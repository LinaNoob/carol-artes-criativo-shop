
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Tiktok, ShoppingBag, MessageCircle } from 'lucide-react';
import { handleLogoClick } from '../utils/helpers';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  onAdminMode: () => void;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    shopee?: string;
    whatsapp?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ 
  onAdminMode, 
  socialLinks = {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    shopee: "https://shopee.com.br/",
    whatsapp: "https://wa.me/5500000000000"
  } 
}) => {
  const { toast } = useToast();

  const handleClick = () => {
    handleLogoClick(() => {
      toast({
        title: "Modo Admin",
        description: "Digite a senha para acessar o modo administrador",
      });
      onAdminMode();
    });
  };

  return (
    <header className="py-4 px-4 md:px-8 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" onClick={handleClick} className="font-playfair text-2xl text-carol-pink font-bold">
            Carol Artes
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {socialLinks.instagram && (
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-carol-pink transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
          )}
          
          {socialLinks.tiktok && (
            <a 
              href={socialLinks.tiktok} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-carol-pink transition-colors"
              aria-label="TikTok"
            >
              <Tiktok size={22} />
            </a>
          )}
          
          {socialLinks.shopee && (
            <a 
              href={socialLinks.shopee} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-carol-pink transition-colors"
              aria-label="Shopee"
            >
              <ShoppingBag size={22} />
            </a>
          )}
          
          {socialLinks.whatsapp && (
            <a 
              href={socialLinks.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-carol-pink transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
