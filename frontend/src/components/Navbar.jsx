import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './Button';
import { LogOut, Moon, Sun, Menu, Search, FolderKanban, CheckSquare } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';

export default function Navbar({ setIsSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ projects: [], tasks: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setSearchQuery('');
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults({ projects: [], tasks: [] });
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/projects/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleTaskClick = (task) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/projects/${task.project_id}#task-${task.id}`);
  };

  const handleProjectClick = (project) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/projects/${project.id}`);
  };

  const hasResults = searchResults.projects.length > 0 || searchResults.tasks.length > 0;

  return (
    <nav className="h-16 border-b bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 transition-colors duration-200 shrink-0 z-40 relative">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Left section: Mobile menu toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden sm:flex flex-col max-w-md w-full relative" ref={searchRef}>
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search tasks, projects..." 
                className="w-full pl-9 pr-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-zinc-300 dark:focus:border-zinc-700 rounded-md text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-all"
              />
            </div>

            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-[400px] overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-sm text-zinc-500 text-center">Searching...</div>
                ) : !hasResults ? (
                  <div className="p-4 text-sm text-zinc-500 text-center">No results found for "{searchQuery}"</div>
                ) : (
                  <div className="py-2">
                    {searchResults.projects.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Projects</div>
                        {searchResults.projects.map(p => (
                          <button 
                            key={p.id} 
                            onClick={() => handleProjectClick(p)}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                          >
                            <FolderKanban size={16} className="text-blue-500 shrink-0" />
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {searchResults.tasks.length > 0 && (
                      <div>
                        {searchResults.projects.length > 0 && <div className="border-t border-zinc-100 dark:border-zinc-800/50 my-1"></div>}
                        <div className="px-4 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Tasks</div>
                        {searchResults.tasks.map(t => (
                          <button 
                            key={t.id} 
                            onClick={() => handleTaskClick(t)}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex flex-col transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-1 w-full">
                              <CheckSquare size={16} className="text-zinc-400 shrink-0" />
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{t.title}</span>
                            </div>
                            <span className="text-[11px] text-zinc-500 ml-7 flex items-center gap-1.5">
                              in <span className="font-medium text-zinc-700 dark:text-zinc-300">{t.project_name}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleDark}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-zinc-200 dark:border-zinc-800">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 leading-tight">{user.username}</span>
            </div>
            {/* Simple Avatar Placeholder */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="ml-2 p-1.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}
