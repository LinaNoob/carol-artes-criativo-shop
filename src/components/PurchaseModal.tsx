
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product, ProductPurchase } from '../types/Product';
import { formatCurrency, generateQRCodeUrl, isValidEmail, triggerWebhook, generateToken, getExpiryDate } from '../utils/helpers';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '@/hooks/useStorage';
import { supabase } from '@/lib/supabase';

interface PurchaseModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createSignedUrl } = useStorage();
  
  const handleCopyPix = () => {
    navigator.clipboard.writeText(product.pix_codigo);
    toast({
      title: "Código PIX copiado!",
      description: "Cole no seu aplicativo de banco para realizar o pagamento.",
    });
  };
  
  const handlePaymentSubmit = async () => {
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido para receber o acesso.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Gerar token único
      const token = generateToken();
      const expiryDate = getExpiryDate(30); // Link expira em 30 minutos
      
      // Criar link temporário para o PDF
      let signedUrl = '';
      if (product.link_pdf) {
        // Extrair o caminho do arquivo do URL público
        const pathParts = product.link_pdf.split('/');
        const filePath = pathParts[pathParts.length - 1];
        
        const signedUrlResult = await createSignedUrl(filePath);
        if (signedUrlResult.signedUrl) {
          signedUrl = signedUrlResult.signedUrl;
        }
      }
      
      // Registrar a compra no Supabase
      const purchaseData = {
        produto_id: product.id,
        email: email,
        data_compra: new Date().toISOString(),
        token: token,
        expira_em: expiryDate,
        pdf_link_temp: signedUrl
      };
      
      const { error: dbError } = await supabase
        .from('compras')
        .insert([purchaseData]);
        
      if (dbError) throw dbError;
      
      // Disparar webhook para notificar sobre a compra
      const webhookData = {
        product: product,
        customer: {
          email: email
        },
        purchase: {
          id: token,
          date: new Date().toISOString(),
          expiry: expiryDate,
          downloadUrl: signedUrl,
          accessUrl: `${window.location.origin}/produto/${product.id}?token=${token}`
        }
      };
      
      // Enviar para webhook
      await triggerWebhook(webhookData);
      
      // Fecha o modal após processamento bem-sucedido
      onClose();
      
      // Redireciona para a página do produto com o token
      navigate(`/produto/${product.id}?token=${token}`);
      
    } catch (error: any) {
      console.error('Erro ao processar compra:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-0 border border-pink-100 rounded-lg overflow-hidden">
        <DialogHeader className="p-4 border-b border-pink-100">
          <DialogTitle className="text-xl font-semibold text-center text-carol-pink">
            Finalizar Compra
          </DialogTitle>
          <p className="text-center text-gray-600 font-medium mt-1">
            {product.nome} - {formatCurrency(product.preco)}
          </p>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-48 h-48 relative bg-gray-100">
              <img 
                src={generateQRCodeUrl(product.pix_codigo)} 
                alt="QR Code para pagamento" 
                className="w-full h-full"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded p-2 relative">
            <Input
              value={product.pix_codigo}
              readOnly
              className="pr-10 text-xs text-gray-700 border-0 bg-transparent focus-visible:ring-0"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-xs"
              onClick={handleCopyPix}
            >
              Copiar
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500 italic">
              Após confirmar o pagamento, o acesso será enviado para este email.
            </p>
          </div>
        </div>
        
        <DialogFooter className="p-0">
          <Button 
            onClick={handlePaymentSubmit}
            disabled={isSubmitting || !email}
            className="w-full rounded-none py-4 bg-carol-pink hover:bg-opacity-90 text-white font-medium"
          >
            {isSubmitting ? "Processando..." : "Já realizei o pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
