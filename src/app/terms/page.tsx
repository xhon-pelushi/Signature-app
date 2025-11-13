import { PenTool, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: November 6, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-lg max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using SignatureApp ("Service"), you agree to be bound by these Terms of
            Service ("Terms"). If you do not agree to these Terms, you may not use our Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            SignatureApp is a digital document signing platform that enables users to upload,
            sign, send, and manage documents electronically. The Service includes:
          </p>
          <ul>
            <li>Document upload and PDF viewing</li>
            <li>Electronic signature creation and placement</li>
            <li>Multi-party signing workflows</li>
            <li>Document tracking and notifications</li>
            <li>Audit trail and compliance features</li>
          </ul>

          <h2>3. Account Registration</h2>
          <h3>3.1 Eligibility</h3>
          <p>
            You must be at least 18 years old and have the legal capacity to enter into contracts
            to use our Service.
          </p>

          <h3>3.2 Account Security</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
            <li>Ensuring your account information is accurate and current</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree NOT to use the Service to:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code or viruses</li>
            <li>Impersonate others or provide false information</li>
            <li>Harass, abuse, or harm others</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the Service for fraudulent purposes</li>
            <li>Reverse engineer or copy our software</li>
          </ul>

          <h2>5. Electronic Signatures</h2>
          <h3>5.1 Legal Validity</h3>
          <p>
            Electronic signatures created through our Service are intended to be legally binding
            and enforceable under the U.S. ESIGN Act, UETA, and similar laws in other
            jurisdictions.
          </p>

          <h3>5.2 Your Responsibilities</h3>
          <ul>
            <li>You are responsible for the documents you sign</li>
            <li>You represent that you have authority to sign documents</li>
            <li>You acknowledge that electronic signatures have the same legal effect as handwritten signatures</li>
            <li>You agree not to dispute the validity of electronic signatures created through our Service</li>
          </ul>

          <h2>6. Subscription and Payment</h2>
          <h3>6.1 Plans and Pricing</h3>
          <p>
            We offer various subscription plans. Pricing is available on our{" "}
            <Link href="/pricing">Pricing page</Link> and is subject to change with notice.
          </p>

          <h3>6.2 Billing</h3>
          <ul>
            <li>Subscriptions are billed in advance on a monthly or annual basis</li>
            <li>All fees are non-refundable except as required by law or stated in our refund policy</li>
            <li>You authorize us to charge your payment method for all fees</li>
            <li>Failure to pay may result in service suspension or termination</li>
          </ul>

          <h3>6.3 Cancellation</h3>
          <p>
            You may cancel your subscription at any time from your account settings. Cancellation
            takes effect at the end of your current billing period.
          </p>

          <h2>7. Intellectual Property</h2>
          <h3>7.1 Our Rights</h3>
          <p>
            We own all rights to the Service, including software, design, content, and trademarks.
            You may not copy, modify, distribute, or create derivative works.
          </p>

          <h3>7.2 Your Content</h3>
          <p>
            You retain ownership of documents and content you upload. By using our Service, you
            grant us a limited license to process, store, and transmit your content solely to
            provide the Service.
          </p>

          <h2>8. Privacy and Data Protection</h2>
          <p>
            Your use of the Service is governed by our{" "}
            <Link href="/privacy">Privacy Policy</Link>. We are committed to protecting your data
            and complying with applicable privacy laws including GDPR and CCPA.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Guarantees of uninterrupted or error-free operation</li>
            <li>Warranties regarding accuracy, reliability, or completeness</li>
          </ul>

          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
          </p>
          <ul>
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages exceeding the amount you paid us in the past 12 months</li>
          </ul>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold us harmless from any claims, damages, losses, or
            expenses (including legal fees) arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Content you upload or share</li>
          </ul>

          <h2>12. Term and Termination</h2>
          <h3>12.1 Term</h3>
          <p>
            These Terms remain in effect while you use the Service.
          </p>

          <h3>12.2 Termination by You</h3>
          <p>
            You may terminate your account at any time by following the cancellation process in
            your account settings.
          </p>

          <h3>12.3 Termination by Us</h3>
          <p>
            We may suspend or terminate your account immediately if you violate these Terms or for
            any reason with 30 days' notice.
          </p>

          <h3>12.4 Effects of Termination</h3>
          <p>
            Upon termination, your right to use the Service ceases immediately. You may download
            your documents for 30 days after termination, after which we may delete your data.
          </p>

          <h2>13. Dispute Resolution</h2>
          <h3>13.1 Informal Resolution</h3>
          <p>
            If you have a dispute, please contact us at{" "}
            <a href="mailto:support@signatureapp.com">support@signatureapp.com</a> to attempt
            informal resolution.
          </p>

          <h3>13.2 Arbitration</h3>
          <p>
            Any disputes that cannot be resolved informally shall be resolved through binding
            arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h3>13.3 Governing Law</h3>
          <p>
            These Terms are governed by the laws of the State of California, without regard to
            conflict of law principles.
          </p>

          <h2>14. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of
            material changes via email or through the Service. Continued use after changes
            constitutes acceptance of the new Terms.
          </p>

          <h2>15. General Provisions</h2>
          <h3>15.1 Entire Agreement</h3>
          <p>
            These Terms, along with our Privacy Policy, constitute the entire agreement between
            you and SignatureApp.
          </p>

          <h3>15.2 Severability</h3>
          <p>
            If any provision is found invalid or unenforceable, the remaining provisions remain in
            effect.
          </p>

          <h3>15.3 Waiver</h3>
          <p>
            Our failure to enforce any right or provision does not constitute a waiver of that
            right.
          </p>

          <h3>15.4 Assignment</h3>
          <p>
            You may not assign or transfer these Terms. We may assign our rights and obligations
            without restriction.
          </p>

          <h2>16. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us:
          </p>
          <ul>
            <li>
              Email: <a href="mailto:legal@signatureapp.com">legal@signatureapp.com</a>
            </li>
            <li>Mail: 123 Business Avenue, San Francisco, CA 94102, United States</li>
            <li>
              Support: <Link href="/contact">Contact Form</Link>
            </li>
          </ul>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 mb-0">
              <strong>By using SignatureApp, you acknowledge that you have read, understood, and
              agree to be bound by these Terms of Service.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


