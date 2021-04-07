# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-dontobfuscate

-keep class io.realm.react.**
-keep class net.sqlcipher.** { *; }
-keep class net.sqlcipher.database.* { *; }
-keep class com.uniteapprn.BuildConfig { *; }

# Required by EN Framework
-keep public class com.horcrux.svg.** {*;}
-keep class com.google.crypto.tink.** { *; }
-keep class * extends androidx.room.RoomDatabase
-keep class * extends com.google.auto
-keep class org.checkerframework.checker.nullness.qual.** { *; }  

# Required by fast image library
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}