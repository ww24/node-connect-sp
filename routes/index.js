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

  app.get("/connect", function (req, res) {
    libs.generateID(function (id, done) {
      done(!~ ids.indexOf(id));
    }, function (connect_id) {
      req.session.connect_id = connect_id;
      res.redirect("./" + connect_id);
    });
  });

  app.get("/connect/:id/", function (req, res) {
    res.redirect("../" + req.params.id);
  });

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

  app.io.route("activate", function (req) {
    var connect_id = req.data.connect_id,
        room_clients = [],
        verify = connect_id === req.session.connect_id,
        is_parent = false,
        activatable = ~ activatable_socket_ids.indexOf(req.io.socket.id);

    if (verify && req.session.connected !== false) {
      req.io.join(connect_id);
      req.session.connected = true;

      room_clients = req.io.manager.rooms["/" + connect_id] || [];
      // 親端末 (room 内の client の中で一番最初に入室し connect_id を持つもの)
      is_parent = room_clients[0] === req.io.socket.id;

      console.log("clients: " + room_clients);
      console.log("parent: " + is_parent);
    } else {
      req.session.connected = false;
    }

    if (activatable) {
      req.io.join(connect_id);
      req.session.connected = true;

      console.log("clients: " + room_clients);
      console.log("parent: " + is_parent);
    }

    if (! is_parent) {
      // client 情報配信
      req.io.room(connect_id).broadcast("room_info:add", {
        client: {
          name: req.headers["user-agent"],
          time: Date.now(),
          connected: req.session.connected,
          socket_id: req.io.socket.id
        }
      });
    }

    req.io.respond({
      is_parent: is_parent,
      connected: req.session.connected
    });
  });
  app.io.route("activate:client", function (req) {
    activatable_socket_ids.push(req.data.socket_id);
    req.io.broadcast("activatable", {
      socket_id: req.data.socket_id
    });
    req.io.respond();
  });

  app.io.route("room", function (req) {
    var room = Object.keys(req.io.manager.roomClients[req.io.socket.id]).pop().slice(1);
    console.log(room + ": " + req.data);
  });

  app.io.route("disconnect", function (req) {
    var connect_id = req.session.connect_id;
    req.io.room(connect_id).broadcast("room_info:remove", {
      client: {
        name: req.headers["user-agent"],
        time: Date.now(),
        connected: false,
        socket_id: req.io.socket.id
      }
    });
  });
};
