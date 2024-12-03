import { createClient } from './client'

export const uploadImage = async (file: File) => {
  try {
    const supabase = createClient()
    
    // Cria um nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `artworks/${fileName}`

    // Faz o upload para o bucket 'artworks'
    const { data, error } = await supabase.storage
      .from('artworks')
      .upload(filePath, file)

    if (error) throw error

    // Retorna a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Erro no upload:', error)
    throw error
  }
}