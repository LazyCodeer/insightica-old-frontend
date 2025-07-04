import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <title>Discord</title>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
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
            <Link
              href="/privacy-policy"
              className="text-sm font-semibold hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm font-semibold hover:text-accent transition-colors"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/forms/work-with-us"
              className="text-sm font-semibold hover:text-accent transition-colors"
            >
              Work with Us
            </Link>
            <Link
              href="/forms/feedback"
              className="text-sm font-semibold hover:text-accent transition-colors"
            >
              Feedback
            </Link>
            <Link
              href="/forms/invest"
              className="text-sm font-semibold hover:text-accent transition-colors"
            >
              Invest
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://x.com/Insightica32861"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-accent transition-colors"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/insightica-in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-accent transition-colors"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="https://www.instagram.com/insightica_official/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-accent transition-colors"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://discord.com/invite/PTCWzMd5YD"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="hover:text-accent transition-colors"
            >
              <DiscordIcon style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
