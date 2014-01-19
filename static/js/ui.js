$(function () {
  $("#connect-modal form").submit(function (e) {
    e.preventDefault();

    $(this).find("button[type='submit']").button("loading");

    console.log($(this).serializeArray());
  });

  $("#disconnect-modal form").submit(function (e) {
    e.preventDefault();

    $(this).find("button[type='submit']").button("loading");

    console.log($(this).serializeArray());
  });
});
