import pgQuery from "../db.js";

export default async function commit(migrations, lastMigration = null) {
    const migrationPosition = migrations.findIndex(file => file === lastMigration)
    const migrationsToRun = migrations.slice(migrationPosition + 1)
    
    for (const file of migrationsToRun) {
        const migration = await import(`../migrations/${file}`)
        console.log('EXECUTING MIGRATION', file)
        await pgQuery(migration.default.up, [])
        console.log('EXECUTING MIGRATION', 'END')
        await pgQuery(`INSERT INTO migrations (migration_file) VALUES ('${file}')`, [])
    }
}
