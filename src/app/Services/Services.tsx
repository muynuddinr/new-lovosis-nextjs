'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Megaphone,
  Globe,
  Search,
  Users,
  ShoppingCart,
  Cloud,
  Palette,
  Cpu,
  TestTube,
  Zap,
  Wrench,
  Shield,
  Settings,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'it' | 'electronics'>('electronics');

  const itServices: ServiceCard[] = [
    { 
      icon: <Code className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Software Development',
      description: 'Custom software solutions tailored to your business needs with modern technologies.',
      features: [
        'Web applications',
        'Mobile app development',
        'API development',
        'Database design'
      ],
      highlighted: true,
    },
    {
      icon: <Megaphone className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategies to boost your online presence.',
      features: [
        'Social media marketing',
        'Content creation',
        'Email campaigns',
        'Brand management'
      ],
    },
    {
      icon: <Globe className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Website Design & Development',
      description: 'Modern, responsive websites that engage users and drive conversions.',
      features: [
        'Responsive design',
        'E-commerce platforms',
        'CMS integration',
        'Performance optimization'
      ],
    },
    {
      icon: <Search className="w-8 h-8" strokeWidth={1.5} />,
      title: 'SEO Analysis & Optimization',
      description: 'Improve your search engine rankings and organic traffic.',
      features: [
        'Keyword research',
        'On-page optimization',
        'Technical SEO',
        'Performance monitoring'
      ],
    },
    {
      icon: <Users className="w-8 h-8" strokeWidth={1.5} />,
      title: 'IT Consulting',
      description: 'Expert advice on technology strategy and digital transformation.',
      features: [
        'Technology assessment',
        'System architecture',
        'Process optimization',
        'Security consulting'
      ],
    },
    {
      icon: <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />,
      title: 'WordPress & Shopify',
      description: 'Custom development and optimization for popular CMS platforms.',
      features: [
        'Theme customization',
        'Plugin development',
        'E-commerce setup',
        'Maintenance & support'
      ],
    },
    {
      icon: <Cloud className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and migration services.',
      features: [
        'Cloud migration',
        'Infrastructure setup',
        'Monitoring & management',
        'Cost optimization'
      ],
    },
    {
      icon: <Palette className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Design & Creative Services',
      description: 'Creative design solutions for branding and user experience.',
      features: [
        'UI/UX design',
        'Logo & branding',
        'Graphic design',
        'Video production'
      ],
    },
  ];

  const electronicsServices: ServiceCard[] = [
    {
      icon: <Cpu className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Educational Equipment Manufacturing',
      description: 'Specialized manufacturing of educational tools and laboratory equipment.',
      features: [
        'Custom lab equipment',
        'Educational kits',
        'Training devices',
        'Quality certification'
      ],
      highlighted: true,
    },
    {
      icon: <TestTube className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Testing & Measuring Instruments',
      description: 'Precision testing equipment for various industries and applications.',
      features: [
        'Multimeters & oscilloscopes',
        'Calibration services',
        'Custom sensors',
        'Data acquisition systems'
      ],
    },
    {
      icon: <Zap className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Surface Mount Technology (SMT)',
      description: 'Advanced SMT assembly for high-density electronic components.',
      features: [
        'High-precision placement',
        'BGA & fine-pitch assembly',
        'Reflow soldering',
        'Automated inspection'
      ],
    },
    {
      icon: <Wrench className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Through-hole Assembly',
      description: 'Traditional through-hole assembly for robust electronic connections.',
      features: [
        'Manual assembly',
        'Wave soldering',
        'Component insertion',
        'Quality verification'
      ],
    },
    {
      icon: <Shield className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Testing & Quality Assurance',
      description: 'Comprehensive testing and quality control for all products.',
      features: [
        'Functional testing',
        'Environmental testing',
        'Reliability testing',
        'Compliance certification'
      ],
    },
    {
      icon: <Settings className="w-8 h-8" strokeWidth={1.5} />,
      title: 'Custom Enclosures',
      description: 'Custom-designed enclosures for electronic devices and systems.',
      features: [
        'Plastic & metal enclosures',
        'EMI/RFI shielding',
        'Thermal management',
        'Cable assemblies'
      ],
    },
  ];

  const currentServices = activeCategory === 'it' ? itServices : electronicsServices;

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '100+', label: 'Happy Clients' },
    { number: '99.8%', label: 'Quality Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-red-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Comprehensive IT and Electronics solutions from design to manufacturing.
              We deliver innovation, quality, and excellence in every project.
            </p>

            {/* Category Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-lg border">
                <button
                  onClick={() => setActiveCategory('it')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    activeCategory === 'it'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  IT Services
                </button>
                <button
                  onClick={() => setActiveCategory('electronics')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    activeCategory === 'electronics'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  Electronics Manufacturing
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border ${
                  service.highlighted
                    ? 'border-red-200 bg-red-50/50'
                    : 'border-gray-100 hover:border-red-200'
                }`}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl mb-6 ${
                  service.highlighted
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                } transition-colors duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-red-600 mr-3 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`inline-flex items-center text-sm font-semibold transition-colors ${
                  service.highlighted
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-gray-600 hover:text-red-600'
                }`}>
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Highlight Badge */}
                {service.highlighted && (
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-red-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamlined workflow from concept to delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'Understanding your requirements and objectives' },
              { step: '02', title: 'Design', desc: 'Creating detailed specifications and schematics' },
              { step: '03', title: 'Prototyping', desc: 'Building and testing initial prototypes' },
              { step: '04', title: 'Production', desc: 'Full-scale manufacturing and quality assurance' }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{process.title}</h3>
                <p className="text-gray-600">{process.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with our expert team and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Get Quote
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
