
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import AboutSection from '@/components/AboutSection';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import { products as initialProducts } from '@/data/products';
import { getStoredProducts } from '@/utils/localStorage';
import { Product } from '@/types/Product';

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const storedProducts = getStoredProducts();
    if (storedProducts && storedProducts.length > 0) {
      // Combine stored products with initial products, preferring stored versions
      const combinedProducts = [...initialProducts];
      
      storedProducts.forEach(storedProduct => {
        const index = combinedProducts.findIndex(p => p.id === storedProduct.id);
        if (index >= 0) {
          combinedProducts[index] = storedProduct;
        } else {
          combinedProducts.push(storedProduct);
        }
      });
      
      setProducts(combinedProducts);
    }
  }, []);

  const handleAdminMode = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogin = () => {
    setIsAdminMode(true);
  };

  const handleExitAdminMode = () => {
    setIsAdminMode(false);
  };

  const handleProductsUpdated = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  if (isAdminMode) {
    return (
      <AdminPanel 
        initialProducts={products}
        onClose={handleExitAdminMode}
        onProductsUpdated={handleProductsUpdated}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAdminMode={handleAdminMode} />
      
      <main className="flex-grow">
        <Hero />
        <ProductGrid 
          products={products}
          subtitle="Moldes em PDF e projetos Canva para papelaria personalizada"
        />
        <AboutSection />
      </main>
      
      <Footer />
      
      <AdminLogin 
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />
    </div>
  );
};

export default Index;
