
import { Product, ProductPurchase } from "../types/Product";

const ADMIN_PASSWORD_KEY = "carol-artes-admin-password";
const PRODUCTS_KEY = "carol-artes-products";
const PURCHASES_KEY = "carol-artes-purchases";
const ADMIN_PASSWORD_DEFAULT = "carol1234";

// Funções para gerenciar a senha de administrador
export const getAdminPassword = (): string => {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || ADMIN_PASSWORD_DEFAULT;
};

export const setAdminPassword = (password: string): void => {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
};

// Funções para gerenciar produtos
export const getStoredProducts = (): Product[] => {
  const storedProducts = localStorage.getItem(PRODUCTS_KEY);
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  return [];
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Funções para gerenciar compras
export const getStoredPurchases = (): ProductPurchase[] => {
  const storedPurchases = localStorage.getItem(PURCHASES_KEY);
  if (storedPurchases) {
    return JSON.parse(storedPurchases);
  }
  return [];
};

export const savePurchase = (purchase: ProductPurchase): void => {
  const purchases = getStoredPurchases();
  purchases.push(purchase);
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
};

export const getPurchaseByToken = (token: string): ProductPurchase | undefined => {
  const purchases = getStoredPurchases();
  return purchases.find(purchase => purchase.token === token);
};

export const isTokenValid = (token: string): boolean => {
  const purchase = getPurchaseByToken(token);
  if (!purchase) return false;
  
  const expiryDate = new Date(purchase.expiresAt);
  return expiryDate > new Date();
};
