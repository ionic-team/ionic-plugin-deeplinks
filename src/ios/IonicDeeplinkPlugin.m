#import "IonicDeeplink.h"
#import "IonicDeeplinkPlugin.h"

#import <Cordova/CDVAvailability.h>

@implementation IonicDeeplinkPlugin

- (void)pluginInitialize {

  NSNotificationCenter* nc = [NSNotificationCenter defaultCenter];

  NSLog(@"Ionic Deeplinks...deployyyy!");

  IonicDeeplink *dl = [IonicDeeplink instance];
  [dl testMethod];
}


/* ------------------------------------------------------------- */

- (void)dealloc {
}

@end
