import type { Metadata } from "next";
import "./globals.css";
import "./theme-modern.css";
import "./theme-layout.css";


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
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
