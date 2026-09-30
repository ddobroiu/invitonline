/**
 * Local development database: PGlite (Postgres compiled to WASM) behind a Postgres wire-protocol socket.
 * No installation, no Docker, never the production database.
 *
 *   npm run db:local            -> starts the server on 127.0.0.1:54329 (data in .local-db/, gitignored)
 *   npm run db:local:migrate    -> applies prisma/migrations to it (prisma migrate deploy)
 *
 * .env.local: DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54329/postgres?schema=invitonline&sslmode=disable"
 * Options: LOCAL_DB_PORT, LOCAL_DB_DIR (e.g. a temp dir for e2e tests, or "memory" for an in-memory database).
 */
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'

const port = Number(process.env.LOCAL_DB_PORT || 54329)
const dir = process.env.LOCAL_DB_DIR || '.local-db'

const db = await PGlite.create(dir === 'memory' ? undefined : dir)
const server = new PGLiteSocketServer({ db, port, host: '127.0.0.1', maxConnections: 20 })
await server.start()
console.log(`[local-db] PGlite on 127.0.0.1:${port} (${dir === 'memory' ? 'in memory' : dir})`)

let stopping = false
async function shutdown() {
    if (stopping) return
    stopping = true
    try { await server.stop() } catch { /* already stopped */ }
    try { await db.close() } catch { /* already closed */ }
    process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('SIGBREAK', shutdown)
