/**
 * Ionic Deeplinks Plugin.
 * License: MIT
 *
 * Thanks to Eddy Verbruggen and nordnet for the great custom URl scheme and
 * unviversal links plugins this plugin was inspired by.
 *
 * https://github.com/EddyVerbruggen/Custom-URL-scheme
 * https://github.com/nordnet/cordova-universal-links-plugin
 */
package io.ionic.links;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;
import android.content.Intent;
import android.content.Context;
import android.graphics.Rect;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewTreeObserver.OnGlobalLayoutListener;
import android.view.inputmethod.InputMethodManager;
import android.net.Uri;
import android.content.pm.PackageManager;

import java.util.ArrayList;

public class IonicDeeplink extends CordovaPlugin {
  private static final String TAG = "IonicDeeplinkPlugin";

  private JSONObject lastEvent;

  private ArrayList<CallbackContext> _handlers = new ArrayList<CallbackContext>();

  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    Log.d(TAG, "Initializing Deeplinks Plugin");
  }

  @Override
  public void onNewIntent(Intent intent) {
    final String intentString = intent.getDataString();


    // read intent
    String action = intent.getAction();
    Uri url = intent.getData();
    Log.d(TAG, "Got a new intent: " + intentString + " " + intent.getScheme() + " " + action + " " + url);

    // if app was not launched by the url - ignore
    if (!Intent.ACTION_VIEW.equals(action) || url == null) {
      return;
    }

    // store message and try to consume it
    try {
      lastEvent = new JSONObject();
      lastEvent.put("url", url.toString());
      lastEvent.put("path", url.getPath());
      lastEvent.put("queryString", url.getQuery());
      lastEvent.put("scheme", url.getScheme());
      lastEvent.put("host", url.getHost());
      consumeEvents();
    } catch(JSONException ex) {
      Log.e(TAG, "Unable to process URL scheme deeplink", ex);
    }
  }

  private void consumeEvents() {
    for(CallbackContext callback : this._handlers) {
      sendToJs(lastEvent, callback);
    }
    lastEvent = null;
  }

  private void sendToJs(JSONObject event, CallbackContext callback) {
    final PluginResult result = new PluginResult(PluginResult.Status.OK, event);
    result.setKeepCallback(true);
    callback.sendPluginResult(result);
  }

  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    if(action.equals("onDeepLink")) {
      Log.d(TAG, "Adding handler");
      addHandler(args, callbackContext);
    } else if(action.equals("canOpenApp")) {
      Log.d(TAG, "Checking if can open");
      String uri = args.getString(0);
      canOpenApp(uri, callbackContext);
    }
    return true;
  }

  private void addHandler(JSONArray args, final CallbackContext callbackContext) {
    this._handlers.add(callbackContext);
  }

  /**
   * Check if we can open an app with a given URI scheme.
   *
   * Thanks to https://github.com/ohh2ahh/AppAvailability/blob/master/src/android/AppAvailability.java
   */
  private void canOpenApp(String uri, final CallbackContext callbackContext) {
    Context ctx = this.cordova.getActivity().getApplicationContext();
    final PackageManager pm = ctx.getPackageManager();

    try {
      pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
      callbackContext.success();
    } catch(PackageManager.NameNotFoundException e) {}

    callbackContext.error("");
  }
}
