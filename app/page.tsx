import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { Hero } from "@/components/hero/Hero";
import { Pillars } from "@/components/Pillars";
import { Credibility } from "@/components/Credibility";
import { CtaClose } from "@/components/CtaClose";
import { Footer } from "@/components/Footer";
import { DesktopOnly } from "@/components/DesktopOnly";

export default function Page() {
  return (
    <DesktopOnly>
      <main className="min-h-screen">
        <Nav />
        <Problem />
        <div id="story">
          <Hero />
        </div>
        <Pillars />
        <Credibility />
        <CtaClose />
        <Footer />
      </main>
    </DesktopOnly>
  );
}
