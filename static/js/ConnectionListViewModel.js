function ConnectionElement(params, parent) {
  var that = this;

  this.parent = parent;

  Object.keys(params).forEach(function (key) {
    that[key] = params[key];
  });
}

ConnectionElement.prototype.active = function () {
  this.parent.active_element(this);
};

function ConnectionListViewModel() {
  this.connected = ko.observable(false);
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
  this.connections.push(new ConnectionElement(connection, this));
};

ConnectionListViewModel.prototype.remove = function (socket_id) {
  this.connections.remove(function (connection) {
    return connection.socket_id === socket_id;
  });
};

// view model bindings
var connection_list = new ConnectionListViewModel();
ko.applyBindings(connection_list);
