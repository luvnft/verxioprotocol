import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: "Verxio Protocol",
  description: "On-chain loyalty and rewards system that combines gamified engagement and achievement tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} font-open-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
