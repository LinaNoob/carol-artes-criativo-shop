
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    setIsError(false);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setIsError(true);
      toast({
        title: "Falha no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao modo administrador.",
      });
      onLogin();
      onClose();
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Administrador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsError(false);
              }}
              className={`w-full ${isError ? 'border-red-500' : ''}`}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsError(false);
              }}
              className={`w-full ${isError ? 'border-red-500' : ''}`}
            />
            {isError && <p className="text-xs text-red-500">Email ou senha incorretos.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            className="bg-carol-pink hover:bg-opacity-90" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
