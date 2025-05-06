
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import AboutSection from '@/components/AboutSection';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import { products as initialProducts } from '@/data/products';
import { getStoredProducts, getSocialLinks } from '@/utils/localStorage';
import { Product } from '@/types/Product';

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    shopee: 'https://shopee.com.br/',
    whatsapp: 'https://wa.me/5500000000000'
  });

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
    
    // Load social links from localStorage if available
    const links = getSocialLinks();
    if (links) {
      setSocialLinks({...socialLinks, ...links});
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
      <Header onAdminMode={handleAdminMode} socialLinks={socialLinks} />
      
      <main className="flex-grow pt-16 pb-16">
        <Hero />
        <ProductGrid 
          products={products}
          subtitle="Moldes em PDF e projetos Canva para papelaria personalizada"
        />
        <AboutSection />
      </main>
      
      <BottomNav />
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
