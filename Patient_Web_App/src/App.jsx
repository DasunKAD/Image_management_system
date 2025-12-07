import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/layout/Navigation';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MedicalHistory from './pages/MedicalHistory';
import Reports from './pages/Reports';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import { LoadingSpinner } from './components/ui';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'history': return <MedicalHistory />;
      case 'reports': return <Reports />;
      case 'appointments': return <Appointments />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-5 max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;