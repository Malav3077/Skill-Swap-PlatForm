import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { Skill } from '../../types';

interface SwapRequestModalProps {
  targetSkill: Skill;
  onSubmit: (swapData: any) => void;
  onClose: () => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ targetSkill, onSubmit, onClose }) => {
  const { user } = useAuth();
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      const response = await api.get(`/skills?user_id=${user?.id}`);
      // Filter to only show skills that could be offered in exchange
      const offeredSkills = response.filter((skill: Skill) => 
        skill.skill_type === 'offered' && skill.category === targetSkill.category
      );
      setMySkills(offeredSkills);
    } catch (error) {
      console.error('Failed to fetch my skills:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkillId) {
      setError('Please select a skill to offer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const swapData = {
        provider_id: targetSkill.user_id,
        offered_skill_id: parseInt(selectedSkillId),
        wanted_skill_id: targetSkill.id,
        message: message.trim() || undefined
      };
      
      await onSubmit(swapData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create swap request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Target Skill Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">You want to learn:</h3>
            <p className="text-lg font-bold text-blue-600">{targetSkill.title}</p>
            <p className="text-sm text-gray-600">from {targetSkill.user_name}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What skill will you offer in return? *
              </label>
              {mySkills.length > 0 ? (
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a skill to offer</option>
                  {mySkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.title} ({skill.category})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">
                    You don't have any skills in the {targetSkill.category} category to offer.
                  </p>
                  <p className="text-sm text-gray-500">
                    Add some skills first to request swaps.
                  </p>
                </div>
              )}
            </div>

            {mySkills.length > 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Introduce yourself and explain what you hope to learn..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedSkillId}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Send Request'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;