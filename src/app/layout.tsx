import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider
import { AosProvider } from "@/components/AosProvider";

export const metadata: Metadata = {
  title: "Insightica - Clarity Over Chaos, Insights Over Noise",
  description:
    "AI-powered financial analysis for data-driven trading insights. Explore historical performance, predict indicator effectiveness, and backtest strategies.",
  icons: {
    icon: [
      { url: "assets/logo.svg", type: "image/svg+xml" },
    ],
    apple: "assets/logo.svg",
    shortcut: "assets/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/logo.svg" type="image/svg+xml" />
      </head>
      <body className="font-body antialiased">
        <AosProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </AosProvider>
      </body>
    </html>
  );
}
