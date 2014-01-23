// modal button event
$(function () {
  var $connect_modal = $("#connect-modal");
  $connect_modal.find("form").submit(function (e) {
    e.preventDefault();
    var $this = $(this);

    var $button = $this.find("button[type='submit']");
    $button.button("loading");

    var socket_id = connection_list.active_element().socket_id;
    realtime.activate(socket_id, function (data) {
      $button.button("reset");
      $connect_modal.modal("hide");
    });
  });

  // 未実装
  $("#disconnect-modal form").submit(function (e) {
    e.preventDefault();

    var $button = $(this).find("button[type='submit']");
    $button.button("loading");

    console.log($(this).serializeArray());
  });

  $("#decidable").click(function () {
    $(this).button("loading");
    realtime.connect();
  });
});
