import PageSection from './PageSection';
import ToolCard from '../ToolCard';
import { FunctionSquare, Lightbulb, History } from 'lucide-react';

const tools = [
  {
    icon: FunctionSquare,
    tagline: 'Evaluator',
    title: 'Unlock Historical Indicator Performance',
    description: "Discover which technical indicators have performed historically for any specific stock or index and timeframe. Get clear, data-backed insights to understand what's truly works for your specific trading scenario.",
    features: [
      'Head-to-head indicator comparison with customizable evaluation parameters.',
      'Performance benchmarking for single indicators.',
      'Analysis of complementary indicator combinations.',
    ],
    ctaLink: '/tools/evaluator',
    ctaText: 'Explore Evaluator',
    isFeatured: false,
  },
  {
    icon: Lightbulb,
    tagline: 'Predictor',
    title: 'Forecast Future Indicator Effectiveness',
    description: 'Move beyond past performance. Our cutting-edge ML engine analyzes vast market data to forecast which technical indicators are most likely to be effective for your upcoming trades. Gain a forward-looking advantage and make decisions with predictive intelligence.',
    features: [
      'ML-driven predictions of relative importance of indicators.',
      'Confidence scores accompanying predictions.',
      'Recommendations for your specific trading parameters.',
    ],
    ctaLink: '/tools/predictor',
    ctaText: 'Explore Predictor',
    isFeatured: true,
  },
  {
    icon: History,
    tagline: 'Backtester',
    title: 'Test Before You Trade',
    description: 'Test any trading strategy—whether based on historical evaluation, complementary pairs, or AI-driven predictions—against comprehensive historical Indian market data. See precisely how your approach would have performed, understand potential risks, and refine your plan before making a commitment.',
    features: [
      'Simulation of strategies on historical Indian market data.',
      'Test single or combined indicator strategies.',
      'Detailed profit/loss, drawdown, and key risk metrics.',
    ],
    ctaLink: '/tools/backtester',
    ctaText: 'Explore Backtester',
    isFeatured: false,
  },
];

const ToolsShowcaseSection = () => {
  return (
    <PageSection>
      <div className="text-center mb-12 md:mb-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Your Toolkit for <span className="text-accent">Smarter Trading</span> Decisions
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          From foundational analysis to predictive foresight, Insightica empowers every Indian retail trader.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 items-center">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            icon={tool.icon}
            title={tool.title} 
            description={tool.description}
            features={tool.features}
            ctaLink={tool.ctaLink}
            ctaText={tool.ctaText}
            isFeatured={tool.isFeatured}
          />
        ))}
      </div>
    </PageSection>
  );
};

export default ToolsShowcaseSection;
