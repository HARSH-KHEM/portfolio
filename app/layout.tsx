import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_ROLE, SITE_DESCRIPTION } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Harsh Khem | Software Engineer, Full-Stack and GenAI Developer",
    template: "%s | Harsh Khem",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Harsh Khem | Software Engineer, Full-Stack and GenAI Developer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Khem | Software Engineer, Full-Stack and GenAI Developer",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: SITE_ROLE,
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Delhi Technological University",
  },
  sameAs: [
    "https://github.com/HARSH-KHEM",
    "https://www.linkedin.com/in/harsh-khem-76b76a345/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="bg-black antialiased font-sans">{children}</body>
    </html>
  );
}
