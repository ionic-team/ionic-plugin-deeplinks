#import "IonicDeeplinkPlugin.h"

#import <Cordova/CDVAvailability.h>

@implementation IonicDeeplinkPlugin

- (void)pluginInitialize {
  _handlers = [[NSMutableArray alloc] init];
}


/* ------------------------------------------------------------- */

- (void)onAppTerminate {
  _handlers = nil;
  [super onAppTerminate];
}

- (void)onDeepLink:(CDVInvokedUrlCommand *)command {
  [_handlers addObject:command.callbackId];
}

- (BOOL)handleLink:(NSURL *)url {
  NSLog(@"IonicDeepLinkPlugin: Handle link (internal) %@", url);

  _lastEvent = [self createResult:url];

  [self sendToJs];

  return YES;
}

- (BOOL)handleContinueUserActivity:(NSUserActivity *)userActivity {
  NSLog(@"IonicDeepLinkPlugin: Handle continueUserActivity (internal)");

  if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] || userActivity.webpageURL == nil) {
    return NO;
  }

  NSURL *url = userActivity.webpageURL;
  _lastEvent = [self createResult:url];

  [self sendToJs];

  return NO;
}

- (void) sendToJs {
  // Send the last event to JS if we have one
  if (_lastEvent == nil) {
    return;
  }

  // Iterate our handlers and send the event
  for (id callbackID in _handlers) {
    [self.commandDelegate sendPluginResult:_lastEvent callbackId:callbackID];
  }

  // Clear out the last event
  _lastEvent = nil;
}

- (CDVPluginResult *)createResult:(NSURL *)url {
  NSDictionary* data = @{
    @"url": [url absoluteString] ?: @"",
    @"path": [url path] ?: @"",
    @"queryString": [url query] ?: @"",
    @"scheme": [url scheme] ?: @"",
    @"host": [url host] ?: @""
  };

  CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
  [result setKeepCallbackAsBool:YES];
  return result;
}

@end
