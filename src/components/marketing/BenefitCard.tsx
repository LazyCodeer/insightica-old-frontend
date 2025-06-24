import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => {
  return (
    <Card className="bg-card/80 border-border/50 hover:shadow-xl hover:border-accent/50 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="items-center text-center pb-4">
        <div className="p-3 rounded-full bg-accent/20 text-accent mb-4">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl font-semibold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
