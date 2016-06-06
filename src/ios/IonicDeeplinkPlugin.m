#import "IonicDeeplinkPlugin.h"

#import <Cordova/CDVAvailability.h>

@implementation IonicDeeplinkPlugin

- (void)pluginInitialize {

  NSNotificationCenter* nc = [NSNotificationCenter defaultCenter];

  NSLog(@"Ionic Deeplinks...deployyyy!");

  _handlers = [[NSMutableArray alloc] init];

  //IonicDeeplink *dl = [IonicDeeplink instance];
}


/* ------------------------------------------------------------- */

- (void)dealloc {
}

- (void)onDeepLink:(CDVInvokedUrlCommand *)command {
  [_handlers addObject:command.callbackId];

  NSLog(@"IonicDeeplink: Registering onURL handler from JS %@", command.callbackId);
}

- (BOOL)handleLink:(NSURL *)url {
  NSLog(@"IonicDeepLinkPlugin: Handle link (internal) %@", url);

  _lastEvent = [self createResult:url];

  for (id callbackID in _handlers) {
    [self.commandDelegate sendPluginResult:_lastEvent callbackId:callbackID];
  }

  return YES;
}

- (BOOL)handleContinueUserActivity:(NSUserActivity *)userActivity {
  NSLog(@"IonicDeepLinkPlugin: Handle continueUserActivity (internal)");

  if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] || userActivity.webpageURL == nil) {
    return NO;
  }

  NSURL *url = userActivity.webpageURL;
  _lastEvent = [self createResult:url];

  NSLog(@"Stored the last event");

  [self sendToJs];

  return NO;
}

- (void) sendToJs {
  NSLog(@"Sending event to JS engine...");
}

- (CDVPluginResult *)createResult:(NSURL *)url {
  NSDictionary* data = @{
    @"url": [url absoluteString],
  };

  CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
  [result setKeepCallbackAsBool:YES];
  return result;
}

@end
