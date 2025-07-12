import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { Skill } from '../../types';
import SkillCard from './SkillCard';
import SkillForm from './SkillForm';
import SwapRequestModal from '../Swaps/SwapRequestModal';

const SkillsPage: React.FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-skills'>('marketplace');
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    skill_type: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'marketplace') {
        const [skillsResponse, categoriesResponse] = await Promise.all([
          api.get(`/skills?${new URLSearchParams(filters)}`),
          api.get('/skills/categories')
        ]);
        setSkills(skillsResponse);
        setCategories(categoriesResponse);
      } else {
        const [mySkillsResponse, categoriesResponse] = await Promise.all([
          api.get(`/skills?user_id=${user?.id}`),
          api.get('/skills/categories')
        ]);
        setMySkills(mySkillsResponse);
        setCategories(categoriesResponse);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (skillData: any) => {
    try {
      await api.post('/skills', skillData);
      setShowSkillForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create skill:', error);
    }
  };

  const handleUpdateSkill = async (skillData: any) => {
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill.id}`, skillData);
        setEditingSkill(null);
        setShowSkillForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${skillId}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete skill:', error);
      }
    }
  };

  const handleRequestSwap = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowSwapModal(true);
  };

  const handleSwapRequest = async (swapData: any) => {
    try {
      await api.post('/swaps', swapData);
      setShowSwapModal(false);
      setSelectedSkill(null);
    } catch (error) {
      console.error('Failed to create swap request:', error);
    }
  };

  const currentSkills = activeTab === 'marketplace' ? skills : mySkills;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="text-gray-600 mt-1">
            {activeTab === 'marketplace' 
              ? 'Discover skills to learn and connect with teachers'
              : 'Manage your skills and expertise'
            }
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingSkill(null);
            setShowSkillForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('my-skills')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'my-skills'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Skills
        </button>
      </div>

      {/* Filters */}
      {activeTab === 'marketplace' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            <select
              value={filters.skill_type}
              onChange={(e) => setFilters({ ...filters, skill_type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="offered">Skills Offered</option>
              <option value="wanted">Skills Wanted</option>
            </select>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : currentSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isOwn={activeTab === 'my-skills'}
              onRequestSwap={handleRequestSwap}
              onEdit={(skill) => {
                setEditingSkill(skill);
                setShowSkillForm(true);
              }}
              onDelete={handleDeleteSkill}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {activeTab === 'marketplace' ? 'No skills found' : 'No skills yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'marketplace' 
              ? 'Try adjusting your filters or check back later'
              : 'Start by adding your first skill'
            }
          </p>
          {activeTab === 'my-skills' && (
            <button
              onClick={() => {
                setEditingSkill(null);
                setShowSkillForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Add Your First Skill
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showSkillForm && (
        <SkillForm
          skill={editingSkill}
          categories={categories}
          onSubmit={editingSkill ? handleUpdateSkill : handleCreateSkill}
          onClose={() => {
            setShowSkillForm(false);
            setEditingSkill(null);
          }}
        />
      )}

      {showSwapModal && selectedSkill && (
        <SwapRequestModal
          targetSkill={selectedSkill}
          onSubmit={handleSwapRequest}
          onClose={() => {
            setShowSwapModal(false);
            setSelectedSkill(null);
          }}
        />
      )}
    </div>
  );
};

export default SkillsPage;