
import PageSection from './PageSection';
import { Layers3, Target, GaugeCircle, ListChecks } from 'lucide-react';

const keyBenefits = [
  {
    icon: Layers3,
    title: 'Wide Indicator Coverage',
    description: 'We use 50+ technical indicators to analyze different stocks and scenarios.',
  },
  {
    icon: Target,
    title: 'High Prediction Accuracy',
    description: 'Our models consistently deliver over 85% accuracy across varied market conditions.',
  },
  {
    icon: GaugeCircle,
    title: 'Fast, Reliable Analysis',
    description: 'What takes hours manually, Insightica does in seconds—backed by real data.',
  },
  {
    icon: ListChecks,
    title: 'Detailed Performance Metrics',
    description: 'We track multiple metrics like returns, drawdowns, and success rates to support your decisions.',
  },
];

const KeyBenefitsSection = () => {
  return (
    <PageSection className="bg-background/50">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Why Traders Choose <span className="text-accent">Insightica</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover the core features that give you a trading edge.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {keyBenefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <div 
              key={index} 
              className="bg-card/70 p-6 rounded-xl border border-border/40 shadow-lg hover:shadow-2xl hover:border-accent/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-accent/20 text-accent mr-4 shrink-0">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">{benefit.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm flex-grow">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
};

export default KeyBenefitsSection;
