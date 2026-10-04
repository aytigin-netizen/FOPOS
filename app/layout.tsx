import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "FOPOS v47 • Güvenli Öğretmen Çalışma Alanı",
  description: "Türkiye Yüzyılı Maarif Modeli ile uyumlu, yapay zekâ destekli pedagojik işletim sistemi.",
  manifest: "/manifest.webmanifest",
  themeColor: "#172925",
  other: {
    "codex-preview": "development",
  },
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
