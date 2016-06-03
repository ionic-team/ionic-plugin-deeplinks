#import "IonicDeeplink.h"
#import <Cordova/CDVAvailability.h>

@implementation IonicDeeplink

+ (IonicDeeplink*)instance {
  return [IonicDeeplink _instance];
}


+ (IonicDeeplink*)_instance {
  static IonicDeeplink *sharedInstance = nil;

  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[IonicDeeplink alloc] init];
    // Do any other initialisation stuff here
  });
  return sharedInstance;
}

- (BOOL)handleLink:(NSURL *)url {
  NSLog(@"Handling LINK %s", [url absoluteString]);
  return NO;
}

- (BOOL)handleContinueUserActivity:(NSUserActivity *)userActivity {

  return NO;
}

@end
