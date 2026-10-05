import { Pool } from 'pg'
import { readFileSync, readdirSync } from 'node:fs'

async function main() {
const connectionString = process.env.DATABASE_URL || process.env.INVITONLINE_DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL missing')
const url = new URL(connectionString)
const schema = url.searchParams.get('schema') || 'public'
console.log(JSON.stringify({ localDatabase: ['127.0.0.1', 'localhost'].includes(url.hostname), schema, authOrigin: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).origin : null, secretConfigured: Boolean(process.env.NEXTAUTH_SECRET) }))
const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000, query_timeout: 10000 })
try {
    const { rows } = await pool.query('SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = $1 ORDER BY table_name, ordinal_position', [schema])
    const columns = rows as { table_name: string; column_name: string }[]
    const source = readFileSync('prisma/schema.prisma', 'utf8')
    const missing: string[] = []
    for (const model of source.matchAll(/model (\w+) \{([\s\S]*?)\n\}/g)) {
        for (const field of model[2].matchAll(/^\s+(\w+)\s+(String|DateTime|Int|Float|Boolean|Json)\??(?:\s|$)/gm)) {
            if (!columns.some(column => column.table_name === model[1] && column.column_name === field[1])) missing.push(`${model[1]}.${field[1]}`)
        }
    }
    console.log(JSON.stringify({ databaseConnected: true, missingColumns: missing }))
    if (columns.some(column => column.table_name === '_prisma_migrations')) {
        const table = `"${schema.replaceAll('"', '""')}"."_prisma_migrations"`
        const migrations = await pool.query(`SELECT migration_name, finished_at IS NOT NULL AS complete, rolled_back_at IS NOT NULL AS rolled_back FROM ${table} ORDER BY migration_name`)
        const applied = new Set(migrations.rows.filter(row => row.complete && !row.rolled_back).map(row => row.migration_name))
        console.log(JSON.stringify({ pendingMigrations: readdirSync('prisma/migrations', { withFileTypes: true }).filter(file => file.isDirectory() && !applied.has(file.name)).map(file => file.name) }))
    } else console.log('MIGRATION TABLE MISSING')
} catch (error) {
    const failure = error as { code?: string; message?: string }
    console.log(JSON.stringify({ databaseConnected: false, code: failure.code, message: failure.message?.replace(/postgres(?:ql)?:\/\/[^\s]+/g, '[database]') }))
    process.exitCode = 1
} finally { await pool.end() }
}
void main()
