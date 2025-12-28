
import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { TodoList } from './components/TodoList';
import { MusicPlayer } from './components/MusicPlayer';
import { BackgroundPicker } from './components/BackgroundPicker';
import { AppSettings, DEFAULT_SETTINGS, Task } from './types';
import { Settings as SettingsIcon, BookOpen, Music, Image as ImageIcon, Target, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pomodoro-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [liquidStudySeconds, setLiquidStudySeconds] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro-liquid-time');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'settings'>('timer');

  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro-liquid-time', liquidStudySeconds.toString());
  }, [liquidStudySeconds]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleFocusTick = () => {
    setLiquidStudySeconds(prev => prev + 1);
  };

  const formatLiquidTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  const totalCompletedQuestions = tasks.reduce((acc, t) => acc + t.completedQuestions, 0);
  const progressPercent = Math.min(100, (totalCompletedQuestions / settings.dailyQuestionGoal) * 100);

  return (
    <div 
      className="min-h-screen w-full transition-all duration-700 bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 md:p-8"
      style={{ backgroundImage: `url(${settings.backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
        
        {/* Sidebar / Navigation */}
        <nav className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start space-x-4 lg:space-x-0 lg:space-y-6 glass-dark p-4 rounded-2xl">
          <button 
            onClick={() => setActiveTab('timer')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'timer' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Temporizador"
          >
            <BookOpen size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'tasks' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Lista de Questões"
          >
            <SettingsIcon size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Personalizar"
          >
            <ImageIcon size={24} />
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="lg:col-span-7 space-y-6">
          <div className="glass-dark p-8 rounded-3xl shadow-2xl min-h-[550px] flex flex-col items-center justify-center text-white">
            {activeTab === 'timer' && (
              <Timer settings={settings} onFocusTick={handleFocusTick} updateSettings={updateSettings} />
            )}
            {activeTab === 'tasks' && (
              <TodoList tasks={tasks} setTasks={setTasks} />
            )}
            {activeTab === 'settings' && (
              <BackgroundPicker currentBg={settings.backgroundImage} onSelect={(url) => updateSettings({ backgroundImage: url })} />
            )}
          </div>
        </main>

        {/* Music Player & Stats */}
        <aside className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="glass-dark p-6 rounded-3xl text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Music size={20} className="text-indigo-400" />
              Rádio Lo-fi
            </h3>
            <MusicPlayer />
          </div>

          <div className="glass-dark p-6 rounded-3xl text-white flex-grow flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={20} className="text-indigo-400" />
                Resumo do Dia
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Tempo Líquido de Estudo:</span>
                  <div className="flex items-center gap-1.5 text-indigo-300 font-mono">
                    <Clock size={14} />
                    {formatLiquidTime(liquidStudySeconds)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Meta de Questões:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">{totalCompletedQuestions} /</span>
                      <input 
                        type="number" 
                        value={settings.dailyQuestionGoal}
                        onChange={(e) => updateSettings({ dailyQuestionGoal: parseInt(e.target.value) || 0 })}
                        className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 w-14 text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-700 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              <button 
                onClick={() => {
                  if(confirm("Deseja resetar as estatísticas do dia?")) setLiquidStudySeconds(0);
                }}
                className="text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white/60 transition-colors"
              >
                Zerar estatísticas diárias
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
