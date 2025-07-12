import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, Star, Trash2, User } from 'lucide-react';
import { SwapRequest } from '../../types';

const SwapRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'completed'>('received');
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Mock data - in real app, this would come from your MongoDB via API
  const mockRequests: SwapRequest[] = [
    {
      id: '1',
      fromUserId: 'user1',
      toUserId: 'currentUser',
      fromUserName: 'Sarah Johnson',
      toUserName: 'You',
      skillOffered: 'Photoshop',
      skillWanted: 'React Development',
      status: 'pending',
      message: 'Hi! I love your React projects and would love to learn from you. I can help you with advanced Photoshop techniques.',
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      fromUserId: 'user2',
      toUserId: 'currentUser',
      fromUserName: 'Mike Chen',
      toUserName: 'You',
      skillOffered: 'Node.js',
      skillWanted: 'UI/UX Design',
      status: 'pending',
      message: 'Would love to swap skills! I can teach you backend development.',
      createdAt: new Date('2024-01-14T14:20:00'),
      updatedAt: new Date('2024-01-14T14:20:00')
    },
    {
      id: '3',
      fromUserId: 'currentUser',
      toUserId: 'user3',
      fromUserName: 'You',
      toUserName: 'Emma Davis',
      skillOffered: 'JavaScript',
      skillWanted: 'Digital Marketing',
      status: 'accepted',
      message: 'Looking forward to learning marketing from you!',
      createdAt: new Date('2024-01-13T09:15:00'),
      updatedAt: new Date('2024-01-13T16:45:00')
    },
    {
      id: '4',
      fromUserId: 'currentUser',
      toUserId: 'user4',
      fromUserName: 'You',
      toUserName: 'David Wilson',
      skillOffered: 'React',
      skillWanted: 'Spanish',
      status: 'completed',
      message: 'Thanks for the great Spanish lessons!',
      createdAt: new Date('2024-01-10T11:00:00'),
      updatedAt: new Date('2024-01-12T18:30:00')
    }
  ];

  const filteredRequests = mockRequests.filter(request => {
    if (activeTab === 'received') {
      return request.toUserId === 'currentUser' && request.status === 'pending';
    } else if (activeTab === 'sent') {
      return request.fromUserId === 'currentUser' && ['pending', 'accepted'].includes(request.status);
    } else {
      return request.status === 'completed';
    }
  });

  const handleAccept = (requestId: string) => {
    console.log('Accepting request:', requestId);
    alert(`✅ Request ${requestId} has been accepted!`);
    // You can also place the API call here
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    alert(`❌ Request ${requestId} has been rejected.`);
    // You can also place the API call here
  };


  const handleDelete = (requestId: string) => {
    // API call to delete the request
    console.log('Deleting request:', requestId);
  };

  const handleComplete = (requestId: string) => {
    // API call to mark as completed
    console.log('Completing request:', requestId);
    setShowRatingModal(true);
  };

  const submitRating = () => {
    // API call to submit rating
    console.log('Submitting rating:', { rating, feedback });
    setShowRatingModal(false);
    setRating(0);
    setFeedback('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Swap Requests</h2>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'received'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Received ({mockRequests.filter(r => r.toUserId === 'currentUser' && r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'sent'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Sent ({mockRequests.filter(r => r.fromUserId === 'currentUser' && ['pending', 'accepted'].includes(r.status)).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Completed ({mockRequests.filter(r => r.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {activeTab === 'received' && "You don't have any pending requests."}
              {activeTab === 'sent' && "You haven't sent any requests yet."}
              {activeTab === 'completed' && "No completed swaps yet."}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">
                          {activeTab === 'received' ? request.fromUserName : request.toUserName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(request.createdAt)}</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-gray-700">Skill Exchange:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {activeTab === 'received' ? request.skillOffered : request.skillWanted}
                        </span>
                        <span className="text-gray-400">↔</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {activeTab === 'received' ? request.skillWanted : request.skillOffered}
                        </span>
                      </div>
                    </div>

                    {request.message && (
                      <p className="text-gray-600 text-sm mb-4 italic">"{request.message}"</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                      {activeTab === 'received' && request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAccept(request.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {activeTab === 'sent' && request.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Cancel Request</span>
                        </button>
                      )}

                      {activeTab === 'sent' && request.status === 'accepted' && (
                        <button
                          onClick={() => handleComplete(request.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Completed</span>
                        </button>
                      )}

                      {activeTab === 'completed' && (
                        <button
                          onClick={() => setShowRatingModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          <Star className="w-4 h-4" />
                          <span>Rate Experience</span>
                        </button>
                      )}

                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rate Your Experience</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={rating === 0}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapRequests;