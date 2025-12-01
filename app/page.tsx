'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <SplitHeroSection />
      <ExperienceStrip />
      <ServicesGrid />
      <LoopingTextStrip />
      <CaseStudiesSnap />
      <CultureParallax />
    </div>
  );
}

function SplitHeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center grain-texture bg-[#F8EDD3] dark:bg-[#1D1D1D] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,183,124,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-32">
        <div className="flex flex-col items-center text-center space-y-16">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <img src="/PNG copy copy.png" alt="MUGA WORLD" className="w-20 h-20 object-contain mx-auto mb-12 opacity-80" />
          </div>

          <div className="space-y-6">
            {['MUGA', 'WORLD'].map((word, idx) => (
              <h1
                key={word}
                className={`font-light text-[#1D1D1D] dark:text-[#FFFEF2] leading-none tracking-tight transition-all duration-1000 delay-${idx * 150}`}
                style={{
                  fontSize: 'clamp(64px, 12vw, 140px)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${idx * 0.15}s`
                }}
              >
                {word}
              </h1>
            ))}
          </div>

          <p
            className={`text-2xl md:text-3xl font-light text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 max-w-2xl transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            Culture-led Design Studio from Assam.
          </p>

          <div
            className={`flex flex-wrap items-center justify-center gap-6 pt-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <Link href="/about">
              <Button
                size="lg"
                className="group bg-[#1D1D1D] dark:bg-[#FFFEF2] hover:bg-[#D9B77C] dark:hover:bg-[#D9B77C] text-white dark:text-[#1D1D1D] font-medium px-8 py-6 text-base rounded-full cinematic-transition hover:scale-105 shadow-lg"
              >
                View Work
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 cinematic-transition" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-[#1D1D1D] dark:border-[#FFFEF2] text-[#1D1D1D] dark:text-[#FFFEF2] hover:bg-[#1D1D1D] hover:text-white dark:hover:bg-[#FFFEF2] dark:hover:text-[#1D1D1D] font-medium px-8 py-6 text-base rounded-full cinematic-transition hover:scale-105"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-[#1D1D1D]/30 dark:border-[#FFFEF2]/30 rounded-full p-1">
          <div className="w-1.5 h-2 bg-[#D9B77C] rounded-full mx-auto animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}

function ExperienceStrip() {
  const experiences = [
    { title: 'Brand Systems', icon: '◆' },
    { title: 'Culture-led Design', icon: '✦' },
    { title: 'Digital Identity', icon: '◇' }
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-black border-y border-[#E6E6E6] dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-3xl border border-[#E6E6E6] dark:border-[#2A2A2A] bg-gradient-to-br from-white to-[#F8EDD3]/10 dark:from-[#1D1D1D] dark:to-[#D9B77C]/5 cinematic-transition hover:scale-[1.06] hover:shadow-2xl hover:border-[#D9B77C]/50 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D9B77C]/0 to-[#D9B77C]/10 opacity-0 group-hover:opacity-100 cinematic-transition rounded-3xl"></div>
              <div className="relative">
                <div className="text-5xl mb-6 text-[#D9B77C] cinematic-transition group-hover:scale-110 inline-block">
                  {exp.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1D] dark:text-[#FFFEF2]">
                  {exp.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesGrid() {
  const services = [
    { title: 'Brand Identity', desc: 'Visual systems that define your essence', size: 'large' },
    { title: 'Digital Experience', desc: 'Interfaces that feel alive', size: 'large' },
    { title: 'Strategy', desc: 'Culture-first thinking', size: 'large' },
    { title: 'Packaging Design', desc: 'Tactile brand expressions', size: 'small' },
    { title: 'Creative Campaigns', desc: 'Stories that resonate', size: 'small' }
  ];

  return (
    <section className="relative py-32 bg-[#F8EDD3] dark:bg-[#1D1D1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="mb-20 text-center">
          <h2 className="text-5xl md:text-7xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] mb-6">
            What We Do
          </h2>
          <div className="w-24 h-1 bg-[#D9B77C] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service, idx) => (
            <ServiceCard key={idx} service={service} index={idx} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {services.slice(3).map((service, idx) => (
            <ServiceCard key={idx + 3} service={service} index={idx + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative p-10 md:p-12 rounded-3xl border-2 border-[#E6E6E6] dark:border-[#2A2A2A] bg-white dark:bg-black overflow-hidden cinematic-transition hover:border-[#D9B77C] hover:scale-[1.02] cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        minHeight: service.size === 'large' ? '340px' : '280px'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#D9B77C]/0 via-[#D9B77C]/5 to-[#D9B77C]/10 opacity-0 group-hover:opacity-100 cinematic-transition"></div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="text-6xl md:text-7xl font-bold text-[#D9B77C]/10 dark:text-[#D9B77C]/20 mb-4 group-hover:scale-110 cinematic-transition">
            {String(index + 1).padStart(2, '0')}
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold text-[#1D1D1D] dark:text-[#FFFEF2] mb-4 group-hover:text-[#D9B77C] cinematic-transition">
            {service.title}
          </h3>
        </div>
        <p className="text-lg text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 leading-relaxed">
          {service.desc}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 cinematic-transition">
        <ArrowUpRight className="w-8 h-8 text-[#D9B77C]" />
      </div>
    </div>
  );
}

function LoopingTextStrip() {
  return (
    <section className="relative py-8 bg-[#D9B77C] border-y-2 border-[#1D1D1D] dark:border-[#FFFEF2] overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-3xl md:text-4xl font-bold text-[#1D1D1D] mx-8">
              WE DESIGN FOR BRANDS
            </span>
            <span className="text-3xl md:text-4xl text-[#1D1D1D]">·</span>
            <span className="text-3xl md:text-4xl font-bold text-[#1D1D1D] mx-8">
              CULTURE
            </span>
            <span className="text-3xl md:text-4xl text-[#1D1D1D]">·</span>
            <span className="text-3xl md:text-4xl font-bold text-[#1D1D1D] mx-8">
              IMPACT
            </span>
            <span className="text-3xl md:text-4xl text-[#1D1D1D]">·</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaseStudiesSnap() {
  const cases = [
    {
      title: 'Heritage Weaves',
      category: 'Brand Identity',
      description: 'Reimagining Assamese textiles through contemporary visual language',
      gradient: 'from-[#F8EDD3] via-[#D9B77C]/30 to-[#3A614A]/20'
    },
    {
      title: 'Tea Tales',
      category: 'Digital Experience',
      description: 'An immersive journey through Assam\'s tea heritage',
      gradient: 'from-[#3A614A]/30 via-[#D9B77C]/20 to-[#F8EDD3]'
    },
    {
      title: 'Majuli Makers',
      category: 'Cultural Campaign',
      description: 'Amplifying indigenous artistry through strategic storytelling',
      gradient: 'from-[#D9B77C]/40 via-[#F8EDD3] to-[#D9B77C]/20'
    }
  ];

  return (
    <section id="work" className="relative bg-white dark:bg-black snap-y snap-mandatory">
      {cases.map((project, idx) => (
        <CaseCard key={idx} project={project} index={idx} />
      ))}
    </section>
  );
}

function CaseCard({ project, index }: { project: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="snap-start min-h-screen flex items-center py-24 border-b border-[#E6E6E6] dark:border-[#2A2A2A] last:border-b-0"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`relative h-[500px] rounded-3xl bg-gradient-to-br ${project.gradient} overflow-hidden cinematic-transition ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-[#1D1D1D]/5 dark:text-white/5">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className={`cinematic-transition ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-[#D9B77C]/20 text-[#D9B77C] text-sm font-medium">
              {project.category}
            </div>
            <h3 className="text-5xl md:text-7xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] mb-6 leading-tight">
              {project.title}
            </h3>
            <p className="text-xl text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 mb-10 leading-relaxed">
              {project.description}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-lg font-medium text-[#1D1D1D] dark:text-[#FFFEF2] group"
            >
              <span className="relative">
                View Case Study
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D9B77C] group-hover:w-full cinematic-transition"></span>
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 cinematic-transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CultureParallax() {
  const images = [
    { title: 'Tea Gardens of Assam', speed: 0.5 },
    { title: 'Loom Artistry', speed: 0.7 },
    { title: 'Traditional Masks', speed: 0.6 },
    { title: 'Brahmaputra River', speed: 0.8 }
  ];

  return (
    <section className="relative py-32 bg-[#1D1D1D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-light text-[#FFFEF2] mb-6">
            Rooted in Culture
          </h2>
          <p className="text-xl text-[#FFFEF2]/70 max-w-2xl mx-auto">
            Every design carries the spirit of Assam
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative h-[450px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#D9B77C]/20 to-[#3A614A]/30"
            >
              <div className="absolute inset-0 cinematic-transition group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D] via-[#1D1D1D]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xl font-light italic text-[#FFFEF2]">
                    {img.title}
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
