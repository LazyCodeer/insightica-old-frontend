"use client";

import PageSection from './PageSection';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import * as React from "react";

const testimonials = [
  {
    quote: "Insightica has revolutionized my trading. The AI predictions are spot on and the historical data analysis is incredibly detailed!",
    name: "Priya Sharma",
    title: "Retail Trader",
    avatarUrl: "https://placehold.co/64x64.png",
    avatarHint: "person woman"
  },
  {
    quote: "The evaluator tool helped me understand which indicators actually work for my strategy. My confidence in trades has shot up.",
    name: "Rohan Mehra",
    title: "Day Trader",
    avatarUrl: "https://placehold.co/64x64.png",
    avatarHint: "person man"
  },
  {
    quote: "Finally, a platform that makes complex data easy to understand. The UI is clean and the insights are actionable. Highly recommend!",
    name: "Aisha Khan",
    title: "Investor",
    avatarUrl: "https://placehold.co/64x64.png",
    avatarHint: "person woman"
  },
  {
    quote: "As someone new to technical analysis, Insightica has been a game-changer. The predictor tool gives me a great starting point.",
    name: "Vikram Singh",
    title: "New Trader",
    avatarUrl: "https://placehold.co/64x64.png",
    avatarHint: "person man"
  },
  {
    quote: "The backtester is fantastic for trying out different strategies without risking capital. Essential for any serious trader.",
    name: "Sunita Patil",
    title: "Systematic Trader",
    avatarUrl: "https://placehold.co/64x64.png",
    avatarHint: "person woman"
  }
];

const TestimonialSection = () => {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <PageSection id="testimonials" className="bg-background/70">
      <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          What <span className="text-accent">Our</span> Users Say
        </h2>
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col bg-card/80 border-border/50 hover:shadow-2xl hover:border-accent/70 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    <CardContent className="pt-6 flex-grow flex flex-col items-center text-center">
                      <Quote className="h-10 w-10 text-accent/50 mb-4 transform rotate-180" />
                      <p className="text-muted-foreground italic mb-4 flex-grow text-sm md:text-base">"{testimonial.quote}"</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center text-center pt-4 pb-6 border-t border-border/30">
                      <div className="relative h-16 w-16 mb-2">
                        <Image
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-accent/30"
                          data-ai-hint={testimonial.avatarHint}
                        />
                      </div>
                      <div className="space-y-0">
                        <p className="font-semibold text-lg text-card-foreground">{testimonial.name}</p>
                        <p className="text-sm text-accent">{testimonial.title}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </PageSection>
  );
};

export default TestimonialSection;
