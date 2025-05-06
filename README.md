
# Carol Artes - E-commerce de Papelaria Personalizada

Este projeto é um site de e-commerce para a Carol Artes, focado na venda de moldes em PDF e projetos do Canva para papelaria personalizada.

![Carol Artes Logo](/public/lovable-uploads/a8ac69c1-ef1e-45f2-9ac0-7271189195dd.png)

## Funcionalidades

- Exibição de produtos em grid na página inicial
- Sistema de compra via PIX com QR Code
- Páginas de produto protegidas por token
- Painel administrativo para gerenciamento de produtos
- Simulação de expiração de links (30 minutos)
- Layout responsivo com design em tons de rosa

## Como acessar o modo administrador

Para acessar o painel administrativo:

1. Clique 5 vezes no logo da Carol Artes no cabeçalho do site
2. Digite a senha padrão: `carol1234`
3. Agora você terá acesso ao painel administrativo completo

## Como editar produtos

### Usando o painel administrativo (recomendado)

1. Acesse o modo administrador conforme descrito acima
2. Navegue até a aba "Produtos"
3. Selecione um produto existente para editar ou clique na aba "Adicionar Produto" para criar um novo
4. As alterações são salvas automaticamente

### Editando diretamente o código

Para adicionar ou modificar produtos manualmente, edite o arquivo `src/data/products.ts`. Cada produto deve seguir a estrutura:

```typescript
{
  id: "produto1",
  name: "Nome do Produto",
  price: 29.90,
  imagePath: "/caminho/para/imagem.png",
  pixCode: "00020126580014BR.GOV.BCB.PIX0136example@domain.com...",
  pdfLink: "/produtos/produto1/arquivo.pdf",
  canvaLink: "https://www.canva.com/design/exemplo/compartilhar",
  description: "Descrição do produto...",
  category: "categoria",
  featured: true // opcional, para destacar o produto
}
```

## Configuração de pagamento PIX

Para configurar o pagamento PIX:

1. Acesse o painel administrativo
2. Edite cada produto individualmente 
3. No campo "Código PIX Copia e Cola", insira o código PIX completo gerado pelo seu banco

Alternativamente, edite o código PIX diretamente no arquivo `src/data/products.ts`.

## Integrações com sistemas externos

### Webhooks (n8n ou similar)

Atualmente o sistema está configurado para simular chamadas de webhook. Para integrá-lo realmente:

1. Edite o arquivo `src/utils/helpers.ts`
2. Procure a função `triggerWebhook`
3. Descomente e configure a chamada fetch com a URL do seu webhook

```typescript
export const triggerWebhook = async (data: any): Promise<boolean> => {
  // Substitua pela URL real do seu webhook n8n
  return await fetch('https://n8n.seudominio.com/webhook/123', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.ok);
};
```

### QR Code PIX

O sistema usa a API do Google Charts para gerar QR Codes. Para uma implementação em produção, considere:

1. Edite a função `generateQRCodeUrl` em `src/utils/helpers.ts`
2. Substitua pela sua própria implementação ou serviço de geração de QR Code PIX

## Estrutura de arquivos

- `/src/components` - Componentes reutilizáveis (Header, Footer, ProductCard, etc.)
- `/src/pages` - Páginas principais
- `/src/data` - Dados dos produtos
- `/src/utils` - Funções utilitárias
- `/src/types` - Tipos TypeScript

## Tecnologias utilizadas

- React
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes de UI)
- React Router
- LocalStorage para persistência de dados

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

### Fontes

O projeto usa as fontes Quicksand e Playfair Display do Google Fonts, configuradas no arquivo `src/index.css`.
