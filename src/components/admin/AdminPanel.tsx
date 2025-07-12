import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Download,
  Send,
  Shield,
  BarChart3,
  Settings,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState({ title: '', message: '', type: 'info' as const });
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Mock admin data
  const stats = [
    { label: 'Total Users', value: 1847, icon: Users, color: 'blue', change: '+12%' },
    { label: 'Active Swaps', value: 234, icon: MessageSquare, color: 'green', change: '+8%' },
    { label: 'Pending Reports', value: 7, icon: AlertTriangle, color: 'red', change: '-15%' },
    { label: 'Completed Today', value: 43, icon: CheckCircle, color: 'purple', change: '+23%' }
  ];

  const recentUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2024-01-15', status: 'active', reports: 0 },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', joinDate: '2024-01-14', status: 'active', reports: 1 },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com', joinDate: '2024-01-13', status: 'banned', reports: 3 },
    { id: '4', name: 'David Wilson', email: 'david@example.com', joinDate: '2024-01-12', status: 'active', reports: 0 }
  ];

  const recentSwaps = [
    {
      id: '1',
      users: ['Sarah J.', 'Mike C.'],
      skills: ['Photoshop', 'React'],
      status: 'completed',
      date: '2024-01-15',
      rating: 4.8
    },
    {
      id: '2',
      users: ['Emma D.', 'John S.'],
      skills: ['Marketing', 'Python'],
      status: 'active',
      date: '2024-01-14',
      rating: null
    },
    {
      id: '3',
      users: ['Lisa R.', 'Tom B.'],
      skills: ['Photography', 'Design'],
      status: 'pending',
      date: '2024-01-13',
      rating: null
    }
  ];

  const pendingReports = [
    {
      id: '1',
      reportedUser: 'Bad Actor',
      reportedBy: 'John Doe',
      reason: 'Inappropriate content in skill description',
      date: '2024-01-15',
      severity: 'medium'
    },
    {
      id: '2',
      reportedUser: 'Spam User',
      reportedBy: 'Jane Smith',
      reason: 'Sending spam messages',
      date: '2024-01-14',
      severity: 'high'
    }
  ];

  const handleBanUser = (userId: string) => {
    console.log('Banning user:', userId);
  };

  const handleUnbanUser = (userId: string) => {
    console.log('Unbanning user:', userId);
  };

  const handleResolveReport = (reportId: string, action: 'approve' | 'reject') => {
    console.log('Resolving report:', reportId, action);
  };

  const sendNotification = () => {
    console.log('Sending notification:', notification);
    setShowNotificationModal(false);
    setNotification({ title: '', message: '', type: 'info' });
  };

  const downloadReport = (type: string) => {
    console.log('Downloading report:', type);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recent Swaps</h3>
          <div className="space-y-3">
            {recentSwaps.map((swap) => (
              <div key={swap.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{swap.users.join(' ↔ ')}</p>
                  <p className="text-sm text-gray-600">{swap.skills.join(' ↔ ')}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                      swap.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {swap.status}
                  </span>
                  {swap.rating && (
                    <p className="text-xs text-gray-500 mt-1">★ {swap.rating}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <div key={report.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{report.reportedUser}</p>
                    <p className="text-sm text-gray-600">{report.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">Reported by {report.reportedBy}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${report.severity === 'high' ? 'bg-red-100 text-red-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {report.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">User Management</h3>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Join Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reports</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.joinDate}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${user.reports > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {user.reports}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Pending Reports</h3>
        <div className="space-y-4">
          {pendingReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Report against {report.reportedUser}</h4>
                  <p className="text-sm text-gray-600 mt-1">{report.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reported by {report.reportedBy} on {report.date}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${report.severity === 'high' ? 'bg-red-100 text-red-800' :
                    report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {report.severity}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleResolveReport(report.id, 'approve')}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span
                    onClick={() => alert('🔔 Please accept or reject this request')}
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    Take Action
                  </span>

                </button>
                <button
                  onClick={() => handleResolveReport(report.id, 'reject')}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Dismiss</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Platform Notifications</h3>
          <button
            onClick={() => setShowNotificationModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Send Notification</span>
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Recent Notifications</h4>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded border">
              <p className="font-medium text-sm">Platform Maintenance</p>
              <p className="text-sm text-gray-600">Scheduled maintenance on Sunday</p>
              <p className="text-xs text-gray-500">Sent 2 days ago • 1,847 recipients</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="font-medium text-sm">New Feature Update</p>
              <p className="text-sm text-gray-600">Enhanced skill matching algorithm</p>
              <p className="text-xs text-gray-500">Sent 1 week ago • 1,820 recipients</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDownloadReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Download Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => downloadReport('users')}
            className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-medium text-gray-900">User Activity Report</h4>
            <p className="text-sm text-gray-600 mt-1">Download detailed user statistics</p>
          </button>

          <button
            onClick={() => downloadReport('swaps')}
            className="p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <MessageSquare className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-medium text-gray-900">Swap Statistics</h4>
            <p className="text-sm text-gray-600 mt-1">Export swap completion data</p>
          </button>

          <button
            onClick={() => downloadReport('feedback')}
            className="p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
          >
            <Download className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="font-medium text-gray-900">Feedback Logs</h4>
            <p className="text-sm text-gray-600 mt-1">Download user feedback and ratings</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-purple-100">Manage platform operations and monitor activity</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'reports', label: 'Reports', icon: AlertTriangle },
              { id: 'notifications', label: 'Notifications', icon: Send },
              { id: 'download', label: 'Reports', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'download' && renderDownloadReports()}
        </div>
      </div>

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Send Platform Notification</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={notification.title}
                    onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={notification.message}
                    onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notification message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={notification.type}
                    onChange={(e) => setNotification({ ...notification, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="success">Success</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendNotification}
                  disabled={!notification.title || !notification.message}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send to All Users
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;