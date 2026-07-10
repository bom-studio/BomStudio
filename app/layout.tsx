import { SiteShell } from "@/components/layout/SiteShell";
import { KakaoChatButton } from "@/components/kakao-chat-button";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { jsonLd, metadata } from "@/lib/metadata";
import Script from "next/script";
import "./fonts.css";
import "./globals.css";

export { metadata };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminUser = await getAdminUser();

  return (
    <html lang="ko" suppressHydrationWarning className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteShell isAdmin={Boolean(adminUser)}>{children}</SiteShell>
          <KakaoChatButton />
        </ThemeProvider>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
