import {
  PenTool,
  Upload,
  Users,
  Shield,
  Clock,
  FileText,
  Check,
  Zap,
  Globe,
  Lock,
  Bell,
  Archive,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description:
      "Simply drag and drop your PDF documents or click to browse. Support for multiple file formats and large documents up to 25MB.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: PenTool,
    title: "Digital Signatures",
    description:
      "Draw, type, or upload your signature. Place it anywhere on the document with precision and save it for future use.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Users,
    title: "Multi-Signer Workflow",
    description:
      "Send documents to multiple signers in order. Set up signing sequences and track progress in real-time.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: FileText,
    title: "PDF Viewer & Editor",
    description:
      "High-quality PDF rendering with zoom, navigation, and thumbnail preview. Add signature fields, text boxes, checkboxes, and date fields.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Your documents are encrypted in transit and at rest. We follow industry best practices to keep your data safe and secure.",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Monitor signature status and progress. Get instant notifications when documents are viewed, signed, or completed.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with Next.js 15 and optimized for speed. Experience instant page loads and smooth interactions.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    icon: Globe,
    title: "Mobile Responsive",
    description:
      "Sign documents on any device - desktop, tablet, or mobile. Our responsive design works seamlessly everywhere.",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  {
    icon: Bell,
    title: "Email Notifications",
    description:
      "Automatic email reminders for signers. Customizable notification templates and reminder schedules.",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    icon: Archive,
    title: "Document Templates",
    description:
      "Save frequently used documents as templates. Reuse field layouts and settings to speed up your workflow.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  {
    icon: Lock,
    title: "Audit Trail",
    description:
      "Complete audit trail for every signature. Track who signed what, when, and from where for legal compliance.",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  {
    icon: Check,
    title: "Legally Binding",
    description:
      "Our signatures are legally binding and compliant with e-signature laws including ESIGN Act and eIDAS.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
];

const comparisons = [
  { feature: "Unlimited documents", free: false, pro: true },
  { feature: "Multiple signers", free: "Up to 2", pro: "Unlimited" },
  { feature: "Document templates", free: false, pro: true },
  { feature: "Email reminders", free: false, pro: true },
  { feature: "Audit trail", free: "Basic", pro: "Advanced" },
  { feature: "API access", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
  { feature: "Custom branding", free: false, pro: true },
];

export default function FeaturesPage() {
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
              <Link href="/features" className="text-blue-600 font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
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
            Powerful Features for
            <span className="text-blue-600"> Modern Signing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to sign, send, and manage documents digitally. Fast, secure, and
            easy to use.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Try It Free
            </Link>
            <Link
              href="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-lg text-gray-600">
            Comprehensive tools for digital document signing and workflow management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisons.map((item) => (
                  <tr key={item.feature} className="bg-white">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof item.free === "boolean" ? (
                        item.free ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600">{item.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof item.pro === "boolean" ? (
                        item.pro ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600">{item.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View detailed pricing →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SignatureApp for their document signing needs
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Start Signing Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


