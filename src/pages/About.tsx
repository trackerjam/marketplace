import React from 'react';
import { Building2, Users, Target, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">About Trackerjam</h1>
        <p className="text-lg text-[#666666] mb-8">
          We're revolutionizing the freelance marketplace by combining transparent pricing, 
          productivity tracking, and seamless payments into one powerful platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Our Mission</h2>
          <p className="text-[#666666] leading-relaxed">
            At Trackerjam, we believe in creating meaningful connections between talented 
            freelancers and forward-thinking businesses. Our platform is built on the principles 
            of transparency, fairness, and efficiency, ensuring both parties can focus on what 
            matters most - delivering great work.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Our Vision</h2>
          <p className="text-[#666666] leading-relaxed">
            We envision a future where freelancing is the preferred way of working for millions 
            of professionals worldwide. By providing the right tools and infrastructure, we're 
            making this future possible today.
          </p>
        </div>
      </div>

      {/* Platform statistics - temporarily hidden until we have accurate data
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="font-medium text-[#1a1a1a] mb-2">50K+</h3>
          <p className="text-sm text-[#666666]">Active Freelancers</p>
        </div>
        <div className="text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="font-medium text-[#1a1a1a] mb-2">10K+</h3>
          <p className="text-sm text-[#666666]">Businesses</p>
        </div>
        <div className="text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="font-medium text-[#1a1a1a] mb-2">95%</h3>
          <p className="text-sm text-[#666666]">Project Success Rate</p>
        </div>
        <div className="text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="font-medium text-[#1a1a1a] mb-2">$50M+</h3>
          <p className="text-sm text-[#666666]">Paid to Freelancers</p>
        </div>
      </div>
      */}

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-8">
        <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Our Team</h2>
        <p className="text-[#666666] mb-8">
          We're a diverse team of engineers, designers, and business professionals who are 
          passionate about creating the future of work. Our experience spans across technology, 
          freelancing, and marketplace businesses.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Engineering</h3>
            <p className="text-sm text-[#666666]">
              Building robust, scalable solutions that power millions of freelance relationships.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Product</h3>
            <p className="text-sm text-[#666666]">
              Crafting intuitive experiences that make freelancing seamless and efficient.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Support</h3>
            <p className="text-sm text-[#666666]">
              Providing world-class support to help our community succeed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}