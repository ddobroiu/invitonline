'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

function SuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session_id')
    const [invitationUrl, setInvitationUrl] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) return

            try {
                // Wait for webhook to process or poll API
                const res = await fetch(`/api/events`) // Gets current user's event
                if (res.ok) {
                    const data = await res.json()
                    if (data.event && data.event.isPaid) {
                        setInvitationUrl(`${window.location.origin}/invitatie/${data.event.id}`)
                        setLoading(false)
                    } else {
                        // Retry after 2 seconds if not yet updated
                        setTimeout(verifyPayment, 2000)
                    }
                }
            } catch (err) {
                console.error(err)
            }
        }

        verifyPayment()
    }, [sessionId])

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>✅</div>
                <h1 className={styles.title}>Plată Reușită!</h1>
                <p className={styles.text}>Felicitări! Invitația ta premium a fost activată.</p>

                {loading ? (
                    <div className={styles.loader}>Se generează link-ul unic...</div>
                ) : (
                    <div className={styles.linkContainer}>
                        <p className={styles.linkTitle}>Link-ul tău unic este:</p>
                        <div className={styles.linkBox}>
                            <code>{invitationUrl}</code>
                            <button
                                onClick={() => navigator.clipboard.writeText(invitationUrl)}
                                className={styles.copyBtn}
                            >
                                Copiază
                            </button>
                        </div>
                        <Link href={invitationUrl} className={styles.viewBtn}>
                            Vezi Invitația
                        </Link>
                    </div>
                )}

                <Link href="/dashboard" className={styles.backBtn}>
                    Mergi la Dashboard
                </Link>
            </div>
        </div>
    )
}

import { Suspense } from 'react'

export default function CheckoutSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
