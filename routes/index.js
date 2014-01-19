/**
 * routes
 *
 */

var libs = require("../libs");

var ids = [];

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
    var id = req.params.id;

    var activated = ~ ids.indexOf(id);
    if (! activated)
      if (id === req.session.connect_id)
        ids.push(id);
      else
        return res.send(400);

    res.render("index");
  });

  app.io.route("heartbeat", function (req) {
    var connect_id = req.data.connect_id;
    var verify = connect_id === req.session.connect_id;
    if (verify) {
      req.io.join(connect_id);
      var room_clients = req.io.manager.rooms["/" + connect_id],
          is_parent = !! room_clients && room_clients[0] === req.io.socket.id;

      console.log("parent: " + is_parent);
    } else {
      req.io.room(connect_id).broadcast("room_info", {
        client: req.headers["user-agent"]
      });
    }

    req.io.respond({verify: verify});
  });

  app.io.route("room", function (req) {
    var room = Object.keys(req.io.manager.roomClients[req.io.socket.id]).pop().slice(1);
    console.log(room + ": " + req.data);
  });
};
