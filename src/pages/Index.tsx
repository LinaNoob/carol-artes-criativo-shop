
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import AboutSection from '@/components/AboutSection';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import { useProducts } from '@/hooks/useProducts';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { getSocialLinks } from '@/utils/localStorage';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { products, loading } = useProducts();
  const { config } = useSiteConfig();
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    shopee: 'https://shopee.com.br/',
    whatsapp: 'https://wa.me/5500000000000'
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Carrega links sociais do localStorage se disponíveis
    const links = getSocialLinks();
    if (links) {
      setSocialLinks({...socialLinks, ...links});
    }
    
    // Se o usuário já está logado como admin, habilita o modo admin
    if (isAdmin) {
      setIsAdminMode(true);
    }
  }, [isAdmin]);

  const handleAdminMode = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogin = () => {
    setIsAdminMode(true);
  };

  const handleExitAdminMode = () => {
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    return (
      <AdminPanel onClose={handleExitAdminMode} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onAdminMode={handleAdminMode} 
        socialLinks={socialLinks} 
      />
      
      <main className="flex-grow pt-16 pb-16">
        <Hero 
          backgroundImage={config?.banner_image || "/public/placeholder.svg"}
          title={config?.banner_title || "Carol Artes"}
          subtitle={config?.banner_subtitle || "Moldes em PDF e projetos Canva para papelaria personalizada"}
          buttonText={config?.banner_button_text || "Ver Produtos"}
        />
        <ProductGrid 
          products={products}
          subtitle="Moldes em PDF e projetos Canva para papelaria personalizada"
          loading={loading}
        />
        <AboutSection 
          title={config?.about_title}
          content={config?.about_content}
          imageSrc={config?.about_image}
        />
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
