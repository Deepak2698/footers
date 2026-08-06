import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Heart, Shield, Truck, Clock, Star, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { value: '500+', label: 'Premium Products' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '15+', label: 'Years Experience' },
    { value: '100%', label: 'Handmade Quality' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Handcrafted with Love',
      description: 'Each pair of Kolhapuri chappals and leather shoes is meticulously handcrafted by skilled artisans, ensuring exceptional quality and attention to detail.',
    },
    {
      icon: Shield,
      title: 'Premium Quality Leather',
      description: 'We use only the finest quality leather sourced from trusted suppliers, guaranteeing durability and comfort in every step.',
    },
    {
      icon: Users,
      title: 'Supporting Artisans',
      description: 'We work directly with local artisans and craftsmen, preserving traditional techniques and providing fair wages to skilled workers.',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'Fast and reliable delivery across India, ensuring your favorite footwear reaches you in perfect condition.',
    },
  ];

  const features = [
    '100% Genuine Leather',
    'Traditional Kolhapuri Craftsmanship',
    'Modern Comfort Meets Heritage',
    'Eco-friendly Production Methods',
    'Custom Sizes Available',
    '30-Day Money Back Guarantee',
  ];

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-luxury text-black-100 mb-6">
            About <span className="text-gradient">Footers</span>
          </h1>
          <p className="text-xl text-black-400 max-w-3xl mx-auto leading-relaxed">
            Preserving the rich heritage of Kolhapuri craftsmanship while delivering 
            premium leather footwear that combines tradition with modern comfort.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-gold-500 mb-2">
                {stat.value}
              </div>
              <div className="text-black-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-luxury text-black-100 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-black-400 leading-relaxed">
              <p>
                Founded with a passion for preserving India's rich footwear heritage, 
                Footers has become synonymous with authentic Kolhapuri chappals and 
                premium leather shoes. Our journey began over 15 years ago with a simple 
                mission: to bring traditional craftsmanship to modern consumers.
              </p>
              <p>
                What started as a small workshop with just a handful of skilled artisans 
                has grown into a trusted name in premium footwear. Today, we work with 
                over 50 artisans across Maharashtra, each bringing their unique expertise 
                and traditional techniques passed down through generations.
              </p>
              <p>
                Every pair of footwear that leaves our workshop tells a story of tradition, 
                craftsmanship, and dedication. From the classic T-shaped Kolhapuri chappals 
                to contemporary leather shoes, each piece is a testament to our commitment 
                to quality and heritage.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/VKS_8541.JPG"
              alt="Traditional Kolhapuri Craftsmanship"
              className="w-full h-96 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-900/50 to-transparent rounded-xl"></div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-luxury text-black-100 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-lg font-semibold text-black-100 mb-3">
                  {value.title}
                </h3>
                <p className="text-black-400 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-luxury text-black-100 mb-6">
              What Makes Us Special
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                  <span className="text-black-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-luxury text-black-100 mb-6">
              Our Commitment
            </h2>
            <div className="space-y-4 text-black-400">
              <p>
                At Footers, we're committed to more than just selling footwear. 
                We're dedicated to preserving cultural heritage, supporting local 
                artisans, and providing our customers with products that stand the 
                test of time.
              </p>
              <p>
                Every purchase you make contributes to sustaining traditional crafts 
                and supporting the livelihoods of skilled artisans. We believe in 
                ethical business practices, fair wages, and sustainable production 
                methods that benefit both our customers and our craftsmen.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="card p-8 text-center mb-16">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-gold-500 fill-current" />
            ))}
          </div>
          <p className="text-xl text-black-300 italic mb-4 max-w-2xl mx-auto">
            "The quality and craftsmanship of Footers' Kolhapuri chappals are unmatched. 
            I've been wearing their products for over 5 years, and they never disappoint!"
          </p>
          <p className="text-black-400">
            - Rajesh Kumar, Mumbai
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-xl p-8">
          <h2 className="text-3xl font-luxury text-black-100 mb-4">
            Experience the Difference
          </h2>
          <p className="text-black-400 mb-6">
            Discover why thousands of customers trust Footers for their premium leather footwear needs.
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center">
            Explore Our Collection
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
