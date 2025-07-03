
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '@/components/marketing/Logo';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const baseNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/tools', label: 'Tools' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/testing-results', label: 'Testing Results' },
];

const NavLinkItem = ({ href, label, isActive, onClick, className, ...props }: { href: string, label: string, isActive: boolean, onClick?: () => void, className?: string, [key: string]: any }) => (
  <Button variant="link" asChild 
    className={cn(
      "text-base px-3 py-2 hover:text-accent transition-colors", 
      isActive ? "text-accent font-semibold" : "text-foreground/80", 
      className
    )}
    {...props}
  >
    <Link href={href} onClick={onClick}>{label}</Link>
  </Button>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { currentUser, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Set initial state
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  const getNavLinks = () => {
    if (loading) return []; 
    if (currentUser) {
      return [
        ...baseNavLinks,
        { href: '/forms/invest', label: 'Invest' },
      ];
    }
    return [
      ...baseNavLinks,
      { href: '/forms/invest', label: 'Invest' },
      { href: '/auth/login', label: 'Login' },
    ];
  };

  const navLinksToDisplay = getNavLinks();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
      (isScrolled || isMobileMenuOpen)
        ? "bg-background/80 backdrop-blur-md shadow-lg border-b border-border/50"
        : "bg-transparent"
    )}>
      <div className="flex h-20 items-center justify-between px-5 md:px-10 mx-auto">
        <div data-aos="fade-down" data-aos-delay="100">
          <Logo />
        </div>
        <nav className="hidden md:flex items-center space-x-1" data-aos="fade-down" data-aos-delay="200">
          {navLinksToDisplay.map((link, index) => (
             <NavLinkItem key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} data-aos="fade-down" data-aos-delay={300 + index * 50} />
          ))}
          {currentUser && !loading && (
            <Button variant="ghost" onClick={handleLogout} className="text-base text-foreground/80 hover:text-accent" data-aos="fade-down" data-aos-delay="600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          )}
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden w-full bg-background/90 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-screen opacity-100 border-t border-border/50" : "max-h-0 opacity-0" 
        )}
      >
        <nav className="flex flex-col items-center space-y-1 px-4 py-6">
          {navLinksToDisplay.map((link) => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
              onClick={closeMobileMenu}
              className="w-full text-center text-lg py-3"
            />
          ))}
          {currentUser && !loading && (
            <Button variant="ghost" onClick={handleLogout} className="w-full text-lg py-3 text-foreground/80 hover:text-accent">
               <LogOut className="mr-2 h-5 w-5" /> Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
