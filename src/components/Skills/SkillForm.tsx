import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Skill } from '../../types';

interface SkillFormProps {
  skill?: Skill | null;
  categories: string[];
  onSubmit: (skillData: any) => void;
  onClose: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, categories, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skill_type: 'offered' as 'offered' | 'wanted',
    level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced'
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (skill) {
      setFormData({
        title: skill.title,
        description: skill.description || '',
        category: skill.category,
        skill_type: skill.skill_type,
        level: skill.level || 'intermediate'
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        category: showNewCategory ? newCategory : formData.category
      };
      await onSubmit(submitData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Skill Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., React Development, Guitar Lessons"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe your skill, experience level, or what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            {!showNewCategory ? (
              <div className="space-y-2">
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add new category
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new category"
                />
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  ← Back to existing categories
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="skill_type"
                  value="offered"
                  checked={formData.skill_type === 'offered'}
                  onChange={handleChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                I can teach this
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="skill_type"
                  value="wanted"
                  checked={formData.skill_type === 'wanted'}
                  onChange={handleChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                I want to learn this
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                skill ? 'Update Skill' : 'Add Skill'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;