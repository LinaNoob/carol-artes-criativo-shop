
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SocialLinks } from '../../utils/localStorage';

interface SocialLinksFormProps {
  socialLinks: SocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
  onSaveSocialLinks: () => void;
}

const SocialLinksForm: React.FC<SocialLinksFormProps> = ({ 
  socialLinks, 
  setSocialLinks, 
  onSaveSocialLinks 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Redes Sociais</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram-link">Link do Instagram</Label>
            <Input 
              id="instagram-link"
              placeholder="https://instagram.com/seu_perfil"
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tiktok-link">Link do TikTok</Label>
            <Input 
              id="tiktok-link"
              placeholder="https://tiktok.com/@seu_perfil"
              value={socialLinks.tiktok}
              onChange={(e) => setSocialLinks({...socialLinks, tiktok: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shopee-link">Link da Shopee</Label>
            <Input 
              id="shopee-link"
              placeholder="https://shopee.com.br/seu_perfil"
              value={socialLinks.shopee}
              onChange={(e) => setSocialLinks({...socialLinks, shopee: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp-link">Link do WhatsApp</Label>
            <Input 
              id="whatsapp-link"
              placeholder="https://wa.me/5500000000000"
              value={socialLinks.whatsapp}
              onChange={(e) => setSocialLinks({...socialLinks, whatsapp: e.target.value})}
            />
            <p className="text-xs text-gray-500">
              Formato: https://wa.me/5511999999999 (com código do país e DDD)
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              className="bg-carol-pink hover:bg-opacity-90"
              onClick={onSaveSocialLinks}
            >
              Salvar Redes Sociais
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksForm;
