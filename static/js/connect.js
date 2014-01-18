/**
 * node-connect-sp
 * client
 */

var socket = io.connect();

socket.on("connect", function () {
  socket.emit("heartbeat", {
    connect_id: location.pathname.split("/").pop()
  }, function (data) {
    if (data.verify) {
      socket.emit("room");
    }
  });
});

socket.on("room_info", function (data) {
  console.log(data);
});
