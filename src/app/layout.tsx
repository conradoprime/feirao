import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conrado Prime Imóveis — Grande Feirão MCMV e Morar Bem",
  description:
    "Cadastre-se no grande feirão da Conrado Prime Imóveis. Empreendimentos MCMV e Morar Bem com condições especiais.",
  icons: {
    icon: "/conrado-prime-logo.png",
    shortcut: "/conrado-prime-logo.png",
    apple: "/conrado-prime-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
