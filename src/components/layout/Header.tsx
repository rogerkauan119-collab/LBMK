import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  ShieldAlert,
  Volume2,
  VolumeX,
  Tv,
  Home,
  Wrench,
  Briefcase,
  ChevronDown,
  Info,
  Users,
  HelpCircle,
  Layers,
  Calendar,
  Menu,
  X,
  Trophy,
  Package,
  RefreshCw,
  Bell,
  LogOut,
  Cpu,
  Building2,
  Kanban,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DropdownLink {
  label: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Dropdowns exclusivos do Público Externo (VISITANTE)
const INICIO_DROPDOWN: DropdownLink[] = [
  {
    label: 'Sobre',
    description: 'O que é o LabMaker IFES Serra e quem pode usar',
    to: '/#sobre',
    icon: Info,
  },
  {
    label: 'Nossa Equipe',
    description: 'Docentes, orientadores e pesquisadores do laboratório',
    to: '/#equipe',
    icon: Users,
  },
  {
    label: 'Perguntas Frequentes',
    description: 'Dúvidas sobre acesso, insumos e funcionamento',
    to: '/#faq',
    icon: HelpCircle,
  },
];

const EQUIPAMENTOS_DROPDOWN: DropdownLink[] = [
  {
    label: 'Equipamentos',
    description: 'Impressoras 3D, fresadora de PCI, CNC e corte a laser',
    to: '/equipamentos#maquinas',
    icon: Wrench,
  },
  {
    label: 'Catálogo de Serviços',
    description: 'Prototipagem 3D, confecção de PCI e corte/gravação laser',
    to: '/equipamentos#servicos',
    icon: Layers,
  },
  {
    label: 'Agendar Serviços',
    description: 'Consulte a agenda e solicite atendimento ou visita',
    to: '/equipamentos#agenda',
    icon: Calendar,
  },
];

// Dropdowns exclusivos do Aluno Logado
const AGENDAR_DROPDOWN: DropdownLink[] = [
  {
    label: 'Agendar equipamento',
    description: 'Reserve Impressora 3D, Fresadora de PCI, CNC ou Laser',
    to: '/aluno?aba=agendar&tipo=equipamento',
    icon: Cpu,
  },
  {
    label: 'Agendar laboratório para uso',
    description: 'Reserve bancada ou espaço completo para projeto/aula',
    to: '/aluno?aba=agendar&tipo=laboratorio',
    icon: Building2,
  },
];

const EMPRESTIMO_DROPDOWN: DropdownLink[] = [
  {
    label: 'Empréstimos',
    description: 'Solicite kits Arduino, ESP32, multímetros e ferramentas',
    to: '/aluno?aba=emprestimos',
    icon: Package,
  },
  {
    label: 'Reposição de materiais',
    description: 'Peça reposição de filamentos, fenolite, MDF e insumos',
    to: '/aluno?aba=reposicao',
    icon: RefreshCw,
  },
];

type MenuKey =
  | 'inicio'
  | 'equipamentos'
  | 'agendar'
  | 'emprestimos'
  | 'notificacoes'
  | 'perfil'
  | null;

export const Header: React.FC = () => {
  const {
    user,
    data,
    logoutToVisitor,
    sfxEnabled,
    crtEnabled,
    toggleSfx,
    toggleCrt,
    playClick,
    playHover,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isVisitor = user.role === 'VISITANTE';
  const isAdmin = user.role === 'ADMIN';
  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => n.read === 0).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash, location.search]);

  const navigateToTarget = (to: string) => {
    playClick();
    setOpenMenu(null);
    setMobileOpen(false);

    if (to.includes('?')) {
      navigate(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const [path, hash] = to.split('#');
    const targetPath = path || '/';

    if (location.pathname !== targetPath) {
      navigate(targetPath);
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 260);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    playClick();
    setOpenMenu(null);
    setMobileOpen(false);
    logoutToVisitor();
    navigate('/');
  };

  const renderDropdownPanel = (items: DropdownLink[], widthClass = 'w-72') => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.16 }}
      className={`absolute left-0 top-full pt-2 ${widthClass} z-50`}
    >
      <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg p-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => navigateToTarget(item.to)}
              onMouseEnter={playHover}
              className="w-full text-left p-3 rounded-xl hover:bg-lime/40 transition-colors flex items-start gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand text-accent flex items-center justify-center shrink-0 border border-surface-ink group-hover:bg-accent group-hover:text-surface-ink transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase text-brand">
                  {item.label}
                </p>
                <p className="text-xs text-surface-ink/80 leading-snug mt-0.5">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-50 w-full bg-brand border-b-[3px] border-accent shadow-[0_6px_20px_rgba(10,14,26,0.35)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* 1. Esquerda: Logo LABMAKER · IFES CAMPUS SERRA */}
          <Link
            to="/"
            onClick={() => navigateToTarget('/')}
            onMouseEnter={playHover}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
            aria-label="Ir para o início do LabMaker IFES Campus Serra"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-dark border-2 border-accent/70 flex items-center justify-center shadow-neo-sm">
              <span className="font-display font-extrabold text-lime text-xs tracking-tight">
                LBMK
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-white text-base sm:text-lg tracking-wider">
                LABMAKER
              </span>
              <span className="font-body font-bold text-accent text-[10px] tracking-[0.18em] uppercase mt-0.5">
                IFES CAMPUS SERRA
              </span>
            </div>
          </Link>

          {/* 2. Centro: Navbar condicional (Público Externo vs Aluno Logado) */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-2">
            {isVisitor ? (
              <>
                {/* PÚBLICO EXTERNO — ABA 1: INÍCIO */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    playHover();
                    setOpenMenu('inicio');
                  }}
                  onMouseLeave={() => setOpenMenu((prev) => (prev === 'inicio' ? null : prev))}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenMenu((prev) => (prev === 'inicio' ? null : 'inicio'));
                    }}
                    aria-expanded={openMenu === 'inicio'}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                      location.pathname === '/'
                        ? 'bg-accent text-surface-ink border-surface-ink shadow-[2px_3px_0px_#3A3A3A]'
                        : 'bg-brand-dark/50 hover:bg-brand-dark text-white border-white/15'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Início</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMenu === 'inicio' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenu === 'inicio' && renderDropdownPanel(INICIO_DROPDOWN, 'w-72')}
                  </AnimatePresence>
                </div>

                {/* PÚBLICO EXTERNO — ABA 2: EQUIPAMENTOS E SERVIÇOS */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    playHover();
                    setOpenMenu('equipamentos');
                  }}
                  onMouseLeave={() =>
                    setOpenMenu((prev) => (prev === 'equipamentos' ? null : prev))
                  }
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenMenu((prev) => (prev === 'equipamentos' ? null : 'equipamentos'));
                    }}
                    aria-expanded={openMenu === 'equipamentos'}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                      location.pathname.startsWith('/equipamentos')
                        ? 'bg-accent text-surface-ink border-surface-ink shadow-[2px_3px_0px_#3A3A3A]'
                        : 'bg-brand-dark/50 hover:bg-brand-dark text-white border-white/15'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Equipamentos e Serviços</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMenu === 'equipamentos' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenu === 'equipamentos' &&
                      renderDropdownPanel(EQUIPAMENTOS_DROPDOWN, 'w-80')}
                  </AnimatePresence>
                </div>

                {/* PÚBLICO EXTERNO — ABA 3: PROJETOS */}
                <button
                  type="button"
                  onClick={() => navigateToTarget('/projetos')}
                  onMouseEnter={playHover}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                    location.pathname.startsWith('/projetos')
                      ? 'bg-accent text-surface-ink border-surface-ink shadow-[2px_3px_0px_#3A3A3A]'
                      : 'bg-brand-dark/50 hover:bg-brand-dark text-white border-white/15'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Projetos</span>
                </button>
              </>
            ) : (
              <>
                {/* ALUNO LOGADO — ABA 1: AGENDAR HORÁRIO */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    playHover();
                    setOpenMenu('agendar');
                  }}
                  onMouseLeave={() => setOpenMenu((prev) => (prev === 'agendar' ? null : prev))}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenMenu((prev) => (prev === 'agendar' ? null : 'agendar'));
                    }}
                    aria-expanded={openMenu === 'agendar'}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                      location.pathname.startsWith('/aluno') &&
                      location.search.includes('aba=agendar')
                        ? 'bg-accent text-surface-ink border-surface-ink shadow-[2px_3px_0px_#3A3A3A]'
                        : 'bg-brand-dark/50 hover:bg-brand-dark text-white border-white/15'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar horário</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMenu === 'agendar' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenu === 'agendar' && renderDropdownPanel(AGENDAR_DROPDOWN, 'w-80')}
                  </AnimatePresence>
                </div>

                {/* ALUNO LOGADO — ABA 2: EMPRÉSTIMO E RECURSOS */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    playHover();
                    setOpenMenu('emprestimos');
                  }}
                  onMouseLeave={() =>
                    setOpenMenu((prev) => (prev === 'emprestimos' ? null : prev))
                  }
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenMenu((prev) => (prev === 'emprestimos' ? null : 'emprestimos'));
                    }}
                    aria-expanded={openMenu === 'emprestimos'}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                      location.pathname.startsWith('/aluno') &&
                      (location.search.includes('aba=emprestimos') ||
                        location.search.includes('aba=reposicao'))
                        ? 'bg-accent text-surface-ink border-surface-ink shadow-[2px_3px_0px_#3A3A3A]'
                        : 'bg-brand-dark/50 hover:bg-brand-dark text-white border-white/15'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Empréstimo e Recursos</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMenu === 'emprestimos' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenu === 'emprestimos' &&
                      renderDropdownPanel(EMPRESTIMO_DROPDOWN, 'w-80')}
                  </AnimatePresence>
                </div>

                {/* ALUNO LOGADO — ABA 3: MAKERLAB (Sistema de Progressão) */}
                <button
                  type="button"
                  onClick={() => navigateToTarget('/quest')}
                  onMouseEnter={playHover}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                    location.pathname.startsWith('/quest')
                      ? 'bg-accent text-surface-ink border-surface-ink shadow-[2px_3px_0px_#3A3A3A]'
                      : 'bg-brand-dark/50 hover:bg-brand-dark text-white border-white/15'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-accent" />
                  <span>MakerLab</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigateToTarget('/admin')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-display font-bold text-xs uppercase border-2 transition-all ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-lime text-surface-ink border-surface-ink shadow-neo-sm'
                        : 'bg-arcade-bg text-arcade-cyan border-arcade-cyan/60'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                )}
              </>
            )}
          </nav>

          {/* 3. Direita: Para Visitante = Selo + Entrar | Para Aluno Logado = Sino de Notificações + Ícone de Perfil (com Sair) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isVisitor ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lime text-surface-ink border-2 border-surface-ink shadow-[2px_3px_0px_#3A3A3A] font-display font-bold text-[11px] uppercase tracking-wider">
                  <UserIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                  VISITANTE
                </span>
                <button
                  type="button"
                  onClick={() => navigateToTarget('/acesso')}
                  onMouseEnter={playHover}
                  className="px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-[2px_3px_0px_#3A3A3A] font-display font-bold text-[11px] uppercase tracking-wider active:translate-y-0.5 transition-all"
                >
                  ENTRAR / IFES
                </button>
              </>
            ) : (
              <>
                {/* Sino de Notificações (somente aluno logado) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenMenu((prev) => (prev === 'notificacoes' ? null : 'notificacoes'));
                    }}
                    aria-label="Notificações"
                    aria-expanded={openMenu === 'notificacoes'}
                    className="relative w-10 h-10 rounded-xl bg-brand-dark hover:bg-arcade-bg text-white border-2 border-accent flex items-center justify-center shadow-[2px_3px_0px_#3A3A3A] transition-all"
                  >
                    <Bell className="w-5 h-5 text-accent" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-lime text-surface-ink border border-surface-ink font-pixel text-[8px] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {openMenu === 'notificacoes' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full pt-2 w-80 sm:w-96 z-50"
                      >
                        <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
                          <div className="bg-brand px-4 py-3 border-b-2 border-accent flex items-center justify-between">
                            <span className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                              <Bell className="w-4 h-4 text-accent" /> Notificações ({notifications.length})
                            </span>
                            <span className="px-2 py-0.5 rounded bg-lime text-surface-ink font-pixel text-[7px]">
                              {unreadCount} NOVAS
                            </span>
                          </div>
                          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
                            {notifications.length === 0 ? (
                              <p className="text-xs text-gray-500 p-4 text-center">
                                Nenhuma notificação no momento.
                              </p>
                            ) : (
                              notifications.map((n) => (
                                <div
                                  key={n.id}
                                  className={`p-3 rounded-xl text-left ${
                                    n.read === 0 ? 'bg-lime/25 border border-lime' : 'bg-[#F6F5F2]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-pixel text-[7px] text-brand uppercase">
                                      [{n.type}]
                                    </span>
                                    {n.read === 0 && (
                                      <span className="w-2 h-2 rounded-full bg-brand" />
                                    )}
                                  </div>
                                  <p className="font-display font-bold text-xs text-surface-ink mt-1">
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                                    {n.message}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Ícone de Perfil com dropdown contendo "Sair" */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenMenu((prev) => (prev === 'perfil' ? null : 'perfil'));
                    }}
                    aria-label="Menu do perfil do aluno"
                    aria-expanded={openMenu === 'perfil'}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-lime text-surface-ink border-2 border-surface-ink shadow-[2px_3px_0px_#3A3A3A] font-display font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all"
                  >
                    <UserIcon className="w-4 h-4 stroke-[2.5]" />
                    <span className="hidden sm:inline max-w-[110px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMenu === 'perfil' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openMenu === 'perfil' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full pt-2 w-64 z-50"
                      >
                        <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
                          <div className="bg-brand px-4 py-3 border-b-2 border-accent text-white">
                            <p className="font-display font-bold text-sm uppercase truncate">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-brand-light truncate">
                              {user.course || 'IFES Campus Serra'}
                            </p>
                            <p className="font-pixel text-[8px] text-lime mt-1">
                              LVL {user.level} · {user.xp} XP
                            </p>
                          </div>

                          <div className="p-2 space-y-1">
                            <button
                              type="button"
                              onClick={() => navigateToTarget('/aluno?aba=tarefas')}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F6F5F2] text-xs font-display font-bold uppercase text-brand flex items-center gap-2"
                            >
                              <Kanban className="w-4 h-4" /> Meu Painel / Tarefas
                            </button>

                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full text-left px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-display font-bold uppercase text-red-700 flex items-center gap-2 border border-red-200"
                            >
                              <LogOut className="w-4 h-4" /> Sair
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                playClick();
                setMobileOpen((prev) => !prev);
              }}
              aria-label="Abrir menu de navegação"
              className="lg:hidden p-2 rounded-lg bg-brand-dark text-white border border-accent"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expansível */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-brand-dark border-t-2 border-accent overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {isVisitor ? (
                  <>
                    <div className="space-y-1.5">
                      <p className="font-display font-bold text-xs uppercase text-accent">Início</p>
                      <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-accent/50">
                        {INICIO_DROPDOWN.map((item) => (
                          <button
                            key={item.to}
                            type="button"
                            onClick={() => navigateToTarget(item.to)}
                            className="text-left py-1.5 px-2 rounded text-sm font-semibold text-white hover:bg-white/10"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-display font-bold text-xs uppercase text-accent">
                        Equipamentos e Serviços
                      </p>
                      <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-accent/50">
                        {EQUIPAMENTOS_DROPDOWN.map((item) => (
                          <button
                            key={item.to}
                            type="button"
                            onClick={() => navigateToTarget(item.to)}
                            className="text-left py-1.5 px-2 rounded text-sm font-semibold text-white hover:bg-white/10"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateToTarget('/projetos')}
                      className="w-full text-left py-2.5 px-3 rounded-xl bg-white/10 font-display font-bold text-xs uppercase text-white"
                    >
                      Projetos (Imagens e Arquivos)
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <p className="font-display font-bold text-xs uppercase text-accent">
                        Agendar horário
                      </p>
                      <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-accent/50">
                        {AGENDAR_DROPDOWN.map((item) => (
                          <button
                            key={item.to}
                            type="button"
                            onClick={() => navigateToTarget(item.to)}
                            className="text-left py-1.5 px-2 rounded text-sm font-semibold text-white hover:bg-white/10"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-display font-bold text-xs uppercase text-accent">
                        Empréstimo e Recursos
                      </p>
                      <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-accent/50">
                        {EMPRESTIMO_DROPDOWN.map((item) => (
                          <button
                            key={item.to}
                            type="button"
                            onClick={() => navigateToTarget(item.to)}
                            className="text-left py-1.5 px-2 rounded text-sm font-semibold text-white hover:bg-white/10"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateToTarget('/quest')}
                      className="w-full text-left py-2.5 px-3 rounded-xl bg-accent text-surface-ink font-display font-bold text-xs uppercase"
                    >
                      MakerLab (Progressão & XP)
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left py-2.5 px-3 rounded-xl bg-red-600 text-white font-display font-bold text-xs uppercase flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Toggles discretos de SFX e CRT abaixo do header à direita */}
      <div className="fixed top-[80px] right-3 sm:right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSfx}
          aria-pressed={sfxEnabled}
          aria-label={`Efeitos sonoros 8 bits: ${sfxEnabled ? 'Ligado' : 'Desligado'}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-arcade-bg/95 text-lime border border-accent shadow-neo-sm font-pixel text-[8px] hover:brightness-110 transition-all"
        >
          {sfxEnabled ? (
            <Volume2 className="w-3 h-3 text-lime shrink-0" />
          ) : (
            <VolumeX className="w-3 h-3 text-gray-400 shrink-0" />
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
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-arcade-bg/95 text-lime border border-accent shadow-neo-sm font-pixel text-[8px] hover:brightness-110 transition-all"
        >
          <Tv className={`w-3 h-3 shrink-0 ${crtEnabled ? 'text-lime' : 'text-gray-400'}`} />
          <span className={crtEnabled ? 'text-lime' : 'text-gray-400'}>
            CRT: {crtEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </>
  );
};
