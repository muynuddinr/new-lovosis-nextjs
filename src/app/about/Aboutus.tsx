
"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AboutUsPage = () => {
  const [expandedSection, setExpandedSection] = useState('about');

  const sections = [
    { id: 'about', number: '01', title: 'About US', description: 'Lovosis Technology Private Limited is a digital transformation and technology partner of choice for educational institutions and businesses worldwide. Since our inception, we have upheld the highest standards of innovation, engineering excellence and customer service. We are focused on creating long-term value for our clients, partners, employees, and the community at large. With expertise spanning educational equipment, testing & measurement instruments, web development, and digital marketing, we have built lasting partnerships with institutions across Karnataka and beyond.' },
    { id: 'mission', number: '02', title: 'Our Mission', description: 'To empower educational institutions and businesses with state-of-the-art technology solutions that drive innovation, enhance learning experiences, and accelerate digital transformation.' },
    { id: 'vision', number: '03', title: 'Our Vision', description: 'To become the premier provider of innovative educational equipment and digital solutions, revolutionizing the way institutions teach and businesses operate in the digital era.' }
  ];

  const stats = [
    { number: '150+', label: 'Happy Clients' },
    { number: '10,000+', label: 'Completed Project' },
    { number: '024+', label: 'Country' }
  ];

  const timeline = [
    { year: '2025', number: '01', description: 'Expanding our digital transformation services and strengthening partnerships with educational institutions across India.' },
    { year: '2020', number: '02', description: 'Launched comprehensive digital marketing and web development services to complement our equipment offerings.' },
    { year: '2015', number: '03', description: 'Established strong presence in Karnataka with testing & measurement equipment for engineering colleges.' },
    { year: '2010', number: '04', description: 'Founded Lovosis Technology Private Limited with a vision to revolutionize educational equipment supply.' }
  ];

  const coreValues = [
    { number: '01', title: 'Innovation Excellence', description: 'We continuously push boundaries in technology and education, delivering cutting-edge solutions that drive real-world impact and transformation.' },
    { number: '02', title: 'Customer Partnership', description: 'Building long-term relationships through exceptional service, understanding client needs, and delivering solutions that exceed expectations.' },
    { number: '03', title: 'Quality & Integrity', description: 'Upholding the highest standards in every solution we deliver, maintaining transparency, and ensuring reliability in all our partnerships.' }
  ];

  const faqs = [
    { 
      id: 'faq1', 
      question: 'What types of educational equipment do you offer?', 
      answer: 'We offer premium laboratory equipment for engineering colleges and technical schools, including digital oscilloscopes, electronic workbenches, and a comprehensive range of educational tools designed to enhance practical learning experiences.' 
    },
    { 
      id: 'faq2', 
      question: 'What testing and measurement equipment do you offer?', 
      answer: 'Our portfolio includes professional-grade testing and measurement instruments such as oscilloscopes, multimeters, signal generators, function generators, and other precision instruments essential for accurate analysis and diagnostics.' 
    },
    { 
      id: 'faq3', 
      question: 'Do you offer electronics manufacturing services?', 
      answer: 'Yes, we provide electronics manufacturing services including PCB design, prototyping, and custom electronics solutions tailored to meet specific requirements of educational institutions and businesses.' 
    },
    { 
      id: 'faq4', 
      question: 'What digital services do you specialize in?', 
      answer: 'We specialize in comprehensive digital services including web design and development, e-commerce solutions, mobile app development, digital marketing, SEO optimization, social media management, and content marketing strategies to boost your online presence.' 
    },
    { 
      id: 'faq5', 
      question: 'Do you provide installation and training services?', 
      answer: 'Absolutely! We provide complete installation support and comprehensive training programs for all our equipment and solutions, ensuring your team can maximize the value of our products and services.' 
    },
    { 
      id: 'faq6', 
      question: 'How can I contact your support team?', 
      answer: 'You can reach our support team through our contact page, email, or phone. We are committed to providing prompt assistance and are available to address all your queries and technical support needs.' 
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
            {/* Left - Title */}
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Building Greater Futures<br className="hidden sm:block" />Through Innovation and<br className="hidden sm:block" />Collective Knowledge
              </h1>
              
              {/* Hand-drawn Arrow */}
              <div className="absolute right-0 top-20 sm:top-32 hidden lg:block">
                <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
                  <path
                    d="M 20 10 Q 70 50, 120 100"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path d="M 120 100 L 112 95 L 118 92" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Right - Expandable Sections */}
            <div className="space-y-3 sm:space-y-4 pt-4 lg:pt-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`rounded-lg sm:rounded-2xl transition-all cursor-pointer border-2 ${
                    expandedSection === section.id
                      ? 'bg-[#f8f9fa] border-[#e8eaed] p-4 sm:p-6'
                      : 'bg-white border-[#e8eaed] p-3 sm:p-5 hover:bg-[#fafbfc]'
                  }`}
                  onClick={() => setExpandedSection(section.id)}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex gap-3 sm:gap-5 items-start flex-1">
                      <span className="text-red-600 font-bold text-lg sm:text-xl flex-shrink-0">{section.number}</span>
                      <div className="flex-1 pt-0.5">
                        <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-1 sm:mb-2">{section.title}</h3>
                        {expandedSection === section.id && section.description && (
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-1 sm:mt-2">{section.description}</p>
                        )}
                      </div>
                    </div>
                    <ChevronDown 
                      className={`text-[#9ca3af] flex-shrink-0 transition-transform mt-1 ${
                        expandedSection === section.id ? 'rotate-180' : ''
                      }`} 
                      size={20} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images Section with Circle Badge */}
      <div className="bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {/* Left Image - Building */}
              <div className="rounded-2xl sm:rounded-[32px] overflow-hidden shadow-lg sm:shadow-xl bg-[#6b7b94]">
                <img 
                  src="/about/about1.png" 
                  alt="Building exterior" 
                  className="w-full h-48 sm:h-64 lg:h-[420px] object-cover"
                />
              </div>
              {/* Right Image - Team */}
              <div className="rounded-2xl sm:rounded-[32px] overflow-hidden shadow-lg sm:shadow-xl">
                <img 
                  src="/about/about2.png" 
                  alt="Team meeting" 
                  className="w-full h-48 sm:h-64 lg:h-[420px] object-cover"
                />
              </div>
            </div>

            {/* Circular HARD WORK Badge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                {/* Outer white circle with shadow */}
                <div className="absolute inset-0 bg-white rounded-full shadow-lg sm:shadow-2xl"></div>
                {/* Inner design */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24">
                    {/* Circular text path */}
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 absolute inset-0" viewBox="0 0 100 100">
                      <defs>
                        <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                      </defs>
                      <text fontSize="7" className="sm:text-[9px]" fill="#6b7280" fontWeight="500" letterSpacing="3">
                        <textPath href="#circlePath" startOffset="0%">
                          QUALITY EXCELLENCE
                        </textPath>
                      </text>
                    </svg>
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 mt-12 sm:mt-20 pt-4 sm:pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl lg:text-[56px] font-bold text-red-600 leading-none mb-2 sm:mb-4">{stat.number}</div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our History Section */}
      <div className="bg-[#f8f9fa] py-12 sm:py-16 lg:py-24 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold text-gray-900 mb-4 lg:mb-0">Our History</h2>
            <p className="text-gray-600 text-sm max-w-[420px] leading-relaxed">
              From our humble beginnings to becoming a trusted technology partner, Lovosis has consistently delivered innovative solutions to educational institutions and businesses, building lasting relationships through excellence and dedication.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative pt-4 sm:pt-8">
            {/* Horizontal line */}
            <div className="absolute top-6 sm:top-8 left-0 right-0 h-[2px] bg-[#d1d5db]"></div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 relative">
              {timeline.map((item, index) => (
                <div key={index}>
                  <div className="text-center mb-4 sm:mb-8">
                    <div className="text-xs text-gray-400 font-medium mb-2 sm:mb-3 tracking-wider">{item.number}</div>
                    <div className="text-xl sm:text-2xl lg:text-[32px] font-bold text-red-600 mb-3 sm:mb-6">{item.year}</div>
                  </div>
                  {/* Timeline dot */}
                  <div className="flex justify-center mb-6 sm:mb-10">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full relative z-10"></div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed text-center px-1 sm:px-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
            {/* Left - Title and Description */}
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold text-gray-900 leading-tight mb-6 sm:mb-10">
                Our<br className="hidden sm:block" />Core Values
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                At Lovosis, our core values define who we are and guide every decision we make. These principles form the foundation of our commitment to educational institutions and businesses, ensuring we deliver excellence in innovation, engineering, and customer service while creating lasting value for all our stakeholders.
              </p>

              {/* Hand-drawn Arrow pointing right */}
              <div className="absolute bottom-0 left-6 sm:left-12 hidden lg:block">
                <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
                  <path
                    d="M 10 20 Q 100 80, 180 100"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path d="M 180 100 L 172 96 L 176 92" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Right - Values Cards with Product Image */}
            <div className="relative">
              <div className="space-y-3 sm:space-y-5 relative z-10 max-w-[460px]">
                {coreValues.map((value) => (
                  <div
                    key={value.number}
                    className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-7 shadow-lg hover:shadow-xl transition-all border border-[#e8eaed]"
                  >
                    <div className="flex gap-3 sm:gap-5">
                      <span className="text-gray-300 font-bold text-lg sm:text-xl flex-shrink-0">{value.number}</span>
                      <div>
                        <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-2 sm:mb-3">{value.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Bottles Image - Positioned on the right */}
              <div className="absolute -right-12 sm:-right-24 top-16 sm:top-20 w-48 sm:w-[340px] h-64 sm:h-[500px] hidden lg:block">
                <div className="relative w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=600&fit=crop" 
                    alt="Product bottles" 
                    className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#f8f9fa] py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold text-gray-900 mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Find answers to common questions about our products, services, and support.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`rounded-lg sm:rounded-2xl transition-all cursor-pointer border-2 ${
                  expandedFaq === faq.id
                    ? 'bg-white border-[#e8eaed] p-4 sm:p-6 shadow-lg'
                    : 'bg-white border-[#e8eaed] p-3 sm:p-5 hover:shadow-md'
                }`}
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-1 sm:mb-2">{faq.question}</h3>
                    {expandedFaq === faq.id && (
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-2 sm:mt-3">{faq.answer}</p>
                    )}
                  </div>
                  <ChevronDown 
                    className={`text-[#9ca3af] flex-shrink-0 transition-transform mt-1 ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`} 
                    size={20} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;