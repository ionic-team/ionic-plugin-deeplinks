#import <Cordova/CDVPlugin.h>

@interface IonicDeeplink : NSObject

// Singleton for our deeplink service
+ (IonicDeeplink*)instance;
+ (IonicDeeplink*)_instance;

- (void)testMethod;

@end
