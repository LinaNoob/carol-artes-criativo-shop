
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product, ProductPurchase } from '../types/Product';
import { formatCurrency, generateQRCodeUrl, isValidEmail, triggerWebhook, generateToken, getExpiryDate } from '../utils/helpers';
import { savePurchase } from '../utils/localStorage';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

interface PurchaseModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
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
        
        toast({
          title: "Pagamento registrado!",
          description: "Verifique seu email para acessar o produto.",
        });
        
        // Para demonstração, mostramos o link que seria enviado por email
        console.log(`Link de acesso (simulação): ${window.location.origin}/produto/${product.id}?token=${token}`);
        
        // Fecha o modal após processamento bem-sucedido
        onClose();
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comprar {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="font-bold text-xl text-carol-pink mb-2">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">Pagamento via PIX</h4>
            <div className="flex justify-center mb-4">
              <img 
                src={generateQRCodeUrl(product.pixCode)} 
                alt="QR Code para pagamento" 
                className="w-40 h-40"
              />
            </div>
            
            <div className="flex items-center justify-between bg-white border rounded-md p-2">
              <div className="truncate text-sm pr-2">{product.pixCode}</div>
              <Button variant="outline" size="sm" onClick={handleCopyPix}>
                Copiar
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Seu email para receber o acesso:
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500 italic">
              Após confirmar o pagamento, o acesso será enviado para este email.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="sm:flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePaymentSubmit}
              disabled={isSubmitting || !email}
              className="bg-carol-pink hover:bg-opacity-90 sm:flex-1"
            >
              {isSubmitting ? "Processando..." : "Já Paguei"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
