import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <Card className={cn(
      "flex flex-col transform transition-all duration-300 relative",
      isFeatured 
        ? "bg-primary text-primary-foreground shadow-2xl lg:scale-105 z-10" 
        : "bg-card/80 border-border/50 hover:shadow-xl hover:-translate-y-1"
    )}>
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
          "text-sm min-h-[100px]", 
          isFeatured ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
        <ul className="space-y-1.5 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={cn(
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
          variant={isFeatured ? "default" : "outline"} 
          className={cn(
            "w-full",
            isFeatured 
              ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              : "border-primary text-primary hover:bg-primary/10"
        )}>
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
