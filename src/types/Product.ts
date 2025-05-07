export interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem_url: string;
  pix_codigo: string;
  link_pdf: string;
  link_canva: string;
  descricao: string;
  categoria: string;
  destaque?: boolean;
  created_at?: string;
}

export interface ProductPurchase {
  product: Product;
  email: string;
  purchaseDate: string;
  token: string;
  expiresAt: string;
}

export interface SiteConfig {
  id: string;
  banner_image: string;
  banner_title: string;
  banner_subtitle: string;
  banner_button_text: string;
  about_title: string;
  about_content: string;
  about_image: string;
}
