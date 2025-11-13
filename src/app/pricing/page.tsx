import { PenTool, Check, X, Zap, Building, HelpCircle } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out SignatureApp",
    features: [
      { text: "5 documents per month", included: true },
      { text: "Up to 2 signers per document", included: true },
      { text: "Basic PDF viewer", included: true },
      { text: "Draw, type, or upload signatures", included: true },
      { text: "Email notifications", included: true },
      { text: "Basic audit trail", included: true },
      { text: "Document templates", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/sign",
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "per user/month",
    description: "For professionals and small teams",
    features: [
      { text: "Unlimited documents", included: true },
      { text: "Unlimited signers", included: true },
      { text: "Advanced PDF editor", included: true },
      { text: "Document templates", included: true },
      { text: "Email reminders", included: true },
      { text: "Advanced audit trail", included: true },
      { text: "Priority email support", included: true },
      { text: "API access", included: true },
      { text: "Custom branding", included: false },
      { text: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    ctaLink: "/sign",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations with custom needs",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Custom branding", included: true },
      { text: "Single Sign-On (SSO)", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Advanced security features", included: true },
      { text: "SLA guarantees", included: true },
      { text: "On-premise deployment option", included: true },
      { text: "Custom integrations", included: true },
      { text: "Training and onboarding", included: true },
      { text: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
  },
  {
    question: "What happens when I reach my document limit?",
    answer:
      "On the Free plan, you'll be prompted to upgrade when you reach 5 documents. Pro and Enterprise plans have unlimited documents.",
  },
  {
    question: "Are signatures legally binding?",
    answer:
      "Yes! Our signatures comply with the ESIGN Act, UETA, and eIDAS regulations, making them legally binding in most countries.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely! There are no long-term contracts. You can cancel your subscription at any time from your account settings.",
  },
  {
    question: "Do you offer discounts for nonprofits?",
    answer:
      "Yes! We offer a 50% discount on Pro plans for registered nonprofit organizations. Contact us to learn more.",
  },
];

export default function PricingPage() {
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
              <Link href="/pricing" className="text-blue-600 font-medium">
                Pricing
              </Link>
              <Link href="/security" className="text-gray-700 hover:text-blue-600">
                Security
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
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Simple, Transparent
            <span className="text-blue-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.popular ? "ring-2 ring-blue-600 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  <Zap className="h-4 w-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  )}
                </div>
                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
              <div className="px-8 pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included ? "text-gray-900" : "text-gray-500 line-through"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
            <Building className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We offer custom solutions for large organizations with specific requirements. Get in
              touch with our sales team.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about our pricing</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact our support team →
          </Link>
        </div>
      </div>
    </div>
  );
}


