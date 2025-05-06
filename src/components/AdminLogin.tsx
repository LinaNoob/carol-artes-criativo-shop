
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAdminPassword } from '../utils/localStorage';
import { useToast } from '@/components/ui/use-toast';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    const correctPassword = getAdminPassword();
    
    if (password === correctPassword) {
      setIsError(false);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao modo administrador.",
      });
      onLogin();
      onClose();
    } else {
      setIsError(true);
      toast({
        title: "Senha incorreta",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Administrador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
              Senha do Administrador
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Digite a senha de administrador"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsError(false);
              }}
              className={`w-full ${isError ? 'border-red-500' : ''}`}
            />
            {isError && <p className="text-xs text-red-500">Senha incorreta. Tente novamente.</p>}
            <p className="text-xs text-gray-500 italic">
              A senha padrão é "carol1234" (sem as aspas).
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-carol-pink hover:bg-opacity-90" onClick={handleLogin}>
            Entrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
