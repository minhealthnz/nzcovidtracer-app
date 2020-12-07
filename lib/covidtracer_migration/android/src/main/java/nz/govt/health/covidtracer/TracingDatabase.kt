package nz.govt.health.covidtracer

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import net.sqlcipher.database.SupportFactory

/**
 * The Room database for this app
 */
class TracingDatabase(val dbName: String, val passPhrase: ByteArray, val skipEncryption: Boolean = false) {

    @Volatile private var dbInstance: TracingDatabaseImpl? = null

    @Database(entities = [Location::class, MatchedLocation::class, User::class], version = 7, exportSchema = true)
    @TypeConverters(DbConverters::class)
    abstract class TracingDatabaseImpl : RoomDatabase() {
        abstract fun migrationDao(): MigrationDao
    }

    private fun buildDatabase(context: Context, dbName: String, passPhrase: ByteArray): TracingDatabaseImpl {
        val dbBuilder = Room.databaseBuilder(context, TracingDatabaseImpl::class.java, dbName)
//        if (BuildConfig.DEBUG) {
//            dbBuilder.setJournalMode(RoomDatabase.JournalMode.TRUNCATE)
//        } else {
        if (!skipEncryption) {
            dbBuilder.openHelperFactory(SupportFactory(passPhrase))
        }
//        }
        dbBuilder.addMigrations(DbMigrations.MIGRATION_1_2)
        dbBuilder.addMigrations(DbMigrations.MIGRATION_2_3)
        dbBuilder.addMigrations(DbMigrations.MIGRATION_3_4)
        dbBuilder.addMigrations(DbMigrations.MIGRATION_4_5)
        dbBuilder.addMigrations(DbMigrations.MIGRATION_5_6)
        dbBuilder.addMigrations(DbMigrations.MIGRATION_6_7)
        return dbBuilder.build()
    }

    fun init(context: Context) {
        if (dbInstance === null) {
            dbInstance = buildDatabase(context, dbName, passPhrase)
        }
    }
    fun closedb() {
        if (dbInstance !== null && dbInstance!!.isOpen) {
            dbInstance!!.close()
            dbInstance = null
        }
    }

    fun getDatabase() = dbInstance
}