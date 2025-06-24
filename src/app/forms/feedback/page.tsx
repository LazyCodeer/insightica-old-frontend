
"use client";

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

const professionOptions = [
  { id: "Student", label: "Student" },
  { id: "Retail Trader", label: "Retail Trader" },
  { id: "Working Professional", label: "Working Professional" },
  { id: "Analyst", label: "Analyst" },
  { id: "Long-term Investor", label: "Long-term Investor" },
  { id: "Other", label: "Other" },
] as const;

const sourceOptions = [
  { id: "Twitter", label: "Twitter" },
  { id: "LinkedIn", label: "LinkedIn" },
  { id: "Friend/Colleague", label: "Friend/Colleague" },
  { id: "Online community", label: "Online community" },
  { id: "Other", label: "Other" },
] as const;

const toolsOptions = [
  { id: "Predictor", label: "Predictor" },
  { id: "Backtester", label: "Backtester" },
  { id: "Evaluators", label: "Evaluators" },
] as const;

const motivationOptions = [
    { id: "Curious to explore", label: "Curious to explore" },
    { id: "Clarity on indicator performance", label: "Clarity on indicator performance" },
    { id: "Confused with strategies", label: "Confused with strategies" },
    { id: "Better Accessibility", label: "Better Accessibility" },
    { id: "Other", label: "Other" },
] as const;


const FeedbackFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  profession: z.array(z.string()).refine(value => value.length > 0, { message: "Please select at least one profession." }),
  profession_other: z.string().optional(),
  source: z.array(z.string()).refine(value => value.length > 0, { message: "Please select at least one source." }),
  source_other: z.string().optional(),
  
  tools_tried: z.array(z.string()).optional(),
  usage_frequency: z.enum(["First time", "2-3 times", "4-5 times", "Regularly", ""]).optional(),
  motivation: z.array(z.string()).optional(),
  motivation_other: z.string().optional(),
  primary_trading_goals: z.enum([
      "Day Trading", "Swing Trading", "Long-Term Investing", 
      "Futures and Options Trading", "Forex Trading", "Cryptocurrency Trading", 
      "Scalp Trading", "Other"
    ], { required_error: "Primary trading goals are required."}),
  primary_trading_goals_other: z.string().optional(),
  other_tools_used: z.string().optional(),

  experience_rating: z.enum(["1", "2", "3", "4", "5"], { required_error: "Overall experience rating is required." }),
  platform_feel: z.enum(["Easy to use", "Overwhelming at first", "Confusing", "Didn't explore enough", ""]).optional(),
  learning_curve: z.enum(["Instantly", "A few minutes", "Took some time", "Still unclear", ""]).optional(),
  helpful_visual: z.string().optional(),
  polished_part: z.string().optional(),
  clunky_parts: z.string().optional(),
  one_word_description: z.string().optional(),

  market_participant: z.enum(["Beginner", "Learning but trading", "Experienced trader", "Long-term investor", "Just exploring", ""]).optional(),
  understand_indicators: z.enum(["Yes", "Somewhat", "No", ""]).optional(),
  understand_how: z.string().optional(),
  discovered_patterns: z.enum(["Yes", "Not yet", ""]).optional(),
  patterns_details: z.string().optional(),
  trade_results: z.string().optional(),
  recommend_likelihood: z.enum(["1", "2", "3", "4", "5"], { required_error: "Recommendation likelihood is required." }),

  new_feature: z.enum(["Triad Insight(3 indicator combo)", "Pair Predictor", "Smaller Ticker size", "Expanding to F&O", "Others", ""]).optional(),
  new_feature_other: z.string().optional(),
  best_suited_for: z.string().optional(),
  follow_up_call: z.enum(["Yes", "No", "Maybe", ""]).optional(),
  follow_up_contact: z.string().optional(),
  final_thoughts: z.string().optional(),
})
.refine(data => !data.profession.includes("Other") || (!!data.profession_other && data.profession_other.length > 0), {
  message: "Please specify if 'Other' profession is selected.", path: ["profession_other"],
})
.refine(data => !data.source.includes("Other") || (!!data.source_other && data.source_other.length > 0), {
  message: "Please specify if 'Other' source is selected.", path: ["source_other"],
})
.refine(data => !data.motivation?.includes("Other") || (!!data.motivation_other && data.motivation_other.length > 0), {
  message: "Please specify if 'Other' motivation is selected.", path: ["motivation_other"],
})
.refine(data => data.primary_trading_goals !== "Other" || (!!data.primary_trading_goals_other && data.primary_trading_goals_other.length > 0), {
  message: "Please specify if 'Other' trading goal is selected.", path: ["primary_trading_goals_other"],
})
.refine(data => data.understand_indicators !== "Yes" || (!!data.understand_how && data.understand_how.length > 0) || data.understand_indicators === "" || data.understand_indicators === "No" || data.understand_indicators === "Somewhat", {
  message: "Please elaborate if Insightica helped you understand indicators.", path: ["understand_how"],
})
.refine(data => data.discovered_patterns !== "Yes" || (!!data.patterns_details && data.patterns_details.length > 0) || data.discovered_patterns === "" || data.discovered_patterns === "Not yet", {
  message: "Please provide details if you discovered patterns.", path: ["patterns_details"],
})
.refine(data => data.new_feature !== "Others" || (!!data.new_feature_other && data.new_feature_other.length > 0) || data.new_feature === "", {
  message: "Please specify if 'Others' new feature is selected.", path: ["new_feature_other"],
})
.refine(data => data.follow_up_call !== "Yes" || (!!data.follow_up_contact && data.follow_up_contact.length > 0) || data.follow_up_call === "" || data.follow_up_call === "No" || data.follow_up_call === "Maybe", {
  message: "Please provide contact details if open to a follow-up.", path: ["follow_up_contact"],
});


