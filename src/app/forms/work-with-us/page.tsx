
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { submitWorkWithUsForm } from "@/api/user";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const skillOptions = [
  { id: "Software Development", label: "Software Development" },
  { id: "Content", label: "Content" },
  { id: "UI/UX Design", label: "UI/UX Design" },
  { id: "Product Design", label: "Product Design" },
  { id: "Marketing", label: "Marketing" },
  { id: "Finance and operations", label: "Finance and operations" },
  { id: "Other", label: "Other" },
] as const;

const WorkWithUsFormSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  linkedin: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
  role: z.enum(["Developer", "Data Scientist", "Designer", "Product Manager", "Marketing", "Other"], {
    required_error: "Please select the role you are interested in.",
  }),
  role_other: z.string().optional(),
  skills: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one skill.",
  }),
  skills_other: z.string().optional(),
  experience: z.string().min(1, "Please tell us about your relevant experience."),
  why_insightica: z.string().min(1, "Please tell us why you want to work with Insightica."),
  experience_years: z.enum(["0-1", "1-3", "3-5", "5+"], {
    required_error: "Please select your years of professional experience.",
  }),
  resume: z.any()
    .refine((files) => files && files?.length > 0, "Resume is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .doc, .docx files are accepted."
    ),

  used_tools: z.enum(["Yes", "No"], { required_error: "Please select an option." }),
  tools_experience: z.string().optional(),
  unique_contribution: z.string().min(1, "This field is required."),
  availability: z.enum([
    "Immediate",
    "1-3 months",
    "3-6 months",
    "Flexible", 
  ], { required_error: "Please select your availability." }),
  follow_up: z.enum(["Yes", "No"]).optional(),
  follow_up_contact: z.string().optional(),

  product_familiarity: z.enum([
    "Yes - I've used them extensively", 
    "Yes - I've tried them briefly", 
    "No - but I've researched them", 
    "No - this would be my first exposure"
  ], { required_error: "Please select your familiarity with our tools." }),
  tool_feedback: z.string().optional(),
  unique_skills_perspective: z.string().min(1, "This field is required."),
  start_availability: z.enum([
    "Available immediately", 
    "Available within 1 month", 
    "Available in 1-3 months", 
    "Available in 3-6 months", 
    "Timeline is flexible"
  ], { required_error: "Please select your availability."}),
  interview_interest: z.enum([
    "Yes, absolutely", 
    "Yes, but prefer initial phone/video screening", 
    "Maybe - depends on the role details", 
    "Not at this time",
    ""
  ]).optional(),
  contact_preference: z.enum([
    "Email", 
    "Phone call", 
    "Video call (Zoom/Meet)", 
    "LinkedIn message", 
    "WhatsApp",
    ""
  ]).optional(),
})
.refine(data => data.role !== "Other" || (!!data.role_other && data.role_other.length > 0), {
  message: "Please specify if 'Other' role is selected.",
  path: ["role_other"],
})
.refine(data => !data.skills.includes("Other") || (!!data.skills_other && data.skills_other.length > 0), {
  message: "Please specify if 'Other' skill is selected.",
  path: ["skills_other"],
})
.refine(data => !data.product_familiarity?.startsWith("Yes") || (!!data.tool_feedback && data.tool_feedback.length > 0) || !data.product_familiarity , {
  message: "Please share your feedback if you've used our tools.",
  path: ["tool_feedback"],
})
.refine(data => !data.interview_interest?.startsWith("Yes") || (!!data.contact_preference && data.contact_preference.length > 0) || !data.interview_interest, {
    message: "Please specify your preferred contact method if interested in interviews.",
    path: ["contact_preference"],
});


type WorkWithUsFormValues = z.infer<typeof WorkWithUsFormSchema>;

const defaultValues: Partial<WorkWithUsFormValues> = {
  name: "",
  email: "",
  linkedin: "",
  skills: [],
  role_other: "",
  skills_other: "",
  experience: "",
  why_insightica: "",
  tools_experience: "",
  unique_contribution: "",
  follow_up_contact: "",
  tool_feedback: "",
  unique_skills_perspective: "",
  interview_interest: "",
  contact_preference: ""
};

