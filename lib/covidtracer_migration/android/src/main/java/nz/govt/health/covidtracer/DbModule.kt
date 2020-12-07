package nz.govt.health.covidtracer

import android.content.Context
import kotlinx.coroutines.CoroutineScope
import java.util.concurrent.locks.ReentrantLock
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlin.concurrent.withLock

class DbModule private constructor(private val context: Context) {
    companion object {
      fun withDb(context: Context, skipEncryption: Boolean, cb: suspend (module: DbModule) -> Unit) {
        val dbModule = DbModule(context)
        dbModule.dbScope.launch {
            dbModule.createDatabase(skipEncryption)
            cb(dbModule)
            dbModule.closeDb()
        }
    }
    }
    private val dbScope = CoroutineScope(Dispatchers.IO + Job())
    private val createDatabaseLock = ReentrantLock()
    private var tracingDatabase: TracingDatabase? = null
    private val _dbName: String

    init {
        _dbName = getDbName()
    }
    fun getDbName(): String {
        return DbEncryption(context, "db-name").getKeyBase64()
    }

    suspend fun runMaintenance(dbMaintenanceTime: String) {
          //TODO: We might not need to clean the db every time we open it,
          // find if there is a better time/place to do this.
          getMigrationDao()?.doDatabaseMantenance(dbMaintenanceTime)
          getMigrationDao()?.doDatabaseMantenance(dbMaintenanceTime)
    }

    private fun closeDb() {
        tracingDatabase?.closedb()
        tracingDatabase = null
    }

    private fun createDatabase(skipEncryption: Boolean) {
        if (tracingDatabase === null) {
            createDatabaseLock.withLock {
                if (tracingDatabase === null) {
                    val encrypt = DbEncryption(context, _dbName)
                    var passPhrase = encrypt.getKeyBytes()
                    tracingDatabase = TracingDatabase(_dbName, passPhrase, skipEncryption)
                    tracingDatabase!!.init(context)
                }
            }
        }
    }

    fun getMigrationDao() : MigrationDao? {  
        return tracingDatabase!!.getDatabase()!!.migrationDao()
    }
}