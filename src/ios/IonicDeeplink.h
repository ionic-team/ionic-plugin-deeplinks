#import <Cordova/CDVPlugin.h>

@interface IonicDeeplink : NSObject

// Singleton for our deeplink service
+ (IonicDeeplink*)instance;
+ (IonicDeeplink*)_instance;

- (BOOL)handleLink:(NSURL *)url;
- (BOOL)handleContinueUserActivity:(NSUserActivity *)userActivity;

@end
