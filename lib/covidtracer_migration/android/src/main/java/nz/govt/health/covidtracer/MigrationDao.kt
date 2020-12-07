package nz.govt.health.covidtracer

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Query

@Dao
abstract class MigrationDao {
    @Query("SELECT * FROM tracing_locations")
    abstract suspend fun getAllLocations(): List<Location>

    @Query("SELECT * FROM matched_locations")
    abstract suspend fun getAllMatchedLocations(): List<MatchedLocation>

    @Query("SELECT * FROM users")
    abstract suspend fun getAllUsers(): List<User>
  
    @Query("DELETE FROM tracing_locations WHERE datetime(time) < datetime('now', :locationDateFiltering)")
    abstract suspend fun doDatabaseMantenance(locationDateFiltering: String)

    @Query("DELETE FROM matched_locations WHERE datetime(startDate) < datetime('now', :locationDateFiltering)")
    abstract suspend fun doDatabaseMantenanceMatchedLocations(locationDateFiltering: String)

}