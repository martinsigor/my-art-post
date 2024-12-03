'use client'
import { useEffect, useState, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('artwork_id', resolvedParams.id)
        .order('created_at', { ascending: false })

      if (data) {
        setComments(data)
      }
    }

    fetchComments()
  }, [resolvedParams.id])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('comments')
      .insert({
        artwork_id: resolvedParams.id,
        user_id: user.id,
        content: newComment.trim()
      })

    if (!error) {
      // Recarregar comentários
      const { data } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('artwork_id', resolvedParams.id)
        .order('created_at', { ascending: false })

      if (data) {
        setComments(data)
      }
      setNewComment('')
    }

    setIsSubmitting(false)
  }

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
    <div className="container mx-auto px-4 pt-0 pb-8">
      <Link href="/" className="text-primary hover:underline mb-8 inline-block">
        ← Voltar para a galeria
      </Link>
      
      <div className="max-w-4xl mx-auto bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden min-w-[700px]">
        <div 
          className="relative h-[500px] w-full cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
          style={{ marginTop: '-1px' }}
        >
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            className="object-contain"
          />
        </div>
        
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-colors z-[60]"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{artwork.title}</h1>
            <p className="text-muted-foreground">
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
              <p className="font-medium text-lg text-foreground">{artwork.profiles?.username}</p>
              <p className="text-muted-foreground">Artista</p>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-foreground text-lg leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {artwork.tags && artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Seção de Comentários */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Comentários</h2>
        
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="w-full p-3 border rounded-lg mb-2 min-h-[100px] bg-background text-foreground"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition disabled:bg-muted"
            >
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        ) : (
          <div className="bg-secondary p-4 rounded-lg mb-8">
            <Link href="/sign-in" className="text-primary hover:underline">
              Faça login para comentar
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card text-card-foreground p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                {comment.profiles?.avatar_url && (
                  <div className="relative w-8 h-8 mr-3">
                    <Image
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{comment.profiles?.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-foreground">{comment.content}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  )
}