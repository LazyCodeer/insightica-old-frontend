
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, Users, MessageSquare, Briefcase } from 'lucide-react';

const forms = [
  {
    title: "Early Access Program",
    description: "Sign up to be among the first to experience Insightica and help shape its future.",
    link: "/early-access",
    icon: Users,
  },
  {
    title: "Invest in Insightica",
    description: "Interested in becoming an investor? Share your details with us.",
    link: "/forms/invest",
    icon: Briefcase,
  },
  {
    title: "Work with Us",
    description: "Apply to join our team and contribute to the Insightica vision.",
    link: "/forms/work-with-us",
    icon: FileText,
  },
  {
    title: "User Feedback",
    description: "Share your thoughts and experiences to help us improve Insightica.",
    link: "/forms/feedback",
    icon: MessageSquare,
  },
];

export default function FormsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Insightica <span className="text-accent">Forms</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
              Access various forms to engage with Insightica, provide feedback, or explore opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {forms.map((form) => (
              <Card key={form.title} className="bg-card/80 border-border/50 hover:shadow-xl hover:border-accent/50 transition-all duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <form.icon className="h-8 w-8 text-accent" />
                    <CardTitle className="text-2xl text-card-foreground">{form.title}</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground h-12">{form.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <Button variant="outline" asChild className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent mt-4">
                    <Link href={form.link}>Go to Form</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
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
