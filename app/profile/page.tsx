'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './profile.module.css'
import Image from 'next/image'

interface Profile {
  full_name: string
  username: string
  avatar_url?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile>({ full_name: '', username: '', avatar_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

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
        .select('full_name, username, avatar_url')
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
          username: profile.username,
          avatar_url: profile.avatar_url
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploadingImage(true)
      const supabase = createClient()

      // Upload da imagem para o Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/${fileName}`, file)

      if (uploadError) throw uploadError

      // Pegar a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${user.id}/${fileName}`)

      // Atualizar o perfil com a nova URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
    } catch (err) {
      console.error('Erro ao fazer upload:', err)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
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
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Foto</span>
                </div>
              )}
            </div>
            
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {uploadingImage ? 'Enviando...' : 'Escolher foto'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <label htmlFor="full_name" style={{ color: 'black' }}>Qual seu nome</label>
          <input 
            className={styles.input}
            type="text" 
            name="full_name" 
            id="full_name" 
            value={profile.full_name}
            onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
            required
            disabled={saving}
            style={{
              backgroundColor: 'white',
              color: '#505050',
            }}
          />

          <label htmlFor="username" style={{ color: 'black' }}>Qual o seu nome de usuário</label>
          <input 
            className={styles.input}
            type="text" 
            name="username" 
            id="username" 
            value={profile.username}
            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
            required
            disabled={saving}
            style={{
              backgroundColor: 'white',
              color: '#505050',
            }}
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