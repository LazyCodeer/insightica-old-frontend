import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSection from "@/components/marketing/sections/PageSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Users, Target, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import anuj from "../../../public/assets/anuj.jpg";
import saatvik from "../../../public/assets/saatvik.jpg";
import saisab from "../../../public/assets/saisab.png";
import manas from "../../../public/assets/manas.jpg";
import { FaLinkedin } from "react-icons/fa";

const teamMembers = [
  {
    name: "Manas Nandan",
    role: "Founder – Product, Algorithms & Vision",
    description:
      "Manas started Insightica from scratch, designing and developing the platform as a personal project to simplify decisions in retail trading. It's since grown into a more complete product under his lead. He guides the technical foundation and overall direction, working across design, logic, and long-term planning while relying deeply on the team to bring structure and momentum.",
    imageUrl: manas,
    imageHint: "person man",
    linkedin: "https://www.linkedin.com/in/manas-nandan/",
  },
  {
    name: "Saatvik Pandey",
    role: "Co-founder – Technology & Product Design",
    description:
      "Saatvik has been instrumental in taking Insightica from an early build to a reliable product. He's behind key performance optimizations and ensures everything runs smoothly under the hood. His approach is precise and thoughtful, and he also shapes the product's design, making it intuitive and well-structured.",
    imageUrl: saatvik,
    imageHint: "person man",
    linkedin: "https://www.linkedin.com/in/saatvik-pandey-8250642a7/",
  },
  {
    name: "Saisab Sadhu",
    role: "Co-founder – Operations, Finance & Coordination",
    description:
      "Saisab leads Insightica's operations, overseeing execution, managing finances, and supporting long-term planning. His role spans beyond logistics; he contributes to strategy, testing, and roadmap discussions. His systems-focused thinking helps keep the team grounded and moving forward.",
    imageUrl: saisab,
    imageHint: "person man",
    linkedin: "https://www.linkedin.com/in/saisab-sadhu/",
  },
  {
    name: "Anuj Wani",
    role: "Co-founder – Strategy, Product & Market Understanding",
    description:
      "Anuj connects the product to its users. He refines the frontend, ensuring it's clear, usable, and relevant. On the strategy side, he helps define product direction. He leads marketing, ensuring Insightica speaks to the right people in the right way. His work ties together user needs and market fit.",
    imageUrl: anuj,
    imageHint: "person man",
    linkedin: "https://www.linkedin.com/in/anuj--wani/",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-8">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              About <span className="text-accent">Insightica</span>
            </h1>
          </div>

          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              At Insightica, we believe data should empower, not overwhelm.
              We're here to help retail traders cut through the noise, find
              clarity in the chaos, and make better trading decisions—without
              needing to be market experts or technical analysts.
            </p>
            <p>
              Born out of frustration with the clutter of indicators,
              conflicting advice, and hype-driven strategies, Insightica was
              created to offer a structured, transparent, and intuitive way to
              analyse trading signals. Our tools simplify complexity. Whether
              you're a beginner or a seasoned trader, Insightica helps you focus
              on what actually matters: truthful insights, not trendy noise.
            </p>
          </div>

          <div className="mt-12 md:mt-16 space-y-6">
            <h2 className="text-3xl font-semibold text-foreground flex items-center">
              <Target className="h-8 w-8 mr-3 text-primary shrink-0" />
              OUR MISSION
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Insightica began with a simple frustration shared by countless
                traders: technical indicators are inconsistent. Our founder,
                Manas, experienced this firsthand as a trader, struggling to
                pick the right indicator for the right moment. Indicators that
                worked well for one stock or market regime often fell short in
                others. Determined to find a solution, Manas began experimenting
                with machine learning models and deeper mathematics to solve
                this problem.
              </p>
              <p>
                Instead of chasing a single, perfect indicator, he had moved on
                to a different idea: use machine learning to predict which
                existing indicator would perform best for specific stocks and
                timeframes. His model, tested with over 85% accuracy on
                historical data, became the foundation of Insightica. Manas's
                goal was clear—share this breakthrough to help traders make
                informed decisions without the guesswork.
              </p>
              <p>
                Today, Insightica's mission is to empower traders everywhere
                with data-driven insights. We believe trading shouldn't feel
                like a gamble but a calculated choice. Our tools— Predictor,
                Evaluators, and Backtester—deliver precise recommendations and
                performance analysis, helping you choose strategies with
                confidence. Built on a commitment to innovation and
                transparency, Insightica transforms trading into a clear,
                informed pursuit. Join us to navigate the markets with precision
                and unlock your trading potential.
              </p>
            </div>
          </div>

          <div className="mt-12 md:mt-16 space-y-6">
            <h2 className="text-3xl font-semibold text-foreground flex items-center">
              <Eye className="h-8 w-8 mr-3 text-primary shrink-0" />
              OUR VISION
            </h2>
            <p className="text-muted-foreground">
              We want to make smart trading tools accessible to everyone. Our
              goal is to simplify decision-making, using data and technology to
              guide traders with clarity. As we grow, we hope to support more
              traders across markets, helping them make informed trade—one
              thoughtful decision at a time.
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <h2 className="text-3xl font-semibold text-foreground mb-6 text-center flex items-center justify-center">
              <Users className="h-8 w-8 mr-3 text-primary shrink-0" />
              Meet the Team
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              We're a small, collaborative team that enjoys building
              thoughtfully and wearing multiple hats. Everyone contributes
              across domains, design, development, strategy, and beyond. While
              we each bring different strengths, the work is shared, and the
              vision is collective.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-8">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="bg-card/80 border-border/50 flex flex-col hover:shadow-xl hover:border-accent/50 transition-all duration-300 transform hover:-translate-y-1 w-full"
                >
                  <CardHeader className="items-center text-center">
                    <div className="relative h-24 w-24 mb-4">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover w-24 h-24"
                        data-ai-hint={member.imageHint}
                      />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-accent text-sm">
                      {member.role}
                    </CardDescription>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center mt-2 text-blue-600 hover:text-blue-800"
                        aria-label={`LinkedIn profile of ${member.name}`}
                      >
                        <FaLinkedin size={22} />
                      </a>
                    )}
                  </CardHeader>
                  <CardContent className="text-center flex-grow">
                    <p className="text-muted-foreground text-sm">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-16 text-center">
            <Button variant="link" asChild>
              <Link href="/" className="text-accent hover:text-accent text-lg">
                &larr; Back to Home
              </Link>
            </Button>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
