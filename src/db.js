import pg from "pg";
import { config } from "dotenv";
config()

const pool = new pg.Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
})

process.on("SIGINT", () => {
    console.log('closing pool on sigint')
    pool.end()
})

process.on("SIGTERM", () => {
    console.log('closing pool on sigterm')
    pool.end()
})

process.on("exit", () => {
    console.log('closing pool on exit')
    pool.end()
})

const pgQuery = (query, params) => {
    return pool.query(query, params)
}

export default pgQuery;