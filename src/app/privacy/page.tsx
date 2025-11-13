import { PenTool, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 6, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to SignatureApp ("we", "our", or "us"). We are committed to protecting your
            personal information and your right to privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our digital
            signature platform.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>Account information (name, email address, password)</li>
            <li>Documents you upload for signing</li>
            <li>Signature data (drawn, typed, or uploaded signatures)</li>
            <li>Payment and billing information</li>
            <li>Communications with our support team</li>
          </ul>

          <h3>2.2 Information Automatically Collected</h3>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To process your documents and signatures</li>
            <li>To manage your account and billing</li>
            <li>To send you notifications and updates</li>
            <li>To improve our services and user experience</li>
            <li>To detect and prevent fraud or abuse</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul>
            <li>
              <strong>With Recipients:</strong> When you send a document for signature, we share
              necessary information with the designated recipients
            </li>
            <li>
              <strong>Service Providers:</strong> We work with third-party service providers for
              hosting, analytics, payment processing, and email delivery
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights
              and safety
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
              sale of assets
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information,
            including:
          </p>
          <ul>
            <li>AES-256 encryption for data at rest</li>
            <li>TLS 1.3 encryption for data in transit</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and authentication requirements</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our services and comply
            with legal obligations. Typically:
          </p>
          <ul>
            <li>Active account data: Retained while your account is active</li>
            <li>Signed documents: Retained for 7 years for legal compliance</li>
            <li>Audit logs: Retained for 3 years</li>
            <li>Marketing data: Retained until you unsubscribe</li>
          </ul>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of your personal information
            </li>
            <li>
              <strong>Correction:</strong> Update or correct inaccurate information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal information
            </li>
            <li>
              <strong>Portability:</strong> Receive your data in a portable format
            </li>
            <li>
              <strong>Objection:</strong> Object to certain processing of your data
            </li>
            <li>
              <strong>Restriction:</strong> Request restriction of processing
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:privacy@signatureapp.com">privacy@signatureapp.com</a>.
          </p>

          <h2>8. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Maintain your session and preferences</li>
            <li>Analyze usage patterns and improve our service</li>
            <li>Provide personalized content</li>
            <li>Measure marketing campaign effectiveness</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may
            affect service functionality.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place, including Standard Contractual Clauses
            approved by the European Commission.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 18. We do not knowingly collect
            information from children. If you believe we have collected information from a child,
            please contact us immediately.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by email or through our service. The "Last updated" date at the top indicates
            when this policy was last revised.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact
            us:
          </p>
          <ul>
            <li>
              Email: <a href="mailto:privacy@signatureapp.com">privacy@signatureapp.com</a>
            </li>
            <li>Mail: 123 Business Avenue, San Francisco, CA 94102, United States</li>
            <li>
              Support: <Link href="/contact">Contact Form</Link>
            </li>
          </ul>

          <h2>13. GDPR Compliance (EU Users)</h2>
          <p>
            If you are located in the European Economic Area (EEA), you have additional rights
            under the General Data Protection Regulation (GDPR), including the right to lodge a
            complaint with your local data protection authority.
          </p>

          <h2>14. CCPA Compliance (California Users)</h2>
          <p>
            If you are a California resident, you have specific rights under the California
            Consumer Privacy Act (CCPA), including the right to know what personal information we
            collect and how we use it.
          </p>
        </div>
      </div>
    </div>
  );
}


