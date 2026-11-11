import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Home } from 'lucide-react';
import { MascotRobotPixel } from '../components/ui/PixelArts';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 bg-arcade-grid text-white flex items-center justify-center p-6 pb-32">
      <div className="max-w-xl w-full bg-[#11182C] border-4 border-accent rounded-3xl p-8 sm:p-10 text-center shadow-neo-yellow space-y-6">
        <div className="flex justify-center">
          <MascotRobotPixel className="w-24 h-24" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded bg-red-600 text-white font-pixel text-[10px] tracking-widest uppercase">
            ERRO 404 · ROTA NÃO ENCONTRADA
          </span>
          <h1 className="font-pixel text-3xl sm:text-5xl text-accent tracking-wider pt-2">
            GAME OVER
          </h1>
        </div>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Parece que o seu bico extrusor saiu da mesa de impressão ou a coordenada G-Code aponta
          para fora da bancada do LabMaker!
        </p>

        <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-arcade-cyan">
          &gt; INSERT COIN TO CONTINUE... <span className="cursor-pixel-blink">_</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-pixel text-[10px] uppercase"
          >
            <Home className="w-4 h-4" /> VOLTAR AO INÍCIO
          </Link>
          <Link
            to="/equipamentos"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-brand text-white border-2 border-white/25 font-pixel text-[10px] uppercase"
          >
            <RotateCcw className="w-4 h-4" /> VER EQUIPAMENTOS
          </Link>
        </div>
      </div>
    </div>
  );
};
