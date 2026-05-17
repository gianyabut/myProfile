import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Gian Carlo Yabut | Full Stack Developer",
  description: "Enterprise-grade Full Stack Developer based in Manila, PH. 13+ years building billing systems, eHealth platforms, and SAAS applications.",
  openGraph: {
    title: "Gian Carlo Yabut | Full Stack Developer",
    description: "Enterprise Full Stack Developer — Manila, PH",
    url: "https://gianyabut.github.io/myProfile",
    images: [{ url: "/hero.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gian Carlo Yabut | Full Stack Developer",
    images: ["/hero.png"],
  },
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
