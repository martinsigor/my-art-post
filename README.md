# My Art Domain (MAD)

My Art Domain é uma plataforma para artistas compartilharem seus trabalhos digitalmente. O projeto utiliza tecnologias modernas como Next.js 14, Supabase e Tailwind CSS.

## Tecnologias Principais

- **Next.js 14**: Framework React com App Router
- **Supabase**: Backend as a Service (BaaS)
- **Tailwind CSS**: Framework CSS utilitário
- **TypeScript**: Superset JavaScript com tipagem estática

## Estrutura do Projeto

### Páginas

#### Página Inicial (/)
- Exibe galeria de artworks
- Logo adaptativa (muda conforme tema claro/escuro)
- Navegação principal com autenticação
- Theme switcher (claro/escuro/sistema)

#### Autenticação (/sign-in e /sign-up)
- Sistema de login e registro
- Inputs estilizados (sempre claros independente do tema)
- Validações de formulário
- Redirecionamento pós-autenticação
- Confirmação de email

#### Perfil (/profile)
- Edição de dados do usuário
- Upload de foto de perfil (circular)
- Campos: nome completo e username
- Botão de logout

#### Página da Artwork (/gallery/[id])
- Visualização detalhada da artwork
- Informações do artista com avatar
- Opções de edição/exclusão (para o proprietário)
- Sistema de comentários (em desenvolvimento)

### Banco de Dados (Supabase)

#### Tabelas
- **profiles**: Dados dos usuários
  - id (uuid, FK auth.users)
  - full_name (text)
  - username (text)
  - avatar_url (text)

- **artworks**: Publicações de arte
  - id (uuid)
  - user_id (uuid, FK profiles)
  - title (text)
  - description (text)
  - image_url (text)
  - created_at (timestamp)
  - updated_at (timestamp)

#### Storage
- Bucket 'avatars': Armazena fotos de perfil
  - Políticas de acesso por usuário
  - Acesso público para visualização
  - Organização por user_id/filename

### Estilização

#### Temas
- Sistema de tema claro/escuro usando next-themes
- Cores adaptativas via Tailwind
- Elementos específicos com estilos fixos (ex: inputs de auth)

#### Abordagens de Estilo
1. **Tailwind CSS**: Estilos utilitários
   ```html
   <div className="flex items-center justify-center">
   ```

2. **CSS Modules**: Estilos específicos por componente
   ```css
   .container {
     /* estilos */
   }
   ```

3. **Inline Styles**: Casos específicos (ex: inputs sempre claros)
   ```jsx
   style={{
     backgroundColor: 'white',
     color: '#505050'
   }}
   ```

## Configuração e Instalação

1. Clone o repositório
```bash
git clone [url-do-repositório]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
```

4. Execute o projeto
```bash
npm run dev
```

## Estrutura de Pastas

```
app/
├── (auth-pages)/
│   ├── sign-in/
│   └── sign-up/
├── (main)/
│   └── layout.tsx
├── gallery/
│   └── [id]/
├── profile/
├── components/
├── utils/
└── layout.tsx
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Autores

- [igor.mso](https://igormso.com.br)
- [julio_fv](https://www.linkedin.com/in/júlio-vinícius-da-fonseca-viscardi-b99859330/)