import {
  PenTool,
  Shield,
  Lock,
  Eye,
  Server,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Key,
  Cloud,
  UserCheck,
  Archive,
} from "lucide-react";
import Link from "next/link";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "All documents are encrypted using AES-256 encryption in transit and at rest. Your data is always protected.",
  },
  {
    icon: Shield,
    title: "SOC 2 Compliant",
    description:
      "We maintain SOC 2 Type II compliance to ensure the highest standards of security and data protection.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA and automatic failover.",
  },
  {
    icon: FileCheck,
    title: "Audit Trail",
    description:
      "Complete audit logs for every document action. Track who accessed, viewed, and signed your documents.",
  },
  {
    icon: UserCheck,
    title: "Identity Verification",
    description:
      "Optional multi-factor authentication and email verification for all signers to ensure authenticity.",
  },
  {
    icon: Archive,
    title: "Regular Backups",
    description:
      "Automated daily backups with 30-day retention. Your documents are safe even in disaster scenarios.",
  },
];

const compliance = [
  {
    name: "ESIGN Act",
    description: "U.S. federal law establishing electronic signatures as legally binding",
    icon: CheckCircle,
  },
  {
    name: "UETA",
    description: "Uniform Electronic Transactions Act for U.S. state-level compliance",
    icon: CheckCircle,
  },
  {
    name: "eIDAS",
    description: "European regulation for electronic identification and trust services",
    icon: CheckCircle,
  },
  {
    name: "GDPR",
    description: "General Data Protection Regulation for EU data privacy",
    icon: CheckCircle,
  },
  {
    name: "HIPAA",
    description: "Health Insurance Portability and Accountability Act for healthcare data",
    icon: CheckCircle,
  },
  {
    name: "ISO 27001",
    description: "International standard for information security management",
    icon: CheckCircle,
  },
];

export default function SecurityPage() {
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
              <Link href="/security" className="text-blue-600 font-medium">
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
          <Shield className="h-20 w-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Enterprise-Grade
            <span className="text-blue-600"> Security</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your documents are protected by bank-level security. We take data protection seriously
            and maintain the highest security standards.
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Keep You Safe</h2>
          <p className="text-lg text-gray-600">
            Multiple layers of protection for your sensitive documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encryption Details */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Key className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AES-256 Encryption
              </h3>
              <p className="text-gray-600">
                Military-grade encryption for all documents at rest
              </p>
            </div>
            <div>
              <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                TLS 1.3 Transport
              </h3>
              <p className="text-gray-600">
                Secure data transmission using the latest TLS protocol
              </p>
            </div>
            <div>
              <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Zero-Knowledge Architecture
              </h3>
              <p className="text-gray-600">
                Your documents are encrypted before leaving your device
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Compliance & Certifications
          </h2>
          <p className="text-lg text-gray-600">
            We meet or exceed industry standards for security and compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compliance.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start"
              >
                <Icon className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Practices */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Security Practices
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Regular Security Audits
                </h3>
                <p className="text-gray-600">
                  Independent third-party security audits performed quarterly to identify and
                  address vulnerabilities.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Penetration Testing
                </h3>
                <p className="text-gray-600">
                  Annual penetration testing by certified ethical hackers to ensure our defenses
                  are robust.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Employee Training
                </h3>
                <p className="text-gray-600">
                  All employees undergo regular security training and background checks before
                  accessing any systems.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bug Bounty Program
                </h3>
                <p className="text-gray-600">
                  We reward security researchers who responsibly disclose vulnerabilities through
                  our bug bounty program.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Incident Response Plan
                </h3>
                <p className="text-gray-600">
                  24/7 security monitoring with a documented incident response plan to quickly
                  address any security events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerability Reporting */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
          <div className="flex items-start">
            <AlertCircle className="h-8 w-8 text-orange-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Security Vulnerability Reporting
              </h3>
              <p className="text-gray-700 mb-4">
                If you've discovered a security vulnerability, we appreciate your help in
                disclosing it to us responsibly. Please email our security team at{" "}
                <a
                  href="mailto:security@signatureapp.com"
                  className="text-blue-600 hover:underline"
                >
                  security@signatureapp.com
                </a>{" "}
                with details.
              </p>
              <p className="text-sm text-gray-600">
                We aim to acknowledge all security reports within 24 hours and provide regular
                updates on our investigation and remediation timeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Security is Our Priority
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start signing documents with confidence. Your data is protected every step of the way.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Start Signing Securely
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Contact Security Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


