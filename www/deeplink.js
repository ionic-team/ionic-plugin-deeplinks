
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var PLUGIN_NAME = 'IonicDeeplinkPlugin';

var IonicDeeplink = {
  canOpenApp: function(app, cb) {
    exec(cb, null, PLUGIN_NAME, 'canOpenApp', []);
  },
  init: function(navController, paths) {
    var self = this;

    this.navController = navController;
    this.paths = paths;

    this.onDeepLink(function(data) {
      var realPath, pathData, args;

      console.log('DeepLink: CHECKING PATHS', data);
      for(var targetPath in paths) {
        pathData = paths[targetPath];

        realPath = self._getRealPath(data);
        args = self._queryToObject(data.queryString)
        console.log('Real Path', realPath, targetPath, args);

        if(realPath == targetPath) {
          self.navController.push(pathData, args || {});
        }
      }
    })
  },

  _queryToObject: function(q) {
    if(!q) return {};

    var i = 0, retObj = {}, pair = null,
      qArr = q.split('&');

    for (; i < qArr.length; i++) {
      if(!qArr[i]) { continue; }
      pair = qArr[i].split('=');
      retObj[pair[0]] = pair[1];
    };

    return retObj;
  },

  _getRealPath: function(data) {
    var standardSchemes = ['http', 'https'];
    for(var i = 0; i < standardSchemes; i++) {
      if(data.scheme == standardSchemes[i]) {
        // We found a standard scheme, so we'll assume the path
        // portion of the URL is the real path

        if(data.path.charAt(0) != '/') data.path = '/' + data.path;
        return data.path;
      }
    }

    // We didn't find a match with standard schemes, so we're considering
    // the host to be the "path." Example: instagram://camera?blah
    if(data.host.charAt(0) != '/') data.host = '/' + data.host;
    return data.host;
  },

  onDeepLink: function(callback) {
    var innerCB = function(data) {
      callback(data);
    };
    exec(innerCB, null, PLUGIN_NAME, 'onDeepLink', []);
  }
};

module.exports = IonicDeeplink;
