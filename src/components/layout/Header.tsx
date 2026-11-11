import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  ShieldAlert,
  Volume2,
  VolumeX,
  Tv,
  Home,
  Activity,
  Briefcase,
  Wrench,
  Users,
  Map,
  Trophy,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavShortcut {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresInternal?: boolean;
}

const NAV_SHORTCUTS: NavShortcut[] = [
  { id: 'home', label: 'Início & Sobre', shortLabel: 'Início', path: '/', icon: Home },
  {
    id: 'agenda',
    label: 'Painel & Agenda',
    shortLabel: 'Painel',
    path: '/aluno',
    icon: Activity,
    requiresInternal: true,
  },
  {
    id: 'projetos',
    label: 'Projetos & Tutoriais',
    shortLabel: 'Projetos',
    path: '/projetos',
    icon: Briefcase,
  },
  {
    id: 'equipamentos',
    label: 'Equipamentos & Serviços',
    shortLabel: 'Máquinas',
    path: '/equipamentos',
    icon: Wrench,
  },
  { id: 'equipe', label: 'Nossa Equipe', shortLabel: 'Equipe', path: '/equipe', icon: Users },
  { id: 'local', label: 'Local & Contato', shortLabel: 'Local', path: '/local', icon: Map },
  {
    id: 'quest',
    label: 'MakerLab Quest (8-Bits)',
    shortLabel: 'Quest',
    path: '/quest',
    icon: Trophy,
    requiresInternal: true,
  },
];

