
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { isValidEmail } from '@/utils/helpers';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/Product';

const ProductPage = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [purchase, setPurchase] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingState, setLoadingState] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [countdownInterval, setCountdownInterval] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!productId || !token) {
        setLoadingState('invalid');
        return;
      }
      
      try {
        // Verifica se a compra existe com este token
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('compras')
          .select('*')
          .eq('token', token)
          .single();
        
        if (purchaseError || !purchaseData) {
          setLoadingState('invalid');
          return;
        }
        
        // Verifica se o produto da compra corresponde ao ID na URL
        if (purchaseData.produto_id !== productId) {
          setLoadingState('invalid');
          return;
        }
        
        // Verifica se o token expirou
        const expiryDate = new Date(purchaseData.expira_em);
        if (expiryDate < new Date()) {
          setLoadingState('invalid');
          return;
        }
        
        setPurchase(purchaseData);
        
        // Busca os detalhes do produto
        const { data: productData, error: productError } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (productError || !productData) {
          setLoadingState('invalid');
          return;
        }
        
        setProduct(productData);
        setLoadingState('valid');
        
        // Define o email do comprador
        setEmail(purchaseData.email || '');
        
        // Configura o contador de tempo
        const updateCountdown = () => {
          const expiry = new Date(purchaseData.expira_em);
          const now = new Date();
          const diffMs = expiry.getTime() - now.getTime();
          
          if (diffMs <= 0) {
            clearInterval(countdownInterval);
            setTimeLeft('Expirado');
            setLoadingState('invalid');
            return;
          }
          
          const minutes = Math.floor(diffMs / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutos`);
        };
        
        updateCountdown(); // Run immediately
        const interval = setInterval(updateCountdown, 1000);
        setCountdownInterval(interval);
        
      } catch (error) {
        console.error('Error fetching product data:', error);
        setLoadingState('invalid');
      }
    };
    
    fetchData();
    
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [productId, token]);
  
  const handleDownloadPDF = () => {
    // Usa o link temporário gerado no momento da compra
    if (purchase?.pdf_link_temp) {
      window.open(purchase.pdf_link_temp, '_blank');
      toast({
        title: "Download iniciado",
        description: "Seu PDF está sendo baixado."
      });
    } else if (product?.link_pdf) {
      // Fallback para o link direto
      window.open(product.link_pdf, '_blank');
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
    if (product?.link_canva) {
      window.open(product.link_canva, '_blank');
    } else {
      toast({
        title: "Erro",
        description: "Link do Canva não disponível.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendEmail = async () => {
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, digite um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    // Em um ambiente real, isso enviaria um email com os links
    // Aqui estamos apenas simulando o envio bem-sucedido
    toast({
      title: "Email enviado",
      description: `Os links foram enviados para ${email}.`
    });
    
    // Registra a solicitação de reenvio de email
    try {
      await supabase
        .from('email_logs')
        .insert([{
          compra_id: purchase.id,
          email: email,
          data_envio: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Erro ao registrar envio de email:', error);
    }
  };
  
  const handleAdminMode = () => {
    // Do nothing for product page
  };
  
  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carol-pink"></div>
      </div>
    );
  }
  
  if (loadingState === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onAdminMode={handleAdminMode} />
        
        <main className="flex-grow flex items-center justify-center pt-20 pb-16">
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
              Voltar para a Loja
            </Button>
          </div>
        </main>
        
        <BottomNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <Header onAdminMode={handleAdminMode} />
      
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-pink-100">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center text-carol-pink mb-1">
                {product?.nome}
              </h1>
              <p className="text-center text-gray-600 text-sm mb-6">
                Seu acesso ao produto
              </p>
              
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-100 rounded-md overflow-hidden">
                  {product?.imagem_url ? (
                    <img 
                      src={product.imagem_url} 
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      Sem imagem
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-carol-pink hover:bg-opacity-90 py-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Baixar PDF
                </Button>
                
                <Button
                  onClick={handleOpenCanva}
                  className="bg-carol-pink hover:bg-opacity-90 py-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Abrir no Canva
                </Button>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Enviar para meu email</h3>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-pink-200"
                  />
                  <Button 
                    onClick={handleSendEmail} 
                    className="bg-carol-pink hover:bg-opacity-90"
                  >
                    Enviar
                  </Button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <div className="flex items-center text-yellow-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Atenção</span>
                </div>
                <p className="text-yellow-800 text-sm ml-7">
                  Este link expira em {timeLeft}.
                </p>
              </div>
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-gray-300 text-gray-700"
                >
                  Voltar para a loja
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ProductPage;
