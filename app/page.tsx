import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { Credibility } from "@/components/Credibility";
import { CtaClose } from "@/components/CtaClose";
import { Footer } from "@/components/Footer";
import { DesktopOnly } from "@/components/DesktopOnly";

export default function Page() {
  return (
    <DesktopOnly>
      <main className="min-h-screen">
        <Nav />
        <div id="story">
          <Hero />
        </div>
        <Credibility />
        <CtaClose />
        <Footer />
      </main>
    </DesktopOnly>
  );
}
