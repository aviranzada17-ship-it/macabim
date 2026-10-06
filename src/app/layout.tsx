import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "המכבים | תוכנית הכנה לצבא",
  description: "מערכת מעקב והתקדמות חניכים – תוכנית המכבים",
  icons: {
    icon: "/branding/logo-navy.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
