package nz.govt.health.covidtracer

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import android.util.Base64.decode
import android.util.Base64.encodeToString
import java.nio.charset.Charset
import java.security.Key
import java.security.KeyStore
import java.security.MessageDigest
import java.security.spec.AlgorithmParameterSpec
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.spec.GCMParameterSpec

object HashHelper {
    fun hashString(input: String, removePadding: Boolean = false, urlSafe: Boolean = false): String {
        val messageDigest = MessageDigest.getInstance("SHA-384")
        messageDigest.update(input.toByteArray(Charset.defaultCharset()))
        val digestedBytes = messageDigest.digest()
        var flags = Base64.NO_WRAP
        if (urlSafe) {
            flags = flags or Base64.URL_SAFE
        }
        if (removePadding) {
            flags = flags or Base64.NO_PADDING
        }
        return encodeToString(digestedBytes, flags)
    }
}

/**
 * This provider generates a AES 256-bit key using
 * AndroidKeyStore.
 */
class EncryptionHelper constructor(context: Context) {
    companion object {
        private const val KEYSTORE_ENCRYPTION_ALIAS = "UniteAppKS"
        private const val AES_KEY_ALGORITHM = "AES"
        private const val CIPHER_AES_GCM_NOPADDING_KEY_LENGTH_IN_BITS = 256
        private const val ANDROID_KEY_STORE_NAME = "AndroidKeyStore"
        private const val CIPHER_AES_GCM_NOPADDING = "AES/GCM/NoPadding"
        private const val CIPHER_AES_GCM_NOPADDING_IV_LENGTH_IN_BYTES = 12
        private const val CIPHER_AES_GCM_NOPADDING_TAG_LENGTH_LENGTH_IN_BITS = 128
        //TODO: Put NO_WRAP So we don't introduce newline characters, its too late now as the users will have their encryption keys stored with a newline but for future reference.
        const val BASE64_ENCODING_FLAGS = Base64.URL_SAFE or Base64.NO_PADDING
        /**
         * The data key in SharedPreferences will have this suffix.
         *
         * For example: if the key to access data is "accessKey", the SharedPreferences
         * key will be "accessKey.encrypted"
         */
        const val SHARED_PREFERENCES_DATA_IDENTIFIER_SUFFIX = ".encrypted"

        /**
         * The IV used to encrypt data will be stored under the key
         * "accessKey.encrypted.iv"
         */
        const val SHARED_PREFERENCES_IV_SUFFIX = ".iv"
    }

    private val preferencesGet = PreferencesHelper.getPreferences("keys", context)
    private val preferencesEdit = PreferencesHelper.editPreferences("keys", context)
    @Synchronized
    fun retrieveKey(keyAlias: String): Key {
        return try {
            val keyStore = KeyStore.getInstance(ANDROID_KEY_STORE_NAME)
            keyStore.load(null)
            // If the keystore does not have keys for this alias, generate a new
            // asymmetric AES/GCM/NoPadding key pair.
            if (keyStore.containsAlias(keyAlias)) {
                val key = keyStore.getKey(keyAlias, null)
                key ?:
                    throw Exception("Key is null even though the keyAlias: $keyAlias  is present in $ANDROID_KEY_STORE_NAME")
            } else {
                throw Exception("$ANDROID_KEY_STORE_NAME does not contain the keyAlias: $keyAlias")
            }
        }
        catch (ex: Exception) {
            throw Exception("Error occurred while accessing $ANDROID_KEY_STORE_NAME to retrieve the key for keyAlias: $keyAlias", ex)
        }
    }

    @Synchronized
    fun generateKey(keyAlias: String): Key {
        return try {
            val keyStore = KeyStore.getInstance(ANDROID_KEY_STORE_NAME)
            keyStore.load(null)
            // If the keystore does not have keys for this alias, generate a new
            // asymmetric AES/GCM/NoPadding key pair.
            if (!keyStore.containsAlias(keyAlias)) {
                val generator = KeyGenerator.getInstance(
                    AES_KEY_ALGORITHM,
                    ANDROID_KEY_STORE_NAME
                )
                // setRandomizedEncryptionRequired(false) because Randomized Encryption
                // does not work consistently in API levels 23-28.
                generator.init(
                    KeyGenParameterSpec.Builder(
                        keyAlias,
                        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
                    )
                        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                        .setKeySize(CIPHER_AES_GCM_NOPADDING_KEY_LENGTH_IN_BITS)
                        .setRandomizedEncryptionRequired(false)
                        .build()
                )
                val key: Key = generator.generateKey()
                key
            } else {
                throw Exception("Key already exists for the keyAlias: $keyAlias in $ANDROID_KEY_STORE_NAME"
                )
            }
        }
        catch (ex: Exception) {
            throw Exception("Cannot generate a key for alias: $keyAlias in $ANDROID_KEY_STORE_NAME", ex)
        }
    }

