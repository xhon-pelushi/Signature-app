import { PenTool, Target, Users, Zap, Heart, Globe } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're on a mission to make digital signing accessible, secure, and simple for everyone.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description:
      "Every feature we build starts with understanding our users' needs and pain points.",
  },
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We embrace cutting-edge technology to deliver the fastest, most reliable signing experience.",
  },
  {
    icon: Heart,
    title: "Customer Success",
    description:
      "Your success is our success. We're committed to providing exceptional support and service.",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former VP of Product at DocuSign. 15 years in digital transformation.",
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer. Led development of enterprise security solutions.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Product",
    bio: "Product leader with expertise in SaaS and document management systems.",
  },
  {
    name: "David Kim",
    role: "Head of Security",
    bio: "Certified security expert with background in cryptography and compliance.",
  },
];

export default function AboutPage() {
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
              <Link href="/about" className="text-blue-600 font-medium">
                About
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
            About
            <span className="text-blue-600"> SignatureApp</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of digital document signing - making it faster, more secure,
            and accessible to everyone.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              SignatureApp was founded in 2023 by a team of engineers and product leaders who were
              frustrated with the complexity and cost of existing e-signature solutions. We believed
              there had to be a better way - one that was simpler, more affordable, and just as
              secure.
            </p>
            <p className="mb-4">
              Today, we're proud to serve thousands of users worldwide, from individual freelancers
              to large enterprises. Our platform processes millions of signatures every month,
              helping businesses move faster and work more efficiently.
            </p>
            <p>
              We're committed to building the most user-friendly, secure, and reliable digital
              signing platform on the market. And we're just getting started.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600">
            Passionate people building the future of digital signing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-blue-600 mb-3">{member.role}</p>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-200">Documents Signed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-200">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Careers CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Globe className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people who are passionate about building great
            products. Check out our open positions.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </div>
  );
}


