"use client";

import { useState } from "react";
import {
  PenTool,
  HelpCircle,
  Search,
  FileText,
  Users,
  Mail,
  Video,
  Book,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    icon: FileText,
    title: "Getting Started",
    description: "New to SignatureApp? Start here",
    articles: 12,
  },
  {
    icon: PenTool,
    title: "Signing Documents",
    description: "Learn how to sign and send documents",
    articles: 8,
  },
  {
    icon: Users,
    title: "Account Management",
    description: "Manage your account and billing",
    articles: 15,
  },
  {
    icon: Mail,
    title: "Email & Notifications",
    description: "Configure email settings and reminders",
    articles: 6,
  },
];

const faqs = [
  {
    question: "How do I upload a document?",
    answer:
      "To upload a document, click on the 'Sign Document' button in the navigation, then either drag and drop your PDF file or click 'Choose File' to browse. We support PDF files up to 25MB.",
  },
  {
    question: "Can I use SignatureApp on my mobile device?",
    answer:
      "Yes! SignatureApp is fully responsive and works great on all devices including smartphones and tablets. Simply access the website through your mobile browser.",
  },
  {
    question: "How do I create a signature?",
    answer:
      "You can create a signature in three ways: draw it using your mouse or touchscreen, type your name and select a font style, or upload an image of your handwritten signature.",
  },
  {
    question: "Are my documents secure?",
    answer:
      "Absolutely. All documents are encrypted using AES-256 encryption both in transit and at rest. We maintain SOC 2 compliance and follow industry best practices for data security.",
  },
  {
    question: "How many people can sign one document?",
    answer:
      "Free accounts support up to 2 signers per document. Pro and Enterprise accounts support unlimited signers.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts.",
  },
  {
    question: "What file formats do you support?",
    answer:
      "Currently, we support PDF files. Support for additional formats like Word documents and images is coming soon.",
  },
  {
    question: "How do I track document status?",
    answer:
      "You can track all your documents from the Dashboard. Each document shows its current status (draft, sent, partially signed, or completed) and signing progress.",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <PenTool className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SignatureApp</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-gray-700 hover:text-blue-600">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/support" className="text-blue-600 font-medium">
                Support
              </Link>
              <Link href="/sign" className="text-gray-700 hover:text-blue-600">
                Sign Document
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            How can we
            <span className="text-blue-600"> help you?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Search our knowledge base or browse categories to find answers
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                href="#"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <span className="text-sm text-blue-600 font-medium">
                  {category.articles} articles →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No results found. Try different keywords or{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  contact support
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Resources</h2>
          <p className="text-lg text-gray-600">More ways to learn and get help</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-gray-600 mb-4">
              Watch step-by-step guides on how to use SignatureApp
            </p>
            <Link href="#" className="text-blue-600 hover:underline font-medium">
              Watch Now →
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive guides for developers and power users
            </p>
            <Link href="#" className="text-blue-600 hover:underline font-medium">
              Read Docs →
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? We're here to help
            </p>
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              Get in Touch →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is available Monday through Friday, 9 AM - 6 PM PST
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Support
            </Link>
            <Link
              href="/sign"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


