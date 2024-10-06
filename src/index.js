import { config } from "dotenv";
config()
import fs from "node:fs"

import pgQuery from "./db.js";
import { existsMigrationTable } from "./utils/migrations-utils.js";

async function commit(folder, lastMigration = null) {
    const migrationPosition = folder.findIndex(file => file === lastMigration)
    const migrations = folder.slice(migrationPosition + 1)
    
    for (const file of migrations) {
        const migration = await import(`./migrations/${file}`)
        console.log('EXECUTING MIGRATION', file)
        await pgQuery(migration.default.up, [])
        console.log('EXECUTING MIGRATION', 'END')
        await pgQuery(`INSERT INTO migrations (migration_file) VALUES ('${file}')`, [])
    }
}

async function main() {
    const folder = fs.readdirSync("./src/migrations")

    console.log('START')

    const ans = await pgQuery(existsMigrationTable, [])
    const exists = ans?.rows?.[0]?.exists
        
    let lastMigration = null
    if (exists) {
        const data = await pgQuery(`SELECT * FROM migrations ORDER BY id DESC LIMIT 1`, [])
        lastMigration = data?.rows?.[0]?.migration_file ?? null
        console.log('LAST MIGRATION', lastMigration)
    }
    commit(folder, lastMigration)
    console.log('END')
}

main()