'use client'
import { useEffect, useState, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'

export default function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
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
        .eq('id', resolvedParams.id)
        .single()

      if (data) {
        setArtwork(data)
      }
      setLoading(false)
    }

    fetchArtwork()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Arte não encontrada</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Voltar para a galeria
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">
        ← Voltar para a galeria
      </Link>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-[500px] w-full">
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            className="object-contain"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <p className="text-gray-500">
              {new Date(artwork.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center mb-6">
            {artwork.profiles?.avatar_url && (
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={artwork.profiles.avatar_url}
                  alt={artwork.profiles.username}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-lg">{artwork.profiles?.username}</p>
              <p className="text-gray-500">Artista</p>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {artwork.tags && artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}