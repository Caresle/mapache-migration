export const existsMigrationTable = `
    SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'migrations'
    )
`

export const getMigrationsToRollback = `
    SELECT * FROM migrations order by id desc
    LIMIT $1
`