    @Synchronized
    fun deleteKey(keyAlias: String) {
        val keyStore = KeyStore.getInstance(ANDROID_KEY_STORE_NAME)
        keyStore.load(null)
        keyStore.deleteEntry(keyAlias)
    }

    @Synchronized
    fun getBytes(dataKey: String?): ByteArray? {
        val value = get(dataKey)
        if (value === null) {
            return null
        }
        return decode(value, BASE64_ENCODING_FLAGS)
    }

    /**
     * Retrieve the value for the given key from the key-value store.
     *
     * go to the persistent store, read the data and return.
     *
     * @param dataKey key that identifies the value to be retrieved.
     * @return the value corresponding to the key.
     */
    @Synchronized
    fun get(dataKey: String?): String? {
        if (dataKey == null) {
            return null
        }
        // Retrieve the decryption key used for decrypting the data.
        // dataKey becomes dataKey.encrypted
        val dataKeyInPersistentStore = getDataKeyUsedInPersistentStore(dataKey)
        // Based on the encryption key alias, retrieve the encryption key
        // If the encryption key cannot be retrieved, return null and
        // the consumer of get would treat it as if this data is not present
        // on the persistent store.
        val decryptionKey = retrieveEncryptionKey("$KEYSTORE_ENCRYPTION_ALIAS/$dataKey") ?: return null
        // If the key-value pair is not found in the SharedPreferences,
        // return null.
        if (!preferencesGet.contains(dataKeyInPersistentStore))
            return null

        return try {
            // Read from the SharedPreferences and decrypt
            val encryptedData = preferencesGet.getString(dataKeyInPersistentStore, null)
            val decryptedDataInString = decrypt(
                decryptionKey,
                getInitializationVector(dataKeyInPersistentStore),
                encryptedData
            )
            decryptedDataInString
        }
        catch (ex: java.lang.Exception) {
            // Remove the dataKey and its associated value if there is an exception in decryption
            remove(dataKey)
            null
        }
    }

    @Synchronized
    fun putBytes(dataKey: String?, value: ByteArray?) {
        put(dataKey, encodeToString(value, BASE64_ENCODING_FLAGS))
    }
    /**
     * Store the key-value pair in the key-value store.
     *
     * First, store it in-memory.
     * If isPersistenceEnabled is true, store it in the persistent
     * store.
     *
     * In cases of error while persisting to disk, th subsequent read
     * will get null.
     *
     * @param dataKey key that identifies the value
     * @param value data that needs to be stored
     */
    @Synchronized
    fun put(dataKey: String?, value: String?) {
        if (dataKey == null) {
            return
        }
        // Convert string to bytes -> Encrypt -> Base64 encode -> Store
        if (value == null) {
            remove(dataKey)
            return
        }
        // dataKey becomes dataKey.encrypted
        val dataKeyInPersistentStore = getDataKeyUsedInPersistentStore(dataKey)
        // Based on the encryption key alias, retrieve the encryption key
        // If the encryption key cannot be retrieved, create a new encryption key
        // with the encryption key alias.
        var encryptionKey = retrieveEncryptionKey("$KEYSTORE_ENCRYPTION_ALIAS/$dataKey")
        if (encryptionKey == null) {
            // If the encryption key is null, create a new encryption key
            encryptionKey = generateEncryptionKey("$KEYSTORE_ENCRYPTION_ALIAS/$dataKey")
            if (encryptionKey == null) {
                return
            }
        }
        try {
            // Encrypt
            val iv = generateInitializationVector()
                ?: throw java.lang.Exception("The generated IV for dataKey = $dataKey is null.")
            val base64EncodedEncryptedString = encrypt(
                encryptionKey,
                getAlgorithmParameterSpecForIV(iv),
                value
            )
            // Persist
            val base64EncodedIV = encodeToString(iv, BASE64_ENCODING_FLAGS)
                ?: throw java.lang.Exception("Error in Base64 encoding the IV for dataKey = $dataKey")
            preferencesEdit
                .putString(dataKeyInPersistentStore, base64EncodedEncryptedString) // Data
                .putString(dataKeyInPersistentStore + SHARED_PREFERENCES_IV_SUFFIX, base64EncodedIV) // IV
                .apply()
        }
        catch (ex: java.lang.Exception) {
        }
    }

    /**
     * Remove the key-value pair identified by the key
     * from the key-value store.
     *
     * remove(key) will remove from in-memory and
     * the persistent store if isPersistenceEnabled is true.
     *
     * @param dataKey identifies the key-value pair to be removed
     */
    @Synchronized
    fun remove(dataKey: String) {
        // Irrespective of persistence is enabled or not, mutate in memory.
        val keyUsedInPersistentStore = getDataKeyUsedInPersistentStore(dataKey)
        preferencesEdit
            .remove(keyUsedInPersistentStore)
            .remove(keyUsedInPersistentStore + SHARED_PREFERENCES_IV_SUFFIX)
            .apply()

    }


