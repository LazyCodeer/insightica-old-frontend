import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageSection from "./PageSection";
import {
  ArrowRight,
  BarChart2,
  PieChart,
  LineChart,
  TrendingUp,
} from "lucide-react";

const HeroSection = () => {
  return (
    // Set container to relative, and adjust min-height to account for the sticky header (h-20 = 5rem)
    <PageSection className="text-center relative overflow-hidden min-h-screen flex items-center justify-center py-0">
      {/* Background with gradient inspired by Stratos design */}
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e9d5ff, #f3e8ff, #e0f2fe)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 h-full w-full opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "3rem 3rem, 3rem 3rem",
        }}
      />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {/* Top left decorative chart */}
        <div className="absolute left-[5%] top-[15%] opacity-20 rotate-6 transform hover:scale-110 transition-transform duration-700">
          <BarChart2
            className="w-16 h-16 md:w-24 md:h-24 text-primary"
            strokeWidth={1.5}
          />
        </div>

        {/* Bottom right decorative chart */}
        <div className="absolute right-[8%] bottom-[20%] opacity-20 -rotate-12 transform hover:scale-110 transition-transform duration-700">
          <PieChart
            className="w-20 h-20 md:w-28 md:h-28 text-accent"
            strokeWidth={1.5}
          />
        </div>

        {/* Middle right decorative line */}
        <div className="absolute right-[15%] top-[30%] opacity-15 transform hover:translate-x-2 transition-transform duration-700">
          <LineChart
            className="w-16 h-16 md:w-20 md:h-20 text-primary/60"
            strokeWidth={1.5}
          />
        </div>

        {/* Bottom left decorative trend */}
        <div className="absolute left-[12%] bottom-[25%] opacity-20 rotate-12 transform hover:scale-110 transition-transform duration-700">
          <TrendingUp
            className="w-12 h-12 md:w-16 md:h-16 text-accent/70"
            strokeWidth={1.5}
          />
        </div>

        {/* Abstract shapes */}
        <div className="absolute left-[20%] top-[40%] w-32 h-32 rounded-full bg-gradient-to-r from-blue-300/10 to-purple-300/10 blur-2xl"></div>
        <div className="absolute right-[25%] top-[20%] w-40 h-40 rounded-full bg-gradient-to-r from-indigo-300/10 to-pink-300/10 blur-3xl"></div>
      </div>

      {/* Main content with z-10 to be on top of the background */}
      <div className="relative z-10">
        {/* New testing results banner with enhanced glassy effect */}
        <div
          className="inline-flex items-center justify-center mb-8"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <Link
            href="/testing-results"
            className="group relative rounded-full px-5 py-2.5 transition-all hover:shadow-lg 
                      bg-white/20 backdrop-blur-md hover:bg-white/30
                      border border-white/40 hover:border-white/50
                      shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center">
              <span className="mr-2 rounded-full bg-blue-600/90 px-2.5 py-0.5 text-xs font-semibold text-white">
                NEW
              </span>
              <span className="text-sm font-medium text-gray-800">
                Check out our theoretical testing results
              </span>
              <ArrowRight className="ml-1.5 h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1" />
            </div>
            {/* Enhanced glow effects */}
            <div
              className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-blue-400/20 blur-2xl animate-pulse"
              style={{ animationDuration: "4s" }}
            />
            <div
              className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-purple-400/20 blur-2xl animate-pulse"
              style={{ animationDuration: "6s" }}
            />
            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div
                className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ transform: "skewX(-45deg)" }}
              />
            </div>
          </Link>
        </div>

        <h1
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          data-aos="fade-up"
        >
          Clarity Over Chaos, <br />
          <span className="text-accent">Insights</span> Over Noise
        </h1>
        <p
          className="mt-8 max-w-6xl mx-auto text-lg leading-8 text-foreground/80 sm:text-xl"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Insightica provides clear historical indicator analysis, identifies
          optimal complementary pairings, and employs ML to forecast future
          indicator effectiveness—delivering data-driven insights rigorously
          validated against extensive market data for your trades.
        </p>
        <div
          className="mt-10 flex items-center justify-center gap-x-6"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Button
            asChild
            size="lg"
            className="group bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <Link href="/early-access">
              Try Now
              <ArrowRight className="h-5 w-5 ml-0 group-hover:ml-2 w-0 group-hover:w-5 transition-all duration-300" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-md"
          >
            <Link href="/tutorials">Learn More</Link>
          </Button>
        </div>
      </div>
    </PageSection>
  );
};

export default HeroSection;
