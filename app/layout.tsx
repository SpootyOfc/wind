import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RiseShop Discord Manager",
  description: "Painel de configuracao e deploy para site + bot Discord."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
