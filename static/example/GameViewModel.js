function GameViewModel() {
  this.parent = ko.observable(false);
  this.connected = ko.observable(false);

  this.circle_x = ko.observable(0);
  this.circle_y = ko.observable(0);
}

GameViewModel.prototype.play = function () {
  /** Memo
   * http://connect-sp-server/connect/?redirect=redirect-url
   */
  location.assign("/connect/?redirect=" + location.href);
};

GameViewModel.prototype.move = function (d) {
  this.circle_x(this.circle_x() + (d.x || 0));
  this.circle_y(this.circle_y() + (d.y || 0));
};

// interface
GameViewModel.prototype.left = function () {};
GameViewModel.prototype.right = function () {};
