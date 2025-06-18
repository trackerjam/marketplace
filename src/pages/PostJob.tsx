import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import SkillsInput from '../components/SkillsInput';

type JobForm = {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  require_trackerjam: boolean;
  min_trackerjam_hours?: number;
  visibility: 'public' | 'private';
  skills: string[];
};

const categories = [
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

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<JobForm>({
    defaultValues: {
      visibility: 'public',
      require_trackerjam: false,
      skills: [],
    },
  });

  const [skills, setSkills] = React.useState<string[]>([]);
  const requiresTrackerjam = watch('require_trackerjam');

  const onSubmit = async (data: JobForm) => {
    try {
      // Insert job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .insert([
          {
            ...data,
            business_id: user?.id,
            status: 'open',
          },
        ])
        .select()
        .single();

      if (jobError) throw jobError;

      // Insert skills
      if (skills.length > 0) {
        // First, ensure all skills exist in the skills table
        for (const skillName of skills) {
          await supabase
            .from('skills')
            .upsert({ name: skillName }, { onConflict: 'name' });
        }

        // Get skill IDs
        const { data: skillData } = await supabase
          .from('skills')
          .select('id, name')
          .in('name', skills);

        if (skillData) {
          // Insert job-skill relationships
          const jobSkills = skillData.map(skill => ({
            job_id: jobData.id,
            skill_id: skill.id,
          }));

          await supabase
            .from('job_skills')
            .insert(jobSkills);
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-8">Post a New Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-[#e5e5e5] p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#1a1a1a] mb-1">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' }
            })}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
            placeholder="e.g., Full Stack Developer for E-commerce Project"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#1a1a1a] mb-1">
            Category *
          </label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#1a1a1a] mb-1">
            Job Description *
          </label>
          <textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            rows={8}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent resize-vertical"
            placeholder="Describe the project requirements, deliverables, and any specific skills needed..."
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
            Required Skills
          </label>
          <SkillsInput
            skills={skills}
            onChange={setSkills}
            placeholder="Add required skills..."
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-[#1a1a1a] mb-1">
            Budget ($) *
          </label>
          <input
            type="number"
            id="budget"
            {...register('budget', { 
              required: 'Budget is required',
              min: { value: 50, message: 'Minimum budget is $50' }
            })}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
            placeholder="e.g., 1000"
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-[#1a1a1a] mb-1">
            Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            {...register('deadline', { required: 'Deadline is required' })}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="require_trackerjam"
              {...register('require_trackerjam')}
              className="rounded border-gray-300 text-[#0463fb] focus:ring-[#0463fb]"
            />
            <label htmlFor="require_trackerjam" className="text-sm font-medium text-[#1a1a1a]">
              Require Trackerjam for time tracking
            </label>
          </div>

          {requiresTrackerjam && (
            <div>
              <label htmlFor="min_trackerjam_hours" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                Minimum Hours per Week
              </label>
              <input
                type="number"
                id="min_trackerjam_hours"
                {...register('min_trackerjam_hours')}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                placeholder="e.g., 20"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            Visibility
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="public"
                value="public"
                {...register('visibility')}
                className="text-[#0463fb] focus:ring-[#0463fb]"
              />
              <label htmlFor="public" className="text-sm text-[#1a1a1a]">
                Public - Visible to all freelancers
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="private"
                value="private"
                {...register('visibility')}
                className="text-[#0463fb] focus:ring-[#0463fb]"
              />
              <label htmlFor="private" className="text-sm text-[#1a1a1a]">
                Private - Only visible to invited freelancers
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0463fb] text-white px-4 py-2 rounded-md hover:bg-[#0355d5] transition-colors"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}