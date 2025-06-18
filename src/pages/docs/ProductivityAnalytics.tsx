import React from 'react';
import { BarChart, Clock, Brain, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductivityAnalytics() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-4">Productivity Analytics</h1>
          <p className="text-lg text-[#666666] mb-8">
            TrackerJam analyzes your web browser activity for freelancers and teams, providing detailed 
            insights into core time metrics and essential productivity reports.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Smart Activity Tracking</h3>
                    <p className="text-[#666666]">
                      Our browser extension intelligently monitors your work activity, categorizing time 
                      spent on different websites and applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Real-time Insights</h3>
                    <p className="text-[#666666]">
                      Get instant feedback on your productivity patterns with real-time analytics and 
                      activity scores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Key Metrics</h2>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Focus Score</h3>
                <div className="flex items-center gap-8 mb-6">
                  <div className="bg-[#f0f4ff] w-24 h-24 rounded-lg flex items-center justify-center">
                    <span className="text-3xl font-semibold text-[#0463fb]">85%</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#666666] mb-4">
                      Your Focus Score represents the percentage of time spent on productive tasks versus 
                      distractions. A higher score indicates better concentration and work efficiency.
                    </p>
                    <div className="h-2 bg-[#f0f4ff] rounded-full">
                      <div className="h-full w-[85%] bg-[#0463fb] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <h4 className="font-medium text-[#1a1a1a] mb-2">Active Time</h4>
                  <div className="flex items-center gap-2 text-2xl font-semibold text-[#0463fb] mb-2">
                    <Clock className="w-5 h-5" />
                    <span>6.5h</span>
                  </div>
                  <p className="text-sm text-[#666666]">Average daily active work time</p>
                </div>

                <div className="card p-6">
                  <h4 className="font-medium text-[#1a1a1a] mb-2">Deep Work</h4>
                  <div className="flex items-center gap-2 text-2xl font-semibold text-[#0463fb] mb-2">
                    <Brain className="w-5 h-5" />
                    <span>4.2h</span>
                  </div>
                  <p className="text-sm text-[#666666]">Focused, uninterrupted work sessions</p>
                </div>

                <div className="card p-6">
                  <h4 className="font-medium text-[#1a1a1a] mb-2">Productivity</h4>
                  <div className="flex items-center gap-2 text-2xl font-semibold text-[#0463fb] mb-2">
                    <Zap className="w-5 h-5" />
                    <span>92%</span>
                  </div>
                  <p className="text-sm text-[#666666]">Overall productivity rating</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Reports & Analytics</h2>
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Comprehensive Reporting</h3>
                  <div className="space-y-4 mb-6">
                    <p className="text-[#666666]">
                      Our detailed reports provide insights into:
                    </p>
                    <ul className="space-y-2 text-[#666666]">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#0463fb]" />
                        Daily and weekly productivity trends
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#0463fb]" />
                        Time spent on different projects and tasks
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#0463fb]" />
                        Focus periods and break patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#0463fb]" />
                        Application and website usage statistics
                      </li>
                    </ul>
                  </div>
                  <Link to="/docs/reports" className="btn-secondary inline-flex items-center gap-2">
                    View Sample Reports
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}