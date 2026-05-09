import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Plus, MoreHorizontal, ArrowRight, FolderKanban } from 'lucide-react';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/');
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

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
      const res = await api.get('/projects/');
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 text-sm">Loading projects...</div>;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage all your team's active projects.</p>
        </div>
        <Button onClick={() => setIsProjectModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2 whitespace-nowrap">
          <Plus size={16} /> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-xl p-12 text-center max-w-2xl mx-auto mt-10">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <FolderKanban size={24} />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">Create your first project to start organizing your work and collaborating with your team.</p>
          <Button onClick={() => setIsProjectModalOpen(true)}>Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <Link to={`/projects/${p.id}`} key={p.id} className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[80px]"></div>
              
              <div className="flex justify-between items-start mb-4 z-10">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <FolderKanban size={20} />
                </div>
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors z-10">{p.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6 flex-1 z-10">
                {p.description || "No description provided."}
              </p>
              
              <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-end text-xs text-zinc-500 dark:text-zinc-400 z-10">
                <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  View details <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

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
