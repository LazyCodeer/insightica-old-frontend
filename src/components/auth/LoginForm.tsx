
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

const defaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);
    try {
      await login(data.email, data.password);
      toast({
        title: "Login Successful",
        description: "Welcome!"
      })
      // Redirect is handled by AuthContext or page
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to login. Please check your credentials.";
      setError(errorMessage);
      console.error("Login failed:", err);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full bg-card/90 border-border/60 shadow-xl">
      <CardHeader className="text-center">
        <LogIn className="mx-auto h-10 w-10 text-accent mb-3" />
        <CardTitle className="text-2xl md:text-3xl font-bold text-card-foreground">Welcome Back!</CardTitle>
        <CardDescription className="text-sm md:text-base text-muted-foreground">
          Sign in to access your Insightica dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                     <Button variant="link" asChild className="p-0 h-auto text-xs text-muted-foreground hover:text-accent font-normal">
                      <Link href="/auth/reset-password">Forgot Password?</Link>
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground pt-2" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </FormProvider>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
