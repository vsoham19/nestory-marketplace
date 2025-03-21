
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Search },
    { name: 'Add Property', path: '/add-property', icon: PlusCircle },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6 py-4',
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <span className="text-primary">Estate</span>
          <span>Finder</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                location.pathname === item.path
                  ? 'text-primary bg-primary/5'
                  : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 items-center">
            <User size={16} />
            <span>Sign In</span>
          </Button>
          <Button size="sm" className="hidden md:flex">Get Started</Button>
          
          <div className="md:hidden flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'p-2 rounded-md transition-all',
                  location.pathname === item.path
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                <item.icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
