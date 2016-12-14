/*
Parser for config.xml file. Read plugin-specific preferences (from <universal-links> tag) as JSON object.

 This file has been originally written by Nikolay Demyankov for the cordova-universal-links-plugin: https://github.com/nordnet/cordova-universal-links-plugin
*/
var path = require('path');
var ConfigXmlHelper = require('./configXmlHelper.js');
var DEFAULT_SCHEME = 'http';

module.exports = {
  getDeeplinkHost: getDeeplinkHost
};

// region Public API

/**
 * Get Deeplink host from the config.xml file.
 *
 * @param {Object} cordovaContext - cordova context object
 * @return {String} The host url
 */
function getDeeplinkHost(cordovaContext) {
  // read data from projects root config.xml file
  var configXml = new ConfigXmlHelper(cordovaContext).read();
  if (configXml == null) {
    console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
    return null;
  }

  var xmlDeeplinksPlugin = getXmlDeeplinksPlugin(configXml);

  if (xmlDeeplinksPlugin == null || xmlDeeplinksPlugin.length == 0) {
    console.warn('ionic-plugin-deeplinks is not set in the config.xml. The plugin\'s entitlement generation is not going to work.');
    return null;
  }

  deeplinkHost = getDeeplinkHostFromDeeplinksConfig(xmlDeeplinksPlugin);

  return deeplinkHost;
}

/**
 * Get deeplinks plugin xml element
 * @param {Object} configXml The xml config
 * @returns {Object} The deeplinks plugin xml element
 */
function getXmlDeeplinksPlugin(configXml) {
  var xmlPlugins = configXml.widget.plugin;
  var xmlDeeplinksPlugin = null;
  xmlPlugins && xmlPlugins.forEach(function(xmlElement) {

    // look for data from the ionic-plugin-deeplinks element
    if (xmlElement.$.name === 'ionic-plugin-deeplinks') {
      xmlDeeplinksPlugin = xmlElement;
    }
  });
  return xmlDeeplinksPlugin;
}

/**
 * Get deeplinks plugin host from the deeplinks config
 * @param {Object} xmlDeeplinksPlugin - The deeplinks plugin xml element
 * @returns {String} The deeplinks host
 */
function getDeeplinkHostFromDeeplinksConfig(xmlDeeplinksPlugin) {
  var xmlDeeplinksPluginVariables = xmlDeeplinksPlugin['variable'];
  var deeplinkHost = null;
  xmlDeeplinksPluginVariables && xmlDeeplinksPluginVariables.forEach(function(xmlElement) {
    if (xmlElement.$.name === 'DEEPLINK_HOST') {
      deeplinkHost = xmlElement.$.value;
    }
  });
  return deeplinkHost;
}

// endregion
