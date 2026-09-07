import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OAK Partner Convening 2026",
    template: "%s | OAK Partner Convening 2026",
  },
  description:
    "Registration and attendance platform for the OAK Zimbabwe Foundation Partner Gathering — Cresta Lodge, Msasa, Harare. 9–11 November 2026.",
  keywords: [
    "OAK Foundation",
    "Partner Gathering",
    "Zimbabwe",
    "Registration",
    "Cresta Lodge",
  ],
  authors: [{ name: "Uncommon.org" }],
  openGraph: {
    title: "OAK Partner Convening 2026",
    description:
      "Registration and attendance platform for the OAK Zimbabwe Foundation Partner Gathering.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#162E55",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=chillax@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/chillax"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
