/* global qrcode */
$(function () {
  var $qrcode = $("#qrcode");
  var qr = qrcode(10, "H");
  qr.addData(location.href);
  qr.make();

  var $url = $("<p class='url'><input type='text' readonly></p>"),
      $input = $url.find("input");

  $input.val(location.href);
  $input.click(function () {
    this.select();
  });

  $qrcode.append(qr.createImgTag()).after($url);
});
