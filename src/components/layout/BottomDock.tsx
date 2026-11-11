import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Activity,
  Briefcase,
  Wrench,
  Users,
  Map,
  Trophy,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DockItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresInternal?: boolean;
  adminOnly?: boolean;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'home', label: 'Início & Sobre', path: '/', icon: Home },
  {
    id: 'agenda',
    label: 'Painel & Agenda do Lab',
    path: '/aluno',
    icon: Activity,
    requiresInternal: true,
  },
  { id: 'projetos', label: 'Projetos & Tutoriais', path: '/projetos', icon: Briefcase },
  { id: 'equipamentos', label: 'Equipamentos & Serviços', path: '/equipamentos', icon: Wrench },
  { id: 'equipe', label: 'Nossa Equipe', path: '/equipe', icon: Users },
  { id: 'local', label: 'Local & Contato', path: '/local', icon: Map },
  {
    id: 'quest',
    label: 'MakerLab Quest (8-Bits)',
    path: '/quest',
    icon: Trophy,
    requiresInternal: true,
  },
];

export const BottomDock: React.FC = () => {
  const { user, playClick, playHover, pushToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isVisitor = user.role === 'VISITANTE';
  const isAdmin = user.role === 'ADMIN';

  const handleDockClick = (item: DockItem) => {
    playClick();
    if (item.requiresInternal && isVisitor) {
      pushToast(
        'ÁREA DO PÚBLICO INTERNO',
        `Faça o Check-in ou Login como Aluno/Servidor para acessar "${item.label}".`,
        'info'
      );
      navigate(`/acesso?redirect=${encodeURIComponent(item.path)}`);
      return;
    }
    navigate(item.path);
  };

  return (
    <nav
      aria-label="Menu principal de navegação LabMaker"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-[20px] bg-brand border-[2.5px] border-accent shadow-[0_8px_24px_rgba(10,14,26,0.55),0_4px_0_#081026] flex items-center gap-1.5 sm:gap-2.5"
    >
      {DOCK_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
        const lockedForVisitor = Boolean(item.requiresInternal && isVisitor);

        return (
          <div key={item.id} className="relative group">
            <button
              type="button"
              onClick={() => handleDockClick(item)}
              onMouseEnter={playHover}
              aria-label={lockedForVisitor ? `${item.label} (Requer Check-in/Login)` : item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-surface-ink border-2 border-surface-ink shadow-[2px_3px_0px_#081026] -translate-y-1.5 scale-105'
                  : 'bg-[#253CE6]/70 hover:bg-[#3148F5] text-white border border-white/15 hover:-translate-y-0.5'
              }`}
            >
              <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.1]" />

              {lockedForVisitor && (
                <span
                  title="Acesso restrito a alunos/servidores — clique para fazer Check-in"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-arcade-bg border border-accent text-accent flex items-center justify-center shadow"
                >
                  <Lock className="w-2.5 h-2.5" />
                </span>
              )}
            </button>

            {/* Tooltip ao passar o mouse */}
            <div className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 rounded bg-arcade-bg text-white border border-accent shadow-neo-sm whitespace-nowrap font-pixel text-[8px] tracking-wider z-50">
              {item.label}
              {lockedForVisitor ? ' 🔒' : ''}
            </div>
          </div>
        );
      })}

      {/* Aba extra exclusiva quando logado como ADMINISTRADOR */}
      {isAdmin && (
        <div className="relative group pl-1 border-l border-white/20">
          <button
            type="button"
            onClick={() => {
              playClick();
              navigate('/admin');
            }}
            onMouseEnter={playHover}
            aria-label="Painel Administrativo"
            aria-current={location.pathname.startsWith('/admin') ? 'page' : undefined}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center transition-all duration-200 ${
              location.pathname.startsWith('/admin')
                ? 'bg-lime text-surface-ink border-2 border-surface-ink shadow-[2px_3px_0px_#081026] -translate-y-1.5 scale-105'
                : 'bg-arcade-bg text-arcade-cyan border border-arcade-cyan/60 hover:-translate-y-0.5'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
          <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 rounded bg-arcade-bg text-lime border border-lime whitespace-nowrap font-pixel text-[8px] z-50">
            Painel Admin ⚙️
          </div>
        </div>
      )}
    </nav>
  );
};
