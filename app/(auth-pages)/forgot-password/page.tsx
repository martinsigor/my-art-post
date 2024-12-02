'use client'
import styles from '../signup.module.css'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ForgotPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email') as string
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        throw resetError
      }

      // Redirecionar para uma página de confirmação ou mostrar mensagem de sucesso
      router.push('/sign-in?message=Verifique+seu+email+para+redefinir+sua+senha')
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <header>Recuperar senha</header>

        <p>Lembrou sua senha? <Link href="/sign-in">Faça login</Link></p>

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
          />

          <div className={styles.grid}>
            <div className={styles.butao}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar email de recuperação'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
