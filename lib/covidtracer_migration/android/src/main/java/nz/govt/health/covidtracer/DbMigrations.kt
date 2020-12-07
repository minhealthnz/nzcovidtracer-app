package nz.govt.health.covidtracer

import android.util.Log
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import nz.govt.health.covidtracer.HashHelper

object DbMigrations {
    val MIGRATION_1_2 = object : Migration(1, 2) {
        override fun migrate(database: SupportSQLiteDatabase) {
            database.execSQL("CREATE TABLE IF NOT EXISTS `matched_locations` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `locationId` INTEGER NOT NULL, `acknowledged` INTEGER NOT NULL, `notificationId` TEXT NOT NULL, `eventId` TEXT NOT NULL, `startDate` TEXT NOT NULL, `endDate` TEXT NOT NULL, FOREIGN KEY(`locationId`) REFERENCES `tracing_locations`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE )")
            database.execSQL("CREATE INDEX IF NOT EXISTS `index_matched_locations_locationId` ON `matched_locations` (`locationId`)")
            database.execSQL("ALTER TABLE `tracing_locations` ADD COLUMN `hashedGln` TEXT")
            val cursor = database.query("SELECT id, gln FROM `tracing_locations` WHERE hashedGln IS NULL")
            //We now will update the existing glns with hashed SHA-384 glns so we can compare later.
            val hashedGlns = mutableListOf<Pair<Long, String>>()
            while(cursor.moveToNext()) {
                val id = cursor.getLong(cursor.getColumnIndex("id"))
                val gln = cursor.getString(cursor.getColumnIndex("gln"))
                try {
                    val hashedGln = HashHelper.hashString(gln)
                    hashedGlns.add(Pair(id, hashedGln))
                } catch (e: Exception) {
                }
            }
            cursor.close()
            hashedGlns.forEach {
                database.execSQL("UPDATE `tracing_locations` SET hashedGln = '${it.second}' WHERE id = ${it.first}")
            }
        }
    }
    val MIGRATION_2_3 = object : Migration(2, 3) {
        override fun migrate(database: SupportSQLiteDatabase) {
            database.execSQL("CREATE TABLE IF NOT EXISTS `tracing_locations_new` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `userId` TEXT NOT NULL, `businessName` TEXT NOT NULL, `time` TEXT NOT NULL, `address` TEXT, `gln` TEXT, `hashedGln` TEXT, `locationType` TEXT, `note` TEXT, `scanType` INTEGER NOT NULL DEFAULT 0)")
            database.execSQL("INSERT INTO tracing_locations_new (id, userId, businessName, time, address, gln, hashedGln) SELECT id, userId, businessName, time, address, gln, hashedGln FROM tracing_locations")
            database.execSQL("DROP TABLE tracing_locations")
            database.execSQL("ALTER TABLE `tracing_locations_new` RENAME TO `tracing_locations`")
        }
    }
    val MIGRATION_3_4 = object : Migration(3, 4) {
        override fun migrate(database: SupportSQLiteDatabase) {
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `systemNotificationBody` TEXT NOT NULL DEFAULT ''")
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `appBannerTitle` TEXT NOT NULL DEFAULT ''")
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `appBannerBody` TEXT NOT NULL DEFAULT ''")
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `appBannerLinkLabel` TEXT NOT NULL DEFAULT ''")
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `appBannerLinkUrl` TEXT NOT NULL DEFAULT ''")
        }
    }
    val MIGRATION_4_5 = object : Migration(4, 5) {
        override fun migrate(database: SupportSQLiteDatabase) {
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `appBannerRequestCallbackEnabled` INTEGER NOT NULL DEFAULT 0")
            database.execSQL("ALTER TABLE `matched_locations` ADD COLUMN `callbackRequested` INTEGER NOT NULL DEFAULT 0")
        }
    }
    val MIGRATION_5_6 = object: Migration(5, 6) {
        override fun migrate(database: SupportSQLiteDatabase) {
            database.execSQL("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `lastKnownCognitoUserId` TEXT, `firstName` TEXT, `middleName` TEXT, `lastName` TEXT, `phone` TEXT, `nhi` TEXT, `dateOfBirth` TEXT, `isActive` INTEGER NOT NULL DEFAULT 0)")
            database.execSQL("INSERT INTO `users` (`lastKnownCognitoUserId`) SELECT DISTINCT `userId` FROM `tracing_locations`")
        }
    }
    val MIGRATION_6_7 = object: Migration(6, 7) {
        override fun migrate(database: SupportSQLiteDatabase) {
            database.execSQL("CREATE TABLE IF NOT EXISTS `matched_locations_new` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `locationId` INTEGER, `acknowledged` INTEGER NOT NULL, `notificationId` TEXT NOT NULL, `eventId` TEXT NOT NULL, `startDate` TEXT NOT NULL, `endDate` TEXT NOT NULL, `systemNotificationBody` TEXT NOT NULL DEFAULT '', `appBannerTitle` TEXT NOT NULL DEFAULT '', `appBannerBody` TEXT NOT NULL DEFAULT '', `appBannerLinkLabel` TEXT NOT NULL DEFAULT '', `appBannerLinkUrl` TEXT NOT NULL DEFAULT '', `appBannerRequestCallbackEnabled` INTEGER NOT NULL DEFAULT 0, `callbackRequested` INTEGER NOT NULL DEFAULT 0, FOREIGN KEY(`locationId`) REFERENCES `tracing_locations`(`id`) ON UPDATE NO ACTION ON DELETE SET NULL)")
            database.execSQL("INSERT INTO matched_locations_new SELECT * FROM matched_locations")
            database.execSQL("DROP TABLE matched_locations")
            database.execSQL("ALTER TABLE `matched_locations_new` RENAME TO `matched_locations`")

        }
    }
}