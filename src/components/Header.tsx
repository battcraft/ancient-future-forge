import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShop } from '@/contexts/ShopContext';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { cartCount, setIsCartOpen } = useShop();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/academy', label: 'Academy' },
    { path: '/journal', label: 'Journal' },
    { path: '/bazaar', label: 'Bazaar' },
    { path: '/oracle', label: 'Oracle' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-parchment/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-cosmic flex items-center justify-center shadow-cosmic group-hover:scale-105 transition-transform">
              <span className="text-saffron font-display text-lg">॰</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg md:text-xl text-foreground tracking-wider">
                LifeisKraft
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase -mt-1">
                Digital Ashram
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  className={`font-display tracking-wide transition-all ${
                    isActive(link.path) 
                      ? 'text-saffron bg-saffron/10' 
                      : 'text-foreground hover:text-saffron'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-saffron">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground hover:text-saffron"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-saffron font-display">
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-foreground hover:text-saffron"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-parchment border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-display tracking-wide ${
                    isActive(link.path) 
                      ? 'text-saffron bg-saffron/10' 
                      : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
