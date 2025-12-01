import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ZYRAH - Simple & Elegant Indian Wear",
  description: "Effortless elegance in contemporary Indian silhouettes. Simple sophistication for the modern woman.",
  openGraph: {
    images: [
      {
        url: "/assets/meta-image.png", // ✔ your meta image path
        width: 1200,
        height: 630,
        alt: "ZYRAH Meta Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/meta-image.png"], // ✔ same image for Twitter
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-body antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
