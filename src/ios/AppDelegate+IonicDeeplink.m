
//
//  AppDelegate+IonicDeeplink.m
//
//


#import "AppDelegate.h"
#import "IonicDeeplink.h"
#import "IonicDeeplinkPlugin.h"

/**
 *  Category for the AppDelegate that overrides application:continueUserActivity:restorationHandler method,
 *  so we could handle application launch when user clicks on the link in the browser.
 */
@interface AppDelegate (IonicDeeplinkPlugin)

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;
- (void)applicationDidBecomeActive:(UIApplication *)application;

@end

@implementation AppDelegate (IonicDeeplinkPlugin)

-(void)applicationDidBecomeActive:(UIApplication *)application {
  NSLog(@"DEEP LINK: APP DID BECOME ACTIVE");
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  NSURL *launchURL = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey];
  NSLog(@"DID FINISH LUNCHING WITH OPTIONS %@", [launchURL absoluteString]);
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    NSLog(@"OPEN URL CALLED %@", [url absoluteString]);

    BOOL handled = [[IonicDeeplink instance] handleLink:url];

    if(!handled) {
      // Continue sending the openURL request through
    }

    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    // Pass it off to our plugin
    BOOL handled = [[IonicDeeplink instance] handleContinueUserActivity:userActivity];

    if(!handled) {
        // Continue sending the openURL request through
    }
    return YES;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    // Pass the push notification to the plugin

}

@end