export default function WorkWithUsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<WorkWithUsFormValues>({
    resolver: zodResolver(WorkWithUsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchRole = form.watch("role");
  const watchSkills = form.watch("skills");
  const watchProductFamiliarity = form.watch("product_familiarity");
  const watchInterviewInterest = form.watch("interview_interest");


  async function onSubmit(data: WorkWithUsFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    
    // Dynamically append fields to FormData
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (key === 'resume' && value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
        } else if (key === 'skills' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'string') {
            formData.append(key, value);
        }
    });

    try {
      await submitWorkWithUsForm(formData);
      toast({
        title: "Application Sent!",
        description: "Thank you for your interest in joining Insightica. We will review your application and be in touch.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Application Failed",
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
             <FileText className="mx-auto h-12 w-12 text-accent mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Work with <span className="text-accent">Insightica</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Join our mission to bring clarity to financial markets. We're looking for passionate individuals to help us grow.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto mt-12 bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-card-foreground">Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">About You</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="Your Full Name" {...field} /></FormControl>
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
                            <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile or Portfolio Link (Optional)</FormLabel>
                            <FormControl><Input type="url" placeholder="https://linkedin.com/in/yourprofile or https://yourportfolio.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Your Skills and Experience</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What role are you interested in? <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="Developer">Developer</SelectItem>
                                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                                <SelectItem value="Designer">Designer</SelectItem>
                                <SelectItem value="Product Manager">Product Manager</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {watchRole === "Other" && (
                        <FormField
                          control={form.control}
                          name="role_other"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Please specify role <span className="text-destructive">*</span></FormLabel>
                              <FormControl><Input placeholder="Specify interested role" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                       <FormField
                        control={form.control}
                        name="skills"
                        render={() => (
                          <FormItem>
                            <FormLabel>Which skills do you bring to the table? <span className="text-destructive">*</span></FormLabel>
                            {skillOptions.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="skills"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                  (field.value || []).filter(
                                                    (value) => value !== item.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {watchSkills?.includes("Other") && (
                        <FormField
                          control={form.control}
                          name="skills_other"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Please specify other skills <span className="text-destructive">*</span></FormLabel>
                              <FormControl><Input placeholder="List other relevant skills" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tell us about your relevant experience <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Textarea placeholder="Describe your experience..." rows={5} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="why_insightica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why do you want to work with Insightica? <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Textarea placeholder="Your motivation..." rows={3} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience_years"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How many years of professional experience do you have in your field? <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select years of experience" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="0-1">0-1 year</SelectItem>
                                <SelectItem value="1-3">1-3 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="5+">5+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="resume"
                        render={({ field: { onChange, value, ...rest }}) => (
                          <FormItem>
                            <FormLabel>Upload your resume <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                               <Input 
                                type="file" 
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => onChange(e.target.files)}
                                {...rest}
                               />
                            </FormControl>
                            <FormDescription>PDF, DOC, DOCX format, max 5MB.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Product Familiarity and Team Fit</h3>
                    <div className="space-y-6">
                      // ...after resume field...
<FormField
  control={form.control}
  name="used_tools"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Have you used trading or financial analysis tools before? <span className="text-destructive">*</span></FormLabel>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="flex flex-row space-x-6"
      >
        <FormItem className="flex items-center space-x-2">
          <FormControl><RadioGroupItem value="Yes" /></FormControl>
          <FormLabel className="font-normal">Yes</FormLabel>
        </FormItem>
        <FormItem className="flex items-center space-x-2">
          <FormControl><RadioGroupItem value="No" /></FormControl>
          <FormLabel className="font-normal">No</FormLabel>
        </FormItem>
      </RadioGroup>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="tools_experience"
  render={({ field }) => (
    <FormItem>
      <FormLabel>If yes, please describe your experience with these tools (Optional)</FormLabel>
      <FormControl>
        <Textarea placeholder="Describe your experience with trading/financial tools..." rows={3} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="unique_contribution"
  render={({ field }) => (
    <FormItem>
      <FormLabel>What unique contribution can you make to Insightica? <span className="text-destructive">*</span></FormLabel>
      <FormControl>
        <Textarea placeholder="Describe your unique contribution..." rows={3} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="availability"
  render={({ field }) => (
    <FormItem>
      <FormLabel>What is your preferred working arrangement? <span className="text-destructive">*</span></FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl><SelectTrigger><SelectValue placeholder="Select availability" /></SelectTrigger></FormControl>
        <SelectContent>
          <SelectItem value="Full-time">Full-time</SelectItem>
          <SelectItem value="Part-time">Part-time</SelectItem>
          <SelectItem value="Freelance/Contract">Freelance/Contract</SelectItem>
          <SelectItem value="Internship">Internship</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="follow_up"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Would you like us to follow up with you for future opportunities? (Optional)</FormLabel>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="flex flex-row space-x-6"
      >
        <FormItem className="flex items-center space-x-2">
          <FormControl><RadioGroupItem value="Yes" /></FormControl>
          <FormLabel className="font-normal">Yes</FormLabel>
        </FormItem>
        <FormItem className="flex items-center space-x-2">
          <FormControl><RadioGroupItem value="No" /></FormControl>
          <FormLabel className="font-normal">No</FormLabel>
        </FormItem>
      </RadioGroup>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="follow_up_contact"
  render={({ field }) => (
    <FormItem>
      <FormLabel>If yes, how should we contact you? (Optional)</FormLabel>
      <FormControl>
        <Input placeholder="Preferred contact method (email, phone, etc.)" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">Product Familiarity and Team Fit</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="product_familiarity"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Are you familiar with Insightica's platform and tools (Predictor, Backtester, Evaluators)? <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="Yes - I've used them extensively" /></FormControl>
                                  <FormLabel className="font-normal">Yes - I've used them extensively</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="Yes - I've tried them briefly" /></FormControl>
                                  <FormLabel className="font-normal">Yes - I've tried them briefly</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="No - but I've researched them" /></FormControl>
                                  <FormLabel className="font-normal">No - but I've researched them</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="No - this would be my first exposure" /></FormControl>
                                  <FormLabel className="font-normal">No - this would be my first exposure</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {(watchProductFamiliarity === "Yes - I've used them extensively" || watchProductFamiliarity === "Yes - I've tried them briefly") && (
                         <FormField
                            control={form.control}
                            name="tool_feedback"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>If you've used our tools, please share your honest feedback and suggestions for improvement <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Textarea placeholder="Your feedback on Predictor, Backtester, Evaluators..." rows={3} {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      )}
                      <FormField
                        control={form.control}
                        name="unique_skills_perspective"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What unique skills, perspective, or experience would you bring to our team? <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Textarea placeholder="Describe your unique qualities..." rows={3} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="start_availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>When would you be available to start if selected? <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select your availability" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="Available immediately">Available immediately</SelectItem>
                                <SelectItem value="Available within 1 month">Available within 1 month</SelectItem>
                                <SelectItem value="Available in 1-3 months">Available in 1-3 months</SelectItem>
                                <SelectItem value="Available in 3-6 months">Available in 3-6 months</SelectItem>
                                <SelectItem value="Timeline is flexible">Timeline is flexible</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="interview_interest"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Would you be interested in participating in our interview process? (Optional)</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="Yes, absolutely" /></FormControl>
                                  <FormLabel className="font-normal">Yes, absolutely</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="Yes, but prefer initial phone/video screening" /></FormControl>
                                  <FormLabel className="font-normal">Yes, but prefer initial phone/video screening</FormLabel>
                                </FormItem>
                                 <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="Maybe - depends on the role details" /></FormControl>
                                  <FormLabel className="font-normal">Maybe - depends on the role details</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="Not at this time" /></FormControl>
                                  <FormLabel className="font-normal">Not at this time</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       {(watchInterviewInterest === "Yes, absolutely" || watchInterviewInterest === "Yes, but prefer initial phone/video screening") && (
                         <FormField
                            control={form.control}
                            name="contact_preference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>If interested in interviews, how would you prefer we contact you? <span className="text-destructive">*</span></FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select preferred contact method" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Phone call">Phone call</SelectItem>
                                    <SelectItem value="Video call (Zoom/Meet)">Video call (Zoom/Meet)</SelectItem>
                                    <SelectItem value="LinkedIn message">LinkedIn message</SelectItem>
                                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" disabled={isLoading}>
                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {isLoading ? "Submitting..." : "Submit Application"}
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
