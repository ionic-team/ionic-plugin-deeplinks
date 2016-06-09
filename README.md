Ionic Deeplinks Plugin
======

This plugin makes it easy to respond to deeplinks through custom URL schemes
and Universal/App Links on iOS and Android.

For example, you can have your app open through a link to https://yoursite.com/product/cool-beans and then navigate
to display the Cool Beans in your store (cool beans!).

Additionally, on Android and pre 9.2 iOS, your app can be opened through a custom URL scheme, like `coolbeans://app/product/cool-beans`.

Since Custom URL schemes are no longer supported on iOS >= 9.2 iOS, you'll need to [configure Universal Links](#universal-links)

*Note: this plugin may clash with existing Custom URL Scheme and Universal Links Plugins. Please let
us know if you encounter compatibility issues. Also, try removing them and using this one on its own.*

## Installation

```bash
cordova plugin add ionic-plugin-deeplinks --variable URL_SCHEME myapp --variable DEEPLINK_SCHEME=https DEEPLINK_HOST=example.com
```

Fill in the appropriate values as shown below:

 * `URL_SCHEME` - the custom URL scheme you'd like to use for your app. This lets your app respond to links like `myapp://blah`
 * `DEEPLINK_SCHEME` - the scheme to use for universal/app links. 99% of the time you'll use `https` here as iOS and Android require SSL for app links domains.
 * `DEEPLINK_HOST` - the host that will respond to deeplinks. For example, if we want `example.com/product/cool-beans` to open in our app, we'd use `example.com` here.


## Handling Deeplinks in JavaScript

Using [Ionic Native](https://github.com/driftyco/ionic-native):

```typescript
import {IonicDeeplink} from 'ionic-native';

IonicDeeplink.route({
  '/about-us': AboutPage,
  '/universal-links-test': AboutPage,
  '/products/:productId': ProductPage
}, (routeInfo, args) => {
  console.log('Successfully matched route', routeInfo, args);
}, (routeInfo) => {
  console.error('Got a deeplink that didn\'t match', routeInfo);
});
```

If you're using Ionic 2, there is a convenience method to route automatically:

```typescript
IonicDeeplink.routeWithNavController(this.navChild, {
  '/about-us': AboutPage,
  '/universal-links-test': AboutPage,
  '/products/:productId': ProductPage
}), (routeInfo, args) => {
  // Optional callback
  // Successful match, feel free to do more here or just let it slide

  console.log('Successfully routed', routeInfo, args);
}, (routeInfo) => {
  // Handle a deeplink that didn't match, if you fancy

  console.error('Unable to route', routeInfo);
});
```

[](#universal-links)
## iOS Configuration

As of iOS 9.2, Universal Links *must* be enabled in order to deep link to your app. Custom URL schemes are no longer supported.

Follow the official [Universal Links](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html) guide on the Apple Developer docs
to set up your domain to allow Universal Links.

## Android Configuration

Android supports Custom URL Scheme links, and as of Android 6.0 supports a similar feature to iOS' Universal Links called App Links.

Follow the App Links documentation on [Declaring Website Associations](https://developer.android.com/training/app-links/index.html#web-assoc) to enable your domain to
deeplink to your Android app.
