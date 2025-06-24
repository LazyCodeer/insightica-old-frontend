import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-accent hover:text-accent/90 transition-colors">
      <span>Insightica</span>
    </Link>
  );
};

export default Logo;
