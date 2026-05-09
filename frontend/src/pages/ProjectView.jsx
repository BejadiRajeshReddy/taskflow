import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, ArrowLeft, Settings, Trash2, UserPlus, Calendar as CalendarIcon, Clock, ChevronDown } from 'lucide-react';

// Draggable Task Card
function TaskCard({ task, members, onClick, index }) {
  const priorityColors = {
    'Low': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    'Medium': 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500',
    'High': 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500',
  };

  const assignee = task.assignee_id ? members.find(m => m.user_id === task.assignee_id)?.user : null;

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div 
          id={`task-${task.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: 1,
            zIndex: snapshot.isDragging ? 9999 : 'auto',
          }}
          className={`bg-white dark:bg-zinc-900 p-5 rounded-xl mb-3 cursor-grab active:cursor-grabbing border border-transparent dark:border-zinc-800 transition-[box-shadow,border-color,background-color] shadow-sm ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/20' : 'hover:border-zinc-200 dark:hover:border-zinc-700'}`}
          onClick={() => onClick(task)}
        >
          <h4 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug">{task.title}</h4>
          {task.description && (
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              {task.due_date && (
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                  <CalendarIcon size={12} />
                  {new Date(task.due_date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                </div>
              )}
            </div>
            {assignee && (
               <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] shadow-sm">
                 {assignee.username.charAt(0).toUpperCase()}
               </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

// Droppable Column
function Column({ id, title, tasks, members, onTaskClick }) {
  const borderColors = {
    'To Do': 'border-t-zinc-400 dark:border-t-zinc-600',
    'In Progress': 'border-t-amber-400 dark:border-t-amber-600',
    'Done': 'border-t-emerald-400 dark:border-t-emerald-600',
  };

  const bgColors = {
    'To Do': 'bg-zinc-100/50 dark:bg-zinc-800/20',
    'In Progress': 'bg-amber-50/50 dark:bg-amber-900/10',
    'Done': 'bg-emerald-50/50 dark:bg-emerald-900/10',
  };

  return (
    <div className="flex flex-col flex-1 min-w-[320px] max-w-[380px] h-full">
      <div className="flex items-center gap-3 mb-4 px-1">
        <h3 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">{title}</h3>
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            className={`flex-1 transition-colors min-h-[150px] p-3 rounded-b-xl border-t-2 ${borderColors[title]} ${bgColors[title]} ${snapshot.isDraggingOver ? 'ring-2 ring-inset ring-black/5 dark:ring-white/5' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} members={members} onClick={onTaskClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Task form state
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium', assignee_id: '', due_date: '' });
  
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (location.hash && !loading && project) {
      const taskId = location.hash.replace('#task-', '');
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        // slight delay to ensure rendering is complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-zinc-950', 'transition-all', 'duration-500');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-zinc-950');
          }, 2000);
        }, 100);
      }
    }
  }, [location.hash, loading, project]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    const task = project.tasks.find(t => t.id === taskId);

    if (task && task.status !== newStatus) {
      // Optimistic update
      setProject(prev => {
        const updatedTasks = prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        return { ...prev, tasks: updatedTasks };
      });

      try {
        await api.put(`/projects/${id}/tasks/${taskId}`, { status: newStatus });
      } catch (err) {
        console.error("Failed to update status", err);
        fetchProject(); // Revert on failure
      }
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...taskForm };
      if (payload.assignee_id === '') {
        payload.assignee_id = null;
      }
      if (payload.due_date === '') {
        payload.due_date = null;
      } else if (payload.due_date) {
        payload.due_date = new Date(payload.due_date).toISOString();
      }
      
      if (selectedTask) {
        await api.put(`/projects/${id}/tasks/${selectedTask.id}`, payload);
      } else {
        await api.post(`/projects/${id}/tasks`, payload);
      }
      setIsTaskModalOpen(false);
      fetchProject();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const handleDeleteTask = async () => {
    if(!selectedTask) return;
    try {
      await api.delete(`/projects/${id}/tasks/${selectedTask.id}`);
      setIsTaskModalOpen(false);
      fetchProject();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/invite`, { email: inviteEmail });
      setIsInviteModalOpen(false);
      setInviteEmail('');
      fetchProject();
    } catch (err) {
      console.error("Failed to invite", err);
      alert(err.response?.data?.detail || "Failed to invite member");
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, editForm);
      setIsEditModalOpen(false);
      fetchProject();
    } catch (err) {
      console.error("Failed to update project", err);
      alert(err.response?.data?.detail || "Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error("Failed to delete project", err);
        alert(err.response?.data?.detail || "Failed to delete project");
      }
    }
  };

  const openEditModal = () => {
    setEditForm({ name: project.name, description: project.description || '' });
    setIsEditModalOpen(true);
  };

  const openNewTaskModal = (status = 'To Do') => {
    if (typeof status !== 'string') status = 'To Do';
    setSelectedTask(null);
    setTaskForm({ title: '', description: '', status, priority: 'Medium', assignee_id: '', due_date: '' });
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    if (typeof task === 'string') {
      openNewTaskModal(task);
      return;
    }
    setSelectedTask(task);
    
    // Format date for input[type="date"]
    let formattedDate = '';
    if (task.due_date) {
      formattedDate = new Date(task.due_date).toISOString().split('T')[0];
    }
    
    setTaskForm({ 
      title: task.title, 
      description: task.description || '', 
      status: task.status, 
      priority: task.priority, 
      assignee_id: task.assignee_id || '',
      due_date: formattedDate
    });
    setIsTaskModalOpen(true);
  };

  if (loading || !project) {
    return <div className="p-8 text-sm text-zinc-500">Loading project details...</div>;
  }

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950">
      {/* Project Header */}
      <div className="px-8 py-8 shrink-0">
        <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-6 hover:text-zinc-800 dark:hover:text-zinc-200 w-fit cursor-pointer transition-colors">
          <Link to="/dashboard" className="flex items-center gap-2 font-medium">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">{project.name}</h1>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{project.tasks.length} tasks</span>
            </div>
            {project.description && <p className="text-zinc-500 dark:text-zinc-400 text-sm">{project.description}</p>}
          </div>
          
          <div className="flex items-center gap-5 text-zinc-500 dark:text-zinc-400 mt-2 sm:mt-0">
            <button onClick={openEditModal} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" aria-label="Settings">
              <Settings size={20} strokeWidth={1.5} />
            </button>
            <button onClick={handleDeleteProject} className="hover:text-red-500 transition-colors" aria-label="Delete">
              <Trash2 size={20} strokeWidth={1.5} />
            </button>
            <div className="flex items-center ml-2">
              <div className="flex -space-x-2">
                 {project.members.map(m => (
                   <div key={m.user_id} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border border-zinc-950 text-xs font-bold text-white shadow-sm" title={m.user.username}>
                     {m.user.username.charAt(0).toUpperCase()}
                   </div>
                 ))}
              </div>
              <button onClick={() => setIsInviteModalOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ml-2">
                <UserPlus size={18} strokeWidth={1.5} />
              </button>
            </div>
            <button onClick={openNewTaskModal} className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity ml-4">
              <Plus size={18} strokeWidth={2} /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Board */}
      <div className="flex-1 overflow-auto px-8">
        <div className="flex gap-8 h-full items-start pb-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            {columns.map(col => (
              <Column 
                key={col} 
                id={col} 
                title={col} 
                tasks={project.tasks.filter(t => t.status === col)} 
                members={project.members}
                onTaskClick={openEditTaskModal}
              />
            ))}
          </DragDropContext>
        </div>
      </div>

      {/* Task Edit Modal Overlay */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity p-4">
          <div className="w-full max-w-[500px] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800/80">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedTask ? "Edit Task" : "Create Task"}
              </h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="flex flex-col">
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block mb-2">Title *</label>
                  <input 
                    type="text"
                    value={taskForm.title} 
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
                    required 
                    autoFocus
                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-3 py-2.5 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none dark:text-zinc-100 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block mb-2">Description</label>
                  <textarea
                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-3 py-2.5 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none dark:text-zinc-100 min-h-[120px] resize-none transition-colors"
                    value={taskForm.description}
                    onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block mb-2">Status</label>
                    <select 
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-3 py-2.5 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none dark:text-zinc-100 appearance-none"
                      value={taskForm.status}
                      onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                    >
                      <option value="To Do" className="dark:bg-zinc-900">To Do</option>
                      <option value="In Progress" className="dark:bg-zinc-900">In Progress</option>
                      <option value="Done" className="dark:bg-zinc-900">Done</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block mb-2">Priority</label>
                    <select 
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-3 py-2.5 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none dark:text-zinc-100 appearance-none"
                      value={taskForm.priority}
                      onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                    >
                      <option value="Low" className="dark:bg-zinc-900">Low</option>
                      <option value="Medium" className="dark:bg-zinc-900">Medium</option>
                      <option value="High" className="dark:bg-zinc-900">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block mb-2">Assignee</label>
                    <select 
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-3 py-2.5 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none dark:text-zinc-100 appearance-none"
                      value={taskForm.assignee_id}
                      onChange={e => setTaskForm({...taskForm, assignee_id: e.target.value ? Number(e.target.value) : ''})}
                    >
                      <option value="" className="dark:bg-zinc-900">Unassigned</option>
                      <option value={project.owner_id} className="dark:bg-zinc-900">Project Owner</option>
                      {project.members.map(m => (
                        <option key={m.user_id} value={m.user_id} className="dark:bg-zinc-900">{m.user.username}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block mb-2">Due Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-3 py-2.5 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none dark:text-zinc-100"
                      value={taskForm.due_date}
                      onChange={e => setTaskForm({...taskForm, due_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 flex justify-end items-center gap-3 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
                {selectedTask && (
                  <button 
                    type="button" 
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all mr-auto" 
                    onClick={handleDeleteTask}
                    title="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-8 py-2.5 rounded-lg shadow-lg shadow-zinc-900/10 dark:shadow-none hover:opacity-90 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">
                  {selectedTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <Input label="Email address" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required placeholder="user@example.com" />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Send Invite</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
        <form onSubmit={handleEditProject} className="space-y-4">
          <Input 
            label="Project Name" 
            value={editForm.name} 
            onChange={e => setEditForm({...editForm, name: e.target.value})} 
            required 
            autoFocus 
          />
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-200">Description</label>
            <textarea
              className="flex w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 min-h-[100px] resize-none"
              value={editForm.description}
              onChange={e => setEditForm({...editForm, description: e.target.value})}
              placeholder="What is this project about?"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
