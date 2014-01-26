/**
 * room page
 *
 */

// 接続後
var room_data = {};

module.exports = function () {
  var app = this;

  /**
   * @api {socket.io} socket.emit("client") get client information
   * @apiGroup Room
   * @apiName Client
   * @apiDescription 接続確認とクライアント情報の取得
   * @apiVersion 0.0.1
   * 
   * @apiSuccessTitle (All) StatusObject
   * @apiSuccess (All) {String} status [ok/ng] 接続後/接続前
   * @apiSuccess (All) {String} room_id ルーム固有の ID
   * @apiSuccess (All) {Boolean} is_parent 親機判定
   * @apiSuccess (All) {String} socket_id Socket.IO の ID
   *
   * @apiExample Example
   * socket.emit("client", function (client) {
   *   // 自分の情報を取得
   *   console.log(client);
   * });
   *
   */
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
          /**
           * @api {socket.io} socket.on("room:player:add") receive player data
           * @apiGroup Room
           * @apiName RoomPlayerAdd
           * @apiDescription Player 情報の受信 (入室イベント)
           * @apiVersion 0.0.1
           *
           * @apiExample Example
           * socket.on("room:player:add", function (player) {
           *   // Player の情報を取得
           *   console.log(player);
           * });
           *
           */
          req.io.room(room_id).broadcast("room:player:add", player);
          player.status = "ok";
          req.io.respond(player);
        });
      }
    });
  });

  /**
   * @api {socket.io} socket.emit("data") send sync data
   * @apiGroup Room
   * @apiName Data
   * @apiDescription 汎用データの送信 (書式は任意)
   * @apiVersion 0.0.1
   *
   */
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

      /**
       * @api {socket.io} socket.on("room:data") receive sync data
       * @apiGroup Room
       * @apiName RoomData
       * @apiDescription 汎用データの受信 (書式は任意)
       * @apiVersion 0.0.1
       *
       */
      req.io.room(room_id).broadcast("room:data", data);
      req.io.respond({
        status: "ok"
      });
    });
  });
};
