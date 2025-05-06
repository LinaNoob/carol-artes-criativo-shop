
import React from 'react';

const Hero: React.FC = () => {
  const logoPath = "/lovable-uploads/a8ac69c1-ef1e-45f2-9ac0-7271189195dd.png";

  return (
    <div className="relative bg-gradient-carol py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Papelaria <span className="text-carol-pink">Personalizada</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Moldes em PDF e projetos do Canva para tornar seu dia mais organizado e bonito
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="#produtos" 
                className="btn-primary text-center"
              >
                Ver Produtos
              </a>
              <a 
                href="#sobre" 
                className="btn-secondary text-center"
              >
                Saiba Mais
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center animate-float">
            <img 
              src={logoPath}
              alt="Carol Artes" 
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-12 md:h-16" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
