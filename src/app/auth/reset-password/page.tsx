
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, MailCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { requestPasswordReset } from '@/api/user';
import Link from 'next/link';

const ResetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
});

type ResetPasswordRequestValues = z.infer<typeof ResetPasswordRequestSchema>;

export default function ResetPasswordRequestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordRequestValues>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  async function onSubmit(data: ResetPasswordRequestValues) {
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send reset link. Please check the email address.");
    } finally {
      setLoading(false);
    }
  }

  const renderForm = () => (
    <Card className="w-full bg-card/90 border-border/60 shadow-xl">
      <CardHeader className="text-center">
        <Mail className="mx-auto h-10 w-10 text-accent mb-3" />
        <CardTitle className="text-3xl font-bold text-card-foreground">Reset Your Password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
              {!loading && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </FormProvider>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );

  const renderSuccess = () => (
    <Card className="w-full bg-card/90 border-border/60 shadow-xl text-center">
      <CardHeader>
        <MailCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <CardTitle className="text-2xl text-card-foreground">Reset Link Sent!</CardTitle>
        <CardDescription className="text-muted-foreground">
          If an account with that email exists, we've sent a password reset link to it. Please check your inbox (and spam folder).
        </CardDescription>
      </CardHeader>
       <CardContent>
          <Button asChild>
              <Link href="/auth/login">Back to Login</Link>
          </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <PageSection className="w-full py-8" containerClassName="w-full max-w-md md:w-[500px] md:max-w-[500px]">
          {success ? renderSuccess() : renderForm()}
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
