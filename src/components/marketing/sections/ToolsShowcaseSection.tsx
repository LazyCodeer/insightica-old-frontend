"use client";

import PageSection from './PageSection';
import ToolCard from '../ToolCard';
import { FunctionSquare, Lightbulb, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const tools = [
  {
    icon: FunctionSquare,
    title: 'Historical Performance Analysis',
    description: "Discover which technical indicators have performed historically for any specific stock or index and timeframe. Get clear, data-backed insights to understand what's truly works for your specific trading scenario.",
    features: [
      'Head-to-head indicator comparison with customizable evaluation parameters.',
      'Performance benchmarking for single indicators.',
      'Analysis of complementary indicator combinations.',
    ],
    ctaLink: '/tools', // Updated to point to the main tools page
    ctaText: 'Explore Evaluator',
    isFeatured: false,
  },
  {
    icon: Lightbulb,
    title: 'AI-Powered Indicator Forecasts',
    description: 'Move beyond past performance. Our cutting-edge ML engine analyzes vast market data to forecast which technical indicators are most likely to be effective for your upcoming trades. Gain a forward-looking advantage and make decisions with predictive intelligence.',
    features: [
      'ML-driven predictions of relative importance of indicators.',
      'Confidence scores accompanying predictions.',
      'Recommendations for your specific trading parameters.',
    ],
    ctaLink: '/tools', // Updated to point to the main tools page
    ctaText: 'Explore Predictor',
    isFeatured: true,
  },
  {
    icon: History,
    title: 'Strategy Backtesting Engine',
    description: 'Test any trading strategy against comprehensive historical market data. See precisely how your approach would have performed, understand potential risks, and refine your plan before making a commitment.',
    features: [
      'Simulation of strategies on historical Indian market data.',
      'Test single or combined indicator strategies.',
      'Detailed profit/loss, drawdown, and key risk metrics.',
    ],
    ctaLink: '/tools', // Updated to point to the main tools page
    ctaText: 'Explore Backtester',
    isFeatured: false,
  },
];

const ToolsShowcaseSection = () => {
  return (
    <PageSection>
      <div className="text-center mb-12 md:mb-20" data-aos="fade-up">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Your Toolkit for <span className="text-accent">Smarter Trading</span> Decisions
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          From foundational analysis to predictive foresight, Insightica empowers every retail trader.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 items-center">
        {tools.map((tool, index) => (
          <div key={tool.title} data-aos="fade-up" data-aos-delay={index * 100}>
            <ToolCard
              icon={tool.icon}
              title={tool.title} 
              description={tool.description}
              features={tool.features}
              ctaLink={tool.ctaLink}
              ctaText={tool.ctaText}
              isFeatured={tool.isFeatured}
            />
          </div>
        ))}
      </div>
    </PageSection>
  );
};

export default ToolsShowcaseSection;
