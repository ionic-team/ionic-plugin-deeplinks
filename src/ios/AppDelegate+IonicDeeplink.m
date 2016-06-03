
//
//  AppDelegate+CULPlugin.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "AppDelegate+IonicDeeplink.h"
#import "IonicDeeplink.h"

/**
 *  Plugin name in config.xml
 */
static NSString *const PLUGIN_NAME = @"IonicDeeplink";

@implementation AppDelegate (IonicDeeplink)

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {

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
