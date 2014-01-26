/**
 * routes
 *
 */

var libs = require("../libs");

module.exports = function () {
  var app = this;

  // load connect, room, ...
  libs.loader.call(app, __dirname, null);

  // disconnect event
  app.io.route("disconnect", function (req) {
    req.io.socket.get("client", function (err, client) {
      if (err)
        return console.error(err);

      if (client) {
        // broadcast client info
        req.io.room(client.connect_id).broadcast("room_info:remove", {
          client: {
            name: req.headers["user-agent"],
            time: Date.now(),
            connected: false,
            socket_id: req.io.socket.id
          }
        });
      } else {
        req.io.socket.get("player", function (err, player) {
          if (err)
            return console.error(err);

          if (player) {
            // broadcast client info
            /**
             * @api {socket.io} socket.on("room:player:remove") receive player data
             * @apiGroup Room
             * @apiName RoomPlayerRemove
             * @apiDescription Player 情報の受信 (退室イベント)
             * @apiVersion 0.0.1
             *
             * @apiExample Example
             * socket.on("room:player:remove", function (player) {
             *   // Player の情報を取得
             *   console.log(player);
             * });
             *
             */
            req.io.room(player.room_id).broadcast("room:player:remove", player);

            // cleanup
            req.session.destroy();
          }
        });
      }
    });
  });
};
