'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <BrandStatementSection />
      <ServicesStripSection />
      <CaseStudiesSection />
      <CultureImmersionSection />
      <FinalCTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center grain-texture bg-[#F8EDD3] dark:bg-[#1D1D1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 text-center py-20">
        <div className="space-y-12 animate-fade-in-up">
          <h1
            className="font-normal text-[#1D1D1D] dark:text-[#FFFEF2] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(64px, 10vw, 118px)' }}
          >
            MUGA WORLD
          </h1>

          <p className="text-[22px] font-medium text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 tracking-wide">
            Design · Culture · Strategy
          </p>

          <div className="pt-6">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-[#1D1D1D] dark:bg-[#D9B77C] hover:bg-[#1D1D1D]/90 dark:hover:bg-[#D9B77C]/90 text-white dark:text-[#1D1D1D] font-medium px-10 py-7 text-lg rounded-full cinematic-transition hover:scale-105"
              >
                Explore Our Capabilities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 opacity-60 animate-pulse" style={{ animationDuration: '1.2s' }}>
          <span className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFFEF2]">Scroll</span>
          <ChevronDown className="w-5 h-5 text-[#1D1D1D] dark:text-[#FFFEF2]" />
        </div>
      </div>
    </section>
  );
}

function BrandStatementSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const lines = [
    "We build identities.",
    "We shape visual cultures.",
    "We design systems that travel the world."
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-[#F8EDD3] dark:bg-[#1D1D1D]"
    >
      <div className="max-w-[820px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="space-y-8">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{
                animationDelay: isVisible ? `${index * 0.2}s` : '0s',
                animationFillMode: 'forwards'
              }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] leading-tight">
                {line.includes('visual cultures') ? (
                  <>
                    We shape <span className="relative inline-block">
                      visual cultures
                      <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[#D9B77C]"></span>
                    </span>.
                  </>
                ) : (
                  line
                )}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesStripSection() {
  const services = [
    { title: 'Brand Identity', subtitle: '+ Strategy' },
    { title: 'UI/UX', subtitle: '+ Web Systems' },
    { title: 'Packaging', subtitle: '+ Print' },
    { title: 'Design', subtitle: 'Consulting' },
    { title: 'Creative', subtitle: 'Campaigns' }
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border border-[#E6E6E6] dark:border-[#2A2A2A]">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden border-b sm:border-r border-[#E6E6E6] dark:border-[#2A2A2A] last:border-r-0 last:border-b-0 sm:last:border-b lg:border-b-0"
            >
              <div className="relative p-8 h-64 flex flex-col justify-center items-center text-center cinematic-transition group-hover:scale-[1.04] group-hover:bg-[#D9B77C]/5 dark:group-hover:bg-[#D9B77C]/10">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 cinematic-transition">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D9B77C]/10 to-transparent dark:from-[#D9B77C]/20 dark:to-transparent"></div>
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_#D9B77C] dark:shadow-[inset_0_0_0_1px_#D9B77C] opacity-30 dark:opacity-50"></div>
                </div>

                <h3 className="relative text-2xl font-semibold text-[#1D1D1D] dark:text-[#FFFEF2] mb-2">
                  {service.title}
                </h3>
                <p className="relative text-lg text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60">
                  {service.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection() {
  const caseStudies = [
    {
      title: 'Heritage Textiles',
      subtitle: 'Brand Identity & Packaging',
      description: 'Reimagining traditional Assamese weaving through contemporary visual language.',
      align: 'left'
    },
    {
      title: 'Urban Tea Co.',
      subtitle: 'Digital Experience Design',
      description: 'Creating a seamless e-commerce platform that honors tea ceremony traditions.',
      align: 'right'
    },
    {
      title: 'Majuli Arts',
      subtitle: 'Cultural Campaign',
      description: 'Amplifying indigenous artistry through strategic storytelling and design systems.',
      align: 'left'
    }
  ];

  return (
    <section className="relative bg-white dark:bg-black">
      {caseStudies.map((study, index) => (
        <CaseStudyFrame key={index} study={study} index={index} />
      ))}
    </section>
  );
}

function CaseStudyFrame({ study, index }: { study: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (frameRef.current) {
      observer.observe(frameRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isLeft = study.align === 'left';

  return (
    <div ref={frameRef} className="relative">
      <div className={`grid lg:grid-cols-2 min-h-[600px] ${!isLeft ? 'lg:grid-flow-dense' : ''}`}>
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${
            index === 0 ? 'from-[#F8EDD3] to-[#D9B77C]/30' :
            index === 1 ? 'from-[#3A614A]/20 to-[#3A614A]/5' :
            'from-[#D9B77C]/20 to-[#F8EDD3]'
          } ${!isLeft ? 'lg:col-start-2' : ''}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-[#1D1D1D]/5 dark:text-white/5">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center p-12 md:p-16 lg:p-20 bg-white dark:bg-black">
          <div
            className={`max-w-xl ${isVisible ? (isLeft ? 'animate-slide-in-left' : 'animate-slide-in-right') : 'opacity-0'}`}
          >
            <h3 className="text-5xl md:text-6xl font-semibold text-[#1D1D1D] dark:text-[#FFFEF2] mb-4 leading-tight">
              {study.title}
            </h3>
            <p className="text-xl md:text-2xl text-[#D9B77C] dark:text-[#D9B77C] mb-6 font-medium">
              {study.subtitle}
            </p>
            <p className="text-lg text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 mb-8 leading-relaxed">
              {study.description}
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 text-lg font-medium text-[#1D1D1D] dark:text-[#FFFEF2] hover:text-[#D9B77C] dark:hover:text-[#D9B77C] cinematic-transition group">
              See Details
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 cinematic-transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CultureImmersionSection() {
  const images = [
    { title: 'Muga Silk Threads', speed: 1 },
    { title: 'Sualkuchi Loom Work', speed: 0.7 },
    { title: 'Brahmaputra Dusk', speed: 0.5 }
  ];

  return (
    <section className="relative py-32 bg-[#F8EDD3] dark:bg-[#1D1D1D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <h2 className="text-5xl md:text-6xl font-semibold text-center text-[#1D1D1D] dark:text-[#FFFEF2] mb-20">
          Rooted in Culture
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9B77C]/30 to-[#3A614A]/20 dark:from-[#D9B77C]/20 dark:to-[#1D1D1D]"
            >
              <div className="absolute inset-0 cinematic-transition group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/80 via-[#1D1D1D]/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-2xl font-light italic text-[#FFFEF2]">
                    {image.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16 text-center py-32">
        <div className="space-y-12 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] leading-tight">
            Let's shape something unforgettable.
          </h2>

          <div className="pt-8">
            <Link href="/contact">
              <Button
                size="lg"
                className="relative bg-transparent hover:bg-transparent text-[#1D1D1D] dark:text-[#FFFEF2] font-medium px-12 py-7 text-xl border-0 group"
              >
                <span className="relative z-10">Work With Us</span>
                <span className="absolute bottom-2 left-0 right-0 h-0.5 bg-[#D9B77C] group-hover:h-1 cinematic-transition"></span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 cinematic-transition">
                  <span className="absolute bottom-2 left-0 right-0 h-8 bg-[#D9B77C]/10 blur-xl"></span>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
