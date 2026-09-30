'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import styles from './page.module.css'
import RegisterTermsConsent from '@/components/legal/RegisterTermsConsent'
import RegisterMarketingChoice from '@/components/legal/RegisterMarketingChoice'

// Only allow redirects inside the site
function safeCallback(url: string | null) {
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/dashboard'
}

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = safeCallback(searchParams.get('callbackUrl'))
    const tab = searchParams.get('tab')
    const { status } = useSession()
    const [isLogin, setIsLogin] = useState(tab !== 'register')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [marketingOptOut, setMarketingOptOut] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })

    // Keep the form in sync when the URL changes (e.g. header "Creează cont" while already on /login)
    useEffect(() => {
        setIsLogin(tab !== 'register')
        setError('')
    }, [tab])

    // Already signed in: nothing to do here
    useEffect(() => {
        if (status === 'authenticated' && !isLoading) router.replace(callbackUrl)
    }, [status, isLoading, router, callbackUrl])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (!isLogin) {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, acceptTerms, marketingOptOut })
                })
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    setError(data.message || 'Eroare la înregistrare')
                    return
                }
            }

            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (res?.error) {
                setError('Email sau parolă incorectă')
                return
            }

            router.push(callbackUrl)
            router.refresh()
        } catch {
            setError('A apărut o eroare. Încearcă din nou.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.orb1}></div>
            <div className={styles.orb2}></div>

            <div className={styles.glassCard}>
                <h1 className={styles.title}>{isLogin ? 'Bine ai venit' : 'Creează cont'}</h1>
                <p className={styles.subtitle}>
                    {isLogin
                        ? 'Intră în cont pentru a gestiona invitațiile.'
                        : 'Începe să creezi momente memorabile.'}
                </p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="name">Nume</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                autoComplete="name"
                                className={styles.input}
                                placeholder="Ex: Andrei Popescu"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            className={styles.input}
                            placeholder="nume@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">Parolă</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            minLength={isLogin ? undefined : 6}
                            className={styles.input}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {!isLogin && <span className={styles.hint}>Minim 6 caractere</span>}
                    </div>

                    {!isLogin && <RegisterTermsConsent checked={acceptTerms} onChange={setAcceptTerms} />}
                    {!isLogin && <RegisterMarketingChoice optOut={marketingOptOut} onChange={setMarketingOptOut} />}

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Se procesează...' : (isLogin ? 'Autentificare' : 'Creează contul')}
                    </button>
                </form>

                <div className={styles.footer}>
                    {isLogin ? 'Nu ai cont?' : 'Ai deja cont?'}
                    <button
                        type="button"
                        className={styles.link}
                        onClick={() => { setIsLogin(!isLogin); setError('') }}
                    >
                        {isLogin ? 'Creează unul acum' : 'Intră în cont'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    )
}
