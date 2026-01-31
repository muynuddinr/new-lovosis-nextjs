import Navbar from './Components/Navbar';
import Loader from './Components/Loader';
// import Hero from './Components/Herosection';
import Banner from './Components/Banner';
import Image from './Components/Imagetext';
import Why from './Components/Whychooseus';
import Services from './Components/Ourservices';
import ShuffleHero from './Components/ShuffleHero';
import Faq from './Components/Faq';
import Footer from './Components/Footer';
import FeaturedProducts from './Components/FeaturedProducts';
import AIChatbot from './Components/AIChatbot';
import type { Metadata } from 'next';
import { faqSchema, createHowToSchema } from '../utils/aeoSchemas';

export const metadata: Metadata = {
  title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
  description: "Discover premium educational trainer kits, electronic trainer kits, power supply solutions in India, and advanced test & measuring instruments. Perfect for engineering education and professional training.",
  keywords: [
  "educational trainer kits",
  "electronic trainer kits",
  "engineering trainer kits",
  "laboratory equipment",
  "test measuring instrument",

  "power supply india",
  "AC power supply manufacturers in Bangalore",
  "DC power supply manufacturers in Bangalore",
  "AC power supply manufacturers in Kerala",
  "DC power supply manufacturers in Kerala",
  "AC DC regulated power supply manufacturers in Bangalore",
  "AC power supply supplier in Bangalore",
  "DC power supply supplier in Bangalore",

  "Digital storage oscilloscope manufacturers in Bangalore",
  "DSO manufacturers in Bangalore",
  "Buy DSO in Bangalore",

  "educational equipment manufacturers in Bangalore",
  "educational equipment suppliers in Bangalore",
  "best educational equipment supplier in Bangalore",

  "engineering educational equipment manufacturers in Bangalore",
  "engineering lab equipment manufacturers in Bangalore",
  "electronics lab equipment manufacturers in Bangalore",

  "educational equipment suppliers in Kerala",

  "engineering educational equipment manufacturers near me",
  "educational equipment suppliers near me",
  "electronics lab equipment suppliers near me",
  "college laboratory equipment suppliers near me",
  "school science lab equipment suppliers near me"
],
  openGraph: {
    title: "Educational & Electronic Trainer Kits, Power Supply & Test Instruments | Lovosis",
    description: "Premium quality trainer kits and test instruments for engineering education in India",
    url: "https://lovosis.in",
    type: "website",
  },
};

export default function Home() {
  const howToGuide = {
    name: "How to Choose the Right Educational Trainer Kit",
    description: "A comprehensive guide to selecting the appropriate educational trainer kit for your engineering curriculum",
    steps: [
      {
        name: "Assess Your Curriculum Requirements",
        text: "Review your engineering syllabus and identify the key topics that require hands-on training, such as basic electronics, power systems, or measurement techniques."
      },
      {
        name: "Determine Student Skill Level",
        text: "Consider whether the kits are for beginners, intermediate, or advanced students. Choose components that match their current knowledge level."
      },
      {
        name: "Check Component Quality and Safety",
        text: "Ensure all components meet safety standards and are durable enough for repeated use in educational environments."
      },
      {
        name: "Review Experiment Coverage",
        text: "Verify that the kit includes experiments that cover all required topics in your curriculum with clear instructions and learning objectives."
      },
      {
        name: "Evaluate Support and Documentation",
        text: "Check for comprehensive user manuals, experiment guides, and technical support availability from the manufacturer."
      }
    ]
  };

  return (
    <div>
      {/* FAQ Schema for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* How-To Schema for GEO/AIO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createHowToSchema(howToGuide)),
        }}
      />

      <Loader />

      <Banner />
       <FeaturedProducts />
      {/* <ShuffleHero /> */}
      {/* <Hero /> */}
      <Image />
      <Services />
     
      <Why />
      <Faq />

      {/* AEO/GEO Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions About Our Products</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <article>
              <h3 className="text-xl font-semibold mb-4">What are educational trainer kits?</h3>
              <p className="text-gray-700 mb-4">Educational trainer kits are hands-on learning tools designed for engineering students and professionals. They include electronic components, circuits, and modules for practical training in electronics, power systems, and measurement techniques.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Perfect for engineering education</li>
                <li>Hands-on learning experience</li>
                <li>Industry-standard components</li>
              </ul>
            </article>

            <article>
              <h3 className="text-xl font-semibold mb-4">Do you provide power supply solutions in India?</h3>
              <p className="text-gray-700 mb-4">Yes, we offer a wide range of power supply solutions including AC and DC regulated power supplies. Our products are available across India with manufacturing facilities in Bangalore and Kerala.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>AC and DC power supplies</li>
                <li>Regulated and unregulated options</li>
                <li>Custom specifications available</li>
              </ul>
            </article>

            <article>
              <h3 className="text-xl font-semibold mb-4">What test and measuring instruments do you offer?</h3>
              <p className="text-gray-700 mb-4">We provide professional test and measuring instruments including digital storage oscilloscopes (DSO), multimeters, signal generators, and other laboratory equipment essential for engineering education and research.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Digital storage oscilloscopes</li>
                <li>Multimeters and signal generators</li>
                <li>Laboratory testing equipment</li>
              </ul>
            </article>

            <article>
              <h3 className="text-xl font-semibold mb-4">How can I contact Lovosis for inquiries?</h3>
              <p className="text-gray-700 mb-4">You can contact us through our website contact form, email at info@lovosis.in, or call +91 7012970281. We also have WhatsApp support available for quick inquiries.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Email: info@lovosis.in</li>
                <li>Phone: +91 7012970281</li>
                <li>WhatsApp support available</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* GEO/AIO Enhanced Product Comparison Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Product Categories Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Product Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Key Features</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Applications</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Warranty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Educational Trainer Kits</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      <li>Electronic components & circuits</li>
                      <li>Hands-on learning modules</li>
                      <li>Experiment guides included</li>
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      <li>Engineering education</li>
                      <li>Skill development labs</li>
                      <li>Research projects</li>
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">1 Year</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Power Supply Systems</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      <li>AC/DC regulated supplies</li>
                      <li>Variable voltage/current</li>
                      <li>Safety protections</li>
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      <li>Laboratory testing</li>
                      <li>Industrial applications</li>
                      <li>Educational experiments</li>
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">2 Years</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Test & Measuring Instruments</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      <li>Digital oscilloscopes</li>
                      <li>Multimeters & generators</li>
                      <li>Precision measurements</li>
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      <li>Quality control</li>
                      <li>Research & development</li>
                      <li>Educational labs</li>
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">2 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How-To Guide Section for GEO */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">How to Choose the Right Educational Trainer Kit</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Assess Your Curriculum Requirements</h3>
                  <p className="text-gray-600">Review your engineering syllabus and identify the key topics that require hands-on training, such as basic electronics, power systems, or measurement techniques.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Determine Student Skill Level</h3>
                  <p className="text-gray-600">Consider whether the kits are for beginners, intermediate, or advanced students. Choose components that match their current knowledge level.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Check Component Quality and Safety</h3>
                  <p className="text-gray-600">Ensure all components meet safety standards and are durable enough for repeated use in educational environments.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Review Experiment Coverage</h3>
                  <p className="text-gray-600">Verify that the kit includes experiments that cover all required topics in your curriculum with clear instructions and learning objectives.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Evaluate Support and Documentation</h3>
                  <p className="text-gray-600">Check for comprehensive user manuals, experiment guides, and technical support availability from the manufacturer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot for AIO/GEO Enhancement */}
      <AIChatbot />

    </div>
  );
}
