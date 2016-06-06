//
//  AppDelegate+IonicDeeplink.h
//
//  Created by Max Lynch <max@ionic.io>
//

#import "AppDelegate.h"

/**
 *  Category for the AppDelegate that overrides application:continueUserActivity:restorationHandler method,
 *  so we could handle application launch when user clicks on the link in the browser.
 */
@interface AppDelegate (IonicDeeplink)

//- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;

@end