    /**
     * Encrypt the data using the encryptionKey and ivSpec. After successful
     * encryption of data, Base64 encode the encrypted data and return the
     * base64 encoded string.
     *
     * @param encryptionKey key used to encrypt the data
     * @param ivSpec spec that wraps the initialization vector used in encryption
     * @param data data to be encrypted in string
     * @return base64 encoded string of the encrypted data.
     */
    private fun encrypt(encryptionKey: Key, ivSpec: AlgorithmParameterSpec, data: String): String? {
        return try {
            val cipher = Cipher.getInstance(CIPHER_AES_GCM_NOPADDING)
            cipher.init(
                Cipher.ENCRYPT_MODE,
                encryptionKey,
                ivSpec
            )
            val encryptedData = cipher.doFinal(data.toByteArray(Charset.defaultCharset()))
            encodeToString(encryptedData, BASE64_ENCODING_FLAGS)
        }
        catch (ex: java.lang.Exception) {
            null
        }
    }

    /**
     * Decrypt the data using the decryptionKey and ivSpec. After successful
     * decryption of data, Base64 decode the encrypted data and decrypt it
     * and return the raw data in string format.
     *
     * @param decryptionKey key used to encrypt the data
     * @param ivSpec spec that wraps the initialization vector used in encryption
     * @param encryptedData data to be decrypted
     * @return raw data in string format
     */
    private fun decrypt(decryptionKey: Key,
                        ivSpec: AlgorithmParameterSpec,
                        encryptedData: String?): String? {
        return try {
            val encryptedDecodedData = decode(encryptedData, BASE64_ENCODING_FLAGS)
            val cipher = Cipher.getInstance(CIPHER_AES_GCM_NOPADDING)
            cipher.init(
                Cipher.DECRYPT_MODE,
                decryptionKey,
                ivSpec
            )
            val decryptedData = cipher.doFinal(encryptedDecodedData)
            String(decryptedData, Charset.defaultCharset())
        }
        catch (ex: java.lang.Exception) {
            null
        }
    }

    @Throws(java.lang.Exception::class)
    private fun getInitializationVector(keyOfDataInSharedPreferences: String?): AlgorithmParameterSpec {
        val keyOfIV = keyOfDataInSharedPreferences + SHARED_PREFERENCES_IV_SUFFIX
        if (!preferencesGet.contains(keyOfIV)) {
            throw java.lang.Exception("Initialization vector for $keyOfDataInSharedPreferences is missing from the SharedPreferences.")
        }
        val initializationVectorInString = preferencesGet.getString(keyOfIV, null)
            ?: throw java.lang.Exception("Cannot read the initialization vector for $keyOfDataInSharedPreferences from SharedPreferences.")
        val base64DecodedIV = decode(initializationVectorInString, BASE64_ENCODING_FLAGS)
        if (base64DecodedIV == null || base64DecodedIV.isEmpty()) {
            throw java.lang.Exception("Cannot base64 decode the initialization vector for $keyOfDataInSharedPreferences read from SharedPreferences.")
        }
        return getAlgorithmParameterSpecForIV(base64DecodedIV)
    }

    private fun generateInitializationVector(): ByteArray? {
        // Else, generate one and save it in SharedPreferences
        val initializationVector = ByteArray(CIPHER_AES_GCM_NOPADDING_IV_LENGTH_IN_BYTES)
        Random.get(initializationVector)
        return initializationVector
    }

    private fun getAlgorithmParameterSpecForIV(iv: ByteArray): AlgorithmParameterSpec {
        return  GCMParameterSpec(CIPHER_AES_GCM_NOPADDING_TAG_LENGTH_LENGTH_IN_BITS, iv)
    }

    @Synchronized
    private fun retrieveEncryptionKey(encryptionKeyAlias: String): Key? {
        return try {
            retrieveKey(encryptionKeyAlias)
        }
        catch (ex: Exception) {
            // When Key cannot be retrieved, any existing encrypted data
            // cannot be decrypted successfully. Hence, deleting all the
            // existing encrypted data stored in SharedPreferences
            // Clears the encryption keys if stored on SharedPreferences
            deleteKey(encryptionKeyAlias)
            null
        }
    }

    @Synchronized
    fun generateEncryptionKey(encryptionKeyAlias: String): Key? {
        // Try to generate a new key.
        return try {
            generateKey(encryptionKeyAlias)
        }
        catch (ex: Exception) {
            null
        }
    }

    private fun getDataKeyUsedInPersistentStore(key: String): String? {
        return key + SHARED_PREFERENCES_DATA_IDENTIFIER_SUFFIX
    }
}
