
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection 
          className="relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 -z-10 h-full w-full bg-background" 
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px),
                radial-gradient(at 20% 25%, hsl(var(--primary) / 0.15) 0px, transparent 50%),
                radial-gradient(at 80% 75%, hsl(var(--chart-4) / 0.1) 0px, transparent 50%)
              `,
              backgroundSize: '3rem 3rem, 3rem 3rem, 100% 100%, 100% 100%'
            }}
          />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
                Privacy <span className="text-accent">Policy</span>
              </h1>
            </div>

            <div className="space-y-6 text-muted-foreground prose prose-sm sm:prose-base max-w-none">
              <p>
                This Privacy Policy (“Policy”) is entered into by and between Insightica, a product/platform operated by Insightica Fintech LLP, having its principal place of business at H. No. 65 and 66, 3rd Floor, Jain Road, Gali No. 19, Uttam Nagar, New Delhi, West Delhi- 110059, India. (“Company”, “we”, “us”, or “our”), and the user (“you”, “your”, or “User”) of the services offered through our website and related digital platforms (“Platform”).
              </p>
              <p>
                This Policy governs the manner in which Insightica collects, uses, maintains, and discloses information collected from Users and forms a binding legal agreement under applicable Indian laws, including but not limited to the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1. Collection of Personal Information</h2>
              <p>
                By accessing and using the Platform, the User consents to the collection of the following personal information:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Date of Birth (used solely for age verification)</li>
                <li>Usage patterns and behavior on the Platform, including but not limited to feature engagement, clickstream data, and duration of sessions.</li>
              </ul>
              <p>
                We do not collect passwords, payment details, financial information, or any other sensitive personal data as defined under Indian law.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">2. Purpose of Collection and Use</h2>
              <p>
                The information collected from the User shall be used for the following limited purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide, operate, and maintain the Platform and its features;</li>
                <li>To verify the User’s eligibility to access the Platform based on age;</li>
                <li>To enhance and personalize the User experience through the analysis of usage behavior;</li>
                <li>To communicate with the User, including service notifications, responses to inquiries, and important platform updates.</li>
              </ul>
              <p>
                Insightica shall not use the User’s personal information for purposes unrelated to the above without obtaining prior consent, unless required by law.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">3. Disclosure of Personal Information</h2>
              <p>
                The Company shall not disclose or share the User’s personal information with any third party, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>When disclosure is required by applicable law or governmental authority;</li>
                <li>To third-party service providers who are bound by confidentiality obligations and require access to such information strictly for operational purposes of the Platform.</li>
              </ul>
              <p>
                No data shall be sold, leased, or transferred to any unauthorized external entity under any circumstances.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">4. No Financial Advice</h2>
              <p>
                The User acknowledges and agrees that the Platform and its services are intended solely for informational and assistive purposes. The Company is not a registered financial advisor, investment advisor, or research analyst under SEBI or any other regulatory body.
              </p>
              <p>
                All tools and content provided by Insightica are designed to assist the User in analyzing data and indicators. Any investment or trading decisions made by the User are done solely at their own risk, and the Company shall not be liable for any loss, damage, or liability incurred as a result of such decisions.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">5. Cookies and Usage Tracking</h2>
              <p>
                The Platform may employ cookies or other tracking technologies to monitor usage patterns, analyze trends, and enhance the quality of services. Users may disable cookies via their browser settings; however, doing so may impact the functionality of certain features of the Platform.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">6. Data Retention and Security</h2>
              <p>
                All personal information collected shall be retained only for as long as necessary to fulfill the purposes outlined in this Policy or as required by applicable law. The Company implements commercially reasonable security measures to protect the integrity and confidentiality of personal information. However, the User acknowledges that no electronic transmission or storage system is fully secure and assumes all risks associated with data transmission over the internet.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">7. Rights of the User</h2>
              <p>
                The User has the right to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to their personal information held by the Company;</li>
                <li>Request corrections, updates, or deletion of their personal information;</li>
                <li>Withdraw consent to the collection or processing of data, subject to legal and contractual obligations.</li>
              </ul>
              <p>
                Such requests must be submitted in writing to the email address provided in Clause 9.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">8. Children’s Privacy</h2>
              <p>
                The services provided by Insightica are not intended for individuals under the age of 18. The Company does not knowingly collect data from minors. If it is brought to our attention that such data has been collected inadvertently, the Company shall take prompt action to delete the same.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">9. Grievance Officer and Contact Information</h2>
              <p>
                In accordance with the Information Technology Act, 2000, and the rules made thereunder, the name and contact details of the Grievance Officer are as follows:
              </p>
              <ul className="list-none pl-0 space-y-1">
                <li><strong>Name:</strong> Anuj Wani</li>
                <li><strong>Email:</strong> <a href="mailto:contact.insightica@gmail.com" className="text-accent hover:underline">contact.insightica@gmail.com</a></li>
                <li><strong>Address:</strong> H. No. 65 and 66, 3rd Floor, Jain Road, Gali No. 19, Uttam Nagar, New Delhi, West Delhi- 110059, India</li>
              </ul>
              <p>
                The Grievance Officer shall address complaints within the timeline prescribed under applicable law.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">10. Modifications to the Policy</h2>
              <p>
                The Company reserves the right to amend, modify, or revise this Policy at any time without prior notice. Any such changes shall be posted on the Platform and shall become effective upon publication. The User’s continued use of the Platform after such modifications shall constitute their acceptance of the revised Policy.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">11. Governing Law and Jurisdiction</h2>
              <p>
                This Privacy Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the competent courts located in New Delhi.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">12. Acceptance of Terms</h2>
              <p>
                By using the Platform, the User signifies their acceptance of this Privacy Policy. If the User does not agree with the terms of this Policy, they are advised to refrain from using the Platform.
              </p>
            </div>

            <div className="mt-12 text-center">
              <Button variant="link" asChild>
                <Link href="/" className="text-accent hover:text-accent text-lg">
                  &larr; Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
