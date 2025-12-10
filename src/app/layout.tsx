import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Finder Force | Awards Platform",
  description: "Submit and judge entries for the Finder Force Innovation Awards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-midnight-950 text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

