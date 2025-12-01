'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <WhyMugaSection />
      <WeaveJourneySection />
      <ArtisansSection />
      <ProductCollectionSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <AssamExperienceSection />
      <ImpactSection />
      <FinalCTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-silk-cream via-white to-muga-gold/20">
      <div className="absolute inset-0 silk-texture opacity-30" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,183,124,0.1),transparent_50%)]" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-muga-gold/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-silk-cream rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-charcoal leading-none tracking-tight">
            MUGA WORLD
          </h1>

          <p className="text-2xl md:text-3xl text-charcoal/70 font-light tracking-wide max-w-3xl mx-auto">
            Where Assam's Heritage Becomes Modern Luxury.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/about">
              <Button
                size="lg"
                className="bg-charcoal hover:bg-charcoal/90 text-white font-medium px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
              >
                Explore Craftsmanship
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-medium px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
              >
                Shop Muga
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-charcoal/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-charcoal/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function WhyMugaSection() {
  const lines = [
    "Born from the Soil of Assam.",
    "Woven with Hands that Carry Generations.",
    "Crafted to Last a Lifetime."
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-charcoal overflow-hidden">
      <div className="absolute inset-0 silk-texture opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <div className="space-y-12">
          <h2 className="text-5xl md:text-6xl font-bold text-muga-gold mb-16">
            Why Muga is Gold
          </h2>

          {lines.map((line, index) => (
            <div
              key={index}
              className="opacity-0 animate-stagger-fade-in"
              style={{ animationDelay: `${index * 0.3}s`, animationFillMode: 'forwards' }}
            >
              <p className="text-3xl md:text-4xl text-silk-cream font-light leading-relaxed tracking-wide">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes stagger-fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-stagger-fade-in {
          animation: stagger-fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
}

function WeaveJourneySection() {
  const journeySteps = [
    { title: 'Cocoon', description: 'Golden threads begin their journey in nature\'s embrace' },
    { title: 'Yarn', description: 'Skilled hands transform silk into delicate strands' },
    { title: 'Dye', description: 'Natural colors bring life to ancient traditions' },
    { title: 'Weave', description: 'The loom dances as patterns emerge' },
    { title: 'Fashion', description: 'Heritage meets contemporary elegance' }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-silk-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-6xl font-bold text-charcoal text-center mb-20">
          The Weave Journey
        </h2>

        <div className="flex overflow-x-auto gap-8 pb-8 scrollbar-hide snap-x snap-mandatory">
          {journeySteps.map((step, index) => (
            <div
              key={index}
              className="min-w-[80vw] md:min-w-[400px] h-[500px] relative group snap-center"
            >
              <div className="h-full bg-gradient-to-br from-muga-gold/20 to-silk-cream rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="absolute top-8 left-8 text-8xl font-bold text-muga-gold/20">
                  {index + 1}
                </div>

                <h3 className="text-4xl font-bold text-charcoal mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-charcoal/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtisansSection() {
  const artisans = [
    { name: 'Rita Das', role: '19 years weaving Muga in Sualkuchi', village: 'Sualkuchi' },
    { name: 'Ramen Nath', role: 'Master dyer, 3rd generation craftsman', village: 'Kamrup' },
    { name: 'Malati Bora', role: 'Silk spinner and pattern keeper', village: 'Majuli' },
    { name: 'Keshab Gogoi', role: 'Loom craftsman for 25 years', village: 'Jorhat' }
  ];

  return (
    <section className="relative py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-6xl font-bold text-charcoal text-center mb-20">
          Artisans of Assam
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {artisans.map((artisan, index) => (
            <div
              key={index}
              className="group relative h-80 bg-gradient-to-br from-silk-cream to-muga-gold/30 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-charcoal/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-muga-gold mb-4">
                  {artisan.name}
                </h3>
                <p className="text-xl text-silk-cream mb-2">
                  {artisan.role}
                </p>
                <p className="text-lg text-silk-cream/70">
                  {artisan.village}, Assam
                </p>
              </div>

              <div className="p-8 flex items-end h-full">
                <div>
                  <p className="text-2xl font-bold text-charcoal">
                    {artisan.name}
                  </p>
                  <p className="text-sm text-charcoal/60 mt-2">
                    Hover to learn more
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

function ProductCollectionSection({ activeFilter, setActiveFilter }: { activeFilter: string, setActiveFilter: (filter: string) => void }) {
  const filters = ['all', 'Pure Muga', 'Natural Dye', 'Golden Weave', 'Specialty'];

  const products = [
    { name: 'Classic Muga Mekhela', category: 'Pure Muga', price: '₹15,000' },
    { name: 'Natural Dye Stole', category: 'Natural Dye', price: '₹8,500' },
    { name: 'Golden Weave Saree', category: 'Golden Weave', price: '₹25,000' },
    { name: 'Heritage Shawl', category: 'Specialty', price: '₹12,000' },
    { name: 'Traditional Chaddar', category: 'Pure Muga', price: '₹18,000' },
    { name: 'Contemporary Dupatta', category: 'Golden Weave', price: '₹9,500' }
  ];

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <section className="relative py-32 bg-gradient-to-b from-silk-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-6xl font-bold text-charcoal text-center mb-12">
          Product Collection
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-charcoal border-2 border-charcoal/20 hover:border-charcoal'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="group relative h-[500px] bg-gradient-to-br from-white to-silk-cream rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
            >
              <div className="absolute top-6 right-6 z-10">
                <button className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-charcoal" />
                </button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-muga-gold/30 to-transparent group-hover:scale-110 transition-transform duration-700" />

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent">
                <h3 className="text-2xl font-bold text-charcoal mb-2">
                  {product.name}
                </h3>
                <p className="text-lg text-charcoal/60 mb-3">
                  {product.category}
                </p>
                <p className="text-3xl font-bold text-muga-gold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-charcoal hover:bg-charcoal/90 text-white font-medium px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
            >
              View Full Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AssamExperienceSection() {
  const experiences = [
    { title: 'Tea Gardens', color: 'from-tea-green to-tea-green/60' },
    { title: 'Majuli Masks', color: 'from-accent-red to-accent-red/60' },
    { title: 'Ahom Motifs', color: 'from-muga-gold to-muga-gold/60' },
    { title: 'Brahmaputra Evenings', color: 'from-tea-green/80 to-muga-gold/60' }
  ];

  return (
    <section className="relative py-32 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-6xl font-bold text-muga-gold text-center mb-20">
          Assam Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative h-80 bg-gradient-to-br ${exp.color} rounded-3xl overflow-hidden group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white text-center px-8">
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

function ImpactSection() {
  const stats = [
    { number: '500+', label: 'Artisan Families Supported' },
    { number: '100%', label: 'Natural & Sustainable' },
    { number: '50+', label: 'Villages Empowered' },
    { number: '25', label: 'Years of Heritage' }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-silk-cream via-white to-muga-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-6xl font-bold text-charcoal text-center mb-12">
          Craft That Sustains Culture, Nature & Communities.
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-muga-gold mb-4">
                {stat.number}
              </div>
              <p className="text-lg text-charcoal/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal via-charcoal to-tea-green">
      <div className="absolute inset-0 silk-texture opacity-20" />

      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-muga-gold/20 to-transparent animate-wave" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="space-y-10">
          <Sparkles className="w-16 h-16 text-muga-gold mx-auto mb-8" />

          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Begin Your Muga Journey
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-muga-gold hover:bg-muga-gold/90 text-charcoal font-medium px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
              >
                Shop Muga Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-charcoal font-medium px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
              >
                Visit Assam Store
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-muga-gold text-muga-gold hover:bg-muga-gold hover:text-charcoal font-medium px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
              >
                Custom Weave Inquiry
              </Button>
            </Link>
          </div>

          <p className="text-2xl text-silk-cream font-light tracking-wide pt-12">
            Muga World — A Fabric, A Legacy.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-20px) scaleY(1.1); }
        }
        .animate-wave {
          animation: wave 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
