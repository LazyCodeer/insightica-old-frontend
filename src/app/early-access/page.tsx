
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Added Label for consistency
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';

const EarlyAccessFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required."),
  email_address: z.string().email("Invalid email address.").min(1, "Email address is required."),
  trading_experience: z.enum(["Beginner", "Intermediate", "Experienced", "Professional"], {
    required_error: "Trading experience level is required.",
  }),
  referral_source: z.enum(["Social Media", "Referral from Friend/Colleague", "Online Community/Forum", "Web Search", "Other", ""]).optional(),
  referral_other_specify: z.string().optional(),
  biggest_challenge: z.string().optional(),
  additional_comments: z.string().optional(),
}).refine(data => {
  if (data.referral_source === "Other") {
    return !!data.referral_other_specify && data.referral_other_specify.length > 0;
  }
  return true;
}, {
  message: "Please specify your referral source if 'Other' is selected.",
  path: ["referral_other_specify"],
});

type EarlyAccessFormValues = z.infer<typeof EarlyAccessFormSchema>;

const defaultValues: Partial<EarlyAccessFormValues> = {
  full_name: "",
  email_address: "",
  referral_source: "",
  referral_other_specify: "",
  biggest_challenge: "",
  additional_comments: "",
};

export default function EarlyAccessPage() {
  const form = useForm<EarlyAccessFormValues>({
    resolver: zodResolver(EarlyAccessFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchReferralSource = form.watch("referral_source");

  function onSubmit(data: EarlyAccessFormValues) {
    console.log(data);
    // TODO: Implement backend submission
    alert("Thank you for signing up for early access!");
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Join the <span className="text-accent">Insightica</span> Revolution
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Be among the first to experience the future of trading analysis. Sign up for early access and get exclusive updates, features, and an opportunity to shape Insightica.
            </p>
          </div>
          
          <Card className="max-w-lg mx-auto mt-12 bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-card-foreground">Get Early Access</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Enter your details below to join the waitlist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trading_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading Experience Level <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Experienced">Experienced</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referral_source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you find us?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a source (Optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Social Media">Social Media</SelectItem>
                            <SelectItem value="Referral from Friend/Colleague">Referral from Friend/Colleague</SelectItem>
                            <SelectItem value="Online Community/Forum">Online Community/Forum</SelectItem>
                            <SelectItem value="Web Search">Web Search</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchReferralSource === "Other" && (
                    <FormField
                      control={form.control}
                      name="referral_other_specify"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify other source <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Conference, Advertisement" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="biggest_challenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your biggest challenge with trading indicators? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your challenges..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additional_comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anything else you'd like to tell us? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your comments..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Join Waitlist
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>

           <div className="mt-12 text-center">
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
