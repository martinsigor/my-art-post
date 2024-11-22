'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtworks = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (data) {
        setArtworks(data)
      }
      setLoading(false)
    }

    fetchArtworks()
  }, [])

  return (
    <div>
      <h1>My Art Post</h1>
      <h2>A nossa gigantesca e ativa comunidade já tem alguns desenhos para você se basear ou dar seu feedback</h2>
      <button>Publicar nova arte</button>      
    </div>
  )
}