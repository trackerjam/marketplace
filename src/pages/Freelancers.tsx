import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Star, Code, Pencil, Camera, Briefcase, ChevronRight } from 'lucide-react';

type Freelancer = {
  id: string;
  username: string;
  hourly_rate: number;
  bio: string;
  skills: { name: string }[];
};

const categories = [
  { id: 'development', name: 'Development', icon: Code },
  { id: 'design', name: 'Design', icon: Pencil },
  { id: 'content', name: 'Content Creation', icon: Camera },
  { id: 'business', name: 'Business', icon: Briefcase },
];

function formatName(username: string): string {
  // Split username into parts
  const parts = username.split(/[\s_-]/);
  if (parts.length > 1) {
    // If multiple parts, show first name and last initial
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  // If single word, show first part and last character
  return `${username.slice(0, -1)}${username.charAt(username.length - 1)}.`;
}

export default function Freelancers() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: freelancers, isLoading } = useQuery({
    queryKey: ['freelancers', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          hourly_rate,
          bio,
          skills (name)
        `)
        .eq('user_type', 'freelancer');

      if (selectedCategory) {
        query = query.contains('skills', [{ category: selectedCategory }]);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data as Freelancer[];
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-4">Browse Freelancers</h1>
        <p className="text-[#666666] max-w-2xl">
          Find skilled professionals for your projects. We hide full names and photos to ensure 
          fair hiring based on skills and experience.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-4">
            <h2 className="font-medium text-[#1a1a1a] mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-[#f0f4ff] text-[#2d7ff9]'
                    : 'text-[#666666] hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-[#f0f4ff] text-[#2d7ff9]'
                        : 'text-[#666666] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2d7ff9] border-t-transparent mx-auto"></div>
            </div>
          ) : freelancers && freelancers.length > 0 ? (
            <div className="space-y-4">
              {freelancers.map((freelancer) => (
                <div key={freelancer.id} className="card p-6">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-[#1a1a1a]">
                          {formatName(freelancer.username)}
                        </h3>
                        <div className="flex items-center text-[#666666] text-sm">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          4.8
                        </div>
                      </div>
                      <p className="text-[#666666] mb-4 line-clamp-2 text-sm">
                        {freelancer.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {freelancer.skills?.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#f0f4ff] text-[#2d7ff9] text-xs px-2 py-1 rounded-full"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-[#666666]">
                        ${freelancer.hourly_rate}/hr
                      </div>
                    </div>
                    <Link
                      to={`/freelancers/${freelancer.id}`}
                      className="btn-secondary flex items-center gap-1"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-12 text-center">
              <p className="text-[#666666]">No freelancers found for the selected category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}