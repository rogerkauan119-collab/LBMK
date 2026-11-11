import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Award,
  CheckCircle2,
  Printer,
  Cpu,
  Flame,
  Shield,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MascotRobotPixel } from '../components/ui/PixelArts';

export const MakerLabQuestPage: React.FC = () => {
  const { user, data, completeQuest, playClick } = useApp();

  if (user.role === 'VISITANTE') {
    return <Navigate to="/acesso?redirect=/quest" replace />;
  }

  const quests = data?.quests || [];
  const ranking = [...(data?.users || [])].sort((a, b) => b.xp - a.xp);

  const currentLevelProgress = ((user.xp % 300) / 300) * 100;

  const renderQuestIcon = (icon: string) => {
    switch (icon) {
      case 'printer':
        return <Printer className="w-6 h-6 text-accent" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-arcade-cyan" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-orange-400" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-lime" />;
      default:
        return <Trophy className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <div className="flex-1 bg-arcade-grid text-white py-12 px-4 sm:px-6 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Arcade MakerLab Quest */}
        <div className="rounded-3xl bg-[#10172A] border-[3px] border-accent shadow-neo-yellow p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-brand border border-arcade-cyan font-pixel text-[9px] text-arcade-cyan uppercase">
              <Zap className="w-3.5 h-3.5 text-accent" /> PLATAFORMA GAMIFICADA 8-BITS
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
              MAKERLAB <span className="text-accent">QUEST</span> · ARENA IFES
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Complete missões reais de prototipagem, impressão 3D, confecção de placas PCI e corte
              a laser para subir de nível, colecionar medalhas 8-bits e liderar o ranking do
              laboratório!
            </p>

            {/* Barra de Progresso de Nível em steps */}
            <div className="pt-2 space-y-2 max-w-xl">
              <div className="flex items-center justify-between font-pixel text-[10px]">
                <span className="text-lime">JOGADOR: {user.name.toUpperCase()}</span>
                <span className="text-accent">
                  LVL {user.level} · {user.xp} XP
                </span>
              </div>
              <div className="w-full h-5 rounded-lg bg-black border-2 border-white/25 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-brand via-arcade-cyan to-lime rounded transition-all duration-500"
                  style={{ width: `${Math.max(12, currentLevelProgress)}%` }}
                />
              </div>
              <p className="font-mono text-xs text-gray-400">
                Faltam {300 - (user.xp % 300)} XP para alcançar o Nível {user.level + 1}
              </p>
            </div>
          </div>

          {/* Card Status & Medalhas Desbloqueadas */}
          <div className="lg:col-span-5 bg-arcade-bg rounded-2xl border-2 border-arcade-cyan/50 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <MascotRobotPixel className="w-16 h-16 shrink-0" />
              <div>
                <p className="font-pixel text-[9px] text-arcade-cyan uppercase">SUAS INSÍGNIAS</p>
                <h2 className="font-display font-bold text-xl uppercase text-white mt-0.5">
                  {user.badges.length} MEDALHAS CONQUISTADAS
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {user.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand/60 border border-accent text-accent font-pixel text-[8px] uppercase"
                >
                  <Award className="w-3.5 h-3.5 text-lime" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid: Missões Ativas (7 cols) + Ranking Geral (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Missões */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-pixel text-[9px] text-arcade-cyan uppercase">QUEST LOG</p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-white mt-1">
                  MISSÕES DISPONÍVEIS NO LABMAKER
                </h2>
              </div>
              <span className="font-pixel text-[9px] text-accent">{quests.length} MISSÕES</span>
            </div>

            <div className="space-y-4">
              {quests.map((q) => {
                const isDone = q.completedBy.includes(user.email.toLowerCase());
                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-[#0F241D] border-lime/70'
                        : 'bg-[#12192E] border-white/15 hover:border-accent'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-arcade-bg border border-white/20 flex items-center justify-center shrink-0">
                        {renderQuestIcon(q.badge_icon)}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-brand text-white font-pixel text-[7px] uppercase">
                            {q.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-arcade-cyan font-pixel text-[7px] uppercase">
                            {q.difficulty}
                          </span>
                          <span className="font-pixel text-[9px] text-accent">
                            +{q.xp_reward} XP
                          </span>
                        </div>
                        <h3 className="font-pixel text-xs sm:text-sm text-white uppercase">
                          {q.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {q.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-lime text-surface-ink font-pixel text-[8px] uppercase">
                          <CheckCircle2 className="w-4 h-4" /> CONCLUÍDA
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            completeQuest(q.id);
                          }}
                          className="px-4 py-3 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo-sm font-pixel text-[8px] uppercase active:translate-y-0.5"
                        >
                          RESGATAR +{q.xp_reward} XP
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Ranking Hall of Fame */}
          <div className="lg:col-span-5 bg-[#12192E] rounded-2xl border-2 border-accent p-6 space-y-5 shadow-neo-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-pixel text-[8px] text-accent uppercase">HIGH SCORES</span>
                <h2 className="font-display font-bold text-2xl uppercase text-white mt-1 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-accent" /> RANKING DO LABORATÓRIO
                </h2>
              </div>
              <span className="font-pixel text-[8px] text-lime">TOP MAKERS</span>
            </div>

            <div className="space-y-3">
              {ranking.map((r, index) => {
                const isCurrentUser = r.email.toLowerCase() === user.email.toLowerCase();
                return (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isCurrentUser
                        ? 'bg-brand/40 border-lime'
                        : index === 0
                        ? 'bg-accent/10 border-accent/60'
                        : 'bg-arcade-bg/80 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg font-pixel text-[10px] flex items-center justify-center ${
                          index === 0
                            ? 'bg-accent text-surface-ink'
                            : index === 1
                            ? 'bg-gray-300 text-surface-ink'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-display font-bold text-white text-sm sm:text-base flex items-center gap-2">
                          {r.name}
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded bg-lime text-surface-ink font-pixel text-[7px]">
                              VOCÊ
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {r.course || r.role} · Nível {r.level}
                        </p>
                      </div>
                    </div>

                    <span className="font-pixel text-xs text-accent">{r.xp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
