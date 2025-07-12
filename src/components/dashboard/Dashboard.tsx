import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Star, Users, Calendar, TrendingUp, Plus, Search, Filter, MapPin, Clock } from 'lucide-react';
import UserProfile from './UserProfile';
import SkillBrowser from './SkillBrowser';
import SwapRequests from './SwapRequests';
import AdminPanel from '../admin/AdminPanel';

const Dashboard: React.FC = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Skills Offered', value: userData?.skillsOffered.length || 0, icon: Star, color: 'blue' },
    { label: 'Skills Wanted', value: userData?.skillsWanted.length || 0, icon: TrendingUp, color: 'green' },
    { label: 'Active Swaps', value: 3, icon: Users, color: 'purple' },
    { label: 'Completed Swaps', value: 12, icon: Calendar, color: 'orange' }
  ];

  const recentSwaps = [
    {
      id: '1',
      type: 'incoming',
      fromUser: 'Sarah Johnson',
      skill: 'Photoshop',
      forSkill: 'React Development',
      status: 'pending',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'outgoing',
      toUser: 'Mike Chen',
      skill: 'JavaScript',
      forSkill: 'UI/UX Design',
      status: 'accepted',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'completed',
      withUser: 'Emma Davis',
      skill: 'Python',
      forSkill: 'Digital Marketing',
      status: 'completed',
      time: '3 days ago'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'browse':
        return <SkillBrowser />;
      case 'requests':
        return <SwapRequests />;
      case 'admin':
        return userData?.isAdmin ? <AdminPanel /> : null;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, {userData?.name}!</h1>
                  {userData?.isAdmin && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Administrator
                      </span>
                    </div>
                  )}
                  <p className="text-blue-100">Ready to discover new skills and share your expertise?</p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userData?.rating.toFixed(1)}</div>
                    <div className="text-blue-100 text-sm">Your Rating</div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                    <Star className="w-8 h-8 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('browse')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <Search className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Browse Skills</h3>
                  <p className="text-sm text-gray-600">Find people with the skills you need</p>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                >
                  <Plus className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-medium">Update Profile</h3>
                  <p className="text-sm text-gray-600">Add or edit your skills and availability</p>
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                >
                  <Users className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-medium">View Requests</h3>
                  <p className="text-sm text-gray-600">Manage your swap requests</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentSwaps.map((swap) => (
                  <div key={swap.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        swap.status === 'pending' ? 'bg-yellow-100' :
                        swap.status === 'accepted' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          swap.status === 'pending' ? 'text-yellow-600' :
                          swap.status === 'accepted' ? 'text-blue-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {swap.type === 'incoming' && `${swap.fromUser} wants to swap`}
                          {swap.type === 'outgoing' && `You requested to swap with ${swap.toUser}`}
                          {swap.type === 'completed' && `Swap completed with ${swap.withUser}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {swap.skill} ↔ {swap.forSkill || swap.skill}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        swap.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {swap.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{swap.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browse'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Skills
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Swap Requests
              </button>
              {userData?.isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'admin'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Admin Panel
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;