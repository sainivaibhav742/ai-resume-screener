"use client";

import { Inter, Playfair_Display, Roboto_Slab, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatAssistant from "../components/ChatAssistant";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { AuthProvider } from "../contexts/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700'],
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
  weight: ['400', '700'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Hide footer on dashboard and all portal pages
  const isDashboard = pathname?.includes('/dashboard') || 
                      pathname?.startsWith('/candidate/') || 
                      pathname?.startsWith('/recruiter/') || 
                      pathname?.startsWith('/admin/');
  
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${robotoSlab.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <ChatAssistant />
          {!isDashboard && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
