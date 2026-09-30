'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import styles from '../login/page.module.css'

// „Ai uitat parola?”: fara token — cererea linkului pe e-mail; cu ?token=… — parola noua.
// Merge si pentru conturile create cu Google (fara parola), care isi pot seta asa o parola.
function ResetContent() {
    const router = useRouter()
    const token = useSearchParams().get('token')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const requestLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const res = await fetch('/api/password-reset/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) setError(data.message || 'A apărut o eroare. Încearcă din nou.')
            else setDone(data.message)
        } catch {
            setError('Eroare de rețea. Încearcă din nou.')
        } finally {
            setIsLoading(false)
        }
    }

    const setNewPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (password !== confirm) {
            setError('Parolele nu coincid.')
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setError(data.message || 'A apărut o eroare. Încearcă din nou.')
                return
            }
            // intra direct in cont cu parola noua
            const login = await signIn('credentials', { email: data.email, password, redirect: false })
            if (login?.error) {
                setDone('Parola a fost schimbată. Acum poți intra în cont cu parola nouă.')
                return
            }
            router.push('/dashboard')
            router.refresh()
        } catch {
            setError('Eroare de rețea. Încearcă din nou.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.orb1}></div>
            <div className={styles.orb2}></div>

            <div className={styles.glassCard}>
                <h1 className={styles.title}>{token ? 'Parolă nouă' : 'Ai uitat parola?'}</h1>
                <p className={styles.subtitle}>
                    {token
                        ? 'Alege parola nouă pentru contul tău.'
                        : 'Îți trimitem pe e-mail un link pentru o parolă nouă. Merge și dacă ai intrat până acum doar cu Google.'}
                </p>

                {error && <p className={styles.error}>{error}</p>}

                {done ? (
                    <p style={{ textAlign: 'center', color: '#ccc', lineHeight: 1.6 }}>{done}</p>
                ) : token ? (
                    <form onSubmit={setNewPassword}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="password">Parola nouă</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                minLength={6}
                                maxLength={200}
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className={styles.hint}>Minim 6 caractere</span>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="confirm">Repetă parola</label>
                            <input
                                id="confirm"
                                type="password"
                                autoComplete="new-password"
                                minLength={6}
                                maxLength={200}
                                className={styles.input}
                                placeholder="••••••••"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? 'Se procesează...' : 'Salvează parola'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={requestLink}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={styles.input}
                                placeholder="nume@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? 'Se trimite...' : 'Trimite linkul'}
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    <Link href="/login" className={styles.link}>Înapoi la autentificare</Link>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetContent />
        </Suspense>
    )
}
