import { config } from "dotenv";
config()
import fs from "node:fs"

import pgQuery from "./db.js";
import { existsMigrationTable } from "./utils/migrations-utils.js";
import commit from "./commands/commit.js";
import rollback from "./commands/rollback.js";

async function main() {
    const folder = fs.readdirSync("./src/migrations")

    console.log('START')

    const ans = await pgQuery(existsMigrationTable, [])
    const exists = ans?.rows?.[0]?.exists
        
    let lastMigration = null
    if (exists) {
        const data = await pgQuery(`SELECT * FROM migrations ORDER BY id DESC LIMIT 1`, [])
        lastMigration = data?.rows?.[0]?.migration_file ?? null
    }
    // commit(folder, lastMigration)
    rollback(2)
    console.log('END')
}

main()