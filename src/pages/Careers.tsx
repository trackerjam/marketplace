import React from 'react';
import { ArrowRight, Code, Palette, HeartHandshake, Megaphone } from 'lucide-react';

// Commented out for later use
/*
const departments = [
  {
    name: 'Engineering',
    icon: Code,
    positions: [
      { title: 'Senior Full Stack Engineer', location: 'Remote', type: 'Full-time' },
      { title: 'DevOps Engineer', location: 'Remote', type: 'Full-time' },
    ],
  },
  {
    name: 'Design',
    icon: Palette,
    positions: [
      { title: 'Product Designer', location: 'Remote', type: 'Full-time' },
      { title: 'UX Researcher', location: 'Remote', type: 'Contract' },
    ],
  },
  {
    name: 'Customer Success',
    icon: HeartHandshake,
    positions: [
      { title: 'Customer Success Manager', location: 'Remote', type: 'Full-time' },
    ],
  },
  {
    name: 'Marketing',
    icon: Megaphone,
    positions: [
      { title: 'Content Marketing Manager', location: 'Remote', type: 'Full-time' },
    ],
  },
];
*/

export default function Careers() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Join Our Team</h1>
        <p className="text-lg text-[#666666] mb-8">
          Help us build the future of work. We're looking for passionate individuals who want 
          to make a difference in how people work and collaborate globally.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 mb-16">
        <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Why Trackerjam?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Remote-First</h3>
            <p className="text-sm text-[#666666]">
              Work from anywhere in the world. We believe in hiring the best talent, regardless of location.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Competitive Benefits</h3>
            <p className="text-sm text-[#666666]">
              Comprehensive health coverage, unlimited PTO, and annual learning stipend.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Growth Opportunities</h3>
            <p className="text-sm text-[#666666]">
              Fast-paced environment with plenty of opportunities to learn and advance your career.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 text-center">
        <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">No Current Openings</h2>
        <p className="text-[#666666] mb-6">
          We don't have any open positions at the moment, but we're always interested in 
          meeting talented individuals. Check back later for new opportunities.
        </p>
        <a 
          href="mailto:careers@trackerjam.com" 
          className="btn-secondary inline-flex items-center gap-2"
        >
          Send Your Resume
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}