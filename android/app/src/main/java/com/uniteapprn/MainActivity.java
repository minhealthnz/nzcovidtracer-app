package com.uniteapprn;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;

import ie.gov.tracing.storage.SharedPrefs;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "UniteAppRN";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    saveLaunchTime();
    SplashScreen.show(this, R.style.SplashScreenTheme);
    super.onCreate(null);
  }

  private void saveLaunchTime() {
    SharedPreferences sharedPreferences = this.getSharedPreferences("nz.govt.health.covidtracer.storage", Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putLong("lastLaunchTime", System.currentTimeMillis());
    editor.apply();
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
