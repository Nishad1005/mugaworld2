import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Code, Share2, PenTool, TrendingUp, Mail, CircleCheck as CheckCircle, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Strategic campaigns that drive real ROI. From SEO to paid advertising, we create data-driven marketing strategies that connect your brand with the right audience.',
    features: [
      'Search Engine Optimization (SEO)',
      'Pay-Per-Click (PPC) Advertising',
      'Content Marketing Strategy',
      'Analytics & Reporting',
    ],
  },
  {
    icon: Code,
    title: 'Website Development',
    description: 'Modern, responsive websites built with cutting-edge technology. We create fast, scalable, and user-friendly web solutions that grow with your business.',
    features: [
      'Custom Website Development',
      'E-commerce Solutions',
      'Progressive Web Apps',
      'Website Maintenance & Support',
    ],
  },
  {
    icon: Share2,
    title: 'Social Media Management',
    description: 'Build and engage your community across all major platforms. We craft compelling content and manage your social presence to drive meaningful engagement.',
    features: [
      'Content Creation & Curation',
      'Community Management',
      'Social Media Advertising',
      'Influencer Partnerships',
    ],
  },
  {
    icon: PenTool,
    title: 'Branding & Design',
    description: 'Create a memorable brand identity that resonates with your audience. From logo design to complete brand guidelines, we bring your vision to life.',
    features: [
      'Brand Identity Design',
      'Logo & Visual Assets',
      'Brand Guidelines',
      'Marketing Collateral',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Lead Generation',
    description: 'Fill your sales pipeline with qualified leads. Our proven strategies combine multiple channels to generate consistent, high-quality leads for your business.',
    features: [
      'Landing Page Optimization',
      'Email Marketing Campaigns',
      'Marketing Automation',
      'Lead Nurturing Strategies',
    ],
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Reach your audience directly with targeted email campaigns. We design, implement, and optimize email marketing strategies that convert.',
    features: [
      'Campaign Strategy & Design',
      'List Segmentation',
      'A/B Testing',
      'Performance Analytics',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Digital Solutions That Drive Results
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Transform your business with our comprehensive suite of digital services.
              We combine strategy, creativity, and technology to deliver measurable results.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card key={idx} className="hover:shadow-xl transition-all hover:border-gold">
                <CardHeader>
                  <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-20 bg-gradient-to-br from-gold/10 via-amber-50 to-red-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how our digital solutions can help you achieve your goals.
            Get a free consultation with our team of experts.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-red hover:bg-red/90 text-white font-bold px-8">
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We follow a proven methodology to ensure your project's success
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'Understanding your goals and requirements' },
              { step: '02', title: 'Strategy', desc: 'Creating a customized action plan' },
              { step: '03', title: 'Execution', desc: 'Implementing solutions with precision' },
              { step: '04', title: 'Optimization', desc: 'Continuous improvement and scaling' },
            ].map((item, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-5xl font-black text-gold/20 mb-2">{item.step}</div>
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
