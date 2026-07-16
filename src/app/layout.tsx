import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GYMLABS Admin Console",
  description: "High-performance administrative environment for GYMLABS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${hanken.variable} ${geistMono.variable} h-full w-full antialiased dark`}
    >
      <body className="min-h-full w-full bg-background text-text-main flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
