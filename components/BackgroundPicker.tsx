
import React, { useState } from 'react';
import { Image as ImageIcon, Link2, Check } from 'lucide-react';

const PRESETS = [
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2074',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2071',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2070'
];

interface BackgroundPickerProps {
  currentBg: string;
  onSelect: (url: string) => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ currentBg, onSelect }) => {
  const [customUrl, setCustomUrl] = useState('');

  const handleCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      onSelect(customUrl);
      setCustomUrl('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="text-indigo-400" />
        <h2 className="text-xl font-bold">Personalizar Fundo</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {PRESETS.map((url, i) => (
          <button 
            key={i}
            onClick={() => onSelect(url)}
            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${currentBg === url ? 'border-indigo-500 scale-[1.02]' : 'border-transparent hover:border-white/30'}`}
          >
            <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
            {currentBg === url && (
              <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                <Check className="text-white drop-shadow-lg" size={32} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white/70">
          <Link2 size={16} />
          Usar Imagem Customizada
        </h3>
        <form onSubmit={handleCustom} className="flex gap-2">
          <input 
            type="url"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Cole a URL da imagem aqui..."
            className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="bg-white text-indigo-900 font-bold px-6 py-2 rounded-xl hover:bg-white/90 transition-colors"
          >
            Aplicar
          </button>
        </form>
        <p className="mt-3 text-[10px] text-white/30 italic">
          * Sugestão: Use URLs do Unsplash para melhores resultados.
        </p>
      </div>
    </div>
  );
};
