import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForms from './components/auth/AuthForms';
import Navigation from './components/Navigation';
import Dashboard from './components/dashboard/Dashboard';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthForms />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Dashboard />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;