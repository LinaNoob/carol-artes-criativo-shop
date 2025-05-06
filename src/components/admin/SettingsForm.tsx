
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface SettingsFormProps {
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  onChangePassword: () => void;
  productsCount: number;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ 
  newPassword, 
  setNewPassword, 
  onChangePassword,
  productsCount 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Configurações</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold">Alterar Senha de Administrador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-admin-password">Nova Senha</Label>
                <Input 
                  id="new-admin-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={onChangePassword}
                  className="bg-carol-pink hover:bg-opacity-90"
                >
                  Alterar Senha
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
                <span className="font-semibold">Versão do Sistema:</span> 1.0.0
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
