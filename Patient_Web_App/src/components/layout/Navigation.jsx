import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, Home, History, FileText, 
  Calendar, User, LogOut, Shield 
} from '../icons/Icons';

const Navigation = ({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'history', label: 'Medical History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const NavContent = () => (
    <>
      {/* User Info */}
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white text-lg font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-white font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-primary-300 text-sm">ID: {user?.id}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="p-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 mb-1 rounded-xl
                transition-all font-sans text-sm
                ${isActive 
                  ? 'bg-primary-500 text-white font-semibold' 
                  : 'text-primary-200 hover:bg-primary-600/50'
                }
              `}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-primary-200 hover:bg-primary-600/50 transition-all font-sans text-sm"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-primary-700 to-primary-800 flex-col fixed left-0 top-0 bottom-0 z-50">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <span className="text-white font-bold text-lg font-display">MediCare</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white/20 p-2 rounded-lg text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-primary-700 to-primary-800
        transform transition-transform duration-300 z-[70] flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <NavContent />
      </div>
    </>
  );
};

export default Navigation;