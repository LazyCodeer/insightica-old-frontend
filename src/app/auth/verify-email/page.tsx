
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/api/user';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'invalid'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const doVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000); // Redirect after 3 seconds
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.response?.data?.detail || 'Verification failed. The link may be invalid or expired.');
        console.error("Verification failed:", error);
      }
    };

    doVerification();
  }, [token, router]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <Loader2 className="mx-auto h-10 w-10 text-accent mb-3 animate-spin" />
            <CardTitle className="text-2xl font-bold text-card-foreground">Verifying Your Email</CardTitle>
            <CardDescription className="text-muted-foreground">Please wait a moment...</CardDescription>
          </>
        );
      case 'success':
        return (
          <>
            <BadgeCheck className="mx-auto h-10 w-10 text-green-500 mb-3" />
            <CardTitle className="text-2xl font-bold text-card-foreground">Verification Successful!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your email has been verified. Redirecting you to the login page...
            </CardDescription>
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-3" />
            <CardTitle className="text-2xl font-bold text-card-foreground">Verification Failed</CardTitle>
            <CardDescription className="text-destructive">{errorMessage}</CardDescription>
          </>
        );
      case 'invalid':
      default:
        return (
          <>
            <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-3" />
            <CardTitle className="text-2xl font-bold text-card-foreground">Invalid Link</CardTitle>
            <CardDescription className="text-muted-foreground">
              The verification link is missing or invalid. Please check the link in your email.
            </CardDescription>
          </>
        );
    }
  };

  return (
     <Card className="w-full bg-card/90 border-border/60 shadow-xl">
      <CardHeader className="text-center p-8">
        {renderContent()}
      </CardHeader>
      {(status === 'error' || status === 'invalid') && (
        <CardContent className="text-center">
            <Button asChild>
                <Link href="/auth/login">Go to Login</Link>
            </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <PageSection className="w-full py-8" containerClassName="w-full max-w-md md:w-[500px] md:max-w-[500px]">
                    <Suspense fallback={<div>Loading...</div>}>
                        <EmailVerificationContent />
                    </Suspense>
                </PageSection>
            </main>
            <Footer />
        </div>
    );
}
