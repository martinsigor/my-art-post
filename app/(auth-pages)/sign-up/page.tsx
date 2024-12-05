'use client'
import styles from '../signup.module.css'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        throw signUpError
      }

      window.location.href = '/profile'
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <header>Criar conta</header>

        <p>Já tem uma conta? <Link href="/sign-in">Faça login</Link></p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Endereço de e-mail</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            required 
            placeholder="exemplo@dominio.com"
            disabled={isLoading}
            className={styles['auth-input']}
            style={{
              backgroundColor: 'white',
              color: '#505050',
              borderColor: '#9c9c9c',
            }}
          />

          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            required 
            placeholder="Digite sua senha"
            disabled={isLoading}
            className={styles['auth-input']}
            style={{
              backgroundColor: 'white',
              color: '#505050',
              borderColor: '#9c9c9c',
            }}
          />

          <div className={styles.grid}>
            <div className={styles.butao}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Continuar'}
              </button>
            </div>
          </div>
        </form>

        {/* <p style={{fontSize: '12px'}}>
          <Link href="/forgot-password">Esqueceu sua senha?</Link>
        </p> */}
      </div>
    </div>
  )
}