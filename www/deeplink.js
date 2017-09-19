
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
  /**
   * How long to wait after a deeplink match before navigating.
   * Default is 800ms which gives the app time to get back and then
   * smoothly animate.
   */
  NAVIGATION_DELAY: 800,

  canOpenApp: function(app, cb) {
    exec(cb, null, PLUGIN_NAME, 'canOpenApp', []);
  },
  route: function(paths, success, error) {
    var self = this;

    this.paths = paths;

    this.onDeepLink(function(data) {
      console.log('On deep link', data);
      var realPath, pathData, matchedParams, args, finalArgs, didRoute;

      realPath = self._getRealPath(data);
      args = self._queryToObject(data.url)

      for(var targetPath in paths) {
        pathData = paths[targetPath];

        matchedParams = self.routeMatch(targetPath, realPath);

        if(matchedParams !== false) {
          finalArgs = extend({}, matchedParams, args);

          if(typeof(success) === 'function') {
            success({
              $route: pathData,
              $args: finalArgs,
              $link: data
            });
          }

          didRoute = true;
        }
      }

      if(!didRoute) {
        if(typeof(error) === 'function') {
          error({
            $link: data
          });
        }
      }
    })
  },

  routeWithNavController: function(navController, paths, options, success, error) {
    var self = this;

    var defaultOptions = {
      root: false
    };

    if(typeof options !== 'function') {
      options = extend(defaultOptions, options);
    } else {
      success = options;
      error = success;
      options = defaultOptions;
    }

    this.route(paths, function(match) {

      // Defer this to ensure animations run
      setTimeout(function() {
        if(options.root === true) {
          navController.setRoot(match.$route, match.$args);
        } else {
          navController.push(match.$route, match.$args);
        }
      }, self.NAVIGATION_DELAY);

      if(typeof(success) === 'function') {
        success(match);
      }
    }, function(nomatch) {
      if(typeof(error) === 'function') {
        error(nomatch);
      }
    });
  },

  /**
   * Check if the path matches the route.
   */
  routeMatch: function(route, path) {
    if (route === path) {
      return {};
    }

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
    for(var i = 0; i < parts.length; i++) {
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

    var qIndex = q.lastIndexOf('?');
    if(qIndex < 0) return {};

    // Get everything after the ?
    q = q.slice(q.lastIndexOf('?') + 1);

    var i = 0, retObj = {}, pair = null,
      qArr = q.split('&');

    for (; i < qArr.length; i++) {
      if(!qArr[i]) { continue; }
      pair = qArr[i].split('=');
      retObj[pair[0]] = pair[1];
    };

    return retObj;
  },

  /**
   * We're fairly flexible when it comes to matching a URL. We support
   * host-less custom URL scheme matches like ionic://camera?blah but also support
   * and match against fragments.
   *
   * This method tries to infer what the proper "path" is from the URL
   */
  _getRealPath: function(data) {
    // If we have a fragment, we use that as the path
    if(data.fragment) {
      var fi = data.fragment.indexOf('?');
      if(fi > -1) {
        return data.fragment.slice(0, fi).slice(1);
      }
      return data.fragment.slice(1);
    }

    if(!data.path) {
      if(data.host.charAt(0) != '/') data.host = '/' + data.host;
      return data.host;
    }

    var hostOrScheme = data.host || data.scheme + '://';
    var restOfUrl = data.url.slice(data.url.indexOf(hostOrScheme) + hostOrScheme.length);

    if(restOfUrl.indexOf('?') > -1) {
      restOfUrl = restOfUrl.slice(0, restOfUrl.indexOf('?'));
    }

    if(restOfUrl.indexOf('#') > -1) {
      restOfUrl = restOfUrl.slice(0);
    }

    return restOfUrl;
  },

  onDeepLink: function(callback) {
    var innerCB = function(data) {
      callback(data);
    };
    exec(innerCB, null, PLUGIN_NAME, 'onDeepLink', []);
  },

  getHardwareInfo: function(callback) {
    exec(callback, null, PLUGIN_NAME, 'getHardwareInfo', []);
  }
};

module.exports = IonicDeeplink;
