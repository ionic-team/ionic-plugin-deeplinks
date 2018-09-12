#ifndef DEEPLINK_SERVICE_H
#define DEEPLINK_SERVICE_H

#import <Foundation/Foundation.h>

@interface DeeplinkService : NSObject

+ (void)setLastURL:(NSURL*)url;
+ (NSURL*)getLastURL;
+ (void)clearLastURL;

+ (void)setLastUserActivity:(NSUserActivity*)userActivity;
+ (NSUserActivity*)getLastUserActivity;
+ (void)clearLastUserActivity;

@end

#endif