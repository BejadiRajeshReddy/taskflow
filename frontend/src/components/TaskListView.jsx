import { Calendar, Flag, User as UserIcon } from 'lucide-react';

export default function TaskListView({ tasks, members, onTaskClick }) {
  const priorityColors = {
    'Low': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    'Medium': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500',
    'High': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-500',
  };

  const statusColors = {
    'To Do': 'text-zinc-500 dark:text-zinc-400',
    'In Progress': 'text-amber-600 dark:text-amber-500',
    'Done': 'text-emerald-600 dark:text-emerald-500',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400">
              <th className="px-6 py-3 font-medium">Task</th>
              <th className="px-6 py-3 font-medium w-32">Status</th>
              <th className="px-6 py-3 font-medium w-32">Priority</th>
              <th className="px-6 py-3 font-medium w-40">Assignee</th>
              <th className="px-6 py-3 font-medium w-40">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No tasks found in this view.
                </td>
              </tr>
            ) : (
              tasks.map(task => {
                const assignee = task.assignee_id ? members.find(m => m.user_id === task.assignee_id)?.user : null;
                return (
                  <tr 
                    key={task.id} 
                    onClick={() => onTaskClick(task)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-900 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 font-medium ${statusColors[task.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-current`}></span>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md font-medium text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {assignee ? (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                            {assignee.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{assignee.username}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {task.due_date ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar size={12} />
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      ) : (
                        <span className="text-xs italic opacity-50">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
