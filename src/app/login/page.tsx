'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate login/signup logic
        if (formData.email && formData.password) {
            // In a real app, call API here
            localStorage.setItem('user', JSON.stringify({ name: formData.name || 'User', email: formData.email }))
            router.push('/dashboard')
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
                <h1 className={styles.title}>{isLogin ? 'Bine ai venit' : 'Creează Cont'}</h1>
                <p className={styles.subtitle}>
                    {isLogin
                        ? 'Intră în cont pentru a gestiona invitațiile.'
                        : 'Începe să creezi momente memorabile.'}
                </p>

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

                    <button type="submit" className={styles.submitBtn}>
                        {isLogin ? 'Autentificare' : 'Înregistrare'}
                    </button>
                </form>

                <div className={styles.footer}>
                    {isLogin ? 'Nu ai cont?' : 'Ai deja cont?'}
                    <span
                        className={styles.link}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Creează unul acum' : 'Intră în cont'}
                    </span>
                </div>
            </div>
        </div>
    )
}
