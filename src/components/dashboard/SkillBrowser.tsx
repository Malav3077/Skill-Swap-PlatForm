import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Clock, MessageSquare, Users } from 'lucide-react';

interface SkillUser {
  id: string;
  name: string;
  location: string;
  rating: number;
  totalRatings: number;
  skillsOffered: string[];
  availability: string[];
  profilePhoto?: string;
  distance?: string;
}

const SkillBrowser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState<SkillUser | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock data - in real app, this would come from your MongoDB via API
  const mockUsers: SkillUser[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      location: 'San Francisco, CA',
      rating: 4.8,
      totalRatings: 24,
      skillsOffered: ['Photoshop', 'Illustrator', 'UI/UX Design', 'Figma'],
      availability: ['Weekends', 'Evenings'],
      distance: '2.3 miles'
    },
    {
      id: '2',
      name: 'Mike Chen',
      location: 'New York, NY',
      rating: 4.9,
      totalRatings: 31,
      skillsOffered: ['React', 'Node.js', 'Python', 'JavaScript'],
      availability: ['Weekdays', 'Evenings'],
      distance: '1.2 miles'
    },
    {
      id: '3',
      name: 'Emma Davis',
      location: 'Austin, TX',
      rating: 4.7,
      totalRatings: 18,
      skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
      availability: ['Flexible'],
      distance: '5.1 miles'
    },
    {
      id: '4',
      name: 'David Wilson',
      location: 'Seattle, WA',
      rating: 4.6,
      totalRatings: 15,
      skillsOffered: ['Spanish', 'French', 'Translation', 'Teaching'],
      availability: ['Weekends', 'Mornings'],
      distance: '3.7 miles'
    },
    {
      id: '5',
      name: 'Lisa Rodriguez',
      location: 'Los Angeles, CA',
      rating: 4.9,
      totalRatings: 28,
      skillsOffered: ['Photography', 'Video Editing', 'Lightroom', 'Premiere Pro'],
      availability: ['Weekends', 'Afternoons'],
      distance: '4.2 miles'
    }
  ];

  const categories = [
    'all',
    'Design',
    'Programming',
    'Marketing',
    'Language',
    'Photography',
    'Business',
    'Music',
    'Writing'
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' ||
      user.skillsOffered.some(skill => {
        if (selectedCategory === 'Design') return ['Photoshop', 'Illustrator', 'UI/UX Design', 'Figma'].includes(skill);
        if (selectedCategory === 'Programming') return ['React', 'Node.js', 'Python', 'JavaScript'].includes(skill);
        if (selectedCategory === 'Marketing') return ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'].includes(skill);
        if (selectedCategory === 'Language') return ['Spanish', 'French', 'Translation', 'Teaching'].includes(skill);
        if (selectedCategory === 'Photography') return ['Photography', 'Video Editing', 'Lightroom', 'Premiere Pro'].includes(skill);
        return false;
      });

    return matchesSearch && matchesCategory;
  });

  const handleSendRequest = (user: SkillUser, skillWanted: string, skillOffered: string, message: string) => {
    // Here you would send the request to your backend/MongoDB
    console.log('Sending request:', { user, skillWanted, skillOffered, message });
    setShowRequestModal(false);
    setSelectedUser(null);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Skills</h2>
            <p className="text-gray-600">Find people with the skills you need and connect with them</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills or people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{user.rating} ({user.totalRatings})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
                {user.distance && <span className="text-blue-600">• {user.distance}</span>}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{user.availability.join(', ')}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills offered:</p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
              <button
                onClick={() => setSelectedUser(user)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowRequestModal(true);
                }}
                className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Request Swap
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && !showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {selectedUser.profilePhoto ? (
                      <img src={selectedUser.profilePhoto} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-xl">{selectedUser.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedUser.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-gray-600">({selectedUser.totalRatings} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedUser.location}</span>
                  {selectedUser.distance && <span className="text-blue-600">• {selectedUser.distance}</span>}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Skills Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{selectedUser.availability.join(', ')}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send Swap Request
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Swap Modal */}
      {showRequestModal && selectedUser && (
        <SwapRequestModal
          user={selectedUser}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedUser(null);
          }}
          onSend={handleSendRequest}
        />
      )}
    </div>
  );
};

// Swap Request Modal Component
const SwapRequestModal: React.FC<{
  user: SkillUser;
  onClose: () => void;
  onSend: (user: SkillUser, skillWanted: string, skillOffered: string, message: string) => void;
}> = ({ user, onClose, onSend }) => {
  const [selectedSkillWanted, setSelectedSkillWanted] = useState('');
  const [selectedSkillOffered, setSelectedSkillOffered] = useState('');
  const [message, setMessage] = useState('');

  // Mock user's offered skills - in real app, get from context
  const mySkills = ['JavaScript', 'React', 'Python', 'Design', 'Photography'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkillWanted && selectedSkillOffered) {
      alert(`Request sent to ${user.name}!\n\nWanted: ${selectedSkillWanted}\nOffered: ${selectedSkillOffered}`);
      onSend(user, selectedSkillWanted, selectedSkillOffered, message);
    } else {
      alert('Please select both a skill you want and a skill you offer.');
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Send Swap Request</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to learn from {user.name}:
              </label>
              <select
                value={selectedSkillWanted}
                onChange={(e) => setSelectedSkillWanted(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a skill...</option>
                {user.skillsOffered.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I can offer in return:
              </label>
              <select
                value={selectedSkillOffered}
                onChange={(e) => setSelectedSkillOffered(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a skill...</option>
                {mySkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell them why you'd like to swap skills..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SkillBrowser;