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
  this.waiting = ko.computed(function () {
    return this.connected() && ! this.is_parent();
  }, this);
  this.connections = ko.observableArray();
  this.active_element = ko.observable({});
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

// view model bindings
var connection_list = new ConnectionListViewModel();
ko.applyBindings(connection_list);
