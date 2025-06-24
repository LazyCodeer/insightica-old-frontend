
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/30 py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4 md:px-6">
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
          </div>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Twitter" className="hover:text-accent transition-colors"><Twitter size={20} /></Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors"><Linkedin size={20} /></Link>
            <Link href="#" aria-label="GitHub" className="hover:text-accent transition-colors"><Github size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
