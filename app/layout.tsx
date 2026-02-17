import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shadow Board AI — Your Vision Board is Lying to You",
  description: "Your browser history reveals what you're ACTUALLY manifesting. Get your brutal truth in 60 seconds.",
  openGraph: {
    title: "Shadow Board AI — Your Vision Board is Lying to You",
    description: "Your browser history reveals what you're ACTUALLY manifesting.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadow Board AI",
    description: "Your browser history reveals what you're ACTUALLY manifesting.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0A0A0A', color: '#F5F0E8' }}>
        {children}
      </body>
    </html>
  );
}