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

- (void)canOpenApp:(CDVInvokedUrlCommand *)command {
  CDVPluginResult* result = nil;

  NSString* scheme = [command.arguments objectAtIndex:0];

  if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:scheme]]) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:(true)];
  } else {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:(false)];
  }

  [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onDeepLink:(CDVInvokedUrlCommand *)command {
  [_handlers addObject:command.callbackId];
  // Try to consume any events we got before we were listening
  [self sendToJs];
}

- (BOOL)handleLink:(NSURL *)url {
  NSLog(@"IonicDeepLinkPlugin: Handle link (internal) %@", url);
  
  if(![self checkUrl:url]) {
    return NO;
  }

  _lastEvent = [self createResult:url];

  [self sendToJs];

  return YES;
}

- (BOOL)checkUrl:(NSURL *)url {
  if(url == nil) return NO;
    
  NSString* urlScheme = [[self.commandDelegate settings] objectForKey:@"url_scheme"];
    
  if(urlScheme == nil) return NO;
    
  NSLog(@"url scheme:%@",[url scheme]);
  NSLog(@"url host:%@",[url host]);

  if([[url scheme] isEqualToString:urlScheme]) {
    return YES;
  }
    
  NSString* deeplinkScheme = [[self.commandDelegate settings] objectForKey:@"deeplink_scheme"];
  NSString* deeplinkHost = [[self.commandDelegate settings] objectForKey:@"deeplink_host"];
    
  if(deeplinkScheme!=nil && deeplinkHost != nil) {
    if([[url scheme] isEqualToString:deeplinkScheme]&&[[url host] isEqualToString:deeplinkHost]) {
      return YES;
    }
  }
  
  return NO;
}

- (BOOL)handleContinueUserActivity:(NSUserActivity *)userActivity {

  if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] || userActivity.webpageURL == nil) {
    return NO;
  }

  NSURL *url = userActivity.webpageURL;
  _lastEvent = [self createResult:url];
  NSLog(@"IonicDeepLinkPlugin: Handle continueUserActivity (internal) %@", url);

  [self sendToJs];

  return NO;
}

- (void) sendToJs {
  // Send the last event to JS if we have one
  if (_handlers.count == 0 || _lastEvent == nil) {
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
    @"host": [url host] ?: @"",
    @"fragment": [url fragment] ?: @""
  };

  CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
  [result setKeepCallbackAsBool:YES];
  return result;
}

- (void)getHardwareInfo:(CDVInvokedUrlCommand *)command {
  NSMutableDictionary *info = [[NSMutableDictionary alloc] init];

  // Get the as id in a way that doesn't require it be linked
  Class asIdManClass = NSClassFromString(@"ASIdentifierManager");

  if(asIdManClass) {
    SEL sharedManagerSel = NSSelectorFromString(@"sharedManager");
    id sharedManager = ((id (*)(id, SEL))[asIdManClass methodForSelector:sharedManagerSel])(asIdManClass, sharedManagerSel);
    SEL advertisingIdentifierSelector = NSSelectorFromString(@"advertisingIdentifier");
    NSUUID *uuid = ((NSUUID* (*)(id, SEL))[sharedManager methodForSelector:advertisingIdentifierSelector])(sharedManager, advertisingIdentifierSelector);
    NSString *adId = [uuid UUIDString];

    // Check if ad tracking is disabled (happens on iOS 10+)
    NSString *disabledString = @"00000000-0000-0000-0000-000000000000";
    if (![adId isEqualToString:disabledString]) {
      [info setObject:adId forKey:@"adid"];
    }
  }

  NSString *uuid = [[UIDevice currentDevice].identifierForVendor UUIDString];

  if(uuid && [uuid length] > 0) {
    [info setObject:uuid forKey:@"uuid"];
  }

  CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:info];
  [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end
