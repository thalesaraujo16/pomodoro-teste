import React, { useState, useEffect, useRef } from 'react';
import { TimerMode, AppSettings, ALARM_SOUNDS } from '../types';
import { Play, Pause, RotateCcw, SkipForward, BrainCircuit, Settings2, Bell, Zap, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { getStudyTip } from '../services/geminiService';

interface TimerProps {
  settings: AppSettings;
  onFocusTick: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export const Timer: React.FC<TimerProps> = ({ settings, onFocusTick, updateSettings }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime);
  const [isActive, setIsActive] = useState(false);
  const [focusCount, setFocusCount] = useState(0); 
  const [tip, setTip] = useState<string>("Pronto para o próximo bloco?");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (mode === 'focus') setTimeLeft(settings.focusTime);
      else if (mode === 'shortBreak') setTimeLeft(settings.shortBreakTime);
      else if (mode === 'longBreak') setTimeLeft(settings.longBreakTime);
    }
  }, [settings.focusTime, settings.shortBreakTime, settings.longBreakTime, mode, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (mode === 'focus') onFocusTick();
          return prev - 1;
        });
      }, 1000) as unknown as number;
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const playAlarm = (soundUrl?: string) => {
    if (!audioRef.current || (!settings.alarmEnabled && !soundUrl)) return;

    const url = soundUrl || settings.alarmSound;
    
    try {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        setIsAudioLoading(true);
        playPromise
          .then(() => setIsAudioLoading(false))
          .catch(e => {
            console.warn("Autoplay bloqueado ou erro no carregamento:", e);
            setIsAudioLoading(false);
          });
      }
    } catch (e) {
      console.error("Erro ao reproduzir alarme:", e);
      setIsAudioLoading(false);
    }
  };

  const handleComplete = () => {
    playAlarm();
    
    let nextMode: TimerMode;
    let nextTime: number;

    if (mode === 'focus') {
      const newCount = focusCount + 1;
      setFocusCount(newCount);
      
      if (newCount % 4 === 0) {
        nextMode = 'longBreak';
        nextTime = settings.longBreakTime;
        showNotification("Ciclo de 4 blocos completo! Pausa longa iniciada.");
      } else {
        nextMode = 'shortBreak';
        nextTime = settings.shortBreakTime;
        showNotification("Foco concluído! Pausa curta iniciada.");
      }
    } else {
      nextMode = 'focus';
      nextTime = settings.focusTime;
      showNotification("Pausa finalizada! Voltando ao foco.");
    }

    setMode(nextMode);
    setTimeLeft(nextTime);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setFocusCount(0);
    if (mode === 'focus') setTimeLeft(settings.focusTime);
    else if (mode === 'shortBreak') setTimeLeft(settings.shortBreakTime);
    else setTimeLeft(settings.longBreakTime);
  };

  const skipTimer = () => {
    handleComplete();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fetchTip = async () => {
    setTip("Refletindo...");
    const newTip = await getStudyTip();
    setTip(newTip);
  };

  const handleTimeChange = (mKey: keyof AppSettings, val: string) => {
    const minutes = Math.max(1, parseInt(val) || 0);
    updateSettings({ [mKey]: minutes * 60 });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md relative">
      {/* Toast Notification */}
      {notification && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center animate-bounce-short z-50">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-indigo-400/50">
            <Bell size={14} className="animate-ring" />
            {notification}
          </div>
        </div>
      )}

      {/* Mode Switches */}
      <div className="flex gap-2 mb-10 bg-white/10 p-1 rounded-2xl w-full border border-white/5 relative">
        {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button 
            key={m}
            onClick={() => {
              setMode(m);
              setIsActive(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider relative ${mode === m ? 'bg-white text-indigo-900 shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            {m === 'focus' ? 'Foco' : m === 'shortBreak' ? 'Pausa' : 'Longa'}
            {m === 'focus' && focusCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-indigo-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-indigo-900">
                {focusCount % 4 || 4}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative mb-10 flex flex-col items-center justify-center w-full">
        <div className={`text-9xl font-bold font-mono tracking-tighter drop-shadow-2xl select-none transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/60'}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <button 
            onClick={() => setIsConfiguring(!isConfiguring)}
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${isConfiguring ? 'text-indigo-400' : 'text-white/30 hover:text-white/60'}`}
          >
            <Settings2 size={12} />
            Ajustar Intervalos
          </button>
          
          {isActive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 animate-pulse uppercase tracking-widest">
              <Zap size={10} fill="currentColor" />
              Automático
            </span>
          )}
        </div>

        {isConfiguring && (
          <div className="mt-6 w-full animate-fadeIn bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-black text-white/40 text-center">Foco</label>
                <input 
                  type="number" 
                  min="1"
                  value={settings.focusTime / 60} 
                  onChange={(e) => handleTimeChange('focusTime', e.target.value)}
                  className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-center font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-black text-white/40 text-center">Curta</label>
                <input 
                  type="number" 
                  min="1"
                  value={settings.shortBreakTime / 60} 
                  onChange={(e) => handleTimeChange('shortBreakTime', e.target.value)}
                  className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-center font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-black text-white/40 text-center">Longa</label>
                <input 
                  type="number" 
                  min="1"
                  value={settings.longBreakTime / 60} 
                  onChange={(e) => handleTimeChange('longBreakTime', e.target.value)}
                  className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-center font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-black text-white/40 tracking-widest flex items-center gap-2">
                  <Bell size={12} /> Alarme Final
                </span>
                <button 
                  onClick={() => updateSettings({ alarmEnabled: !settings.alarmEnabled })}
                  className={`p-1.5 rounded-lg transition-colors ${settings.alarmEnabled ? 'text-indigo-400 bg-indigo-400/10' : 'text-white/20 bg-white/5'}`}
                >
                  {settings.alarmEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ALARM_SOUNDS).map(([name, url]) => (
                  <button
                    key={name}
                    disabled={!settings.alarmEnabled || isAudioLoading}
                    onClick={() => {
                      updateSettings({ alarmSound: url });
                      playAlarm(url);
                    }}
                    className={`text-[10px] uppercase font-bold py-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      settings.alarmSound === url 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 disabled:opacity-30'
                    }`}
                  >
                    {isAudioLoading && settings.alarmSound === url ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      name === 'meditation' ? 'meditativo' : name
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button 
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white border border-white/5 shadow-inner"
          title="Resetar"
        >
          <RotateCcw size={22} />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all ${isActive ? 'bg-white text-indigo-900' : 'bg-indigo-500 text-white'}`}
          title={isActive ? 'Pausar' : 'Iniciar'}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
        </button>

        <button 
          onClick={skipTimer}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white border border-white/5 shadow-inner"
          title="Pular"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* AI Tip Section */}
      <div className="mt-12 w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-2 group transition-all hover:bg-white/[0.07]">
        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <BrainCircuit size={14} />
          Insight de Estudo
        </div>
        <p className="text-sm text-white/80 leading-relaxed italic font-medium px-2 min-h-[40px]">
          "{tip}"
        </p>
        <button 
          onClick={fetchTip}
          className="mt-2 text-[9px] text-white/20 hover:text-indigo-400 transition-colors uppercase font-black tracking-widest cursor-pointer py-1 px-3"
        >
          Gerar nova dica
        </button>
      </div>
    </div>
  );
};