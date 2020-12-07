package nz.govt.health.covidtracer

//import com.google.gson.GsonBuilder
//import com.google.gson.JsonDeserializationContext
//import com.google.gson.JsonDeserializer
//import com.google.gson.JsonElement
//import com.google.gson.JsonParseException
//import com.google.gson.JsonPrimitive
//import com.google.gson.JsonSerializationContext
//import com.google.gson.JsonSerializer
import kotlin.reflect.KClass

object Utils {
//    val gson = GsonBuilder()
//    .registerTypeAdapter(LocalDate::class.java, LocalDateSerializer())
//    .registerTypeAdapter(LocalDate::class.java, LocalDateDeserializer())
//    .registerTypeAdapter(OffsetDateTime::class.java, OffsetDateTimeDeserializer())
//    .registerTypeAdapter(OffsetDateTime::class.java, OffsetDateTimeSerializer())
//    .create()
//
//    class OffsetDateTimeDeserializer : JsonDeserializer<OffsetDateTime> {
//        @Throws(JsonParseException::class)
//        override fun deserialize(
//            jsonElement: JsonElement,
//            type: Type,
//            jsonDeserializationContext: JsonDeserializationContext
//        ): OffsetDateTime {
//            val parsedDate = try {
//                OffsetDateTime.parse(jsonElement.asString, DateTimeFormatter.ISO_INSTANT)
//            } catch (e: Exception) {
//                OffsetDateTime.parse(jsonElement.asString, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
//            }
//            return parsedDate
//        }
//    }
//
//    class OffsetDateTimeSerializer : JsonSerializer<OffsetDateTime> {
//        override fun serialize(
//            offsetDateTime: OffsetDateTime,
//            type: Type,
//            jsonSerializationContext: JsonSerializationContext
//        ): JsonElement {
//            return JsonPrimitive(offsetDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
//        }
//    }
//    class LocalDateDeserializer : JsonDeserializer<LocalDate> {
//        @Throws(JsonParseException::class)
//        override fun deserialize(
//            jsonElement: JsonElement,
//            type: Type,
//            jsonDeserializationContext: JsonDeserializationContext
//        ): LocalDate {
//            val fullPattern = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")
//            val partialPattern = DateTimeFormatter.ofPattern("yyyy-MM-dd")
//            val parsedDate = try {
//                LocalDate.parse(jsonElement.asString, fullPattern)
//            } catch (e: Exception) {
//                LocalDate.parse(jsonElement.asString, partialPattern)
//            }
//            return parsedDate
//        }
//    }
//
//    class LocalDateSerializer : JsonSerializer<LocalDate> {
//        override fun serialize(
//            localDate: LocalDate,
//            type: Type,
//            jsonSerializationContext: JsonSerializationContext
//        ): JsonElement {
//            return JsonPrimitive(localDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
//        }
//    }

    fun isChildOf(c1: KClass<*>, c2: KClass<*>) = c2.javaObjectType.isAssignableFrom(c1.javaObjectType)

}
