import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Laptop, ArrowRight, Sparkles, Heart, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A34C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-gold mr-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Authentic Heritage, Modern Excellence</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Handmade from Assam.
              <br />
              <span className="text-gold">Digital Solutions</span> for the World.
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the rich heritage of Assamese craftsmanship while accessing cutting-edge digital services
              that power your business growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-gray-900 font-bold px-8 py-6 text-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-2 border-gray-900 dark:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-bold px-8 py-6 text-lg">
                  <Laptop className="mr-2 h-5 w-5" />
                  Get a Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Discover Authentic Assamese Handmade Products
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                From exquisite Muga silk textiles to intricate bamboo crafts and aromatic Assam tea,
                each product tells a story of tradition, skill, and cultural heritage passed down through generations.
              </p>
              <Link href="/shop">
                <Button className="bg-gold hover:bg-gold/90 text-gray-900 font-bold">
                  Explore Our Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-lg">Handcrafted</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Every piece is made with love and traditional techniques</CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-2">
                    <Sparkles className="h-6 w-6 text-red" />
                  </div>
                  <CardTitle className="text-lg">Premium Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Authentic materials and superior craftsmanship</CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-2">
                    <Globe className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-lg">Worldwide Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Delivering Assamese heritage to your doorstep</CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-2">
                    <ShoppingBag className="h-6 w-6 text-red" />
                  </div>
                  <CardTitle className="text-lg">Curated Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Hand-picked products from skilled artisans</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Digital Marketing', desc: 'ROI-focused campaigns' },
                  { title: 'Web Development', desc: 'Modern, scalable solutions' },
                  { title: 'Brand Strategy', desc: 'Identity & positioning' },
                  { title: 'Lead Generation', desc: 'Quality pipeline growth' },
                ].map((service, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow hover:border-gold">
                    <CardHeader>
                      <CardTitle className="text-base">{service.title}</CardTitle>
                      <CardDescription className="text-sm">{service.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Digital Solutions That Drive Results
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Transform your business with our comprehensive digital services. From strategic marketing to
                custom development, we deliver solutions that help you reach your goals and grow your brand.
              </p>
              <Link href="/services">
                <Button className="bg-red hover:bg-red/90 text-white font-bold">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the MUGA WORLD Difference?
          </h2>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Whether you're looking for authentic handmade treasures or need expert digital solutions,
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-gray-900 font-bold px-8">
                Start Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
