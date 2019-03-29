#import "AppDelegate.h"
#import "IonicDeeplinkPlugin.h"

static NSString *const PLUGIN_NAME = @"IonicDeeplinkPlugin";

/**
 *  Category for the AppDelegate that overrides application:continueUserActivity:restorationHandler method,
 *  so we could handle application launch when user clicks on the link in the browser.
 */
@interface AppDelegate (IonicDeeplinkPlugin)

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;

@end

@implementation AppDelegate (IonicDeeplinkPlugin)

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    NSMutableString *sourceApp = [[NSMutableString alloc] init];
    NSMutableString *annotation = [[NSMutableString alloc] init];
    
    if([options objectForKey:UIApplicationOpenURLOptionsSourceApplicationKey]) {
        sourceApp = [options objectForKey:UIApplicationOpenURLOptionsSourceApplicationKey];
    }

    if([options objectForKey:UIApplicationOpenURLOptionsAnnotationKey]) {
        annotation = [options objectForKey:UIApplicationOpenURLOptionsAnnotationKey];
    }

    return [self application:app openURL:url sourceApplication:sourceApp annotation:annotation];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    IonicDeeplinkPlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];

    if(plugin == nil) {
      NSLog(@"Unable to get instance of command plugin");
      return NO;
    }

    BOOL handled = [plugin handleLink:url];

    if(!handled) {
      // Pass event through to Cordova
      NSMutableDictionary * openURLData = [[NSMutableDictionary alloc] init];

      [openURLData setValue:url forKey:@"url"];

      if (sourceApplication) {
          [openURLData setValue:sourceApplication forKey:@"sourceApplication"];
      }

      if (annotation) {
          [openURLData setValue:annotation forKey:@"annotation"];
      }

      [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
      [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLWithAppSourceAndAnnotationNotification object:openURLData]];

      // Send notice to the rest of our plugin that we didn't handle this URL
      [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:@"IonicLinksUnhandledURL" object:[url absoluteString]]];
    }

    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    // Pass it off to our plugin
    IonicDeeplinkPlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];

    if(plugin == nil) {
      return NO;
    }

    BOOL handled = [plugin handleContinueUserActivity:userActivity];

    if(!handled) {
        // Continue sending the openURL request through
    }
    return YES;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    // Pass the push notification to the plugin
    if([userInfo objectForKey:@"uri"] == nil) {
      return;
    }

    if(application.applicationState == UIApplicationStateInactive || application.applicationState == UIApplicationStateBackground) {
      IonicDeeplinkPlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];

      if(plugin == nil) {
        NSLog(@"Unable to get instance of command plugin");
        return;
      }

      NSURL *url = [NSURL URLWithString:[userInfo objectForKey:@"uri"]];
      [plugin handleLink:url];
    }
}

@end
