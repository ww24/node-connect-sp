/**
 * node-connect-sp
 * client
 */

var realtime = (function () {
  var socket = io.connect(),
      method = {};

  function activation() {
    socket.emit("activate", {
      connect_id: location.pathname.split("/").pop()
    }, function (data) {
      connection_list.is_parent(data.is_parent);
      connection_list.connected(data.connected);
    });
  }

  // connect event
  socket.on("connect", activation);
  // activatable event
  socket.on("activatable", activation);

  socket.on("room_info:add", function (data) {
    connection_list.add(data.client);
  });
  socket.on("room_info:remove", function (data) {
    connection_list.remove(data.client.socket_id);
  });
  socket.on("room_info:activate", function (data) {
    connection_list.remove(data.client.socket_id);
  });

  // confirm disconnection
  function beforeunload() {
    return "別のページに移ると接続が切断されます。";
  }
  window.addEventListener("beforeunload", beforeunload);

  // redirect
  function redirect(url) {
    window.removeEventListener("beforeunload", beforeunload);
    location.replace(url);
  }

  socket.on("redirect", function (data) {
    redirect(data.url);
  });

  // disconnect event
  socket.on("disconnect", function () {
    // reset list
    connection_list
      .remove()
      .connected(false);
  });

  // activate client
  method.activate = function (socket_id, callback) {
    var args = ["activate:client", {
      socket_id: socket_id
    }];

    callback && args.push(callback);

    socket.emit.apply(socket, args);
  };

  method.connect = function () {
    socket.emit("decide", function (data) {
      redirect(data.url);
    });
  };

  return method;
})();
