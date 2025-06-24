
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
        <title>Reddit</title>
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.34.34 0 0 1 .238-.042l2.906.617a1.25 1.25 0 0 1 1.153-.242zM12 15.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm-2.8-3c0 .718.231 1.379.608 1.908a2.83 2.83 0 0 1-.608-.908c0-.718.231-1.379.608-1.908a2.83 2.83 0 0 1-.608.908z"/>
    </svg>
);


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/30 py-8 text-center text-muted-foreground">
      <div className="mx-auto px-4 md:px-6">
        <div className="mb-4">
          <p className="text-sm">
            &copy; {currentYear} Insightica. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4 md:mb-0">
            <Link href="/privacy-policy" className="text-sm font-semibold hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-sm font-semibold hover:text-accent transition-colors">Terms and Conditions</Link>
            <Link href="/forms/work-with-us" className="text-sm font-semibold hover:text-accent transition-colors">Work with Us</Link>
            <Link href="/forms/feedback" className="text-sm font-semibold hover:text-accent transition-colors">Feedback</Link>
            <Link href="/forms/invest" className="text-sm font-semibold hover:text-accent transition-colors">Invest</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Twitter" className="hover:text-accent transition-colors"><Twitter size={20} /></Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors"><Linkedin size={20} /></Link>
            <Link href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram size={20} /></Link>
            <Link href="#" aria-label="Reddit" className="hover:text-accent transition-colors"><RedditIcon style={{ width: 20, height: 20 }} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
