"use client"; 

import PageSection from './PageSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What exactly is Insightica?',
    answer:
      "Insightica is an AI-powered financial analysis platform that transforms complex market data into clear, actionable trading insights. We combine advanced machine learning with 10+ years of historical market data to help traders of all levels make smarter, data-driven decisions. Our platform analyzes 35+ technical indicators across multiple timeframes, providing you with proven recommendations backed by 85%+ mean accuracy rates. Whether you're learning technical analysis or optimizing professional strategies, Insightica gives you institutional-grade tools in an intuitive, accessible platform.",
  },
  {
    question: "How accurate are Insightica's predictions?",
    answer:
      "Our predictions maintain 70-95% accuracy across different market conditions. We value transparency above all and hence, every prediction will include confidence scores and historical validation.",
  },
  {
    question: 'Do I need trading experience to use Insightica?',
    answer:
      'Not at all! Insightica is designed for everyone. Beginners to professionals, everyone can utilize our tools in their own way. Our products are very customizable and intuitive which makes them fit for users across the board.',
  },
  {
    question: 'What makes Insightica different from other trading tools?',
    answer:
      "Unlike generic indicators or black-box systems who want to takeover your decision process, Insightica provides personalized recommendations and insights rather than giving direct advice. We show you not just what works through our predictor, but also why it works through our evaluators, backed by testing on decades of data. Moreover, our tools adapt to changing market conditions in real-time.",
  },
];

const FaqSection = () => {
  return (
    <PageSection id="faq-section" className="bg-background/50">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Frequently Asked <span className="text-accent">Questions</span>
        </h2>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
              <AccordionTrigger className="text-left text-lg hover:no-underline text-foreground/90 hover:text-accent">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageSection>
  );
};

export default FaqSection;
