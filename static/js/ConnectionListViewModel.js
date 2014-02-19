/* global ko, platform, realtime */
// element model
function ConnectionElementModel(params, parent) {
  var that = this;

  this.parent = parent;

  Object.keys(params).forEach(function (key) {
    that[key] = params[key];
  });
}

ConnectionElementModel.prototype.active = function () {
  this.parent.active_element(this);

  return this;
};

// list view model
function ConnectionListViewModel() {
  this.is_parent = ko.observable(false);
  this.connected = ko.observable(false);
  this.connections = ko.observableArray();
  this.active_element = ko.observable({});

  this.waiting = ko.computed(function () {
    return this.connected() && ! this.is_parent();
  }, this);
  this.decidable = ko.computed(function () {
    var active_connections = this.connections().filter(function (connection) {
      return connection.connected;
    });
    return active_connections.length > 0;
  }, this);
}

ConnectionListViewModel.padding = function (num) {
  return ("0" + num).slice(-2);
};

ConnectionListViewModel.prototype.add = function (client) {
  var connection = client;

  // time format
  var date = new Date(client.time);
  connection.time = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ].map(ConnectionListViewModel.padding).join(":");

  // name format (from UserAgent)
  var name = platform.parse(client.name).description;
  connection.name = name;

  // add
  this.remove(client.socket_id);
  this.connections.push(new ConnectionElementModel(connection, this));

  return this;
};

ConnectionListViewModel.prototype.remove = function (socket_id) {
  if (socket_id) {
    this.connections.remove(function (connection) {
      return connection.socket_id === socket_id;
    });
  } else {
    this.connections.removeAll();
  }

  return this;
};

ConnectionListViewModel.prototype.connect = function (elem) {
  var $form = $(elem),
      $modal = $form.parent().parent();

  var $button = $form.find("button[type='submit']");
  $button.button("loading");

  var socket_id = this.active_element().socket_id;
  realtime.activate(socket_id, function () {
    $button.button("reset");
    $modal.modal("hide");
  });
};

ConnectionListViewModel.prototype.disconnect = function (elem) {
  var $form = $(elem);

  var $button = $form.find("button[type='submit']");
  $button.button("loading");

  realtime.disconnect(this.is_parent());
};

ConnectionListViewModel.prototype.decide = function (elem) {
  $(elem).button("loading");
  realtime.connect();
};

// view model bindings
var connection_list = new ConnectionListViewModel();
ko.applyBindings(connection_list);
