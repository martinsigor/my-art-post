'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './profile.module.css'

interface Profile {
  full_name: string
  username: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile>({ full_name: '', username: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/sign-in')
        return
      }

      setUser(user)
      
      // Buscar perfil existente
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }
      
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          full_name: profile.full_name,
          username: profile.username
        })
        .eq('id', user.id)
        .select()

      if (error) throw error
      
      if (data) {
        console.log('Perfil atualizado:', data)
        setProfile(data[0])
        router.push('/')
      }
      
    } catch (err: any) {
      console.error('Erro ao atualizar:', err)
      setError(err.message || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.header}>Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.header}>Insira seus dados</div>
        
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="full_name">Qual seu nome</label>
          <input 
            className={styles.input}
            type="text" 
            name="full_name" 
            id="full_name" 
            value={profile.full_name}
            onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
            required
            disabled={saving}
          />

          <label htmlFor="username">Qual o seu nome de usuário</label>
          <input 
            className={styles.input}
            type="text" 
            name="username" 
            id="username" 
            value={profile.username}
            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
            required
            disabled={saving}
          />

          <div className={styles.buttonContainer}>
            <button 
              type="submit" 
              className={`${styles.button} ${styles.saveButton}`}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            
            <button
              type="button"
              onClick={handleSignOut}
              className={`${styles.button} ${styles.signOutButton}`}
            >
              Sair da conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}