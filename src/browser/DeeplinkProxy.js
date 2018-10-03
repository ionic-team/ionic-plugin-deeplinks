function parseSchemeFromUrl (url) {
	var _sep = url.indexOf(':');
	if (_sep > -1) {
		return url.slice(0, _sep + 1);
	}

	return undefined;
}

function parseQueryStringFromUrl(url) {
	var qs = url.indexOf('?');

	if (qs > -1) {
		return url.slice(qs + 1);
	}

	return undefined;
}

function locationToData(l) {
  return {
    url: l.href,
    path: l.pathname,
    host: l.hostname,
    fragment: l.hash,
		scheme: parseSchemeFromUrl(l.href),
		queryString: parseQueryStringFromUrl(l.href)
  }
}

module.exports = {
  canOpenApp: function() {
    // We can't infer this from the browser environment
    return false;
  },

  onDeepLink: function(callback) {
    // Try the first deeplink route
    setTimeout(function() {
      callback && callback(locationToData(window.location), {
        keepCallback: true
      });
    })

    return window.addEventListener('hashchange', function(e) {
      callback && callback(locationToData(window.location), {
        keepCallback: true
      });
    }, false);
  },

  getHardwareInfo: function(callback) {
    return {};
  }
};

require("cordova/exec/proxy").add("IonicDeeplinkPlugin", module.exports);
