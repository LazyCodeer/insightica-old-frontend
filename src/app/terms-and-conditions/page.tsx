
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Terms and <span className="text-accent">Conditions</span>
            </h1>
          </div>

          <div className="space-y-6 text-muted-foreground prose prose-sm sm:prose-base max-w-none">
            <p>
              This document (“Agreement” or “Terms”) constitutes a legally binding agreement between you (“User”, “you”, or “your”) and Insightica, operated by Insightica Fintech LLP, with its principal office at H. No. 65 and 66, 3rd Floor, Jain Road, Gali No. 19, Uttam Nagar, New Delhi, West Delhi- 110059, India (“Company”, “we”, “us”, or “our”), governing your use of the Insightica website, platform, tools, and any related services (“Platform”).
            </p>
            <p>
              By accessing or using any part of the Platform, you agree to be bound by these Terms. If you do not agree to all of the Terms, you must not access or use the Platform.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1. Eligibility</h2>
            <p>
              By using the Platform, you represent and warrant that you are at least 18 years of age and competent to enter into a legally binding contract under Indian law. If you are accessing the Platform on behalf of an organization, you warrant that you are authorized to accept these Terms on its behalf.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">2. Nature of Service</h2>
            <p>
              Insightica provides data-driven tools, visualizations, and analytical insights based on technical indicators to assist users in understanding market behavior.
            </p>
            <ul className="list-disc pl-6 space-y-1">
                <li>We do not provide investment advice, recommendations, or trading signals.</li>
                <li>All decisions made by the User based on the Platform's content are done at the User’s sole risk and discretion.</li>
            </ul>
            

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">3. User Information and Account</h2>
            <p>
              Users may be required to provide certain personal information, including their name, email address, and date of birth, for age verification and communication purposes. By submitting such information, you agree that it is accurate and current.
            </p>
            <p>
              We reserve the right to restrict access, suspend accounts, or terminate services in case of suspected misuse, impersonation, or illegal activity.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">4. Usage Restrictions</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Platform for any unlawful, misleading, or harmful purpose;</li>
              <li>Modify, distribute, or reproduce content from the Platform without our written permission;</li>
              <li>Reverse-engineer or attempt to extract source code from the Platform;</li>
              <li>Use automated tools or bots to access or scrape the Platform.</li>
            </ul>
            <p>
              Any breach of the above may result in immediate termination of access and legal action, where applicable.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">5. Intellectual Property</h2>
            <p>
              All content, code, graphics, trademarks, and data on the Platform are the exclusive property of Insightica or its licensors. No part of the Platform may be copied, reproduced, republished, uploaded, or transmitted in any form without prior written consent from the Company.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">6. Disclaimer of Warranties</h2>
            <p>
              The Platform and its content are provided on an "as is" and "as available" basis.
              We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Platform will be error-free, secure, or continuously available;</li>
              <li>The data or outputs provided will be complete, accurate, or fit for a particular purpose.</li>
            </ul>
            <p>
              The User agrees that they are solely responsible for any investment decisions made using insights derived from the Platform.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted under law, Insightica shall not be liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to loss of data, profits, or trading losses, arising out of or in connection with your use of the Platform.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">8. Third-Party Links and Content</h2>
            <p>
              The Platform may contain links to external websites or third-party services. We do not control or endorse any content or practices of such third-party sites. Accessing them is at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">9. Privacy</h2>
            <p>
              All personal data collected is governed by our Privacy Policy. By agreeing to these Terms, you also agree to the terms set out in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Platform at our sole discretion, without prior notice, if you violate these Terms or engage in behavior that is harmful to us or other users.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">11. Amendments</h2>
            <p>
              We may revise these Terms at any time without prior notice. The most recent version will always be available on our website. Continued use of the Platform constitutes your acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">12. Governing Law and Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. All disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of New Delhi.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">13. Contact Information</h2>
            <p>
              For any questions, concerns, or complaints regarding these Terms, please contact us at:
            </p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>Grievance Officer:</strong> Anuj Wani</li>
              <li><strong>Email:</strong> <a href="mailto:contact.insightica@gmail.com" className="text-accent hover:underline">contact.insightica@gmail.com</a></li>
              <li><strong>Address:</strong> H. No. 65 and 66, 3rd Floor, Jain Road, Gali No. 19, Uttam Nagar, New Delhi, West Delhi- 110059, India</li>
            </ul>
             <p className="mt-6">
              By using the Platform, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions.
            </p>
          </div>

          <div className="mt-10 text-center text-sm text-muted-foreground">
            <p>Effective Date: {currentDate}</p>
            <p>Last Updated: {currentDate}</p>
          </div>

          <div className="mt-12 text-center">
            <Button variant="link" asChild>
              <Link href="/" className="text-accent hover:text-accent text-lg">
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
