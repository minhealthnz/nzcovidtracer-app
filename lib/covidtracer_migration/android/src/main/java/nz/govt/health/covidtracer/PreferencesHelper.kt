package nz.govt.health.covidtracer

import android.content.Context
import android.content.SharedPreferences
import android.content.Context.MODE_PRIVATE

@Suppress("UNCHECKED_CAST")
object PreferencesHelper {
    private val prefrencesNamePrefix = "unite_app_"

    fun editPreferences(preferencesSuffix: String, context: Context): SharedPreferences.Editor {
        return getPreferences(preferencesSuffix, context).edit()
    }

    fun getPreferences(preferencesSuffix: String, context: Context): SharedPreferences {
        return context.getSharedPreferences(prefrencesNamePrefix + preferencesSuffix, MODE_PRIVATE)
    }

}
