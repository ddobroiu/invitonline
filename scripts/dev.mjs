import { spawn } from 'node:child_process'
import net from 'node:net'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd(), true)
const args = process.argv.slice(2)
const portIndex = args.findIndex(arg => arg === '--port' || arg === '-p')
const port = Number(portIndex >= 0 ? args[portIndex + 1] : args.find(arg => arg.startsWith('--port='))?.split('=')[1] || process.env.PORT || 3000)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid development port')
const origin = `http://localhost:${port}`
let authLocal = !process.env.NEXTAUTH_URL
try { authLocal ||= ['localhost', '127.0.0.1'].includes(new URL(process.env.NEXTAUTH_URL).hostname) } catch { /* NextAuth will report invalid configuration */ }
if (authLocal) process.env.NEXTAUTH_URL = origin

let database
let app
let stopping = false
function shutdown(code = 0) {
    if (stopping) return
    stopping = true
    app?.kill('SIGTERM')
    database?.kill('SIGTERM')
    process.exitCode = code
}
process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
process.on('SIGBREAK', () => shutdown())

function canConnect(port) {
    return new Promise(resolve => {
        const socket = net.createConnection({ host: '127.0.0.1', port })
        const finish = result => { socket.destroy(); resolve(result) }
        socket.setTimeout(1000)
        socket.once('connect', () => finish(true))
        socket.once('error', () => finish(false))
        socket.once('timeout', () => finish(false))
    })
}
function run(command, env = process.env) {
    return spawn(process.execPath, command, { env, stdio: 'inherit', windowsHide: true })
}
function completed(child) {
    return new Promise((resolve, reject) => {
        child.once('error', reject)
        child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Development prerequisite failed (${code})`)))
    })
}

try {
    let databaseUrl
    try { databaseUrl = new URL(process.env.DATABASE_URL) } catch { /* The app handles missing configuration */ }
    // Only manage the bundled database. External PostgreSQL instances retain their own lifecycle.
    if (databaseUrl && ['127.0.0.1', 'localhost'].includes(databaseUrl.hostname) && databaseUrl.port === '54329') {
        if (!await canConnect(54329)) {
            database = run(['scripts/local-db.mjs'], { ...process.env, LOCAL_DB_PORT: '54329' })
            database.once('error', error => { console.error('[dev] Local database failed:', error.message); shutdown(1) })
            database.once('exit', code => { if (!stopping) { console.error('[dev] Local database stopped.'); shutdown(code || 1) } })
            for (let attempt = 0; attempt < 30; attempt++) {
                if (stopping) break
                if (await canConnect(54329)) break
                if (attempt === 29) throw new Error('Local database did not start')
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        }
        if (!stopping) await completed(run(['node_modules/prisma/build/index.js', 'migrate', 'deploy']))
    }
    if (!stopping) {
        console.log(`[dev] Site and authentication: ${origin}`)
        app = run(['node_modules/next/dist/bin/next', 'dev', ...args])
        app.once('error', error => { console.error('[dev] Server failed:', error.message); shutdown(1) })
        app.once('exit', code => shutdown(code || 0))
    }
} catch (error) {
    console.error('[dev]', error.message)
    shutdown(1)
}
