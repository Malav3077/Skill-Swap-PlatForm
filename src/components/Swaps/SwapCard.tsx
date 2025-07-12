import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  ArrowRight, 
  MessageCircle,
  Calendar,
  Trash2
} from 'lucide-react';
import { SwapRequest } from '../../types';

interface SwapCardProps {
  swap: SwapRequest;
  currentUserId: number;
  onStatusUpdate: (swapId: number, status: string) => void;
  onDelete: (swapId: number) => void;
}

const SwapCard: React.FC<SwapCardProps> = ({ swap, currentUserId, onStatusUpdate, onDelete }) => {
  const isRequester = swap.requester_id === currentUserId;
  const isProvider = swap.provider_id === currentUserId;
  
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
  };

  const config = statusConfig[swap.status];
  const StatusIcon = config.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canAccept = isProvider && swap.status === 'pending';
  const canReject = isProvider && swap.status === 'pending';
  const canComplete = (isRequester || isProvider) && swap.status === 'accepted';
  const canCancel = isRequester && swap.status === 'pending';
  const canDelete = isRequester && ['rejected', 'cancelled'].includes(swap.status);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-5 h-5 text-gray-600" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(swap.created_at)}
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {swap.requester_photo ? (
              <img
                src={swap.requester_photo}
                alt={swap.requester_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{swap.requester_name}</p>
              <p className="text-sm text-gray-500">
                {isRequester ? 'You' : 'Requesting'}
              </p>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-medium text-gray-900">{swap.provider_name}</p>
              <p className="text-sm text-gray-500">
                {isProvider ? 'You' : 'Providing'}
              </p>
            </div>
            {swap.provider_photo ? (
              <img
                src={swap.provider_photo}
                alt={swap.provider_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Skills Exchange */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Offering</p>
              <p className="font-semibold text-blue-600">{swap.offered_skill_title}</p>
              <p className="text-xs text-gray-500">{swap.offered_skill_category}</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">For</p>
              <p className="font-semibold text-purple-600">{swap.wanted_skill_title}</p>
              <p className="text-xs text-gray-500">{swap.wanted_skill_category}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {swap.message && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5" />
              <p className="text-sm text-gray-700">{swap.message}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {canAccept && (
            <button
              onClick={() => onStatusUpdate(swap.id, 'accepted')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept
            </button>
          )}
          
          {canReject && (
            <button
              onClick={() => onStatusUpdate(swap.id, 'rejected')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </button>
          )}
          
          {canComplete && (
            <button
              onClick={() => onStatusUpdate(swap.id, 'completed')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Complete
            </button>
          )}
          
          {canCancel && (
            <button
              onClick={() => onStatusUpdate(swap.id, 'cancelled')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel
            </button>
          )}
          
          {canDelete && (
            <button
              onClick={() => onDelete(swap.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapCard;