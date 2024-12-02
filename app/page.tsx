'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GalleryPage() {
  const router = useRouter()
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

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

  const handlePublishClick = () => {
    if (!user) {
      router.push('/sign-in')
    } else {
      router.push('/publish-art')
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 bg-background">
      <div className="text-center mb-12">
        <div className="flex justify-center">
          <Image
            src="https://unirjaqquspjcsigpmgz.supabase.co/storage/v1/object/public/artworks/page_elements/Logo%20MAD.png"
            alt="MAD Logo"
            width={700}
            height={700}
            className="w-auto h-auto"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">My Art Domain</h1>
        <h2 className="text-xl text-muted-foreground mb-8">
          A nossa gigantesca e ativa comunidade já tem alguns desenhos para você se basear ou dar seu feedback
        </h2>
        <button 
          onClick={handlePublishClick}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition"
        >
          Publicar nova arte
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-foreground">Carregando...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <Link href={`/gallery/${artwork.id}`} key={artwork.id}>
              <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative h-64 w-full">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {artwork.description}
                  </p>
                  <div className="flex items-center">
                    {artwork.profiles?.avatar_url && (
                      <div className="relative w-10 h-10 mr-3">
                        <Image
                          src={artwork.profiles.avatar_url}
                          alt={artwork.profiles.username}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{artwork.profiles?.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(artwork.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {artwork.tags && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {artwork.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && artworks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            Nenhuma arte publicada ainda. Seja o primeiro a compartilhar!
          </p>
        </div>
      )}
    </div>
  )
}