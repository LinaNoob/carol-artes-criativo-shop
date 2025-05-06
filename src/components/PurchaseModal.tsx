
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
import { savePurchase } from '../utils/localStorage';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

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
  
  const handleCopyPix = () => {
    navigator.clipboard.writeText(product.pixCode);
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
    
    // Simula o envio para um webhook
    const token = generateToken();
    const expiryDate = getExpiryDate();
    
    const purchaseData: ProductPurchase = {
      product,
      email,
      purchaseDate: new Date().toISOString(),
      token,
      expiresAt: expiryDate
    };
    
    try {
      // Em uma implementação real, isso chamaria um webhook/backend
      const webhookSuccess = await triggerWebhook(purchaseData);
      
      if (webhookSuccess) {
        // Salvar na simulação local
        savePurchase(purchaseData);
        
        // Fecha o modal após processamento bem-sucedido
        onClose();
        
        // Redireciona para a página do produto com o token
        navigate(`/produto/${product.id}?token=${token}`);
      } else {
        throw new Error("Falha no processamento do webhook");
      }
    } catch (error) {
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
            {product.name} - {formatCurrency(product.price)}
          </p>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-48 h-48 relative bg-gray-100">
              <img 
                src={generateQRCodeUrl(product.pixCode)} 
                alt="QR Code para pagamento" 
                className="w-full h-full"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded p-2 relative">
            <Input
              value={product.pixCode}
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
