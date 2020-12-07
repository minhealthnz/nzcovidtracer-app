package nz.govt.health.covidtracer

import com.facebook.react.bridge.*
import org.threeten.bp.format.DateTimeFormatter
import java.security.SecureRandom
import android.util.Base64;

class CovidTracerMigrationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CovidTracerMigration"
    }

    @ReactMethod
    fun randomBytes(promise: Promise) {
        val random = SecureRandom()
        var buffer = ByteArray(64);
        random.nextBytes(buffer);
        promise.resolve(Base64.encodeToString(buffer, Base64.NO_WRAP));
    }

    @ReactMethod
    fun performMaintenance(skipEncryption: Boolean = false, databaseFilteringDate: String = "-60 days", promise: Promise) {
        try {
            DbModule.withDb(reactApplicationContext, skipEncryption) { db ->
                try {
                    db.getMigrationDao()?.doDatabaseMantenance(databaseFilteringDate)
                    db.getMigrationDao()
                        ?.doDatabaseMantenanceMatchedLocations(databaseFilteringDate)
                    promise.resolve(null)
                } catch(exception: Exception) {
                    promise.reject(exception)
                }
            }
        } catch(exception: Exception) {
            promise.reject(exception)
        }
    }
    @ReactMethod
    fun fetchData(
        skipEncryption: Boolean = true,
        copyUsers: Boolean = true,
        copyEntries: Boolean = true,
        copyMatches: Boolean = true,
        promise: Promise) {
        try {
            DbModule.withDb(reactApplicationContext, skipEncryption) { db ->
                try {
                    val payload = Arguments.createMap()

                    if (copyUsers) {
                        val userAccounts = db.getMigrationDao()?.getAllUsers()
                        val userAccountsSerialized = userAccounts?.fold(Arguments.createArray(), { acc, userAccount ->
                            val item = Arguments.createMap()
                            item.putString("id", userAccount.lastKnownCognitoUserId)
                            item.putString("nhi", userAccount.nhi)
                            item.putBoolean("isActive", userAccount.isActive)
                            acc.pushMap(item)
                            acc
                        })
                        payload.putArray("users", userAccountsSerialized)
                    } else {
                        payload.putArray("users", Arguments.createArray())
                    }

                    if (copyEntries) {
                        val diaryEntries = db.getMigrationDao()?.getAllLocations()
                        val diaryEntriesSerialized = diaryEntries?.fold(Arguments.createArray(), { acc, diaryEntry ->
                            val item = Arguments.createMap()
                            item.putString("id", diaryEntry.id.toString())
                            item.putString("userId", diaryEntry.userId)
                            item.putString("startDate", diaryEntry.time.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                            item.putString("endDate", null)
                            item.putString("name", diaryEntry.businessName)
                            item.putString("address", diaryEntry.address)
                            item.putString("gln", diaryEntry.gln)
                            item.putString("hashedGln", diaryEntry.hashedGln)
                            item.putString("note", diaryEntry.note)
                            item.putInt("type", diaryEntry.scanType)
                            acc.pushMap(item)
                            acc
                        })
                        payload.putArray("diaryEntries", diaryEntriesSerialized)
                    } else {
                        payload.putArray("diaryEntries", Arguments.createArray())
                    }

                    if (copyMatches) {
                        val matches = db.getMigrationDao()?.getAllMatchedLocations()
                        val matchesSerialized = matches?.fold(Arguments.createArray(), { acc, match ->
                            val item = Arguments.createMap()
                            item.putString("id", match.id.toString())
                            item.putString("notificationId", match.notificationId)
                            item.putString("eventId", match.eventId)
                            item.putString("startDate", match.startDate.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                            item.putString("endDate", match.endDate.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
                            item.putString("systemNotificationBody", match.systemNotificationBody)
                            item.putString("appBannerTitle", match.appBannerTitle)
                            item.putString("appBannerBody", match.appBannerBody)
                            item.putString("appBannerLinkLabel", match.appBannerLinkLabel)
                            item.putString("appBannerLinkUrl", match.appBannerLinkUrl)
                            item.putBoolean("appBannerRequestCallbackEnabled", match.appBannerRequestCallbackEnabled)
                            item.putBoolean("callbackRequested", match.callbackRequested)
                            item.putBoolean("ack", match.acknowledged)
                            acc.pushMap(item)
                            acc
                        })
                        payload.putArray("matches", matchesSerialized)
                    } else {
                        payload.putArray("matches", Arguments.createArray())
                    }

                    promise.resolve(payload)
                } catch(exception: Exception) {
                    promise.reject(exception)
                }
            }
        } catch(exception: Exception) {
            promise.reject(exception)
        }
    }
}