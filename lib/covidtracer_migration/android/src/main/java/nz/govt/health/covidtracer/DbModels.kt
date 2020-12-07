package nz.govt.health.covidtracer

import android.os.Parcelable
import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey
import kotlinx.android.parcel.Parcelize
import org.threeten.bp.LocalDate
import org.threeten.bp.OffsetDateTime

enum class ScanType(val value: Int){
    QR_MOH(0),
    MANUAL(1),
}

@Entity(tableName = "tracing_locations") // dairy_entries
@Parcelize
data class Location(
    @PrimaryKey(autoGenerate = true)
    val id: Long? = null, // id
    val userId: String, // userId  It is the Cognito User ID
    val businessName: String, // name
    val time: OffsetDateTime, // startDate // 2011-12-03T10:15:30+01:00
    val address: String? = null, // address
    val gln: String? = null, // gln
    val hashedGln: String? = null, // hashedGln
    val locationType: String? = null, // not used
    val note: String? = null, // note
    @ColumnInfo(defaultValue = "0")
    val scanType: Int = ScanType.QR_MOH.value // type
) : Parcelable

@Entity(
    tableName = "matched_locations",
    foreignKeys = [ForeignKey(
        entity = Location::class,
        parentColumns = arrayOf("id"),
        childColumns = arrayOf("locationId"),
        onDelete = ForeignKey.SET_NULL
    )]
)

@Parcelize
data class MatchedLocation(
    @PrimaryKey(autoGenerate = true)
    val id: Long? = null, // id
    val locationId: Long?, // not used
    val acknowledged: Boolean = false, // ack
    val notificationId: String, // notificationId
    val eventId: String, // eventId
    val startDate: OffsetDateTime, // startDate
    val endDate: OffsetDateTime, // endDate
    @ColumnInfo(defaultValue = "")
    val systemNotificationBody: String = "", // systemNotificationBody
    @ColumnInfo(defaultValue = "")
    val appBannerTitle: String = "", // appBannerTitle
    @ColumnInfo(defaultValue = "")
    val appBannerBody: String = "", // appBannerBody
    @ColumnInfo(defaultValue = "")
    val appBannerLinkLabel: String = "", // appBannerLinkLabel
    @ColumnInfo(defaultValue = "")
    val appBannerLinkUrl: String = "", // appBannerLinkUrl
    @ColumnInfo(defaultValue = "0")
    val appBannerRequestCallbackEnabled: Boolean = false, // appBannerRequestCallbackEnabled
    @ColumnInfo(defaultValue = "0")
    val callbackRequested: Boolean = false // callbackRequested
) : Parcelable

@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Long? = null, // not used
    val lastKnownCognitoUserId: String? = null, // id
    val firstName: String? = null, // not used
    val middleName: String? = null,// not used
    val lastName: String? = null, // not used
    val phone: String? = null,// not used
    val nhi: String? = null, // nhi
    val dateOfBirth: LocalDate? = null, // not used
    @ColumnInfo(defaultValue = "0")
    val isActive: Boolean = false
)