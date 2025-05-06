
export interface Product {
  id: string;
  name: string;
  price: number;
  imagePath: string;
  pixCode: string;
  pdfLink: string;
  canvaLink: string;
  description: string;
  category: string;
  featured?: boolean;
}

export interface ProductPurchase {
  product: Product;
  email: string;
  purchaseDate: string;
  token: string;
  expiresAt: string;
}
