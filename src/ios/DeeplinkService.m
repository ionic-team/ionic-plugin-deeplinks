#import "DeeplinkService.h"

@implementation DeeplinkService

static NSObject* deeplinkLocker;
static NSURL* lastURL = nil;
static NSUserActivity* lastUserActivity = nil;

- (id) init
{
  self = [super init];

  if (self)
  {
      deeplinkLocker = [[NSObject alloc] init];
  }

  return self;
}

+ (void)setLastURL:(NSURL*)url
{
    @synchronized(deeplinkLocker)
    {
        lastURL = url;
    }
}

+ (NSURL*)getLastURL
{
    @synchronized(deeplinkLocker)
    {
        return lastURL;
    }
}

+ (void)clearLastURL
{
    @synchronized(deeplinkLocker)
    {
        lastURL = nil;
    }
}

+ (void)setLastUserActivity:(NSUserActivity*)userActivity
{
    @synchronized(deeplinkLocker)
    {
        lastUserActivity = userActivity;
    }
}

+ (NSUserActivity*)getLastUserActivity
{
    @synchronized(deeplinkLocker)
    {
        return lastUserActivity;
    }
}

+ (void)clearLastUserActivity
{
    @synchronized(deeplinkLocker)
    {
        lastUserActivity = nil;
    }
}

@end