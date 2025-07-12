import React from 'react';
import { User, MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
  onRequestSwap?: (skill: Skill) => void;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skillId: number) => void;
  isOwn?: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ 
  skill, 
  onRequestSwap, 
  onEdit, 
  onDelete, 
  isOwn = false 
}) => {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {skill.user_photo ? (
              <img
                src={skill.user_photo}
                alt={skill.user_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900">{skill.user_name}</h3>
              {skill.user_location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {skill.user_location}
                </div>
              )}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            skill.skill_type === 'offered' 
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {skill.skill_type === 'offered' ? 'Offering' : 'Seeking'}
          </span>
        </div>

        {/* Skill Info */}
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{skill.title}</h4>
          {skill.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{skill.description}</p>
          )}
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="w-4 h-4 mr-1" />
              {skill.category}
            </div>
            {skill.level && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[skill.level]}`}>
                {skill.level}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isOwn ? (
            <>
              <button
                onClick={() => onEdit?.(skill)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(skill.id)}
                className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => onRequestSwap?.(skill)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center"
            >
              Request Swap
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;