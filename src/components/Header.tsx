
import React from 'react';
import { Link } from 'react-router-dom';
import { handleLogoClick } from '../utils/helpers';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  onAdminMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminMode }) => {
  const { toast } = useToast();
  const logoPath = "/lovable-uploads/a8ac69c1-ef1e-45f2-9ac0-7271189195dd.png";

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
    <header className="py-4 px-4 md:px-8 bg-white shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center" onClick={handleClick}>
            <img
              src={logoPath}
              alt="Carol Artes Logo"
              className="h-20 w-auto"
            />
          </Link>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-800 hover:text-carol-pink font-medium transition-colors">
            Início
          </Link>
          <a href="#produtos" className="text-gray-800 hover:text-carol-pink font-medium transition-colors">
            Produtos
          </a>
          <a href="#sobre" className="text-gray-800 hover:text-carol-pink font-medium transition-colors">
            Sobre
          </a>
          <a href="#contato" className="text-gray-800 hover:text-carol-pink font-medium transition-colors">
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
