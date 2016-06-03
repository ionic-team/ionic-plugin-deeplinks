
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

- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
    // ignore activities that are not for Universal Links
    if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb] || userActivity.webpageURL == nil) {
        return NO;
    }

    // get instance of the plugin and let it handle the userActivity object
    CULPlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];
    if (plugin == nil) {
        return NO;
    }

    return [plugin handleUserActivity:userActivity];
}

@end
