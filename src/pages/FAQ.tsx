import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does Trackerjam's payment system work?",
    answer: "We use a simple, transparent payment system with a 5% platform fee. Payments are processed through Stripe, and funds are released to freelancers within 24 hours of work approval. Clients have a 48-hour window to review work before the payment is finalized."
  },
  {
    question: "What is the productivity tracking feature?",
    answer: "Our browser-based tracking tool monitors work activity and provides detailed productivity analytics. It helps build trust between clients and freelancers by providing transparent insights into work patterns and productivity metrics."
  },
  {
    question: "How do you protect freelancers and clients?",
    answer: "We protect both parties through secure payments, dispute resolution, and clear communication channels. All payments are reversible within 48 hours, and our support team helps resolve any issues that arise."
  },
  {
    question: "Can I hire international freelancers?",
    answer: "Yes, Trackerjam supports global hiring. Our platform handles international payments securely, and you can hire talent from anywhere in the world."
  },
  {
    question: "What are the platform fees?",
    answer: "We charge a simple 5% fee on completed projects. There are no monthly fees, no fees for posting jobs, and no fees for submitting proposals."
  },
  {
    question: "How do I get started as a freelancer?",
    answer: "Create an account, complete your profile with skills and portfolio, and start browsing available jobs. You can submit proposals for free and only pay the 5% platform fee when you complete projects."
  },
  {
    question: "What types of jobs can I post?",
    answer: "You can post any type of remote work, including development, design, writing, marketing, and more. Both short-term projects and longer-term engagements are welcome."
  },
  {
    question: "How does the dispute resolution process work?",
    answer: "If a dispute arises, both parties can contact our support team. We review the case, including tracked work data and communication history, to help reach a fair resolution within 48 hours."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-[#1a1a1a]">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-[#666666] transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-[#e5e5e5] bg-[#fafafa]">
                <p className="text-[#666666]">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}