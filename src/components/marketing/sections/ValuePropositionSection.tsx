import PageSection from './PageSection';
import BenefitCard from '../BenefitCard';
import { Presentation, BrainCircuit, UserCheck } from 'lucide-react';

const coreBenefits = [
  {
    icon: Presentation,
    title: 'Intuitive Graphical Views',
    description: 'Our visuals are designed to give you an intuitive understanding of complicated data.',
  },
  {
    icon: BrainCircuit,
    title: 'Machine-Learning Powered',
    description: 'We use algorithms and machine learning to find what works in different market conditions.',
  },
  {
    icon: UserCheck,
    title: 'You Make the Call',
    description: 'We don’t give advice—we just show the data. The decision is always yours.',
  },
];

const ValuePropositionSection = () => {
  return (
    <PageSection>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Gain Your <span className="text-accent">Edge</span> with Insightica
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Unlock powerful insights and navigate the markets with confidence.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {coreBenefits.map((benefit) => (
          <BenefitCard key={benefit.title} {...benefit} />
        ))}
      </div>
    </PageSection>
  );
};

export default ValuePropositionSection;
