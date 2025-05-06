
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SettingsFormProps {
  productsCount: number;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ productsCount }) => {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (!user) return;
    
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso."
      });
      
      setNewPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Configurações</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold">Alterar Senha de Administrador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-admin-password">Senha Atual</Label>
                <Input 
                  id="current-admin-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-admin-password">Nova Senha</Label>
                <Input 
                  id="new-admin-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={handleChangePassword}
                  className="bg-carol-pink hover:bg-opacity-90"
                  disabled={isLoading || !newPassword || !currentPassword}
                >
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-bold">Informações do Sistema</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm mb-2">
                <span className="font-semibold">Total de Produtos:</span> {productsCount}
              </p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Email Administrador:</span> {user?.email}
              </p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Versão do Sistema:</span> 2.0.0
              </p>
              <p className="text-sm">
                <span className="font-semibold">Data de Atualização:</span> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
