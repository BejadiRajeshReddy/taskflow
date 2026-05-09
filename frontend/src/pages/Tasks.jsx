import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { CheckCircle2, ListTodo, Clock, FolderKanban, Calendar, Calendar as CalendarIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/projects/dashboard/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    const task = tasks.find(t => t.id === taskId);

    if (task && task.status !== newStatus) {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

      try {
        await api.put(`/projects/${task.project_id}/tasks/${taskId}`, { status: newStatus });
      } catch (err) {
        console.error("Failed to update status", err);
        fetchTasks(); // Revert on failure
      }
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 text-sm font-medium">Loading tasks...</div>;

  const groupedTasks = {
    'To Do': tasks.filter(t => t.status === 'To Do' || t.status === 'todo' || t.status === 'To do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress' || t.status === 'in_progress'),
    'Done': tasks.filter(t => t.status === 'Done' || t.status === 'done')
  };

  const columns = [
    { id: 'To Do', title: 'To Do', border: 'border-t-zinc-400 dark:border-t-zinc-600', bg: 'bg-zinc-100/50 dark:bg-zinc-800/20' },
    { id: 'In Progress', title: 'In Progress', border: 'border-t-amber-400 dark:border-t-amber-600', bg: 'bg-amber-50/50 dark:bg-amber-900/10' },
    { id: 'Done', title: 'Done', border: 'border-t-emerald-400 dark:border-t-emerald-600', bg: 'bg-emerald-50/50 dark:bg-emerald-900/10' }
  ];

  const priorityColors = {
    'Low': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400',
    'Medium': 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500',
    'High': 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500',
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto w-full h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">My Tasks</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">View and manage all your tasks across projects.</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 min-h-0">
          {columns.map(col => (
            <div key={col.id} className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4 px-1">
                <h3 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
                  {col.title}
                </h3>
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  {groupedTasks[col.id].length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto custom-scrollbar p-3 rounded-b-xl border-t-2 ${col.border} ${col.bg} transition-colors ${snapshot.isDraggingOver ? 'ring-2 ring-inset ring-black/5 dark:ring-white/5' : ''}`}
                  >
                    {groupedTasks[col.id].length === 0 && !snapshot.isDraggingOver ? (
                      <div className="text-center p-8 text-[13px] text-zinc-500 dark:text-zinc-500 italic">No tasks in this list</div>
                    ) : (
                      groupedTasks[col.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: 1,
                                zIndex: snapshot.isDragging ? 9999 : 'auto',
                              }}
                              className={`bg-white dark:bg-zinc-900 p-5 rounded-xl mb-3 cursor-grab active:cursor-grabbing border border-transparent dark:border-zinc-800 transition-[box-shadow,border-color,background-color] shadow-sm group ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/20' : 'hover:border-zinc-200 dark:hover:border-zinc-700'}`}
                            >
                              <h4 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-2">{task.title}</h4>
                              {task.description && (
                                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                              )}

                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${priorityColors[task.priority] || priorityColors['Medium']}`}>
                                    {task.priority || 'Medium'}
                                  </span>
                                  <Link to={`/projects/${task.project_id}`} className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                                    <FolderKanban size={12} />
                                    <span className="truncate max-w-[90px] text-[10px] font-bold uppercase tracking-wider">{task.project_name}</span>
                                  </Link>
                                </div>

                                {task.due_date && (
                                  <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
                                    <CalendarIcon size={12} />
                                    {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
