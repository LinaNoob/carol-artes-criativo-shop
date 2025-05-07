
# Carol Artes - Loja Digital de Papelaria Personalizada

Este projeto é um site de e-commerce para a Carol Artes, focado na venda de moldes em PDF e projetos do Canva para papelaria personalizada.

![Carol Artes Logo](/public/lovable-uploads/a8ac69c1-ef1e-45f2-9ac0-7271189195dd.png)

## Configuração do Supabase

Este projeto utiliza o Supabase como backend. Para configurá-lo corretamente, siga estes passos:

### 1. Crie um projeto no Supabase

- Acesse [supabase.com](https://supabase.com) e crie uma conta
- Crie um novo projeto
- Anote sua URL do projeto e a API Key anônima

### 2. Configure as variáveis de ambiente

Adicione as seguintes variáveis de ambiente ao seu projeto Lovable:

```
VITE_SUPABASE_URL=sua-url-do-projeto
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Configure o banco de dados

Execute os seguintes comandos SQL no editor SQL do Supabase para criar as tabelas necessárias:

```sql
-- Tabela de produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  pix_codigo TEXT NOT NULL,
  link_pdf TEXT,
  link_canva TEXT,
  descricao TEXT,
  categoria TEXT,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do site
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_image TEXT,
  banner_title TEXT,
  banner_subtitle TEXT,
  banner_button_text TEXT,
  about_title TEXT,
  about_content TEXT,
  about_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de compras
CREATE TABLE compras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produto_id UUID REFERENCES produtos(id),
  email TEXT NOT NULL,
  data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  token TEXT NOT NULL UNIQUE,
  expira_em TIMESTAMP WITH TIME ZONE NOT NULL,
  pdf_link_temp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de email
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compra_id UUID REFERENCES compras(id),
  email TEXT NOT NULL,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de administradores
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Configure o Storage

No Supabase, crie os seguintes buckets no Storage:
- `produtos` - para imagens dos produtos
- `pdfs` - para arquivos PDF
- `banners` - para imagens do banner

Configure as permissões:
- Para `produtos` e `banners`: permitir leitura pública
- Para `pdfs`: restringir acesso (apenas via URL assinada)

### 5. Configure a autenticação

- Habilite o provedor de Email/Senha no Supabase
- Crie um usuário admin inicial através da interface do Supabase
- Adicione esse usuário à tabela `admins`:

```sql
INSERT INTO admins (user_id)
VALUES ('id-do-seu-usuario-auth');
```

## Funcionalidades Principais

### Área da Loja
- Exibição de produtos em grid na página inicial
- Sistema de compra via PIX com QR Code
- Páginas de produto protegidas por token com expiração de 30 minutos
- Layout responsivo com design em tons de rosa

### Painel Administrativo
- Login seguro com e-mail e senha
- Gerenciamento completo de produtos (adicionar, editar, excluir)
- Upload de imagens diretamente para o Storage do Supabase
- Configuração do banner e da seção sobre
- Gestão de links para redes sociais

### Processo de Compra
1. Cliente seleciona um produto
2. Realiza pagamento via PIX
3. Confirma o pagamento e fornece e-mail
4. Recebe acesso temporário aos arquivos via link protegido
5. Link se expira automaticamente após 30 minutos

## Integração com n8n (opcional)

Para integrar com o n8n para processamento de pagamentos:

1. Configure um webhook no n8n
2. Adicione a URL do webhook à função `triggerWebhook` no arquivo `src/utils/helpers.ts`
3. Configure seu fluxo no n8n para:
   - Verificar pagamento
   - Gerar link temporário para download
   - Enviar e-mail com o link para o cliente

## Tecnologias utilizadas

- React
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes de UI)
- React Router
- Supabase (Backend as a Service)
  - Banco de dados PostgreSQL
  - Autenticação
  - Storage para arquivos

## Personalização adicional

### Cores e estilos

As cores principais podem ser alteradas no arquivo `tailwind.config.ts` na seção `colors.carol`:

```typescript
carol: {
  pink: '#FF719A',
  'light-pink': '#FFDEE2',
  blue: '#BFE0F3',
  gold: '#F6D365',
  peach: '#FFA99F',
}
```

## Como acessar o Painel Admin

Clique no botão "Admin" no rodapé da página e faça login com o e-mail e senha configurados no Supabase Auth.
