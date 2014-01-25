/**
 * room page
 *
 */

// 接続後
var room_data = {};

module.exports = function () {
  var app = this;

  // get client info
  app.io.route("client", function (req) {
    var room_id = req.session.room_id,
        is_parent = req.session[room_id] && req.session[room_id] === "true";

    req.io.socket.get("player", function (err, player) {
      if (err)
        return console.error(err);

      if (player) {
        // respond player data
        player.status = "ok";
        req.io.respond(player);
      } else {
        if (! room_id) {
          return req.io.respond({
            status: "ng"
          });
        }

        // join room
        req.io.join(room_id);
        var data = room_data[room_id];
        if (! data) {
          // init room data
          data = room_data[room_id] = {
            parent: null
          };
        }
        // check parent
        if (is_parent && data.parent === null) {
          room_data[room_id] = {
            parent: true
          };
        } else {
          is_parent = false;
        }
        // init player data
        player = {
          room_id: room_id,
          is_parent: is_parent,
          socket_id: req.io.socket.id
        };
        // save player data
        req.io.socket.set("player", player, function () {
          req.io.room(room_id).broadcast("room:player:add", player);
          player.status = "ok";
          req.io.respond(player);
        });
      }
    });
  });

  // sync data (in room)
  app.io.route("data", function (req) {
    var room_id = Object.keys(app.io.roomClients[req.io.socket.id]).pop().slice(1);

    req.io.socket.get("player", function (err, player) {
      if (err)
        return console.error(err);

      if (! player || room_id !== player.room_id) {
        return req.io.respond({
          status: "ng"
        });
      }

      var data = req.data;
      data.socket_id = req.io.socket.id;

      req.io.room(room_id).broadcast("room:data", data);
      req.io.respond({
        status: "ok"
      });
    });
  });
};
