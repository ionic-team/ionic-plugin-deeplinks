
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var PLUGIN_NAME = 'IonicDeeplinkPlugin';

var IonicDeeplink = {
  onDeepLink: function(callback) {
    var innerCB = function(data) {
      callback(data);
    };
    exec(innerCB, null, PLUGIN_NAME, 'onDeepLink', []);
  }
};

module.exports = IonicDeeplink;
