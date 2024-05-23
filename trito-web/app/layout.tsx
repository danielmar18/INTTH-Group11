import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";   
import "./globals.css";
import ConvexClientProvider from "../providers/ConvexClientProvider";
import AblyReactProvider from "../providers/AblyClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trito | Aahus University",
  description: "IoT-based Environment Monitoring System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConvexClientProvider>
        <AblyReactProvider>
          <body className={inter.className}>
            <div className="h-screen w-screen relative"> 
              {children}
            </div>
            <Analytics />
          </body>
        </AblyReactProvider>
      </ConvexClientProvider>
    </html>
  );
}
