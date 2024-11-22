'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ArtworkPage({ params }: { params: { id: string } }) {
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtwork = async () => {
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
        .eq('id', params.id)
        .single()

      if (data) {
        setArtwork(data)
      }
      setLoading(false)
    }

    fetchArtwork()
  }, [params.id])

  return (
    <div>
      {/* Aqui você pode criar seu layout/design para exibir um post específico */}
    </div>
  )
}