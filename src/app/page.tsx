import { Events } from "@/components/Events";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Impact } from "@/components/Impact";
import { Join } from "@/components/Join";
import { Mission } from "@/components/Mission";
import { Patron } from "@/components/Patron";
import { SectionChanged } from "@/components/SectionChanged";
import { Stats } from "@/components/Stats";
import { Voices } from "@/components/Voices";
import { WhatIs } from "@/components/WhatIs";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SectionChanged />
        <WhatIs />
        <Mission />
        <Impact />
        <Stats />
        <Events />
        <Patron />
        <Voices />
        <Join />
      </main>
      <Footer />
    </>
  );
}
