import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Check Jurídico · Diagnóstico de Risco para Redes",
  description:
    "Avalie a maturidade jurídica da sua rede em 5 dimensões críticas e receba um diagnóstico personalizado.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
