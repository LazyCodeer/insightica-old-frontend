
"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter }  from 'next/navigation';
import { useEffect } from 'react';


export default function SignupPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.push('/'); // Redirect if already logged in
    }
  }, [currentUser, loading, router]);

  if (loading || currentUser) {
    // Show a loading state or null to prevent flash of login form
     return (
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p>Loading...</p>
          </main>
          <Footer />
        </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="py-20 md:py-8 flex-grow flex items-center justify-center">
        <PageSection
          className="w-full py-8"
          containerClassName="w-full max-w-md md:w-[500px] md:max-w-[500px]"
        >
          <SignupForm />
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
