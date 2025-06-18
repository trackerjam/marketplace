import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Search, Briefcase, DollarSign, Calendar, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  created_at: string;
  skills: { skill: { name: string } }[];
};

type Filters = {
  search: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  skills: string[];
};

const categories = [
  'All Categories',
  'Development',
  'Design',
  'Writing',
  'Marketing',
  'Virtual Assistant',
  'Data Entry',
  'Customer Service',
  'Translation',
  'Video & Animation',
  'Music & Audio'
];

export default function Jobs() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'All Categories',
    minBudget: '',
    maxBudget: '',
    skills: [],
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', filters, selectedSkills],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          skills:job_skills(
            skill:skills(name)
          )
        `)
        .eq('status', 'open')
        .eq('visibility', 'public');

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.category !== 'All Categories') {
        query = query.eq('category', filters.category);
      }

      if (filters.minBudget) {
        query = query.gte('budget', parseFloat(filters.minBudget));
      }

      if (filters.maxBudget) {
        query = query.lte('budget', parseFloat(filters.maxBudget));
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      // Filter by skills on the frontend since it's complex to do in SQL
      let filteredData = data as Job[];
      if (selectedSkills.length > 0) {
        filteredData = data.filter(job => 
          selectedSkills.some(selectedSkill =>
            job.skills?.some(jobSkill => 
              jobSkill.skill.name.toLowerCase().includes(selectedSkill.toLowerCase())
            )
          )
        );
      }

      return filteredData;
    },
  });

  const { data: availableSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('name')
        .order('name');
      if (error) throw error;
      return data.map(skill => skill.name);
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Available Jobs</h1>
        <Link to="/post-job" className="btn-primary">
          Post a Job
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#0463fb]" />
              <h2 className="font-medium text-[#1a1a1a]">Filters</h2>
            </div>

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666666]" />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Budget Range
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  name="minBudget"
                  value={filters.minBudget}
                  onChange={handleBudgetChange}
                  placeholder="Min budget"
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                />
                <input
                  type="number"
                  name="maxBudget"
                  value={filters.maxBudget}
                  onChange={handleBudgetChange}
                  placeholder="Max budget"
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Skills
              </label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {availableSkills?.slice(0, 20).map(skill => (
                  <label key={skill} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="rounded border-gray-300 text-[#0463fb] focus:ring-[#0463fb]"
                    />
                    <span className="text-[#666666]">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0463fb] border-t-transparent mx-auto"></div>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg border border-[#e5e5e5] p-6 hover:border-[#0463fb] transition-all duration-200">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-medium text-[#1a1a1a] mb-2">
                        {job.title}
                      </h2>
                      <p className="text-[#666666] mb-4 line-clamp-2">
                        {job.description.replace(/<[^>]*>/g, '')}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-[#666666] mb-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#0463fb]" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-[#0463fb]" />
                          <span>${job.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#0463fb]" />
                          <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[#f0f4ff] text-[#0463fb] text-xs px-2 py-1 rounded-full"
                            >
                              {skill.skill.name}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="text-xs text-[#666666]">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn-secondary flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-12 text-center">
              <p className="text-[#666666]">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}