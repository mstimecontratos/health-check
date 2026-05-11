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
      <body>{children}</body>
    </html>
  );
}
