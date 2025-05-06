
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Heart, Menu, X } from 'lucide-react';

const navLinkClasses =
  "text-sm font-medium text-muted-foreground hover:text-foreground";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-10 border-b border-border/40">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl">
            RealEstate
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/properties" className={navLinkClasses}>
              Properties
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About Us
            </NavLink>
            {user && (
              <>
                <NavLink to="/add-property" className={navLinkClasses}>
                  Add Property
                </NavLink>
                <NavLink to="/favorites" className={navLinkClasses}>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    Favorites
                  </div>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'User'} />
                    <AvatarFallback>{(user.user_metadata?.name || user.email || 'U')?.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full h-full block">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/favorites" className="w-full h-full block">
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut()}>
                  Logout
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/40 py-4 px-6">
          <nav className="flex flex-col gap-4">
            <NavLink to="/" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/properties" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
              Properties
            </NavLink>
            <NavLink to="/about" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
              About Us
            </NavLink>
            {user && (
              <>
                <NavLink to="/add-property" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Add Property
                </NavLink>
                <NavLink to="/favorites" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    Favorites
                  </div>
                </NavLink>
              </>
            )}
            {!user && (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
