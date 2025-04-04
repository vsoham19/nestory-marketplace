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
  const { user, logout } = useAuth();

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
              <>
                <NavLink to="/add-property" className={navLinkClasses}>
                  Add Property
                </NavLink>
                <NavLink to="/payments" className={navLinkClasses}>
                  Payment Records
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
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
              <DropdownMenuItem className="cursor-pointer" onSelect={() => logout()}>
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
      
      {/* Mobile menu */}
      {/* <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader className="pl-6 pb-1 pt-6">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Take control of your finances.
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <nav className="flex flex-col sm:items-center gap-6 p-6">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/properties" className={navLinkClasses}>
                Properties
              </NavLink>
              {user && (
                <>
                  <NavLink to="/add-property" className={navLinkClasses}>
                    Add Property
                  </NavLink>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div> */}
    </header>
  );
};

export default Navbar;
