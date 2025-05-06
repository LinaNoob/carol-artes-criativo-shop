
import { Product, ProductPurchase } from "../types/Product";

// Storage keys
const PRODUCTS_KEY = "carol_artes_products";
const PURCHASES_KEY = "carol_artes_purchases";
const ADMIN_PASSWORD_KEY = "carol_artes_admin_password";
const SOCIAL_LINKS_KEY = "carol_artes_social_links";

// Default admin password
const DEFAULT_ADMIN_PASSWORD = "admin123";

// Products
export const getStoredProducts = (): Product[] => {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error("Error getting stored products:", error);
    return [];
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving products:", error);
  }
};

// Purchases
export const savePurchase = (purchase: ProductPurchase): void => {
  try {
    const purchases = getPurchases();
    purchases.push(purchase);
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  } catch (error) {
    console.error("Error saving purchase:", error);
  }
};

export const getPurchases = (): ProductPurchase[] => {
  try {
    const storedPurchases = localStorage.getItem(PURCHASES_KEY);
    return storedPurchases ? JSON.parse(storedPurchases) : [];
  } catch (error) {
    console.error("Error getting purchases:", error);
    return [];
  }
};

export const getPurchaseByToken = (token: string): ProductPurchase | null => {
  try {
    const purchases = getPurchases();
    return purchases.find(p => p.token === token) || null;
  } catch (error) {
    console.error("Error getting purchase by token:", error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const purchase = getPurchaseByToken(token);
    if (!purchase) return false;
    
    const expiryDate = new Date(purchase.expiresAt);
    return expiryDate > new Date();
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

// Admin Password
export const getAdminPassword = (): string => {
  try {
    const password = localStorage.getItem(ADMIN_PASSWORD_KEY);
    return password || DEFAULT_ADMIN_PASSWORD;
  } catch (error) {
    console.error("Error getting admin password:", error);
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const setAdminPassword = (password: string): void => {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  } catch (error) {
    console.error("Error setting admin password:", error);
  }
};

export const checkAdminPassword = (password: string): boolean => {
  return password === getAdminPassword();
};

// Social Links
export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  shopee?: string;
  whatsapp?: string;
}

export const getSocialLinks = (): SocialLinks | null => {
  try {
    const links = localStorage.getItem(SOCIAL_LINKS_KEY);
    return links ? JSON.parse(links) : null;
  } catch (error) {
    console.error("Error getting social links:", error);
    return null;
  }
};

export const setSocialLinks = (links: SocialLinks): void => {
  try {
    localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(links));
  } catch (error) {
    console.error("Error setting social links:", error);
  }
};
