import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./theme-modern.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "FOPOS • Öğretmen Çalışma Alanı",
  description: "Türkiye Yüzyılı Maarif Modeli ile uyumlu, yapay zekâ destekli pedagojik işletim sistemi.",
  manifest: "/manifest.webmanifest",
  themeColor: "#2F2A9E",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/fopos-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={jakarta.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
