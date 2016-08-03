function locationToData(l) {
  return {
    url: l.href,
    path: l.pathname,
    host: l.hostname,
    fragment: l.hash
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
