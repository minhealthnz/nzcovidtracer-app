package nz.govt.health.covidtracer

import nz.govt.health.covidtracer.Utils.isChildOf
import java.security.SecureRandom

object Random {
    // Making this instance variable because creation of
    // SecureRandom is expensive.
    var secureRandom: SecureRandom = SecureRandom()
    inline fun <reified T>get(out: T? = null): T? {
        return when {
            isChildOf(T::class, Boolean::class) ->
                secureRandom.nextBoolean() as T
            isChildOf(T::class, Double::class) ->
                secureRandom.nextDouble() as T
            isChildOf(T::class, Float::class) ->
                secureRandom.nextFloat() as T
            isChildOf(T::class, Int::class) ->
                secureRandom.nextInt() as T
            isChildOf(T::class, Long::class) ->
                secureRandom.nextLong() as T
            isChildOf(T::class, ByteArray::class) && out !== null -> {
                secureRandom.nextBytes(out as ByteArray)
                null
            }
            else ->
                null
        }
    }
}