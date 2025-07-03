
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';
import { Briefcase, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { submitInvestmentInterest } from "@/api/user";
import type { InvestmentInterestPayload } from "@/api/user";

const InvestFormSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email address is required."),
  phone: z.string().optional(),
  investor_type: z.enum(["Individual", "Venture Capital", "Angel Investor", "Institutional", "Other"], {
    required_error: "Investor type is required.",
  }),
  investor_type_other: z.string().optional(),
  organization: z.string().optional(),
  source: z.enum(["Website", "Social Media", "Referral", "Event", "Other", ""]).optional(),
  source_other: z.string().optional(),
  interest: z.enum(["Innovative Tools", "Market Potential", "The Team", "Scalability", "Other", ""]).optional(),
  interest_other: z.string().optional(),
  comments: z.string().optional(),
}).refine(data => data.investor_type !== "Other" || (!!data.investor_type_other && data.investor_type_other.length > 0), {
  message: "Please specify if 'Other' investor type is selected.",
  path: ["investor_type_other"],
}).refine(data => data.source !== "Other" || (!!data.source_other && data.source_other.length > 0), {
  message: "Please specify if 'Other' source is selected.",
  path: ["source_other"],
}).refine(data => data.interest !== "Other" || (!!data.interest_other && data.interest_other.length > 0), {
  message: "Please specify if 'Other' interest is selected.",
  path: ["interest_other"],
});

type InvestFormValues = z.infer<typeof InvestFormSchema>;

const defaultValues: Partial<InvestFormValues> = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  source: "",
  source_other: "",
  interest: "",
  interest_other: "",
  comments: "",
};

export default function InvestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InvestFormValues>({
    resolver: zodResolver(InvestFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchInvestorType = form.watch("investor_type");
  const watchSource = form.watch("source");
  const watchInterest = form.watch("interest");

  async function onSubmit(data: InvestFormValues) {
    setIsLoading(true);
    try {
      // The backend expects `source` and `interest` as JSON, but the form provides strings.
      // We will pass them as is, assuming the backend can handle simple string values in JSONFields.
      // If the backend strictly requires an array, this would need to be `source: data.source ? [data.source] : []`
      const payload: InvestmentInterestPayload = {
        ...data,
        source: data.source || null,
        interest: data.interest || null,
      };

      await submitInvestmentInterest(payload);
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. We will be in touch with you shortly.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unknown error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-8">
        <PageSection>
          <div className="max-w-4xl mx-auto text-center">
            <Briefcase className="mx-auto h-12 w-12 text-accent mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Invest in <span className="text-accent">Insightica</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Interested in partnering with us on our journey? Fill out the form below to express your interest.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto mt-12 bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-card-foreground">Investor Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">About You</h3>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investor_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investor Type <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select investor type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Individual">Individual</SelectItem>
                            <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                            <SelectItem value="Angel Investor">Angel Investor</SelectItem>
                            <SelectItem value="Institutional">Institutional</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchInvestorType === "Other" && (
                    <FormField
                      control={form.control}
                      name="investor_type_other"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify investor type <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Specify your investor type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization/Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <h3 className="text-lg font-semibold text-foreground border-b pb-2 pt-4">Investment Interest</h3>
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you hear about Insightica? (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Social Media">Social Media</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchSource === "Other" && (
                    <FormField
                      control={form.control}
                      name="source_other"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify source <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Specify other source" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What interests you most about investing in Insightica? (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your main interest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Innovative Tools">Innovative Tools</SelectItem>
                            <SelectItem value="Market Potential">Market Potential</SelectItem>
                            <SelectItem value="The Team">The Team</SelectItem>
                            <SelectItem value="Scalability">Scalability</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchInterest === "Other" && (
                    <FormField
                      control={form.control}
                      name="interest_other"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify other interest <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Specify your interest" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anything else you'd like to tell us? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your additional comments or questions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>

           <div className="mt-12 text-center">
            <Button variant="link" asChild>
                <Link href="/forms" className="text-accent hover:text-accent">
                    &larr; Back to Forms
                </Link>
            </Button>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
