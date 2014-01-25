/**
 * generateID
 * @namespace libs
 * @class generateID
 * @static
 */

var crypto = require("crypto");

var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
    charLength = chars.length;

function encoder(buf) {
  var i,
      l = buf.length,
      id_str = [];

  for (i = 0; i < l; i++)
    id_str[i] = chars[buf.readUInt8(i) % charLength];

  return id_str.join("");
}

/**
 * @method generateID
 * @param {Function(id, callback)} check 重複 check 用関数
 * @param {Function(id)} callback 結果返却用関数
 */
module.exports = function generateID(check, callback) {
  crypto.randomBytes(6, function (err, buf) {
    if (err)
      throw err;

    var id = encoder(buf);
    check(id, function (status) {
      status ? callback(id) : generateID(check, callback);
    });
  });
};
