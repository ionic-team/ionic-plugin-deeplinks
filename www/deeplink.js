var argscheck = require('cordova/argscheck'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec');

var PLUGIN_NAME = 'IonicDeeplinkPlugin';

var extend = function (out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i]) {
      continue;
    }
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        out[key] = arguments[i][key];
      }
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

  canOpenApp: function (app, cb) {
    exec(cb, null, PLUGIN_NAME, 'canOpenApp', []);
  },

  route: function (paths, success, error) {
    var self = this;
    this.paths = paths;

    this.onDeepLink(function (data) {
      var realPath = self._getRealPath(data);

      var args = self._queryToObject(data.queryString);

      var matched = false;
      var finalArgs;
      var pathData;

      for (var targetPath in paths) {
        pathData = paths[targetPath];

        var matchedParams = self.routeMatch(pathData, realPath);

        if (matchedParams !== false) {
          matched = true;
          finalArgs = extend({}, matchedParams, args);

          break;
        }
      }

      if (matched === true) {
        console.log('Match found', realPath);

        if (typeof (success) === 'function') {
          success({
            $route: pathData,
            $args: finalArgs,
            $link: data,
          });
        }

        return;
      }

      if (typeof (error) === 'function') {
        console.log('No Match found');
        error({ $link: data });
      }
    })
  },

  routeWithNavController: function (navController, paths, options, success, error) {
    var self = this;

    var defaultOptions = {
      root: false,
    };

    if (typeof options !== 'function') {
      options = extend(defaultOptions, options);
    } else {
      success = options;
      error = success;
      options = defaultOptions;
    }

    this.route(paths, function (match) {
      // Defer this to ensure animations run
      setTimeout(function () {
        if (options.root === true) {
          navController.setRoot(match.$route, match.$args);
        } else {
          navController.push(match.$route, match.$args);
        }
      }, self.NAVIGATION_DELAY);

      if (typeof (success) === 'function') {
        success(match);
      }
    }, function (nomatch) {
      if (typeof (error) === 'function') {
        error(nomatch);
      }
    });
  },

  /**
   * Check if the path matches the route.
   */
  routeMatch: function (route, path) {
    if (route === path) {
      return {};
    }

    var parts = path.split('/');
    var routeParts = route.split('/');

    // Our aggregated route params that matched our route path.
    // This is used for things like /post/:id
    var routeParams = {};

    if (parts.length !== routeParts.length) {
      // Can't possibly match if the lengths are different
      return false;
    }

    // Otherwise, we need to check each part

    var rp,
      pp;

    for (var i = 0; i < parts.length; i++) {
      pp = parts[i];
      rp = routeParts[i];

      if (rp[0] == ':') {
        // We have a route param, store it in our
        // route params without the colon
        routeParams[rp.slice(1)] = pp;
      } else if (pp !== rp) {
        return false;
      }
    }
    return routeParams;
  },

  _queryToObject: function (q) {
    if (!q) return {};

    var qIndex = q.indexOf('?');

    if (qIndex > -1) {
      q = q.slice(qIndex + 1);
    }

    var i 			= 0,
      retObj 	= {},
      pair 		= null,
      qArr 		= q.split('&');

    for (; i < qArr.length; i++) {
      if (!qArr[i]) {
        continue;
      }

      pair = qArr[i].split('=');
      retObj[pair[0]] = pair[1];
    }

    return retObj;
  },

  _stripFragmentLeadingHash: function (fragment) {
    var hs = fragment.indexOf('#');

    if (hs > -1) {
      fragment.slice(0, hs);
    }

    return fragment;
  },

  /**
   * We're fairly flexible when it comes to matching a URL. We support
   * host-less custom URL scheme matches like ionic://camera?blah but also support
   * and match against fragments.
   *
   * This method tries to infer what the proper "path" is from the URL
   */
  _getRealPath: function (data) {

    // 1. Let's just do the obvious and return the parsed 'path' first, if available.
    if (!!data.path && data.path !== "") {
      return data.path;
    }

    // 2. Now, are we using a non-standard scheme?
    var isCustomScheme = data.scheme.indexOf('http') === -1;

    // 3. Nope so we'll go fragment first if available as that should be what comes after
    if (!isCustomScheme) {
      if (!!data.fragment) {
        return this._stripFragmentLeadingHash(data.fragment);
      }
    }

    // 4. Now fall back to host / authority
    if (!!data.host) {
      if (data.host.charAt(0) != '/') {
        data.host = '/' + data.host;
      }

      return data.host;
    }

    // 5. We'll use fragment next if we're in a custom scheme, though this might need a little more thought
    if (isCustomScheme && !!data.fragment) {
      return this._stripFragmentLeadingHash(data.fragment);
    }

    // 6. Last resort - no obvious path, fragment or host, so we
    // slice out the scheme and any query string or fragment from the full url.
    var restOfUrl = data.url;
    var separator = data.url.indexOf('://');

    if (separator !== -1) {
      restOfUrl = data.url.slice(separator + 3);
    } else {
      separator = data.url.indexOf(':/');
      if (separator !== -1) {
        restOfUrl = data.url.slice(separator + 2);
      }
    }

    var qs = restOfUrl.indexOf('?');
    if (qs > -1) {
      restOfUrl = restOfUrl.slice(0, qs);
    }

    var hs = restOfUrl.indexOf('#');
    if (hs > -1) {
      restOfUrl = restOfUrl.slice(0, hs);
    }

    return restOfUrl;
  },

  onDeepLink: function (callback) {
    var innerCB = function (data) {
      callback(data);
    };
    exec(innerCB, null, PLUGIN_NAME, 'onDeepLink', []);
  },

  getHardwareInfo: function (callback) {
    exec(callback, null, PLUGIN_NAME, 'getHardwareInfo', []);
  },
};

module.exports = IonicDeeplink;
