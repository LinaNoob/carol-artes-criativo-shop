
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getPurchaseByToken, isTokenValid } from '@/utils/localStorage';
import { isValidEmail } from '@/utils/helpers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/data/products';

const ProductPage = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [purchase, setPurchase] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loadingState, setLoadingState] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  useEffect(() => {
    if (!productId || !token) {
      setLoadingState('invalid');
      return;
    }
    
    // Check if token is valid
    if (!isTokenValid(token)) {
      setLoadingState('invalid');
      return;
    }
    
    // Find purchase by token
    const foundPurchase = getPurchaseByToken(token);
    if (!foundPurchase || foundPurchase.product.id !== productId) {
      setLoadingState('invalid');
      return;
    }
    
    setPurchase(foundPurchase);
    setProduct(foundPurchase.product);
    setLoadingState('valid');
    
    // Calculate time left for link expiration (purely cosmetic in this demo)
    const expiry = new Date(foundPurchase.expiresAt);
    const now = new Date();
    const minutesLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));
    setTimeLeft(`${minutesLeft} minutos`);
    
    // Find product in catalog
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [productId, token]);
  
  const handleDownloadPDF = () => {
    if (product?.pdfLink) {
      // In a real implementation, this would verify the token again and then redirect
      window.open(product.pdfLink, '_blank');
      toast({
        title: "Download iniciado",
        description: "Seu PDF está sendo baixado."
      });
    } else {
      toast({
        title: "Erro",
        description: "Link do PDF não disponível.",
        variant: "destructive"
      });
    }
  };
  
  const handleOpenCanva = () => {
    if (product?.canvaLink) {
      window.open(product.canvaLink, '_blank');
    } else {
      toast({
        title: "Erro",
        description: "Link do Canva não disponível.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendEmail = () => {
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, digite um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would send an email with the links
    toast({
      title: "Email enviado",
      description: `Os links foram enviados para ${email}.`
    });
  };
  
  const handleAdminMode = () => {
    // Do nothing for product page
  };
  
  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }
  
  if (loadingState === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onAdminMode={handleAdminMode} />
        
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso Inválido</h1>
            <p className="text-gray-700 mb-6">
              Este link de acesso ao produto é inválido ou expirou.
              Por favor, verifique se você copiou o link corretamente ou entre em contato conosco.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-carol-pink hover:bg-opacity-90"
            >
              Voltar para a Página Inicial
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAdminMode={handleAdminMode} />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{product?.name}</h1>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm">
                  Link expira em {timeLeft}
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-gray-700">{product?.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <img 
                    src={product?.imagePath} 
                    alt={product?.name}
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Seus Links de Acesso</h2>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={handleDownloadPDF}
                      className="w-full bg-carol-pink hover:bg-opacity-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Baixar PDF
                    </Button>
                    
                    <Button
                      onClick={handleOpenCanva}
                      variant="outline"
                      className="w-full border-carol-pink text-carol-pink hover:bg-carol-pink hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      Abrir no Canva
                    </Button>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-2">Enviar links para seu email</h3>
                    <div className="flex space-x-2">
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button onClick={handleSendEmail}>Enviar</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Dica:</span> Salve este link para acessar seu produto novamente dentro do prazo de validade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
