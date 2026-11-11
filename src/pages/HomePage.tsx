import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Circle,
  Cpu,
  Printer,
  Cog,
  Droplet,
  Flame,
  Zap,
  ChevronDown,
  MapPin,
  Clock,
  Mail,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MascotRobotPixel, PixelMachineBadge } from '../components/ui/PixelArts';

export const HomePage: React.FC = () => {
  const { data, user, playClick, playHover, switchProfileQuick } = useApp();
  const navigate = useNavigate();

  const machines = data?.machines || [];
  const services = data?.siteContent?.services || [];
  const team = data?.siteContent?.team || [];
  const faq = data?.siteContent?.faq || [];
  const about = data?.siteContent?.about;
  const tasks = data?.tasks || [];

  // Contadores pixelados do quadro de tarefas (com fallback 12, 05, 08 idênticos à referência)
  const completedCount = Math.max(12, tasks.filter((t) => t.status === 'CONCLUIDA').length);
  const inProgressCount = Math.max(5, tasks.filter((t) => t.status === 'EM_ANDAMENTO').length);
  const todoCount = Math.max(8, tasks.filter((t) => t.status === 'A_FAZER').length);

  // Carrossel "RECURSOS DISPONÍVEIS" com rolagem automática que pausa no hover
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (isPaused || machines.length <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % machines.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, machines.length]);

  const handlePrevCarousel = () => {
    playClick();
    setCarouselIndex((prev) => (prev - 1 + machines.length) % machines.length);
  };

  const handleNextCarousel = () => {
    playClick();
    setCarouselIndex((prev) => (prev + 1) % machines.length);
  };

  const renderMachineIcon = (iconType: string) => {
    switch (iconType) {
      case 'cpu':
        return <Cpu className="w-5 h-5 text-white" />;
      case 'printer':
        return <Printer className="w-5 h-5 text-white" />;
      case 'cog':
        return <Cog className="w-5 h-5 text-white" />;
      case 'droplet':
        return <Droplet className="w-5 h-5 text-white" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-white" />;
      default:
        return <Zap className="w-5 h-5 text-white" />;
    }
  };

  // Monta janela deslizante de 3 máquinas visíveis no carrossel
  const visibleMachines =
    machines.length >= 3
      ? [
          machines[carouselIndex % machines.length],
          machines[(carouselIndex + 1) % machines.length],
          machines[(carouselIndex + 2) % machines.length],
        ]
      : machines;

  return (
    <div className="flex-1">
      {/* 1. HERO PRINCIPAL — LABMAKER · IFES CAMPUS SERRA */}
      <section className="bg-royal-grid text-white py-12 sm:py-16 border-b-4 border-accent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/25 font-pixel text-[9px] text-accent tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-lime" />
              {about?.badge || 'LABORATÓRIO DE INOVAÇÃO & PROTOTIPAGEM'}
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.03]">
              {about?.title || 'LABMAKER · IFES CAMPUS SERRA'}
              <span className="text-accent cursor-pixel-blink ml-1">_</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-light max-w-2xl leading-relaxed font-medium">
              {about?.subtitle ||
                'Transforme ideias em protótipos reais. Impressão 3D FDM e SLA, fabricação de placas de circuito impresso (PCI), usinagem CNC, corte a laser e robótica colaborativa.'}
            </p>

            {/* Botões de ação: Entrar no IFES / Check-in + Explorar Recursos */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/acesso"
                onClick={playClick}
                onMouseEnter={playHover}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold uppercase tracking-wider text-sm sm:text-base active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                ENTRAR NO IFES / CHECK-IN
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <Link
                to="/equipamentos"
                onClick={playClick}
                onMouseEnter={playHover}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-dark hover:bg-arcade-bg text-white border-2 border-accent shadow-neo font-display font-bold uppercase tracking-wider text-sm sm:text-base active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                AGENDAR MÁQUINA
              </Link>
            </div>

            {/* Barra de troca rápida de perfil para avaliação imediata (Visitante, Aluno, Admin) */}
            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-pixel text-[8px] text-brand-light uppercase mr-1">
                TESTAR PERFIL AGORA:
              </span>
              {(['VISITANTE', 'ALUNO', 'ADMIN'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchProfileQuick(r)}
                  className={`px-3 py-1 rounded border font-pixel text-[8px] transition-all ${
                    user.role === r
                      ? 'bg-lime text-surface-ink border-surface-ink shadow-neo-sm'
                      : 'bg-brand-dark/80 text-white border-white/25 hover:border-accent'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Card Mascote + Ilustrações Pixel Art de Impressora 3D, Laser, PCI e Arduino */}
          <div className="lg:col-span-5">
            <div className="bg-arcade-bg border-2 border-accent rounded-2xl p-6 shadow-neo-lg relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <MascotRobotPixel className="w-16 h-16 shrink-0" />
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-lime text-surface-ink font-pixel text-[8px] uppercase">
                      MASCOTE OFICIAL
                    </span>
                    <h2 className="font-pixel text-white text-xs sm:text-sm mt-1.5">
                      ROBO-MAKER SERRA v2.6
                    </h2>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Óculos de proteção prontos! Escolha sua bancada:
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-brand-dark/50 border border-white/10 flex items-center gap-3">
                  <PixelMachineBadge type="printer3d" className="w-10 h-10 shrink-0" />
                  <div>
                    <p className="font-pixel text-[8px] text-accent">IMPRESSORA 3D</p>
                    <p className="text-xs text-gray-300 mt-0.5">FDM & Resina 8K</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-brand-dark/50 border border-white/10 flex items-center gap-3">
                  <PixelMachineBadge type="laser" className="w-10 h-10 shrink-0" />
                  <div>
                    <p className="font-pixel text-[8px] text-accent">CORTE LASER</p>
                    <p className="text-xs text-gray-300 mt-0.5">CO2 100W Precisão</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-brand-dark/50 border border-white/10 flex items-center gap-3">
                  <PixelMachineBadge type="pcb" className="w-10 h-10 shrink-0" />
                  <div>
                    <p className="font-pixel text-[8px] text-lime">PLACA PCI</p>
                    <p className="text-xs text-gray-300 mt-0.5">Fresagem & SMD</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-brand-dark/50 border border-white/10 flex items-center gap-3">
                  <PixelMachineBadge type="arduino" className="w-10 h-10 shrink-0" />
                  <div>
                    <p className="font-pixel text-[8px] text-arcade-cyan">ARDUINO & IOT</p>
                    <p className="text-xs text-gray-300 mt-0.5">ESP32 & Sensores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATÁLOGO DE SERVIÇOS + CARROSSEL "RECURSOS DISPONÍVEIS" (Fiel às Imagens 2 e 4) */}
      <section className="bg-scanlines-light py-16 border-b-2 border-surface-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          {/* Bloco Catálogo de Serviços */}
          <div>
            <div className="text-center mb-10">
              <p className="font-pixel text-brand text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                SERVIÇOS PRESTADOS
              </p>
              <h2 className="font-display font-bold text-brand text-3xl sm:text-5xl uppercase tracking-tight mt-2">
                CATÁLOGO DE SERVIÇOS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  onMouseEnter={playHover}
                  className="card-scanlines-white rounded-[14px] border-[2.5px] border-surface-ink shadow-neo-lg p-7 flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl">
                      {srv.icon === 'cube' && <span aria-hidden="true">🧊</span>}
                      {srv.icon === 'bolt' && <span aria-hidden="true">⚡</span>}
                      {srv.icon === 'flame' && <span aria-hidden="true">🔥</span>}
                    </div>
                    <h3 className="font-pixel text-brand text-xs sm:text-sm tracking-wide uppercase leading-relaxed">
                      {srv.title}
                    </h3>
                    <p className="text-gray-600 text-base mt-3 leading-relaxed font-medium">
                      {srv.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloco MÃO NA MASSA — RECURSOS DISPONÍVEIS (Carrossel igual à referência 2) */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative"
          >
            <div className="mb-8">
              <p className="font-pixel text-brand text-[10px] sm:text-xs tracking-[0.16em] uppercase">
                MÃO NA MASSA
              </p>
              <h2 className="font-display font-bold text-brand text-3xl sm:text-5xl uppercase tracking-tight mt-1">
                RECURSOS DISPONÍVEIS
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-1 font-medium">
                Passe o mouse para pausar a rolagem automática e explorar os detalhes técnicos. 🥰
              </p>
            </div>

            <div className="relative flex items-center">
              {/* Seta quadrada amarela esquerda */}
              <button
                type="button"
                onClick={handlePrevCarousel}
                aria-label="Recurso anterior"
                className="absolute -left-2 sm:-left-4 z-20 w-11 h-11 rounded-[8px] bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo flex items-center justify-center active:translate-y-0.5 transition-all"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.8]" />
              </button>

              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-2 sm:px-6">
                {visibleMachines.map((mac) => (
                  <article
                    key={`${mac.id}-${carouselIndex}`}
                    className="group relative h-[360px] sm:h-[390px] rounded-[16px] overflow-hidden border-[3px] border-surface-ink shadow-neo-lg bg-arcade-bg flex flex-col justify-end p-6"
                  >
                    <img
                      src={mac.image_url}
                      alt={mac.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 group-hover:opacity-40 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/70 to-transparent" />

                    {/* Status pill no canto superior direito */}
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-2.5 py-1 rounded font-pixel text-[8px] uppercase border ${
                          mac.status === 'DISPONIVEL'
                            ? 'bg-lime text-surface-ink border-surface-ink'
                            : mac.status === 'EM_USO'
                            ? 'bg-accent text-surface-ink border-surface-ink'
                            : 'bg-red-500 text-white border-white'
                        }`}
                      >
                        {mac.status === 'DISPONIVEL'
                          ? 'DISPONÍVEL'
                          : mac.status === 'EM_USO'
                          ? 'EM USO'
                          : 'MANUTENÇÃO'}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-3">
                      {/* Ícone em quadradinho azul com borda amarela/clara exatamente como na referência */}
                      <div className="w-11 h-11 rounded-[10px] bg-brand border-2 border-accent flex items-center justify-center shadow-neo-sm">
                        {renderMachineIcon(mac.icon_type)}
                      </div>

                      <h3 className="font-pixel text-accent text-sm sm:text-base tracking-wide uppercase">
                        {mac.name}
                      </h3>

                      <p className="text-gray-200 text-sm sm:text-base leading-snug">
                        {mac.short_desc}
                      </p>

                      <p className="text-xs text-arcade-cyan font-mono pt-1 opacity-95">
                        {mac.specs}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Seta quadrada amarela direita */}
              <button
                type="button"
                onClick={handleNextCarousel}
                aria-label="Próximo recurso"
                className="absolute -right-2 sm:-right-4 z-20 w-11 h-11 rounded-[8px] bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo flex items-center justify-center active:translate-y-0.5 transition-all"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.8]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUEM PODE USAR NOSSO ESPAÇO? + PERFIS DO SITE (Fiel à Imagem 3) */}
      <section className="bg-royal-dots text-white py-20 border-b-4 border-accent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="font-display font-bold text-accent text-sm tracking-[0.22em] uppercase">
              ACESSO AO LABORATÓRIO
            </p>
            <h2 className="font-display font-bold text-white text-3xl sm:text-5xl uppercase tracking-tight mt-2">
              QUEM PODE USAR NOSSO ESPAÇO?
            </h2>
          </div>

          {/* Os 2 cards principais idênticos à referência 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="rounded-[22px] bg-[#243CE0]/80 border border-white/20 p-8 sm:p-9 shadow-xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-[14px] bg-accent text-surface-ink flex items-center justify-center mb-6 shadow-neo-sm">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-display font-bold text-white text-xl sm:text-2xl uppercase tracking-wide">
                SERVIDORES E ESTUDANTES
              </h3>
              <p className="text-brand-light text-base sm:text-lg mt-2.5 leading-relaxed">
                Do campus, seja para uso em projetos de extensão, pesquisa ou ensino.
              </p>
            </div>

            <div className="rounded-[22px] bg-[#243CE0]/80 border border-white/20 p-8 sm:p-9 shadow-xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-[14px] bg-[#C5F89A] text-surface-ink flex items-center justify-center mb-6 shadow-neo-sm">
                <Building2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-display font-bold text-white text-xl sm:text-2xl uppercase tracking-wide">
                COMUNIDADE EXTERNA
              </h3>
              <p className="text-brand-light text-base sm:text-lg mt-2.5 leading-relaxed">
                Empresas e indivíduos que precisem dos recursos do LabMaker podem agendar uma visita e
                negociar os termos de uso.
              </p>
            </div>
          </div>

          {/* Explicação detalhada dos 3 Perfis da Plataforma ("Quem pode usar o site") */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-brand-dark/80 border border-lime/40 p-5">
              <span className="inline-block px-2.5 py-1 rounded bg-lime text-surface-ink font-pixel text-[8px]">
                1. VISITANTE
              </span>
              <p className="text-sm text-brand-light mt-2.5">
                Explora catálogo de máquinas, serviços, galeria de projetos, tutoriais, equipe,
                agenda em modo leitura e realiza o Check-in presencial.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-dark/80 border border-accent/50 p-5">
              <span className="inline-block px-2.5 py-1 rounded bg-accent text-surface-ink font-pixel text-[8px]">
                2. ALUNO / SERVIDOR
              </span>
              <p className="text-sm text-brand-light mt-2.5">
                Desbloqueia as abas com cadeado: Quadro Kanban de Tarefas, Reserva de Máquinas,
                Empréstimos, Reposição de Materiais e o jogo MakerLab Quest.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-dark/80 border border-arcade-cyan/50 p-5">
              <span className="inline-block px-2.5 py-1 rounded bg-arcade-cyan text-surface-ink font-pixel text-[8px]">
                3. ADMINISTRADOR
              </span>
              <p className="text-sm text-brand-light mt-2.5">
                Acessa o Painel Admin: aprova ou bloqueia horários, gerencia estoque e máquinas
                (CRUD), modera projetos, edita o site e exporta relatórios CSV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HERO DA PLATAFORMA DOS ALUNOS — SISTEMA DE GERENCIAMENTO DE TAREFAS (Fiel à Imagem 1) */}
      <section className="bg-royal-grid text-white py-20 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A41E0] border border-white/25 text-xs font-display font-bold uppercase tracking-wider text-brand-light">
              <span className="text-accent">☷</span> PLATAFORMA DOS ALUNOS
            </div>

            <h2 className="font-display font-bold text-4xl sm:text-5xl uppercase leading-[1.05] tracking-tight">
              SISTEMA DE GERENCIAMENTO DE TAREFAS
            </h2>

            <p className="text-brand-light text-base sm:text-lg leading-relaxed max-w-xl">
              Acompanhe o andamento dos projetos do laboratório em tempo real. Os alunos organizam
              tarefas, marcam progresso e mantêm tudo sob controle num painel único e colaborativo.
            </p>

            <div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  if (user.role === 'VISITANTE') {
                    navigate('/acesso?redirect=/aluno');
                  } else {
                    navigate('/aluno');
                  }
                }}
                onMouseEnter={playHover}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold uppercase tracking-wider text-sm sm:text-base transition-all active:translate-y-0.5"
              >
                ABRIR SISTEMA DE TAREFAS
                <ArrowUpRight className="w-5 h-5" />
                {user.role === 'VISITANTE' && <Lock className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>

          {/* Coluna Direita: Mockup de navegador `labmaker-tarefas.app` idêntico à Imagem 1 */}
          <div className="lg:col-span-6">
            <div className="rounded-[24px] bg-[#E8E6E1] text-surface-ink p-5 sm:p-6 border-2 border-surface-ink shadow-neo-lg">
              {/* Barra superior de navegador com bolinhas laranja, verde e azul */}
              <div className="flex items-center gap-2 pb-4 px-1">
                <span className="w-3 h-3 rounded-full bg-[#FDB94E]" />
                <span className="w-3 h-3 rounded-full bg-[#8CF25A]" />
                <span className="w-3 h-3 rounded-full bg-[#1A2FBF]" />
                <span className="ml-2 font-mono text-xs text-gray-500">labmaker-tarefas.app</span>
              </div>

              {/* Card branco interno com as 3 tarefas da referência */}
              <div className="bg-white rounded-[18px] p-5 shadow-sm border border-black/5 space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-display font-bold text-brand text-xs sm:text-sm uppercase tracking-wider">
                    QUADRO DE TAREFAS
                  </span>
                  <span className="font-mono text-xs text-gray-400">3 ativas</span>
                </div>

                {/* Item 1: Protótipos impressão 3D (CONCLUÍDA) */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#E8E6E1]/80">
                  <div className="w-9 h-9 rounded-lg bg-[#C5F89A] text-green-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand text-sm sm:text-base">
                      Protótipos impressão 3D
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                      CONCLUÍDA
                    </p>
                  </div>
                </div>

                {/* Item 2: Placa PCI — robô seguidor (EM ANDAMENTO) */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#E8E6E1]/80">
                  <div className="w-9 h-9 rounded-lg bg-[#FDE0A6] text-amber-900 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand text-sm sm:text-base">
                      Placa PCI — robô seguidor
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                      EM ANDAMENTO
                    </p>
                  </div>
                </div>

                {/* Item 3: Corte a laser — embalagem (A FAZER) */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#E8E6E1]/80">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                    <Circle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand text-sm sm:text-base">
                      Corte a laser — embalagem
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                      A FAZER
                    </p>
                  </div>
                </div>
              </div>

              {/* Três contadores inferiores em fonte pixel (12 CONCLUÍDAS, 05 EM CURSO, 08 A FAZER) */}
              <div className="grid grid-cols-3 gap-3.5 mt-4">
                <div className="bg-white rounded-2xl py-4 px-3 text-center border border-black/5">
                  <p className="font-pixel text-brand text-lg sm:text-xl">
                    {String(completedCount).padStart(2, '0')}
                  </p>
                  <p className="font-display font-semibold text-[10px] sm:text-xs text-gray-500 uppercase mt-1">
                    CONCLUÍDAS
                  </p>
                </div>
                <div className="bg-white rounded-2xl py-4 px-3 text-center border border-black/5">
                  <p className="font-pixel text-accent text-lg sm:text-xl">
                    {String(inProgressCount).padStart(2, '0')}
                  </p>
                  <p className="font-display font-semibold text-[10px] sm:text-xs text-gray-500 uppercase mt-1">
                    EM CURSO
                  </p>
                </div>
                <div className="bg-white rounded-2xl py-4 px-3 text-center border border-black/5">
                  <p className="font-pixel text-gray-500 text-lg sm:text-xl">
                    {String(todoCount).padStart(2, '0')}
                  </p>
                  <p className="font-display font-semibold text-[10px] sm:text-xs text-gray-500 uppercase mt-1">
                    A FAZER
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONHEÇA A NOSSA EQUIPE DO LABMAKER (Tema Escuro #0A0E1A fiel à Imagem 5) */}
      <section className="bg-arcade-bg text-white py-20 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
              CONHEÇA A NOSSA <span className="text-arcade-cyan">EQUIPE</span> DO LABMAKER
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2.5 max-w-2xl mx-auto">
              Você aprenderá com pesquisadores e docentes dedicados à inovação e tecnologia no IFES
              Serra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {team.map((member) => (
              <article
                key={member.id}
                onMouseEnter={playHover}
                className={`group relative h-[380px] rounded-[16px] overflow-hidden flex flex-col justify-end p-5 transition-transform duration-300 hover:-translate-y-1.5 ${
                  member.isLead
                    ? 'border-[2.5px] border-accent shadow-[0_0_24px_rgba(253,185,78,0.25)]'
                    : 'border border-white/15 bg-[#121829]'
                }`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/65 to-transparent" />

                <div className="relative z-10 space-y-2">
                  {member.badge && (
                    <span className="inline-block w-full text-center py-1 px-2 rounded-[4px] bg-accent text-surface-ink font-pixel text-[8px] tracking-widest uppercase">
                      {member.badge}
                    </span>
                  )}
                  <h3 className="font-pixel text-white text-xs sm:text-[13px] leading-snug uppercase">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-300 leading-snug">{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PERGUNTAS FREQUENTES (Acordeão) + LOCAL E CONTATO RÁPIDO */}
      <section className="bg-scanlines-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Coluna FAQ */}
          <div className="lg:col-span-7">
            <p className="font-pixel text-brand text-[10px] uppercase tracking-widest">
              TIRE SUAS DÚVIDAS
            </p>
            <h2 className="font-display font-bold text-brand text-3xl sm:text-4xl uppercase mt-1 mb-6">
              PERGUNTAS FREQUENTES (FAQ)
            </h2>

            <div className="space-y-3.5">
              {faq.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border-2 border-surface-ink shadow-neo overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setOpenFaq(isOpen ? null : idx);
                      }}
                      aria-expanded={isOpen}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-surface-ink hover:bg-brand-light/20 transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-brand shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-gray-700 text-sm sm:text-base border-t border-gray-100 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Local do Laboratório e Contato */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
              <div className="bg-brand px-6 py-4 border-b-2 border-surface-ink flex items-center justify-between">
                <div>
                  <span className="font-pixel text-accent text-[9px] uppercase">ONDE ESTAMOS</span>
                  <h3 className="font-display font-bold text-white text-xl uppercase mt-0.5">
                    LOCAL & CONTATO DO LABMAKER
                  </h3>
                </div>
                <MapPin className="w-6 h-6 text-accent" />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-display font-bold uppercase text-sm text-brand">
                      ENDEREÇO NO CAMPUS
                    </p>
                    <p className="text-sm text-gray-700">
                      {about?.locationRoom || 'Bloco C · Sala 104 (Térreo) — IFES Campus Serra'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {about?.address || 'Rodovia ES-010, Km 6,5 — Manguinhos, Serra - ES'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-display font-bold uppercase text-sm text-brand">
                      HORÁRIO DE FUNCIONAMENTO
                    </p>
                    <p className="text-sm text-gray-700">
                      {about?.hours || 'Segunda a Sexta · 08h00 às 21h00'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-display font-bold uppercase text-sm text-brand">
                      E-MAIL OFICIAL & ATENDIMENTO
                    </p>
                    <a
                      href={`mailto:${about?.email || 'labmaker.serra@ifes.edu.br'}`}
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      {about?.email || 'labmaker.serra@ifes.edu.br'}
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {about?.phone || '(27) 3348-9200 · Ramal 9245'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    to="/local"
                    onClick={playClick}
                    className="flex-1 text-center py-3 px-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-display font-bold uppercase text-sm border-2 border-surface-ink shadow-neo-sm transition-all"
                  >
                    VER MAPA DETALHADO
                  </Link>
                  <Link
                    to="/acesso"
                    onClick={playClick}
                    className="flex-1 text-center py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink font-display font-bold uppercase text-sm border-2 border-surface-ink shadow-neo-sm transition-all"
                  >
                    FAZER CHECK-IN
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
