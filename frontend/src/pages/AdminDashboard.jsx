import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Users, FolderKanban, CheckSquare, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ users: [], projects: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/admin/all-data');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("You do not have permission to view this page or it failed to load.");
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.is_admin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center dark:text-zinc-200">Loading admin panel...</div>;
  if (!user || !user.is_admin) return <Navigate to="/dashboard" replace />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-red-500" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors duration-300">Admin Control Panel</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">System-wide overview of all users, projects, and tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-4 transition-colors duration-300">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Users</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{data.users.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-4 transition-colors duration-300">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <FolderKanban size={28} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Projects</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{data.projects.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-4 transition-colors duration-300">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckSquare size={28} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Tasks</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{data.tasks.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.users.map(u => (
                <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">#{u.id}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{u.username}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{u.email}</td>
                  <td className="px-6 py-4">
                    {u.is_admin ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300">
                        User
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm transition-colors duration-300 mt-8">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Owner ID</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.projects.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">#{p.id}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">#{p.owner_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm transition-colors duration-300 mt-8">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Tasks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Project ID</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.tasks.map(t => (
                <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">#{t.id}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{t.title}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">#{t.project_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
