'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { uploadImage } from '@/utils/supabase/storage'
import { useRouter } from 'next/navigation'

export default function UploadArtwork() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) return

    setLoading(true)
    try {
      const supabase = createClient()

      // Pegar o usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Upload da imagem usando o helper
      const imageUrl = await uploadImage(file)

      // Processa as tags
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)

      // Salva o artwork no banco
      const { error: dbError } = await supabase
        .from('artworks')
        .insert({
          title,
          description,
          image_url: imageUrl,
          user_id: user.id,
          tags: tagArray
        })

      if (dbError) throw dbError

      // Redireciona para a galeria após sucesso
      router.push('/gallery')

    } catch (error) {
      console.error('Erro:', error)
      // Aqui você pode adicionar um toast ou mensagem de erro
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Publicar Nova Arte</h1>
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {preview && (
            <div className="mt-4 relative h-64 w-full">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="arte, digital, sketch"
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          type="submit"
          disabled={!file || !title || loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Publicando...' : 'Publicar Arte'}
        </button>
      </form>
    </div>
  )
}