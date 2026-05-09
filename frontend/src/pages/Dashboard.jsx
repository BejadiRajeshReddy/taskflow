import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Plus, LayoutDashboard, Clock, CheckCircle2, ListTodo, MoreHorizontal, ArrowRight, FolderKanban } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ projects: [], stats: { todo: 0, in_progress: 0, done: 0, total: 0 }, recent_tasks: [] });
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/projects/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();

    const handleOpenModal = () => setIsProjectModalOpen(true);
    window.addEventListener('open-new-project-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-project-modal', handleOpenModal);
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects/', projectForm);
      setIsProjectModalOpen(false);
      setProjectForm({ name: '', description: '' });
      // Refetch dashboard
      const res = await api.get('/projects/dashboard');
      setData(res.data);
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 text-sm">Loading workspace...</div>;

  const { stats, projects, recent_tasks } = data;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">Good morning, {user?.username}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Here's what's happening in your workspace today.</p>
        </div>
        <Button onClick={() => setIsProjectModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2 whitespace-nowrap">
          <Plus size={16} /> New Project
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Tasks</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300">
            <LayoutDashboard size={20} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">To Do</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{stats.todo}</p>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300">
            <ListTodo size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-500 mb-1">In Progress</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{stats.in_progress}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-500">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-emerald-500 mb-1">Completed</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{stats.done}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-emerald-900/20 rounded-lg text-green-600 dark:text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Active Projects</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">View all</button>
          </div>
          
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-xl p-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">No projects found. Start by creating a new one.</p>
              <Button variant="outline" size="sm" onClick={() => setIsProjectModalOpen(true)}>Create First Project</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <Link to={`/projects/${p.id}`} key={p.id} className="group bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h3>
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 flex-1">
                    {p.description || "No description provided."}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><LayoutDashboard size={14} /> {p.task_count} Tasks</span>
                    <span className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                      Open <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Recent Tasks</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {recent_tasks.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-500">No recent tasks.</div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {recent_tasks.map(t => (
                  <div key={t.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate pr-4">{t.title}</p>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
                        ${t.status === 'Done' ? 'bg-green-100 text-green-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          t.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                          'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}
                      `}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <FolderKanban size={12} /> {t.project_name}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-center">
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">View all activity</button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input 
            label="Project Name" 
            value={projectForm.name} 
            onChange={e => setProjectForm({...projectForm, name: e.target.value})} 
            required 
            autoFocus 
          />
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-200">Description</label>
            <textarea
              className="flex w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 min-h-[100px] resize-none"
              value={projectForm.description}
              onChange={e => setProjectForm({...projectForm, description: e.target.value})}
              placeholder="What is this project about?"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
