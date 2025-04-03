
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Building2, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out.",
        duration: 3000
      });
      
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          RealEstate
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
          >
            <Menu />
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="nav-link flex items-center gap-2">
            <Home size={18} /> Home
          </Link>
          <Link to="/properties" className="nav-link flex items-center gap-2">
            <Building2 size={18} /> Properties
          </Link>
          <Link to="/new-property" className="nav-link flex items-center gap-2">
            <PlusCircle size={18} /> Add Property
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMobileMenu}>
            <div 
              className="absolute top-0 right-0 w-64 h-full bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="nav-link flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <Home size={18} /> Home
                </Link>
                <Link 
                  to="/properties" 
                  className="nav-link flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <Building2 size={18} /> Properties
                </Link>
                <Link 
                  to="/new-property" 
                  className="nav-link flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <PlusCircle size={18} /> Add Property
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate('/profile');
                    toggleMobileMenu();
                  }}
                  className="justify-start"
                >
                  <User className="mr-2" size={18} /> Profile
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu();
                  }}
                  className="justify-start"
                >
                  <LogOut className="mr-2" size={18} /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
