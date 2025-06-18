import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Camera, Loader2, Plus, X, CreditCard } from 'lucide-react';
import SkillsInput from '../components/SkillsInput';
import StripeConnect from '../components/StripeConnect';

type ProfileForm = {
  username: string;
  email: string;
  bio: string;
  location: string;
  hourly_rate?: number;
  company_name?: string;
  company_description?: string;
  website?: string;
};

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [skills, setSkills] = React.useState<string[]>([]);
  const [portfolioLinks, setPortfolioLinks] = React.useState<string[]>([]);
  const [newPortfolioLink, setNewPortfolioLink] = React.useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills:user_skills(
            skill:skills(name)
          )
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>();

  // Set form default values when profile data is loaded
  React.useEffect(() => {
    if (profile) {
      reset({
        username: profile.username,
        email: profile.email,
        bio: profile.bio || '',
        location: profile.location || '',
        hourly_rate: profile.hourly_rate || undefined,
        company_name: profile.company_name || '',
        company_description: profile.company_description || '',
        website: profile.website || '',
      });
      
      // Set skills
      const userSkills = profile.skills?.map((s: any) => s.skill.name) || [];
      setSkills(userSkills);
      
      // Set portfolio links
      setPortfolioLinks(profile.portfolio_links || []);
    }
  }, [profile, reset]);

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileForm) => {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...data,
          portfolio_links: portfolioLinks,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Update skills
      // First, delete existing user skills
      await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user?.id);

      if (skills.length > 0) {
        // Ensure all skills exist
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
          // Insert user-skill relationships
          const userSkills = skillData.map(skill => ({
            user_id: user?.id,
            skill_id: skill.id,
          }));

          await supabase
            .from('user_skills')
            .insert(userSkills);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Invalidate profile query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && !portfolioLinks.includes(newPortfolioLink.trim())) {
      setPortfolioLinks([...portfolioLinks, newPortfolioLink.trim()]);
      setNewPortfolioLink('');
    }
  };

  const removePortfolioLink = (linkToRemove: string) => {
    setPortfolioLinks(portfolioLinks.filter(link => link !== linkToRemove));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#0463fb] animate-spin" />
      </div>
    );
  }

  const isFreelancer = profile?.user_type === 'freelancer';
  const hasStripeAccount = !!profile?.stripe_connect_id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-8">Profile Settings</h1>

      {/* Stripe Connect for Freelancers */}
      {isFreelancer && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Setup
          </h2>
          <StripeConnect 
            isConnected={hasStripeAccount}
            accountId={profile?.stripe_connect_id}
            onConnect={() => queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })}
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#f0f4ff] flex items-center justify-center overflow-hidden">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-[#0463fb]" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image"
              disabled={isUploading}
            />
            <label
              htmlFor="profile-image"
              className={`absolute bottom-0 right-0 bg-white rounded-full p-2 border border-[#e5e5e5] cursor-pointer hover:border-[#0463fb] transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Camera className="w-4 h-4 text-[#0463fb]" />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-medium text-[#1a1a1a]">{profile?.username}</h2>
            <p className="text-[#666666]">{profile?.email}</p>
            <p className="text-sm text-[#666666] capitalize">{profile?.user_type}</p>
            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => updateProfile.mutate(data))} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Username *
            </label>
            <input
              type="text"
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Bio/About Me
            </label>
            <textarea
              id="bio"
              rows={4}
              {...register('bio')}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              {...register('location')}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
              placeholder="City, Country"
            />
          </div>

          {isFreelancer && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Skills
                </label>
                <SkillsInput
                  skills={skills}
                  onChange={setSkills}
                  placeholder="Add your skills..."
                />
              </div>

              <div>
                <label htmlFor="hourly_rate" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourly_rate"
                  {...register('hourly_rate', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Portfolio Links
                </label>
                <div className="space-y-2">
                  {portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={link}
                        readOnly
                        className="flex-1 px-3 py-2 border border-[#e5e5e5] rounded-md bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => removePortfolioLink(link)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newPortfolioLink}
                      onChange={(e) => setNewPortfolioLink(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      onClick={addPortfolioLink}
                      className="p-2 bg-[#0463fb] text-white rounded-md hover:bg-[#0355d5]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {profile?.user_type === 'business' && (
            <>
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company_name"
                  {...register('company_name', { 
                    required: profile?.user_type === 'business' ? 'Company name is required' : false 
                  })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                  placeholder="Your company name"
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="company_description" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Company Description
                </label>
                <textarea
                  id="company_description"
                  rows={4}
                  {...register('company_description')}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                  placeholder="Tell us about your company..."
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  {...register('website')}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full bg-[#0463fb] text-white px-4 py-2 rounded-md hover:bg-[#0355d5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}