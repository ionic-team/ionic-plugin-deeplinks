
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    channel = require('cordova/channel');


var Deeplink = function() {
};

channel.onCordovaReady.subscribe(function() {
    exec(success, null, 'Deeplink', 'init', []);

    function success(msg) {
    }
});

module.exports = Deeplink;
