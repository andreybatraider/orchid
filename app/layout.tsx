import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, fontPlay } from "@/config/fonts";
import { ConditionalNavbar } from "@/components/conditional-navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="ru">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-play antialiased", // font-sans или font-play (см. ниже)
          fontSans.variable,
          fontPlay.variable, // Добавляем переменную Play
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ConditionalNavbar>
            {children}
          </ConditionalNavbar>
        </Providers>
      </body>
    </html>
  );
}