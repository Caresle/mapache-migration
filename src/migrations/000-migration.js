/**
 * Basic migration for creating the migrations table
 * that will keep track of the migrations that have been executed
 */

const up = `
    CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        migration_file VARCHAR(255) NOT NULL
    )
`

const down = `
    DROP TABLE IF EXISTS migrations
`

export default {
    up,
    down
}