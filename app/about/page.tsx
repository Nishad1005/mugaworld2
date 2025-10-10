import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Award, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-amber-50 via-white to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blending Assam's Heritage with Digital Innovation
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are the bridge between tradition and technology, bringing the finest of Assamese
              craftsmanship to the world while empowering businesses with cutting-edge digital solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                MUGA WORLD was born from a vision to preserve and promote the rich cultural heritage
                of Assam while embracing the opportunities of the digital age. Our journey began with
                a deep appreciation for the skilled artisans who have kept traditional crafts alive
                through generations.
              </p>
              <p>
                Named after the precious golden Muga silk unique to Assam, we represent the perfect
                blend of tradition and modernity. Just as Muga silk is valued for its natural golden
                sheen and durability, we bring timeless value through both our handcrafted products
                and innovative digital services.
              </p>
              <p>
                Today, MUGA WORLD stands as a platform that not only showcases authentic Assamese
                handicrafts to a global audience but also helps businesses grow through strategic
                digital solutions. We believe in creating sustainable opportunities for artisans
                while delivering exceptional value to our clients worldwide.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Assamese craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-red/20 rounded-2xl -z-10" />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="text-xl">Authenticity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We celebrate genuine craftsmanship and deliver honest, transparent services
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red" />
                </div>
                <CardTitle className="text-xl">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Supporting local artisans and building lasting relationships with clients
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Striving for the highest quality in everything we create and deliver
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-red" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Embracing new technologies while respecting traditional methods
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl p-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              To preserve and promote the rich cultural heritage of Assam by connecting skilled
              artisans with global markets, while empowering businesses worldwide with innovative
              digital solutions that drive sustainable growth and success.
            </p>

            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                To become the leading platform that seamlessly bridges traditional craftsmanship
                with modern digital commerce, creating opportunities for artisans and delivering
                exceptional value to businesses and customers across the globe.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose MUGA WORLD?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-gold mb-4">15+</div>
              <h3 className="text-xl font-bold mb-2">Years of Heritage</h3>
              <p className="text-gray-600">
                Preserving traditional crafts with generations of knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-black text-gold mb-4">500+</div>
              <h3 className="text-xl font-bold mb-2">Artisan Partners</h3>
              <p className="text-gray-600">
                Supporting local craftspeople and their families
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-black text-gold mb-4">1000+</div>
              <h3 className="text-xl font-bold mb-2">Happy Customers</h3>
              <p className="text-gray-600">
                Satisfied clients across traditional products and digital services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
