'use client';

import { useState } from 'react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What are educational trainer kits?",
      answer: "Educational trainer kits are comprehensive hands-on learning tools designed specifically for engineering students and professionals. They include electronic components, circuit boards, power supplies, and measurement instruments that allow users to build, test, and understand real-world electronic systems. Our kits cover topics from basic electronics to advanced power systems and measurement techniques."
    },
    {
      question: "Do you provide power supply solutions in India?",
      answer: "Yes, we offer a complete range of power supply solutions across India. Our manufacturing facilities in Bangalore and Kerala produce AC and DC regulated power supplies, industrial power systems, and custom power solutions. We serve educational institutions, research labs, and industrial clients nationwide with reliable, high-quality power equipment."
    },
    {
      question: "What test and measuring instruments do you offer?",
      answer: "We provide professional-grade test and measuring instruments including digital storage oscilloscopes (DSO), multimeters, signal generators, spectrum analyzers, and other laboratory equipment. Our instruments are essential for engineering education, research, and quality control in electronics manufacturing."
    },
    {
      question: "How can I contact Lovosis for inquiries?",
      answer: "You can reach us through multiple channels: email us at info@lovosis.in, call +91 7012970281, use our website contact form, or connect via WhatsApp at +91 9747745544. Our technical support team is available Monday to Friday, 9 AM to 6 PM IST, and we typically respond within 24 hours."
    },
    {
      question: "Do you offer custom educational equipment?",
      answer: "Absolutely! We specialize in custom educational trainer kits and laboratory equipment. Whether you need specific circuit designs, custom power supplies, or specialized measurement tools, our engineering team can design and manufacture solutions tailored to your curriculum requirements and technical specifications."
    },
    {
      question: "What is the warranty on your products?",
      answer: "We offer comprehensive warranty coverage on all our products. Educational trainer kits and laboratory equipment come with a 1-year warranty against manufacturing defects. Power supplies and test instruments have a 2-year warranty. Extended warranty options are available, and our technical support team provides lifetime assistance for proper usage and maintenance."
    },
    {
      question: "Do you provide training and support for your equipment?",
      answer: "Yes, we offer extensive training and support services. This includes user manuals, video tutorials, online documentation, and hands-on training sessions for educators. Our technical support team provides guidance on equipment setup, usage, troubleshooting, and integration into your curriculum. We also offer customized training programs for faculty and students."
    },
    {
      question: "Can you deliver to my location in India?",
      answer: "We provide nationwide delivery across India with reliable logistics partners. Standard delivery typically takes 3-7 business days depending on your location. Express delivery options are available for urgent requirements. We also offer installation and commissioning services for larger laboratory setups."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked
            <span className="block text-red-600">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our electronics innovation services and processes.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-red-600 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="px-8 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
