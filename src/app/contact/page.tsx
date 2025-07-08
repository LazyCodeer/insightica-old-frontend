import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Phone, MapPin, User } from 'lucide-react';


export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-8">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Get in <span className="text-accent">Touch</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
              Have questions, feedback, or need support? We're here to help. Reach out to us through the form below or via our contact details.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground">Send us a Message</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill out the form and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-foreground/80">First Name</Label>
                      <Input type="text" id="firstName" placeholder="John" className="mt-1 bg-input text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-foreground/80">Last Name</Label>
                      <Input type="text" id="lastName" placeholder="Doe" className="mt-1 bg-input text-foreground placeholder:text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                    <Input type="email" id="email" placeholder="you@example.com" className="mt-1 bg-input text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-foreground/80">Subject</Label>
                    <Input type="text" id="subject" placeholder="Regarding..." className="mt-1 bg-input text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-foreground/80">Message</Label>
                    <Textarea id="message" rows={5} placeholder="Your message here..." className="mt-1 bg-input text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-accent" />
                  <div className="hover:text-accent">Grievance Officer: Anuj Wani</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-accent" />
                  <a href="mailto:contact.insightica@gmail.com" className="hover:text-accent">contact.insightica@gmail.com</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-accent" />
                  <span>+917066997474</span>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">Connect with us</h3>
                 <p className="text-muted-foreground">
                   Follow us on social media for the latest updates and insights. (Links in footer)
                 </p>
              </div>
            </div>
          </div>
           <div className="mt-16 text-center">
            <Button variant="link" asChild>
                <Link href="/" className="text-accent hover:text-accent">
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
