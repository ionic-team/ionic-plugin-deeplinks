
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var PLUGIN_NAME = 'IonicDeeplinkPlugin';

var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }
  return out;
};


var IonicDeeplink = {
  canOpenApp: function(app, cb) {
    exec(cb, null, PLUGIN_NAME, 'canOpenApp', []);
  },
  route: function(paths, success, error) {
    var self = this;

    this.paths = paths;

    this.onDeepLink(function(data) {
      var realPath, pathData, matchedParams, args, finalArgs, didRoute;

      realPath = self._getRealPath(data);
      args = self._queryToObject(data.queryString)

      for(var targetPath in paths) {
        pathData = paths[targetPath];

        matchedParams = self.routeMatch(targetPath, realPath);

        if(matchedParams !== false) {
          finalArgs = extend({}, matchedParams, args);

          if(typeof(success) === 'function') {
            success(extend({
              routeData: pathData
            }, data), finalArgs);
          }

          didRoute = true;
        }
      }

      if(!didRoute) {
        if(typeof(error) === 'function') {
          error(extend({
            routeData: pathData
          }, data));
        }
      }
    })
  },
  routeWithNavController: function(navController, paths, success, error) {
    var self = this;
    this.route(paths, function(routeInfo, args) {
      navController.push(routeInfo.routeData, args);
      if(typeof(success) === 'function') {
        success(routeInfo, args);
      }
    }, function(routeInfo) {
      error(routeInfo);
    });
  },

  /**
   * Check if the path matches the route.
   */
  routeMatch: function(route, path) {
    var parts = path.split('/');
    var routeParts = route.split('/');

    // Our aggregated route params that matched our route path.
    // This is used for things like /post/:id
    var routeParams = {};

    if(parts.length !== routeParts.length) {
      // Can't possibly match if the lengths are different
      return false;
    }

    // Otherwise, we need to check each part

    var rp, pp;
    for(var i in parts) {
      pp = parts[i];
      rp = routeParts[i];

      if(rp[0] == ':') {
        // We have a route param, store it in our
        // route params without the colon
        routeParams[rp.slice(1)] = pp;
      } else if(pp !== rp) {
        return false;
      }

    }
    return routeParams;
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
    if(!data.path) {
      if(data.host.charAt(0) != '/') data.host = '/' + data.host;
      return data.host;
    }
    return data.path;
  },

  onDeepLink: function(callback) {
    var innerCB = function(data) {
      callback(data);
    };
    exec(innerCB, null, PLUGIN_NAME, 'onDeepLink', []);
  }
};

module.exports = IonicDeeplink;
