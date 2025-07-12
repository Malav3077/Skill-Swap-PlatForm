import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { SwapRequest } from '../../types';
import SwapCard from './SwapCard';

const SwapsPage: React.FC = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  useEffect(() => {
    fetchSwaps();
  }, [activeTab]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const statusFilter = activeTab === 'all' ? '' : activeTab;
      const response = await api.get(`/swaps${statusFilter ? `?status=${statusFilter}` : ''}`);
      setSwaps(response);
    } catch (error) {
      console.error('Failed to fetch swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (swapId: number, status: string) => {
    try {
      await api.put(`/swaps/${swapId}/status`, { status });
      fetchSwaps();
    } catch (error) {
      console.error('Failed to update swap status:', error);
    }
  };

  const handleDeleteSwap = async (swapId: number) => {
    if (window.confirm('Are you sure you want to delete this swap request?')) {
      try {
        await api.delete(`/swaps/${swapId}`);
        fetchSwaps();
      } catch (error) {
        console.error('Failed to delete swap:', error);
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All Swaps', icon: Calendar },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  const filteredSwaps = swaps.filter(swap => {
    if (activeTab === 'all') return true;
    return swap.status === activeTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return swaps.length;
    return swaps.filter(swap => swap.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skill Swaps</h1>
          <p className="text-gray-600 mt-1">
            Manage your skill exchange requests and collaborations
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count = getTabCount(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Swaps List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredSwaps.length > 0 ? (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => (
            <SwapCard
              key={swap.id}
              swap={swap}
              currentUserId={user?.id || 0}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteSwap}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {activeTab === 'all' ? 'No swaps yet' : `No ${activeTab} swaps`}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? 'Start by browsing skills and requesting swaps'
              : `No swaps with ${activeTab} status found`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SwapsPage;