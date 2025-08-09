import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider, AuthProvider, ClientLayout } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mumii - Discover Hidden Culinary Gems",
  description:
    "Smart food tourism planner with mood-based recommendations, interactive maps, and exciting challenges to explore local cuisine",
  keywords:
    "food, restaurant, travel, cuisine, hidden gems, vietnam, recommendations",
  authors: [{ name: "Mumii Team" }],
  creator: "Mumii Team",
  publisher: "Mumii",
  manifest: "/manifest.json",
  metadataBase: new URL("http://localhost:3000"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mumii",
  },
  openGraph: {
    type: "website",
    siteName: "Mumii",
    title: "Mumii - Discover Hidden Culinary Gems",
    description: "Smart food tourism planner with exciting challenges",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mumii Food Adventure App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mumii - Discover Hidden Culinary Gems",
    description: "Smart food tourism planner with exciting challenges",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <AuthProvider>
          <I18nProvider>
            <div className="min-h-screen flex flex-col">
              <ClientLayout>{children}</ClientLayout>
            </div>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
