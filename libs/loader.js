/**
 * Module Auto Loader
 * @namespace libs
 * @class loader
 */

var fs = require("fs"),
    path = require("path");

/**
 * module autoloader
 * @method loader
 * @param {String} dir ディレクトリパス
 */
module.exports = function (dir) {
  var that = this,
      args = [].slice.call(arguments, 1),
      modules = fs.readdirSync(dir),
      mod = {};

  modules.forEach(function (module) {
    if (module.slice(-3) !== ".js" || module === "index.js")
      return false;

    var name = module.slice(0, -3),
        func = require(path.resolve(path.join(dir, name)));

    mod[name] = args.length > 0 ? func.apply(that, args) : func;
  });

  return mod;
};
