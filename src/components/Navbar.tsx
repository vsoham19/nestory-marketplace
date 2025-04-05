
import React from 'react';
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
import { LogOut } from 'lucide-react';

const navLinkClasses =
  "text-sm font-medium text-muted-foreground hover:text-foreground";

const Navbar = () => {
  const { user, signOut } = useAuth();

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
            {user && (
              <NavLink to="/add-property" className={navLinkClasses}>
                Add Property
              </NavLink>
            )}
          </nav>
        </div>

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
      </div>
    </header>
  );
};

export default Navbar;
