// QuickeySdkModule.java

package com.quickeyreactnativesdk;

import static android.app.Activity.RESULT_OK;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class QuickeySdkModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private final ReactApplicationContext reactContext;
    private Callback callback;
    static final int AUTHENTICATION_REQUEST = 1000;
    public QuickeySdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("bundleIdentifier", reactContext.getApplicationInfo().packageName);
        return constants;
    }


    @Override
    public String getName() {
        return "QuickeySdk";
    }

    @ReactMethod
    public void showUrl(String url, Callback callback) {
        final Activity activity = getCurrentActivity();
        final Uri parsedUrl = Uri.parse(url);
        this.callback = callback;

        try {
            if (activity != null) {
                AuthenticationActivity.authenticateUsingBrowser(activity, parsedUrl);
            } else {
                final WritableMap error = Arguments.createMap();
                error.putString("error", "a0.activity_not_available");
                error.putString("error_description", "Android Activity is null.");
                callback.invoke(error);
            }
        } catch (ActivityNotFoundException e){
            final WritableMap error = Arguments.createMap();
            error.putString("error", "a0.browser_not_available");
            error.putString("error_description", "No Browser application is installed.");
            callback.invoke(error);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Callback cb = QuickeySdkModule.this.callback;
        if (cb == null) {
            return;
        }
        boolean hasResult = resultCode == RESULT_OK &&
                requestCode == AuthenticationActivity.AUTHENTICATION_REQUEST &&
                data.getData() != null;
        if (hasResult) {
            Map<String, String> resultData = new HashMap<>();
            resultData.put("email", data.getData().getQueryParameter("email"));
            resultData.put("provider", data.getData().getQueryParameter("provider"));
            JSONObject resultJSON = new JSONObject(resultData);
            cb.invoke(null, resultJSON.toString());
        } else {
            final WritableMap error = Arguments.createMap();
            error.putString("error", "qk.session.user_cancelled");
            error.putString("error_description", "User cancelled the Auth");
            cb.invoke(error, null);
        }
        QuickeySdkModule.this.callback = null;

    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
