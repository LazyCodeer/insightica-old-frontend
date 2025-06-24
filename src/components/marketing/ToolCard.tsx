"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, UserPlus, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  ctaLink: string;
  ctaText?: string;
  isFeatured?: boolean;
}

const ToolCard = ({ icon: Icon, title, description, features, ctaLink, ctaText = "Explore Tool", isFeatured = false }: ToolCardProps) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!currentUser) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const cardClasses = cn(
    "flex flex-col transform transition-all duration-300 relative",
    isFeatured 
      ? "bg-primary text-primary-foreground shadow-2xl lg:scale-105 z-10 glow-animation" 
      : "bg-card/80 border-border/50 hover:shadow-xl hover:-translate-y-1"
  );
  
  const buttonClasses = cn(
    "w-full",
    isFeatured
      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
      : "bg-accent hover:bg-accent/90 text-accent-foreground"
  );

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <Card className={cardClasses}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className={cn(
              "p-2.5 rounded-lg",
              isFeatured ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary"
              )}>
              <Icon className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          </div>
          <CardDescription className={cn(
            "text-sm min-h-[100px] text-justify", 
            isFeatured ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
          <ul className="space-y-1.5 text-sm">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <ChevronRight className={cn(
                  "h-4 w-4 mr-2 mt-0.5 flex-shrink-0", 
                  isFeatured ? "text-primary-foreground" : "text-primary"
                  )} />
                <span className={cn(isFeatured ? "text-primary-foreground/90" : "text-muted-foreground")}>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            asChild 
            className={buttonClasses}
          >
            <Link href={ctaLink} onClick={handleCtaClick}>{ctaText}</Link>
          </Button>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Access Your Tools</DialogTitle>
          <DialogDescription className="text-center">
            Please sign in or create an account to explore our powerful trading tools.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Button size="lg" onClick={() => { setShowAuthModal(false); router.push('/auth/login'); }}>
            <LogIn className="mr-2 h-5 w-5" /> Sign In
          </Button>
          <Button size="lg" variant="secondary" onClick={() => { setShowAuthModal(false); router.push('/auth/signup'); }}>
            <UserPlus className="mr-2 h-5 w-5" /> Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolCard;