type FeedbackFormValues = z.infer<typeof FeedbackFormSchema>;

const defaultValues: Partial<FeedbackFormValues> = {
  name: "",
  email: "",
  profession: [],
  profession_other: "",
  source: [],
  source_other: "",
  tools_tried: [],
  usage_frequency: "",
  motivation: [],
  motivation_other: "",
  primary_trading_goals_other: "",
  other_tools_used: "",
  platform_feel: "",
  learning_curve: "",
  helpful_visual: "",
  polished_part: "",
  clunky_parts: "",
  one_word_description: "",
  market_participant: "",
  understand_indicators: "",
  understand_how: "",
  discovered_patterns: "",
  patterns_details: "",
  trade_results: "",
  new_feature: "",
  new_feature_other: "",
  best_suited_for: "",
  follow_up_call: "",
  follow_up_contact: "",
  final_thoughts: "",
};

export default function FeedbackPage() {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchProfession = form.watch("profession");
  const watchSource = form.watch("source");
  const watchMotivation = form.watch("motivation");
  const watchPrimaryTradingGoals = form.watch("primary_trading_goals");
  const watchUnderstandIndicators = form.watch("understand_indicators");
  const watchDiscoveredPatterns = form.watch("discovered_patterns");
  const watchNewFeature = form.watch("new_feature");
  const watchFollowUpCall = form.watch("follow_up_call");

  function onSubmit(data: FeedbackFormValues) {
    console.log(data);
    alert("Thank you for your valuable feedback!");
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="max-w-2xl mx-auto text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-accent mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              User <span className="text-accent">Feedback</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Your experience and insights are invaluable to us. Please share your thoughts to help us improve Insightica.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto mt-12 bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-card-foreground">Feedback Form</CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">About You</h3>
                    <div className="space-y-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email ID <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="profession" render={() => (
                        <FormItem>
                          <FormLabel>Profession (Multiple selections allowed) <span className="text-destructive">*</span></FormLabel>
                          {professionOptions.map((item) => (
                            <FormField key={item.id} control={form.control} name="profession" render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange((field.value || []).filter(v => v !== item.id))}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )} />
                      {watchProfession?.includes("Other") && (
                        <FormField control={form.control} name="profession_other" render={({ field }) => (
                          <FormItem><FormLabel>Please specify profession <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Your profession" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      )}
                      <FormField control={form.control} name="source" render={() => (
                        <FormItem>
                          <FormLabel>How did you hear about Insightica? (Multiple selections allowed) <span className="text-destructive">*</span></FormLabel>
                          {sourceOptions.map((item) => (
                            <FormField key={item.id} control={form.control} name="source" render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange((field.value || []).filter(v => v !== item.id))}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )} />
                      {watchSource?.includes("Other") && (
                        <FormField control={form.control} name="source_other" render={({ field }) => (
                          <FormItem><FormLabel>Please specify source <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Specify other source" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Your Experience with Insightica</h3>
                    <div className="space-y-6">
                       <FormField control={form.control} name="tools_tried" render={() => (
                        <FormItem>
                          <FormLabel>Which tools did you try? (Check all that apply)</FormLabel>
                          {toolsOptions.map((item) => (
                            <FormField key={item.id} control={form.control} name="tools_tried" render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange((field.value || []).filter(v => v !== item.id))}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="usage_frequency" render={({ field }) => (
                        <FormItem>
                          <FormLabel>How many times have you used Insightica so far?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select usage frequency" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="First time">First time</SelectItem>
                              <SelectItem value="2-3 times">2-3 times</SelectItem>
                              <SelectItem value="4-5 times">4-5 times</SelectItem>
                              <SelectItem value="Regularly">Regularly</SelectItem>
                            </SelectContent>
                          </Select><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="motivation" render={() => (
                        <FormItem>
                          <FormLabel>What brought you to Insightica? (Multiple selections allowed)</FormLabel>
                           {motivationOptions.map((item) => (
                            <FormField key={item.id} control={form.control} name="motivation" render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange((field.value || []).filter(v => v !== item.id))}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )} />
                      {watchMotivation?.includes("Other") && (
                        <FormField control={form.control} name="motivation_other" render={({ field }) => (
                          <FormItem><FormLabel>Please specify motivation <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Your motivation" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      )}
                       <FormField control={form.control} name="primary_trading_goals" render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are your primary trading goals or interests? <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your primary goals" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Day Trading">Day Trading</SelectItem>
                                <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                                <SelectItem value="Long-Term Investing">Long-Term Investing</SelectItem>
                                <SelectItem value="Futures and Options Trading">Futures and Options Trading</SelectItem>
                                <SelectItem value="Forex Trading">Forex Trading</SelectItem>
                                <SelectItem value="Cryptocurrency Trading">Cryptocurrency Trading</SelectItem>
                                <SelectItem value="Scalp Trading">Scalp Trading</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select><FormMessage />
                        </FormItem>
                      )} />
                      {watchPrimaryTradingGoals === "Other" && (
                        <FormField control={form.control} name="primary_trading_goals_other" render={({ field }) => (
                          <FormItem><FormLabel>Please specify trading goals <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Specify your goals" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      )}
                      <FormField control={form.control} name="other_tools_used" render={({ field }) => (
                          <FormItem><FormLabel>What other tools, platforms, or methods do you currently use? (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., TradingView, specific brokers, news sites" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Platform Usability</h3>
                    <div className="space-y-6">
                        <FormField control={form.control} name="experience_rating" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>How would you rate your overall experience? (1 = Poor, 5 = Excellent) <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                    {[1, 2, 3, 4, 5].map(val => (
                                    <FormItem key={val} className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value={String(val)} /></FormControl>
                                        <FormLabel className="font-normal">{val}</FormLabel>
                                    </FormItem>
                                    ))}
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="platform_feel" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>The platform felt: (Optional)</FormLabel>
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Easy to use" /></FormControl><FormLabel className="font-normal">Easy to use</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Overwhelming at first" /></FormControl><FormLabel className="font-normal">Overwhelming at first</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Confusing" /></FormControl><FormLabel className="font-normal">Confusing</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Didn't explore enough" /></FormControl><FormLabel className="font-normal">Didn't explore enough</FormLabel></FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="learning_curve" render={({ field }) => (
                            <FormItem>
                                <FormLabel>How long did it take you to understand how the tools work? (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select learning time" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Instantly">Instantly</SelectItem>
                                    <SelectItem value="A few minutes">A few minutes</SelectItem>
                                    <SelectItem value="Took some time">Took some time</SelectItem>
                                    <SelectItem value="Still unclear">Still unclear</SelectItem>
                                </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="helpful_visual" render={({ field }) => (
                            <FormItem><FormLabel>Which visual felt most helpful in understanding indicator performance? (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., charts, tables, specific visual elements" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="polished_part" render={({ field }) => (
                            <FormItem><FormLabel>Which part of the platform felt the most polished or professional to you? (Optional)</FormLabel><FormControl><Textarea placeholder="Your thoughts..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="clunky_parts" render={({ field }) => (
                            <FormItem><FormLabel>Did anything feel clunky, confusing, or redundant? Be honest. (Optional)</FormLabel><FormControl><Textarea placeholder="Your honest feedback..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="one_word_description" render={({ field }) => (
                            <FormItem><FormLabel>If you could describe Insightica in one word, what would it be? (Optional)</FormLabel><FormControl><Input placeholder="One word" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  </div>

                  <div>
                     <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Value Derived & Insights Gained</h3>
                     <div className="space-y-6">
                        <FormField control={form.control} name="market_participant" render={({ field }) => (
                            <FormItem>
                                <FormLabel>What kind of market participant are you? (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select participant type" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Learning but trading">Learning but trading</SelectItem>
                                    <SelectItem value="Experienced trader">Experienced trader</SelectItem>
                                    <SelectItem value="Long-term investor">Long-term investor</SelectItem>
                                    <SelectItem value="Just exploring">Just exploring</SelectItem>
                                </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="understand_indicators" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Did Insightica help you understand indicators or combinations better? (Optional)</FormLabel>
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Somewhat" /></FormControl><FormLabel className="font-normal">Somewhat</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {watchUnderstandIndicators === "Yes" && (
                             <FormField control={form.control} name="understand_how" render={({ field }) => (
                                <FormItem><FormLabel>If yes, how? <span className="text-destructive">*</span></FormLabel><FormControl><Textarea placeholder="Explain how it helped..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}
                         <FormField control={form.control} name="discovered_patterns" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Have you discovered any interesting combinations or patterns through Insightica? (Optional)</FormLabel>
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Not yet" /></FormControl><FormLabel className="font-normal">Not yet</FormLabel></FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {watchDiscoveredPatterns === "Yes" && (
                             <FormField control={form.control} name="patterns_details" render={({ field }) => (
                                <FormItem><FormLabel>If yes, what were they? <span className="text-destructive">*</span></FormLabel><FormControl><Textarea placeholder="Describe the patterns..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}
                        <FormField control={form.control} name="trade_results" render={({ field }) => (
                            <FormItem><FormLabel>Have you applied any insight into a real or mock trade? If yes, what was the result? (Optional)</FormLabel><FormControl><Textarea placeholder="Describe your trade and outcome..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="recommend_likelihood" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>On a scale of 1–5, how likely are you to recommend Insightica? (1 = Not Likely, 5 = Very Likely) <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                    {[1, 2, 3, 4, 5].map(val => (
                                    <FormItem key={val} className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value={String(val)} /></FormControl>
                                        <FormLabel className="font-normal">{val}</FormLabel>
                                    </FormItem>
                                    ))}
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                     </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Suggestions & Final Thoughts</h3>
                    <div className="space-y-6">
                        <FormField control={form.control} name="new_feature" render={({ field }) => (
                            <FormItem>
                                <FormLabel>If you could add one feature, what would it be? (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a feature or suggest one" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Triad Insight(3 indicator combo)">Triad Insight (3 indicator combo)</SelectItem>
                                    <SelectItem value="Pair Predictor">Pair Predictor</SelectItem>
                                    <SelectItem value="Smaller Ticker size">Smaller Ticker size</SelectItem>
                                    <SelectItem value="Expanding to F&O">Expanding to F&O</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        {watchNewFeature === "Others" && (
                             <FormField control={form.control} name="new_feature_other" render={({ field }) => (
                                <FormItem><FormLabel>Please specify feature <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Your feature idea" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}
                        <FormField control={form.control} name="best_suited_for" render={({ field }) => (
                            <FormItem><FormLabel>What kind of trader do you think Insightica is best suited for? (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., beginners, experienced day traders, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="follow_up_call" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Would you be open to a short follow-up call or interview? (Optional)</FormLabel>
                                <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Maybe" /></FormControl><FormLabel className="font-normal">Maybe</FormLabel></FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {watchFollowUpCall === "Yes" && (
                             <FormField control={form.control} name="follow_up_contact" render={({ field }) => (
                                <FormItem><FormLabel>If yes, please drop your email or contact <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Your preferred contact (email, phone)" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}
                        <FormField control={form.control} name="final_thoughts" render={({ field }) => (
                            <FormItem><FormLabel>Any final thoughts, suggestions, or praise? We'd love to hear it. (Optional)</FormLabel><FormControl><Textarea placeholder="Your final comments..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3">
                    Submit Feedback
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
