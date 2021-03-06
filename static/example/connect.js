/* global GameViewModel, io, ko */
(function () {
  // view model bindings
  var game_view = new GameViewModel();

  function init(client) {
    // apply view
    ko.applyBindings(game_view);
    // status が ng の時は認証失敗
    if (client.status === "ng")
      return console.error("status: ng");

    // parent (最初に接続ページを開いたデバイス)
    game_view.parent(client.is_parent);
    game_view.connected(true);

    game_view.left = function () {
      // 任意のデータを送信
      socket.emit("data", {
        control: "left"
      });
    };
    game_view.right = function () {
      socket.emit("data", {
        control: "right"
      });
    };
  }

  /** Memo
   * io.connect("http://connect-sp-server/");
   */
  var socket = io.connect();
  socket.on("error", function (err) {
    console.error(err);
    // 認証前処理
    init({status: "ng"});
  });
  socket.on("connect", function () {
    // 接続確認
    socket.emit("client", function (client) {
      // 自分の情報を取得
      console.log(client);
      init(client);

      if (client.is_parent) {
        // for The Nagle Algorithm problem
        // http://www.html5rocks.com/ja/tutorials/casestudies/world_wide_maze/
        setInterval(function () {
          socket.emit("data", {
            type: "dummy"
          });
        }, 50);
      }
    });
  });
  // 任意のデータを受け取る
  socket.on("room:data", function (data) {
    if (data.type === "dummy")
      return;

    console.log("room:data");
    console.log(data);

    var x = ["left", "right"].indexOf(data.control);
    switch (x) {
      case 0:
        x = -20;
        break;
      case 1:
        x = 20;
        break;
      default:
        x = 0;
    }

    game_view.move({
      x: x
    });
  });
  // デバイスが追加されると呼ばれる (入室)
  socket.on("room:player:add", function (data) {
    console.log("room:player:add");
    console.log(data);
  });
  // デバイスが削除されると呼ばれる (退室)
  socket.on("room:player:remove", function (data) {
    console.log("room:player:remove");
    console.log(data);
  });
})();
