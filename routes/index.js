/**
 * routes
 *
 */

var libs = require("../libs");

// 後に DB で置き換える
var ids = [],
    activatable_socket_ids = [];

module.exports = function () {
  var app = this;

  // generate id
  app.get("/connect", function (req, res) {
    libs.generateID(function (id, done) {
      done(!~ ids.indexOf(id));
    }, function (connect_id) {
      req.session.connect_id = connect_id;
      res.redirect("./" + connect_id);
    });
  });

  // redirect (:id/ -> :id)
  app.get("/connect/:id/", function (req, res) {
    res.redirect("../" + req.params.id);
  });

  // activate id
  app.get("/connect/:id", function (req, res) {
    var connect_id = req.params.id;

    var activated = ~ ids.indexOf(connect_id);
    if (! activated)
      if (connect_id === req.session.connect_id)
        ids.push(connect_id);
      else
        return res.send(400);

    res.render("index");
  });

  // id activation
  app.io.route("activate", function (req) {
    var connect_id = req.data.connect_id,
        room_clients = app.io.rooms["/" + connect_id] || [],
        activatable = ~ activatable_socket_ids.indexOf(req.io.socket.id);

    // 親端末 (room 内の client の中で一番最初に入室し cookie に connect_id を持つもの)
    var is_parent = connect_id === req.session.connect_id && room_clients.length === 0;

    req.io.socket.get("client", function (err, client) {
      if (err)
        return console.error(err);

      // client object
      client = client || {
        connected: false,
        connect_id: connect_id
      };

      if (is_parent || activatable) {
        // activate
        req.io.join(connect_id);
        client.connected = true;

        console.log("clients: " + room_clients);
        console.log("parent: " + is_parent);
      }

      req.io.socket.set("client", client, function (err) {
        if (err)
          return console.error(err);

        if (! is_parent) {
          // broadcast client info 
          req.io.room(connect_id).broadcast("room_info:add", {
            client: {
              name: req.headers["user-agent"],
              time: Date.now(),
              connected: client.connected,
              socket_id: req.io.socket.id
            }
          });
        }

        req.io.respond({
          is_parent: is_parent,
          connected: client.connected
        });
      });
    });
  });

  // reactivation request
  app.io.route("activate:client", function (req) {
    activatable_socket_ids.push(req.data.socket_id);
    app.io.sockets.socket(req.data.socket_id).emit("activatable");
    req.io.respond();
  });

  app.io.route("room", function (req) {
    var room = Object.keys(app.io.roomClients[req.io.socket.id]).pop().slice(1);
    console.log(room + ": " + req.data);
  });

  // disconnect event
  app.io.route("disconnect", function (req) {
    req.io.socket.get("client", function (err, client) {
      if (err)
        return console.error(err);

      // broadcast client info
      req.io.room(client.connect_id).broadcast("room_info:remove", {
        client: {
          name: req.headers["user-agent"],
          time: Date.now(),
          connected: false,
          socket_id: req.io.socket.id
        }
      });
    });
  });
};
