
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music4, AlertCircle, Loader2 } from 'lucide-react';

const STREAMS = [
  { name: 'Lofi Chill Radio', url: 'https://stream.zeno.fm/f3v528z15m0uv' },
  { name: 'Study Beats', url: 'https://stream.zeno.fm/0r0xa792kwzuv' },
  { name: 'Coffee Shop Lofi', url: 'https://stream.zeno.fm/05axm672kwzuv' },
  { name: 'Synthwave Focus', url: 'https://stream.zeno.fm/99863r6v68zuv' }
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle stream change
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      setIsLoading(true);
      setHasError(false);
      audioRef.current.load();
      audioRef.current.play().catch(e => {
        console.warn("Autoplay failed:", e);
        setHasError(true);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [currentIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setHasError(false);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Audio error:", e);
        setHasError(true);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const nextStream = () => {
    setCurrentIdx((prev) => (prev + 1) % STREAMS.length);
  };

  const prevStream = () => {
    setCurrentIdx((prev) => (prev - 1 + STREAMS.length) % STREAMS.length);
  };

  return (
    <div className="flex flex-col gap-4">
      <audio 
        ref={audioRef} 
        src={STREAMS[currentIdx].url} 
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />
      
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 ${isPlaying ? 'animate-pulse' : ''}`}>
          {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Music4 size={24} />}
        </div>
        <div className="flex-grow overflow-hidden">
          <p className="text-sm font-bold text-white truncate">
            {hasError ? 'Erro no Stream' : STREAMS[currentIdx].name}
          </p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1">
            {hasError ? (
              <> <AlertCircle size={10} className="text-red-400" /> Tente outra estação </>
            ) : (
              'Streaming Live'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={prevStream} 
            className="text-white/40 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <SkipBack size={18} />
          </button>
          
          <button 
            onClick={togglePlay} 
            disabled={isLoading}
            className="w-10 h-10 bg-white text-indigo-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} className="ml-0.5" fill="currentColor" />
            )}
          </button>
          
          <button 
            onClick={nextStream} 
            className="text-white/40 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-white/30" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
