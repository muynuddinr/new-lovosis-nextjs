'use client';

import { useState } from 'react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer custom electronics design, rapid prototyping, quality assurance testing, and full-scale production manufacturing for innovative electronics solutions."
    },
    {
      question: "How long does the prototyping process take?",
      answer: "Our rapid prototyping typically takes 2-4 weeks depending on complexity. We work closely with you to ensure fast turnaround while maintaining high quality."
    },
    {
      question: "Do you provide quality assurance?",
      answer: "Yes, we have rigorous quality assurance processes including testing, certification, and compliance checks to ensure every component meets industry standards."
    },
    {
      question: "Can you handle large-scale production?",
      answer: "Absolutely. We partner with scalable manufacturing facilities to handle everything from small batches to large-scale production runs."
    },
    {
      question: "What industries do you serve?",
      answer: "We serve a wide range of industries including consumer electronics, automotive, medical devices, IoT, and industrial automation."
    },
    {
      question: "How do I get a quote?",
      answer: "You can request a quote through our website or by contacting our sales team directly. We'll need details about your project requirements."
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
