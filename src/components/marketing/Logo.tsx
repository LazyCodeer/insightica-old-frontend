import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { useState, useEffect } from "react";

const Logo = () => {
  const [clipPct, setClipPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = 100; // px to fully hide
      const pct = Math.min(window.scrollY / max, 1);
      setClipPct(pct);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      href="/"
      className="flex items-center space-x-2 text-2xl font-bold text-accent hover:text-accent/90 transition-colors"
    >
      <Image src={logo} alt="Insightica Logo" width={32} height={32} />
      <span
        style={{
          clipPath: `inset(0 ${clipPct * 100}% 0 0)`,
          transition: "clip-path 0.2s linear",
          display: "inline-block",
        }}
      >
        Insightica
      </span>
    </Link>
  );
};

export default Logo;
