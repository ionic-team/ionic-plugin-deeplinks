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

- (void)testMethod {
  NSLog(@"Instance test method");
}



@end
