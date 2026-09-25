import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL
    // Don't throw at import time (it would break `next build`); queries will fail with a clear log instead
    if (!connectionString) {
        console.warn('DATABASE_URL is not defined in environment variables')
    }
    const pool = new Pool({ connectionString })
    // Baza e comuna cu celelalte proiecte (toateproiectele); tabelele InvitOnline stau in schema din ?schema=
    let schema: string | undefined
    try { schema = connectionString ? new URL(connectionString).searchParams.get('schema') || undefined : undefined } catch { schema = undefined }
    const adapter = new PrismaPg(pool, schema ? { schema } : undefined)
    return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
