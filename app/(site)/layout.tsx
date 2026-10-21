import { Suspense } from "react";
import { Footer } from "@/components/site/footer";
import { Header, HeaderRoute } from "@/components/site/header";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { Preloader } from "@/components/site/preloader";
import { QuoteProvider } from "@/components/site/quote-provider";
import { TopBar } from "@/components/site/top-bar";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { getSettings } from "@/lib/data/public";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <QuoteProvider>
      <Preloader />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow-lift"
      >
        Skip to content
      </a>
      <TopBar />
      <Suspense fallback={<Header phone={settings.phone} whatsapp={settings.whatsapp} pathname={null} />}>
        <HeaderRoute phone={settings.phone} whatsapp={settings.whatsapp} />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab whatsapp={settings.whatsapp} />
      <MobileActionBar phone={settings.phone} whatsapp={settings.whatsapp} />
    </QuoteProvider>
  );
}
