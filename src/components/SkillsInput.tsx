import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

const predefinedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'PHP',
  'HTML/CSS', 'Vue.js', 'Angular', 'WordPress', 'Shopify', 'UI/UX Design',
  'Graphic Design', 'Logo Design', 'Web Design', 'Mobile App Design',
  'Content Writing', 'Copywriting', 'Blog Writing', 'Technical Writing',
  'SEO', 'Social Media Marketing', 'Email Marketing', 'PPC Advertising',
  'Data Entry', 'Virtual Assistant', 'Customer Service', 'Project Management'
];

export default function SkillsInput({ skills, onChange, placeholder = "Add skills..." }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = predefinedSkills.filter(
    skill => 
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !skills.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      onChange([...skills, skill.trim()]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkill(inputValue);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-[#f0f4ff] text-[#0463fb] px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
        />
        
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#e5e5e5] rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 5).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="w-full text-left px-3 py-2 hover:bg-[#f0f4ff] text-sm"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-[#666666] mt-1">
        Type and press Enter or comma to add skills
      </p>
    </div>
  );
}