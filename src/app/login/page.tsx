'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import styles from './page.module.css'

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (isLogin) {
            // LOGIN FLOW
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (res?.error) {
                setError('Email sau parolă incorectă')
            } else {
                localStorage.setItem('user', JSON.stringify({ email: formData.email })) // Keep for legacy dashboard check if needed, but session is better
                router.push('/dashboard')
            }
        } else {
            // REGISTER FLOW
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                if (res.ok) {
                    // Auto login after register
                    const loginRes = await signIn('credentials', {
                        email: formData.email,
                        password: formData.password,
                        redirect: false
                    })
                    if (!loginRes?.error) {
                        router.push('/dashboard')
                    }
                } else {
                    const data = await res.json()
                    setError(data.message || 'Eroare la înregistrare')
                }
            } catch (err) {
                setError('A apărut o eroare. Încearcă din nou.')
            }
        }
        setIsLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.orb1}></div>
            <div className={styles.orb2}></div>

            <div className={styles.glassCard}>
                <h1 className={styles.title}>{isLogin ? 'Bine ai venit' : 'Creează Cont'}</h1>
                <p className={styles.subtitle}>
                    {isLogin
                        ? 'Intră în cont pentru a gestiona invitațiile.'
                        : 'Începe să creezi momente memorabile.'}
                </p>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nume</label>
                            <input
                                type="text"
                                name="name"
                                className={styles.input}
                                placeholder="Ex: Andrei Popescu"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            className={styles.input}
                            placeholder="nume@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Parolă</label>
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Se procesează...' : (isLogin ? 'Autentificare' : 'Înregistrare')}
                    </button>
                </form>

                <div className={styles.footer}>
                    {isLogin ? 'Nu ai cont?' : 'Ai deja cont?'}
                    <span
                        className={styles.link}
                        onClick={() => { setIsLogin(!isLogin); setError('') }}
                    >
                        {isLogin ? 'Creează unul acum' : 'Intră în cont'}
                    </span>
                </div>
            </div>
        </div>
    )
}
