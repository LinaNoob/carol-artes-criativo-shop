
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onClose }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-carol-pink text-white py-3 px-4 fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Carol Artes Admin</div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline-block">
              {user?.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="text-white border-white hover:bg-white hover:text-carol-pink"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      <footer className="bg-gray-100 border-t py-4 text-center text-sm text-gray-600">
        Carol Artes - Painel Administrativo &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default AdminLayout;
