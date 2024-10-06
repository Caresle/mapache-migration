import pgQuery from "../db.js";
import { getMigrationsToRollback } from "../utils/migrations-utils.js";

/**
 * Rollback migrations.
 * 
 * Call the down method of the migration.
 * @param { Number } toRollback - Number of migrations to rollback
 */
export default async function rollback(toRollback = 0) {
    const migrationToRollback = await pgQuery(getMigrationsToRollback, [toRollback ?? 0])
    const {rows} = migrationToRollback

    const migrations = rows.map((row) => row.migration_file)
    for (const file of migrations) {
        const migration = await import(`../migrations/${file}`)
        console.log('ROLLING BACK MIGRATION', file)
        await pgQuery(migration.default.down, [])
        console.log('ROLLING BACK MIGRATION', 'END')
        await pgQuery(`DELETE FROM migrations WHERE migration_file = '${file}'`, [])
    }
}