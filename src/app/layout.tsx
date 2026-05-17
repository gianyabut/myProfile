import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Gian Carlo Yabut | Full Stack Developer",
  description: "High-End Tech Noir Minimalist Portfolio of Gian Carlo Yabut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
