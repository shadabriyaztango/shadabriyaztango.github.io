import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const googleSansCode = localFont({
  src: "../../public/fonts/Google_Sans_Code/GoogleSansCode-VariableFont_wght.ttf",
  variable: "--font-code",
  display: "swap",
});

const pressStart2P = localFont({
  src: "../../public/fonts/Press_Start_2P/PressStart2P-Regular.ttf",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shadab",
  description: "AI • Python • Generative Art",
  icons: {
    icon: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${googleSansCode.variable} ${pressStart2P.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
