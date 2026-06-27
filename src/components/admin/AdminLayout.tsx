import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiCode, FiAward, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { NeuCard, NeuButton } from '../common';

export const AdminLayout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Hero', path: '/admin/hero', icon: <FiUser /> },
    { name: 'About', path: '/admin/about', icon: <FiFileText /> },
    { name: 'Skills', path: '/admin/skills', icon: <FiCode /> },
    { name: 'Projects', path: '/admin/projects', icon: <FiCode /> },
    { name: 'Certificates', path: '/admin/certificates', icon: <FiAward /> },
    { name: 'Messages', path: '/admin/messages', icon: <FiMessageSquare /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4 space-y-6">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-xl font-bold tracking-wider text-primary">DINESH CMS</h2>
      </div>
      
      <nav className="flex-1 space-y-3 overflow-y-auto pr-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'shadow-neu-inset text-primary font-medium' 
                  : 'hover:shadow-neu hover:text-primary'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="pt-4 border-t border-neu-muted/20">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-red-500 hover:shadow-neu transition-all duration-300"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neu-bg text-neu-text">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0">
        <NeuCard className="h-full rounded-none rounded-r-3xl m-0 p-0" inset={false}>
          <SidebarContent />
        </NeuCard>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <NeuCard className="flex items-center justify-between p-4 rounded-full">
          <h2 className="text-lg font-bold text-primary">DINESH CMS</h2>
          <NeuButton variant="icon" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
            <FiMenu className="text-xl" />
          </NeuButton>
        </NeuCard>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-neu-bg/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 h-full bg-neu-bg shadow-neu flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <NeuButton variant="icon" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                <FiX className="text-xl text-red-500" />
              </NeuButton>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:max-w-[calc(100vw-18rem)] overflow-x-hidden min-h-screen pt-24 lg:pt-0">
        <div className="p-6 md:p-10 w-full h-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
