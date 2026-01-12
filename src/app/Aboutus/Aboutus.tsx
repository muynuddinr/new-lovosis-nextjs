
"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AboutUsPage = () => {
  const [expandedSection, setExpandedSection] = useState('about');

  const sections = [
    { id: 'about', number: '01', title: 'About US', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat sit amet.' },
    { id: 'mission', number: '02', title: 'Our Mission', description: '' },
    { id: 'vision', number: '03', title: 'Our Vision', description: '' }
  ];

  const stats = [
    { number: '150+', label: 'Happy Clients' },
    { number: '10,000+', label: 'Completed Project' },
    { number: '024+', label: 'Country' }
  ];

  const timeline = [
    { year: '2025', number: '01', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' },
    { year: '2015', number: '02', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' },
    { year: '2005', number: '03', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' },
    { year: '1995', number: '04', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' }
  ];

  const coreValues = [
    { number: '01', title: 'Core Value 1', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' },
    { number: '02', title: 'Core Value 2', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' },
    { number: '03', title: 'Core Value 3', description: 'Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white pt-16 pb-12">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left - Title */}
            <div className="relative">
              <h1 className="text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Your Trusted Partner<br />in Electronics<br />Excellence
              </h1>
              
              {/* Hand-drawn Arrow */}
              <div className="absolute right-0 top-32">
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
            <div className="space-y-4 pt-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`rounded-2xl transition-all cursor-pointer border-2 ${
                    expandedSection === section.id
                      ? 'bg-[#f8f9fa] border-[#e8eaed] p-6'
                      : 'bg-white border-[#e8eaed] p-5 hover:bg-[#fafbfc]'
                  }`}
                  onClick={() => setExpandedSection(section.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-5 items-start flex-1">
                      <span className="text-red-600 font-bold text-xl flex-shrink-0">{section.number}</span>
                      <div className="flex-1 pt-0.5">
                        <h3 className="text-gray-900 font-semibold text-base mb-2">{section.title}</h3>
                        {expandedSection === section.id && section.description && (
                          <p className="text-gray-600 text-sm leading-relaxed mt-2">{section.description}</p>
                        )}
                      </div>
                    </div>
                    <ChevronDown 
                      className={`text-[#9ca3af] flex-shrink-0 transition-transform mt-1 ${
                        expandedSection === section.id ? 'rotate-180' : ''
                      }`} 
                      size={22} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images Section with Circle Badge */}
      <div className="bg-white py-8">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="relative">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Image - Building */}
              <div className="rounded-[32px] overflow-hidden shadow-xl bg-[#6b7b94]">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&h=500&fit=crop" 
                  alt="Building exterior" 
                  className="w-full h-[420px] object-cover"
                />
              </div>
              {/* Right Image - Team */}
              <div className="rounded-[32px] overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&h=500&fit=crop" 
                  alt="Team meeting" 
                  className="w-full h-[420px] object-cover"
                />
              </div>
            </div>

            {/* Circular HARD WORK Badge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-32 h-32">
                {/* Outer white circle with shadow */}
                <div className="absolute inset-0 bg-white rounded-full shadow-2xl"></div>
                {/* Inner design */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    {/* Circular text path */}
                    <svg className="w-24 h-24 absolute inset-0" viewBox="0 0 100 100">
                      <defs>
                        <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                      </defs>
                      <text fontSize="9" fill="#6b7280" fontWeight="500" letterSpacing="3">
                        <textPath href="#circlePath" startOffset="0%">
                          QUALITY EXCELLENCE
                        </textPath>
                      </text>
                    </svg>
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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
          <div className="grid md:grid-cols-3 gap-16 mt-20 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform duration-300">
                <div className="text-[56px] font-bold text-red-600 leading-none mb-4">{stat.number}</div>
                <div className="text-gray-600 text-sm font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our History Section */}
      <div className="bg-[#f8f9fa] py-24 mt-16">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="flex justify-between items-start mb-20">
            <h2 className="text-[52px] font-bold text-gray-900">Our History</h2>
            <p className="text-gray-600 text-sm max-w-[420px] leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat sit amet purus sit amet consectetur.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative pt-8">
            {/* Horizontal line */}
            <div className="absolute top-8 left-0 right-0 h-[2px] bg-[#d1d5db]"></div>
            
            <div className="grid grid-cols-4 gap-8 relative">
              {timeline.map((item, index) => (
                <div key={index}>
                  <div className="text-center mb-8">
                    <div className="text-xs text-gray-400 font-medium mb-3 tracking-wider">{item.number}</div>
                    <div className="text-[32px] font-bold text-red-600 mb-6">{item.year}</div>
                  </div>
                  {/* Timeline dot */}
                  <div className="flex justify-center mb-10">
                    <div className="w-4 h-4 bg-red-600 rounded-full relative z-10"></div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed text-center px-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white py-24">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Left - Title and Description */}
            <div className="relative">
              <h2 className="text-[52px] font-bold text-gray-900 leading-tight mb-10">
                Our<br />Core Values
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat. Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat. Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat. Lorem ipsum dolor sit amet consectetur. Convallis ultricies cursus urna consequat volutpat.
              </p>

              {/* Hand-drawn Arrow pointing right */}
              <div className="absolute bottom-0 left-12">
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
              <div className="space-y-5 relative z-10 max-w-[460px]">
                {coreValues.map((value) => (
                  <div
                    key={value.number}
                    className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all border border-[#e8eaed]"
                  >
                    <div className="flex gap-5">
                      <span className="text-gray-300 font-bold text-xl flex-shrink-0">{value.number}</span>
                      <div>
                        <h3 className="text-gray-900 font-semibold text-base mb-3">{value.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Bottles Image - Positioned on the right */}
              <div className="absolute -right-24 top-20 w-[340px] h-[500px]">
                <div className="relative w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=600&fit=crop" 
                    alt="Product bottles" 
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;