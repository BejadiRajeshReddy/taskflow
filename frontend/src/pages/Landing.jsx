import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { LayoutDashboard, Users, Moon, ArrowRight, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Landing() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 ease-in-out">

      {/* SECTION 1: HERO (100vh minus navbar) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-violet-400/30 dark:bg-violet-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>

        <div className="z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-10 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg shadow-indigo-500/10 transition-all duration-300 hover:scale-105">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>Introducing TaskFlow Enterprise</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-zinc-900 dark:text-white mb-8 transition-colors duration-500 leading-[1.1]">
            Build the future, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              together.
            </span>
          </h1>

          <p className="mt-4 text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-14 font-medium transition-colors duration-500 leading-relaxed">
            Unleash your team's potential with a unified platform designed to manage projects, conquer tasks, and streamline collaboration.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-3 text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all duration-300 hover:-translate-y-1">
                  Enter Workspace <ArrowRight size={22} />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-3 text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all duration-300 hover:-translate-y-1">
                    Start for free <ArrowRight size={22} />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 text-zinc-800 dark:text-white transition-all duration-300 hover:-translate-y-1">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES (100vh) */}
      <section className="relative min-h-screen flex items-center justify-center py-24 bg-white/50 dark:bg-zinc-950/50 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">Everything you need to ship faster</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">Powerful features wrapped in an elegant interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="group bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 text-left hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent dark:from-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px]"></div>
              <div className="bg-blue-100 dark:bg-blue-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Kanban Boards</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Drag and drop tasks across columns seamlessly. Visualize your entire project lifecycle at a single glance with our buttery-smooth boards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 text-left hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent dark:from-indigo-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px]"></div>
              <div className="bg-indigo-100 dark:bg-indigo-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Real-time Collab</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Invite your teammates in seconds. Assign tasks, share project ownership, and break down silos across your entire organization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 text-left hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-100 to-transparent dark:from-violet-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px]"></div>
              <div className="bg-violet-100 dark:bg-violet-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-violet-600 dark:text-violet-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Admin Controls</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Maintain complete oversight with dedicated Admin panels. Securely view and manage all users, projects, and tasks platform-wide.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 text-left hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden lg:col-span-3">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-100 to-transparent dark:from-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[200px]"></div>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 transition-transform duration-500 group-hover:scale-110">
                    <Moon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Gorgeous Dark Mode</h3>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Late night coding sessions? We've got you covered. TaskFlow features a meticulously crafted dark mode that reduces eye strain while looking incredibly premium. Toggle seamlessly without missing a beat.
                  </p>
                </div>
                <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-1/2 h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                    <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full shadow flex items-center justify-center">
                      <Moon size={18} className="text-zinc-800 dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-12 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800"></div>
                    <div className="w-full h-12 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800"></div>
                    <div className="w-3/4 h-12 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
