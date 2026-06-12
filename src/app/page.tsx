import { Contribute } from "@/components/landing/contribute";
import { Features } from "@/components/landing/features";
import { GrainOverlay } from "@/components/landing/grain-overlay";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { TemplateCarousel } from "@/components/landing/template-carousel";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col overflow-x-clip">
      <GrainOverlay />
      <Hero />
      <Features />
      <TemplateCarousel />
      <Contribute />
      <SiteFooter />
    </main>
  );
}
