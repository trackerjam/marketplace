import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-[#666666] mb-8">
          Last updated: April 16, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">1. Information We Collect</h2>
          <p className="text-[#666666] mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-[#666666] mb-4">
            <li>Account information (name, email, password)</li>
            <li>Profile information (skills, portfolio, work history)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Communication data (messages, proposals, reviews)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">2. How We Use Your Information</h2>
          <p className="text-[#666666] mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-[#666666] mb-4">
            <li>Provide and improve our services</li>
            <li>Process payments and prevent fraud</li>
            <li>Communicate with you about your account</li>
            <li>Analyze platform usage and trends</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">3. Information Sharing</h2>
          <p className="text-[#666666] mb-4">
            We do not sell your personal information. We share your information only:
          </p>
          <ul className="list-disc pl-6 text-[#666666] mb-4">
            <li>With your consent</li>
            <li>To process payments via Stripe</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">4. Data Security</h2>
          <p className="text-[#666666] mb-4">
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">5. Your Rights</h2>
          <p className="text-[#666666] mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-[#666666] mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">6. Contact Us</h2>
          <p className="text-[#666666] mb-4">
            If you have any questions about this Privacy Policy, please contact us at privacy@trackerjam.com
          </p>
        </section>
      </div>
    </div>
  );
}