import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Calendar, Activity, Settings, Plus, Layout, ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'My Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Workspace Identity */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Layout size={16} />
            </div>
            TaskFlow
          </div>
        </div>

        {/* Create Project CTA */}
        <div className="p-4 shrink-0">
          <Button 
            className="w-full justify-start gap-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" 
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              if (location.pathname === '/projects') {
                window.dispatchEvent(new CustomEvent('open-new-project-modal'));
              } else {
                navigate('/projects', { state: { openNewProjectModal: true } });
              }
            }}
          >
            <Plus size={16} className="text-blue-600 dark:text-blue-400" /> Create Project
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 mt-4 px-3">
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
              `}
              onClick={() => setIsOpen(false)} // Close on mobile click
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
          {user?.is_admin && (
            <div className="mt-6 mb-2">
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-2">
                Admin
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <ShieldAlert size={18} />
                Admin Panel
              </NavLink>
            </div>
          )}
        </nav>

        {/* Bottom Navigation Removed */}
      </div>
    </>
  );
}
