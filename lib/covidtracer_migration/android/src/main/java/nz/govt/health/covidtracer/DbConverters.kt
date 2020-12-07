package nz.govt.health.covidtracer

import androidx.room.TypeConverter
import org.threeten.bp.LocalDate
import org.threeten.bp.LocalDateTime
import org.threeten.bp.OffsetDateTime
import org.threeten.bp.format.DateTimeFormatter

/**
 * Type converters to allow Room to reference complex data types.
 */
class DbConverters {
    @TypeConverter fun offsetDateTimeToString(offsetDateTime: OffsetDateTime): String =
        offsetDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
    @TypeConverter fun stringToOffsetDateTime(value: String): OffsetDateTime =
        OffsetDateTime.parse(value, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
    @TypeConverter fun localDateToString(localDate: LocalDate?): String? =
        localDate?.format(DateTimeFormatter.ISO_LOCAL_DATE)
    @TypeConverter fun stringToLocalDate(value: String?): LocalDate? {
        return if (value != null) {
            LocalDate.parse(value, DateTimeFormatter.ISO_LOCAL_DATE)
        } else {
            null
        }
    }
    @TypeConverter fun stringToLocalDateTime(value: String?): LocalDateTime? {
        return if (value != null) {
            val parsedDate = LocalDateTime.parse(value, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            parsedDate
        } else {
            null
        }
    }

}