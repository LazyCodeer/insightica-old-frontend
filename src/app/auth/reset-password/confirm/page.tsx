
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Eye, EyeOff, BadgeCheck, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { resetPassword } from '@/api/user';
import Link from 'next/link';

const ResetPasswordConfirmSchema = z.object({
  new_password: z.string().min(6, "Password must be at least 6 characters."),
  confirm_password: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => data.new_password === data.confirm_password, {
  message: "Passwords do not match.",
  path: ["confirm_password"],
});

type ResetPasswordConfirmValues = z.infer<typeof ResetPasswordConfirmSchema>;

function ResetPasswordConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<ResetPasswordConfirmValues>({
    resolver: zodResolver(ResetPasswordConfirmSchema),
    defaultValues: { new_password: "", confirm_password: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);
  
  async function onSubmit(data: ResetPasswordConfirmValues) {
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(token, data.new_password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reset password. The link may be expired.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full bg-card/90 border-border/60 shadow-xl text-center">
        <CardHeader>
          <BadgeCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl text-card-foreground">Password Reset Successful!</CardTitle>
          <CardDescription className="text-muted-foreground">
            You can now log in with your new password. Redirecting to login...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!token) {
     return (
        <Card className="w-full bg-card/90 border-border/60 shadow-xl text-center">
        <CardHeader>
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl text-card-foreground">Invalid Reset Link</CardTitle>
          <CardDescription className="text-muted-foreground">
            The password reset link is invalid or missing a token. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/auth/reset-password">Request New Link</Link>
            </Button>
        </CardContent>
      </Card>
     )
  }

  return (
    <Card className="w-full bg-card/90 border-border/60 shadow-xl">
      <CardHeader className="text-center">
        <KeyRound className="mx-auto h-10 w-10 text-accent mb-3" />
        <CardTitle className="text-3xl font-bold text-card-foreground">Set a New Password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose a new, secure password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordConfirmPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <PageSection className="w-full py-8" containerClassName="w-full max-w-md md:w-[500px] md:max-w-[500px]">
                    <Suspense fallback={<div>Loading...</div>}>
                        <ResetPasswordConfirmContent />
                    </Suspense>
                </PageSection>
            </main>
            <Footer />
        </div>
    );
}
