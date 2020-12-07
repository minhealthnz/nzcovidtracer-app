package nz.govt.health.covidtracer

import android.content.Context
import android.util.Base64


//Keysuffix can be a unique identifier so we can store encryption keys per session.
class DbEncryption(context: Context, keySuffix: String, private val keySize: Int = 16) {
    private val _dataKey = "dbkey/$keySuffix"
    private val _encryptionHelper = EncryptionHelper(context)

    private fun generateKey(keySize: Int) : ByteArray {
        var bytes = ByteArray(keySize)
        Random.get(bytes)
        return bytes
    }
    private fun storeBytes(key: ByteArray) {
        _encryptionHelper.putBytes(_dataKey, key)
    }
    private fun storePlain(key: String) {
        _encryptionHelper.put(_dataKey, key)
    }

    fun getKeyBytes(): ByteArray {
        val storedKey = _encryptionHelper.getBytes(_dataKey)
        return if (storedKey === null) {
            val newKey = generateKey(keySize)
            storeBytes(newKey)
            newKey
        } else {
            storedKey
        }
    }
    fun getKeyBase64() : String {
        val storedKeyBase64 = _encryptionHelper.get(_dataKey)
        return if (storedKeyBase64 === null) {
            val newKey = generateKey(keySize)
            val keyBase64 = Base64.encodeToString(newKey, Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP)
            storePlain(keyBase64)
            keyBase64
        } else {
            storedKeyBase64
        }
    }
}