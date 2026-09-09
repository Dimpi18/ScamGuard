import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScamGuard — Personal Scam Defense",
  description:
    "Free, private scam analysis. Paste a suspicious message, upload a screenshot, or check a link — get an instant threat report explaining how the scam works and what to do.",
  keywords: [
    "scam detector",
    "phishing checker",
    "scam analysis",
    "fraud prevention",
    "suspicious link checker",
  ],
  openGraph: {
    title: "ScamGuard — Don't just detect the scam. Understand the attack.",
    description:
      "Free, anonymous scam analysis tool. Paste suspicious messages, upload screenshots, or check links for instant threat reports.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} light`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent dark mode flash — sets class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('scamguard-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
