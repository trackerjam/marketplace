import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-[#666666] mb-8">
          Last updated: April 16, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">1. Agreement to Terms</h2>
          <p className="text-[#666666] mb-4">
            By accessing or using Trackerjam's platform, you agree to be bound by these Terms of 
            Service and all applicable laws and regulations. If you do not agree with any of these 
            terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">2. Use License</h2>
          <p className="text-[#666666] mb-4">
            Permission is granted to temporarily access the materials (information or software) 
            on Trackerjam's platform for personal, non-commercial transitory viewing only.
          </p>
          <p className="text-[#666666] mb-4">This license shall automatically terminate if you violate any of these restrictions and may be terminated by Trackerjam at any time.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">3. Platform Fees</h2>
          <p className="text-[#666666] mb-4">
            Trackerjam charges a 5% platform fee on all completed projects. This fee is automatically 
            deducted from the payment amount before transfer to the freelancer's account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">4. User Accounts</h2>
          <p className="text-[#666666] mb-4">
            You must provide accurate, complete, and current information when creating an account. 
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">5. Project Terms</h2>
          <p className="text-[#666666] mb-4">
            All project agreements are between freelancers and clients. Trackerjam provides the 
            platform for these interactions but is not a party to any project agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">6. Payment Terms</h2>
          <p className="text-[#666666] mb-4">
            Payments are processed through our secure payment system. Funds are held until project 
            completion and client approval. Disputes must be raised within 48 hours of project completion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">7. Termination</h2>
          <p className="text-[#666666] mb-4">
            We reserve the right to terminate or suspend access to our platform immediately, 
            without prior notice, for any violation of these Terms of Service.
          </p>
        </section>
      </div>
    </div>
  );
}