import "@/css/tailwind.css";
import "pliny/search/algolia.css";

import { Space_Grotesk } from "next/font/google";
import siteMetadata from "@/data/siteMetadata";
import { Metadata } from "next";
import { dir } from "i18next";
import { locales, LocaleTypes } from "@/i18n/settings";
import { createTranslation } from "@/i18n/server";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/contexts/AppContext";
import Body from "../../templates/humanizeai-pro/Body";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk"
});

export async function generateMetadata({ params: { locale } }): Promise<Metadata> {
  const { t } = await createTranslation(locale, "home");
  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: t("metadata.title", { name: t("metadata.name") }),
      template: `%s | ${t("metadata.title", { name: t("metadata.name") })}`
    },
    description: t("metadata.description", { name: t("metadata.name") }),
    openGraph: {
      title: t("metadata.title", { name: t("metadata.name") }),
      description: t("metadata.description", { name: t("metadata.name") }),
      url: "./",
      siteName: t("metadata.title", { name: t("metadata.name") }),
      images: [siteMetadata.socialBanner],
      locale: locale,
      type: "website"
    },
    alternates: {
      // canonical: './', // 后面会多个 en
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    twitter: {
      title: t("metadata.title", { name: t("metadata.name") }),
      description: t("metadata.description", { name: t("metadata.name") }),
      site: siteMetadata.siteUrl,
      creator: siteMetadata.author,
      card: "summary_large_image",
      images: [siteMetadata.socialBanner]
    }
  };
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: LocaleTypes }
}) {
  let body = <Body locale={locale}>{children}</Body>
  if (process.env.NEXT_PUBLIC_CLERK_ENABLED) {
    body = (
      <AppContextProvider>
        {body}
      </AppContextProvider>
    );
  }

  const html = (
    <html lang={locale} dir={dir(locale)} className={`${space_grotesk.variable} scroll-smooth`} suppressHydrationWarning>
    <meta name="msapplication-TileColor" content="#000000" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
    <head>
      {/*<link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png"/>*/}
      {/*<link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png"/>*/}
      {/*<link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png"/>*/}
      {/*<link rel="manifest" href="/static/favicons/site.webmanifest"/>*/}
      {/*<link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5"/>*/}
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <link rel="icon" type="image/png" href={siteMetadata.favicon} />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" integrity="sha384-4LISF5TTJX/fLmGSxO53rV4miRxdg84mZsxmO8Rx5jGtp/LbrixFETvWa5a6sESd" crossOrigin="anonymous" />
      {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`} crossOrigin="anonymous"></script>}
    </head>
    {body}
    </html>
  );

  if (process.env.NEXT_PUBLIC_CLERK_ENABLED) {
    return (
      <ClerkProvider afterSignOutUrl={`/sign-out`} signInUrl={`/sign-in`} signUpUrl={`/sign-up`} afterSignInUrl={`/`}>
        {html}
      </ClerkProvider>
    );
  }
  return html;
}
