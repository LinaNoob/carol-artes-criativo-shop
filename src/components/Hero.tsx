
import React from 'react';

interface HeroProps {
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  backgroundImage = "/public/placeholder.svg",
  title = "Carol Artes",
  subtitle = "Papelaria personalizada para todas as ocasiões",
  buttonText = "Ver Produtos"
}) => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('produtos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            {subtitle}
          </p>
          
          <button 
            onClick={scrollToProducts}
            className="bg-carol-pink hover:bg-opacity-90 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors transform hover:scale-105 shadow-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
