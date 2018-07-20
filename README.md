# Community Maintained

This plugin is being maintained by the Ionic community. Interested in helping? Message `max` on ionic worldwide slack.

Another great solution for deep links for Ionic is the Branch Metrics plugin: [https://github.com/BranchMetrics/cordova-ionic-phonegap-branch-deep-linking](https://github.com/BranchMetrics/cordova-ionic-phonegap-branch-deep-linking)

If you used to handle URI schemes with the help of this plugin and have migrated to Branch Metrics, you can make use of a plugin such as [https://github.com/EddyVerbruggen/Custom-URL-scheme](https://github.com/EddyVerbruggen/Custom-URL-scheme) to facilitate custom URL schemes.

Ionic Deeplinks Plugin
======

This plugin makes it easy to respond to deeplinks through custom URL schemes
and Universal/App Links on iOS and Android.

For example, you can have your app open through a link to https://yoursite.com/product/cool-beans and then navigate
to display the Cool Beans in your app (cool beans!).

Additionally, on Android iOS, your app can be opened through a custom URL scheme, like `coolbeans://product/cool-beans`.

Since Custom URL scheme behavior has changed quite a bit in iOS 9.2 for the case where the app isn't installed, you'll want to start using [Universal Links](#ios-configuration) as it's clear custom URL schemes are on the way out.

*Note: this plugin may clash with existing Custom URL Scheme and Universal Links Plugins. Please let
us know if you encounter compatibility issues. Also, try removing them and using this one on its own.*

Thank you to the [Cordova Universal Links Plugin](https://github.com/nordnet/cordova-universal-links-plugin) and the [Custom URL Scheme](https://github.com/EddyVerbruggen/Custom-URL-scheme) plugin that this plugin is inspired and borrows from.

## Installation

```bash
cordova plugin add ionic-plugin-deeplinks
--variable URL_SCHEME=myapp --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=example.com
--variable ANDROID_PATH_PREFIX=/
```

Fill in the appropriate values as shown below:

 * `URL_SCHEME` - the custom URL scheme you'd like to use for your app. This lets your app respond to links like `myapp://blah`
 * `DEEPLINK_SCHEME` - the scheme to use for universal/app links. Defaults to 'https' in 1.0.13. 99% of the time you'll use `https` here as iOS and Android require SSL for app links domains.
 * `DEEPLINK_HOST` - the host that will respond to deeplinks. For example, if we want `example.com/product/cool-beans` to open in our app, we'd use `example.com` here.
 * `ANDROID_PATH_PREFIX` - (optional): specify which path prefix our Android app should open from [more info](https://developer.android.com/guide/topics/manifest/data-element.html)

(New in 1.0.13): If you'd like to support multiple hosts for Android, you can also set the variables `DEEPLINK_2_SCHEME`, `DEEPLINK_2_HOST`, `ANDROID_2_PATH_PREFIX` and optionally substitue `2` with 3, 4, and 5 to set more.

## Handling Deeplinks in JavaScript

#### Ionic/Angular 2

*note: make sure to call IonicDeeplink from a platform.ready or `deviceready` event*

Using [Ionic Native](https://github.com/ionic-team/ionic-native) (available in 1.2.4 or greater):

```javascript
import { Platform, NavController } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';

export class MyApp {
  constructor(
    protected platform: Platform
    , protected navController: NavController
    , protected deeplinks: Deeplinks
    ) {
    this.platform.ready().then(() => {
      this.deeplinks.route({
        '/about-us': HomePage,
        '/products/:productId': HelpPage
      }).subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
      },
      (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
    });
  }
}

// Note: routeWithNavController returns an observable from Ionic Native so it *must* be subscribed to first in order to trigger.
```

If you're using Ionic 2, there is a convenience method to route automatically (see the simple [Ionic 2 Deeplinks](https://github.com/ionic-team/ionic2-deeplinks-demo/blob/master/app/app.ts) demo for an example):

```javascript
import { Platform, NavController } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';

export class MyApp {
  constructor(
    protected platform: Platform
    , protected navController: NavController
    , protected deeplinks: Deeplinks
    ) {
    this.platform.ready().then(() => {
      this.deeplinks.routeWithNavController(this.navController, {
        '/about-us': HomePage,
        '/products/:productId': HelpPage
      }).subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
      },
      (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
    });
  }
}

// Note: routeWithNavController returns an observable from Ionic Native so it *must* be subscribed to first in order to trigger.
```

#### Ionic/Angular 1

For Ionic 1 and Angular 1 apps using Ionic Native, there are many ways we can handle deeplinks. However,
we need to make sure we set up a history stack for the user, we can't navigate directly to our page
because Ionic 1's navigation system won't properly build the navigation stack (to show a back button, for example).

This is all fine because deeplinks should provide the user with a designed experience for what the back button
should do, as we are putting them deep into the app and need to provide a natural way back to the main flow:

(See a simple [demo](https://github.com/ionic-team/ionic1-deeplinks-demo) of v1 deeplinking).

```javascript
angular.module('myApp', ['ionic', 'ionic.native'])

.run(['$ionicPlatform', '$cordovaDeeplinks', '$state', '$timeout', function($ionicPlatform, $cordovaDeeplinks, $state, $timeout) {
  $ionicPlatform.ready(function() {
    // Note: route's first argument can take any kind of object as its data,
    // and will send along the matching object if the route matches the deeplink
    $cordovaDeeplinks.route({
      '/product/:productId': {
        target: 'product',
        parent: 'products'
      }
    }).subscribe(function(match) {
      // One of our routes matched, we will quickly navigate to our parent
      // view to give the user a natural back button flow
      $timeout(function() {
        $state.go(match.$route.parent, match.$args);

        // Finally, we will navigate to the deeplink page. Now the user has
        // the 'product' view visibile, and the back button goes back to the
        // 'products' view.
        $timeout(function() {
          $state.go(match.$route.target, match.$args);
        }, 800);
      }, 100); // Timeouts can be tweaked to customize the feel of the deeplink
    }, function(nomatch) {
      console.warn('No match', nomatch);
    });
  });
}])
```

#### Non-Ionic/angular

Ionic Native works with non-Ionic/Angular projects and can be accessed at `window.IonicNative` if imported.

If you don't want to use Ionic Native, the plugin is available on `window.IonicDeeplink` with a similar API minus the observable callback:

```javascript
window.addEventListener('deviceready', function() {
  IonicDeeplink.route({
    '/product/:productId': {
      target: 'product',
      parent: 'products'
    }
  }, function(match) {
  }, function(nomatch) {
  });
})
```


## iOS Configuration

As of iOS 9.2, Universal Links *must* be enabled in order to deep link to your app. Custom URL schemes are no longer supported.

Follow the official [Universal Links](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html) guide on the Apple Developer docs
to set up your domain to allow Universal Links.

## Android Configuration

Android supports Custom URL Scheme links, and as of Android 6.0 supports a similar feature to iOS' Universal Links called App Links.

Follow the App Links documentation on [Declaring Website Associations](https://developer.android.com/training/app-links/index.html#web-assoc) to enable your domain to
deeplink to your Android app.

To prevent Android from creating multiple app instances when opening deeplinks, you can add the following preference in Cordova config.xml file:

```xml
 <preference name="AndroidLaunchMode" value="singleTask" />
```