export const Header: React.FC = () => {
  const {
    user,
    logoutToVisitor,
    sfxEnabled,
    crtEnabled,
    toggleSfx,
    toggleCrt,
    playClick,
    playHover,
    pushToast,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isVisitor = user.role === 'VISITANTE';
  const isAdmin = user.role === 'ADMIN';

  const handleAuthAction = () => {
    playClick();
    if (user.role === 'VISITANTE') {
      navigate('/acesso');
    } else if (location.pathname === '/acesso') {
      logoutToVisitor();
    } else {
      navigate('/acesso');
    }
  };

  const handleShortcutClick = (item: NavShortcut) => {
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
    <>
      <header className="sticky top-0 z-50 w-full bg-brand/95 backdrop-blur-md border-b-[3px] border-accent shadow-[0_6px_20px_rgba(10,14,26,0.45)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
          {/* 1. Esquerda: Logo LABMAKER · IFES CAMPUS SERRA */}
          <Link
            to="/"
            onClick={playClick}
            onMouseEnter={playHover}
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            aria-label="Ir para o início do LabMaker IFES Campus Serra"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-dark/80 border border-accent/40 flex items-center justify-center shadow-neo-sm">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-accent fill-current transition-transform duration-500 group-hover:rotate-180"
                aria-hidden="true"
              >
                <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9.4 3.1l-1.7-.3a7.3 7.3 0 00-.7-1.7l1-1.4a.8.8 0 00-.1-1l-1.4-1.4a.8.8 0 00-1-.1l-1.4 1a7.3 7.3 0 00-1.7-.7l-.3-1.7a.8.8 0 00-.8-.7h-2a.8.8 0 00-.8.7l-.3 1.7a7.3 7.3 0 00-1.7.7l-1.4-1a.8.8 0 00-1 .1L4.7 6.7a.8.8 0 00-.1 1l1 1.4a7.3 7.3 0 00-.7 1.7l-1.7.3a.8.8 0 00-.7.8v2c0 .4.3.7.7.8l1.7.3c.2.6.4 1.2.7 1.7l-1 1.4a.8.8 0 00.1 1l1.4 1.4c.3.3.7.3 1 .1l1.4-1c.5.3 1.1.5 1.7.7l.3 1.7c.1.4.4.7.8.7h2c.4 0 .7-.3.8-.7l.3-1.7c.6-.2 1.2-.4 1.7-.7l1.4 1c.3.2.7.2 1-.1l1.4-1.4c.3-.3.3-.7.1-1l-1-1.4c.3-.5.5-1.1.7-1.7l1.7-.3c.4-.1.7-.4.7-.8v-2a.8.8 0 00-.6-.8z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-pixel text-white text-xs sm:text-sm tracking-wider drop-shadow-[2px_2px_0_#0B1470]">
                LABMAKER
              </span>
              <span className="font-pixel text-accent text-[8px] tracking-[0.14em] mt-1">
                IFES CAMPUS SERRA
              </span>
            </div>
          </Link>

          {/* 2. Centro: Barra de Atalhos Dinâmica Integrada à Parte Fixa (Dock Pílula Animada) */}
          <nav
            aria-label="Barra fixa de atalhos rápidos do LabMaker"
            className="order-3 lg:order-2 w-full lg:w-auto flex items-center justify-center"
          >
            <div className="px-2 py-1.5 rounded-[18px] bg-brand-dark/90 border-2 border-accent shadow-[0_4px_0_#081026] flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full">
              {NAV_SHORTCUTS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);
                const isHovered = hoveredId === item.id;
                const lockedForVisitor = Boolean(item.requiresInternal && isVisitor);
                const showExpandedLabel = isActive || isHovered;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    layout
                    onClick={() => handleShortcutClick(item)}
                    onMouseEnter={() => {
                      playHover();
                      setHoveredId(item.id);
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    aria-label={
                      lockedForVisitor ? `${item.label} (Requer Check-in/Login)` : item.label
                    }
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative h-10 px-2.5 sm:px-3 rounded-[11px] flex items-center gap-2 transition-colors shrink-0 ${
                      isActive
                        ? 'bg-accent text-surface-ink border-2 border-surface-ink shadow-[2px_2px_0px_#081026]'
                        : 'bg-[#1F35D6]/85 hover:bg-[#2E46F0] text-white border border-white/15'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.2] shrink-0" />

                    <AnimatePresence initial={false}>
                      {showExpandedLabel && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.16 }}
                          className={`overflow-hidden whitespace-nowrap font-display font-bold uppercase text-xs tracking-wider ${
                            isActive ? 'text-surface-ink' : 'text-accent'
                          }`}
                        >
                          {item.shortLabel}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {lockedForVisitor && (
                      <span
                        title="Acesso restrito a alunos/servidores — clique para fazer Check-in"
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-arcade-bg border border-accent text-accent flex items-center justify-center shadow"
                      >
                        <Lock className="w-2 h-2" />
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {/* Atalho extra dinâmico quando logado como ADMIN */}
              {isAdmin && (
                <motion.button
                  type="button"
                  layout
                  onClick={() => {
                    playClick();
                    navigate('/admin');
                  }}
                  onMouseEnter={() => {
                    playHover();
                    setHoveredId('admin');
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ y: -2, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Painel Administrativo"
                  className={`relative h-10 px-2.5 sm:px-3 rounded-[11px] flex items-center gap-1.5 shrink-0 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-lime text-surface-ink border-2 border-surface-ink shadow-[2px_2px_0px_#081026]'
                      : 'bg-arcade-bg text-arcade-cyan border border-arcade-cyan/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="font-pixel text-[8px] uppercase hidden sm:inline">ADMIN</span>
                </motion.button>
              )}
            </div>
          </nav>

          {/* 3. Direita: Selo Verde-Limão de Perfil + Botão Amarelo SAIR / AUTENTICAR */}
          <div className="order-2 lg:order-3 flex items-center gap-2 shrink-0">
            <Link
              to={user.role === 'ADMIN' ? '/admin' : user.role === 'ALUNO' ? '/aluno' : '/acesso'}
              onClick={playClick}
              onMouseEnter={playHover}
              title="Clique para gerenciar seu perfil ou alternar conta"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-[5px] bg-lime text-surface-ink border-2 border-surface-ink shadow-[3px_3px_0px_#081026] font-pixel text-[8px] sm:text-[9px] tracking-wider hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 stroke-[2.6]" />
              <span className="truncate max-w-[95px] sm:max-w-[140px] uppercase">
                {user.role === 'VISITANTE'
                  ? 'VISITANTE'
                  : user.role === 'ADMIN'
                  ? `ADMIN · ${user.name.split(' ')[0]}`
                  : user.name.split(' ')[0]}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleAuthAction}
              onMouseEnter={playHover}
              className="px-2.5 sm:px-3.5 py-2 rounded-[5px] bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-[3px_3px_0px_#081026] font-pixel text-[8px] sm:text-[9px] tracking-wider active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              SAIR / AUTENTICAR
            </button>
          </div>
        </div>
      </header>

      {/* Toggles escuros com borda amarela logo abaixo do header fixo à direita: SFX: ON/OFF e CRT: ON/OFF */}
      <div className="fixed top-[116px] lg:top-[68px] right-3 sm:right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSfx}
          aria-pressed={sfxEnabled}
          aria-label={`Efeitos sonoros 8 bits: ${sfxEnabled ? 'Ligado' : 'Desligado'}`}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] bg-arcade-bg text-lime border-2 border-accent shadow-[3px_3px_0px_#081026] font-pixel text-[8px] sm:text-[9px] hover:brightness-110 active:translate-y-[1px] transition-all"
        >
          {sfxEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-lime shrink-0" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          )}
          <span className={sfxEnabled ? 'text-lime' : 'text-gray-400'}>
            SFX: {sfxEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={toggleCrt}
          aria-pressed={crtEnabled}
          aria-label={`Filtro de monitor CRT: ${crtEnabled ? 'Ligado' : 'Desligado'}`}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] bg-arcade-bg text-lime border-2 border-accent shadow-[3px_3px_0px_#081026] font-pixel text-[8px] sm:text-[9px] hover:brightness-110 active:translate-y-[1px] transition-all"
        >
          <Tv className={`w-3.5 h-3.5 shrink-0 ${crtEnabled ? 'text-lime' : 'text-gray-400'}`} />
          <span className={crtEnabled ? 'text-lime' : 'text-gray-400'}>
            CRT: {crtEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </>
  );
};
