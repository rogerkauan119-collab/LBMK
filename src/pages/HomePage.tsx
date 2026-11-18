import React, { useState, useEffect, useRef } from 'react';
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
  Camera,
  Target,
  Wrench,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MascotRobotPixel, PixelMachineBadge } from '../components/ui/PixelArts';

interface AboutImageSlot {
  id: string;
  tag: string;
  title: string;
  caption: string;
  defaultUrl: string;
  spanClass: string;
}

const DEFAULT_ABOUT_SLOTS: AboutImageSlot[] = [
  {
    id: 'slot-1',
    tag: 'ESPAÇO MAKER · VISÃO GERAL',
    title: 'Bancadas Colaborativas & Impressão 3D',
    caption: 'Ambiente integrado para prototipagem rápida, modelagem CAD e desenvolvimento de projetos.',
    defaultUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    spanClass: 'sm:col-span-2 h-56 sm:h-64',
  },
  {
    id: 'slot-2',
    tag: 'ELETRÔNICA & PCI',
    title: 'Fresagem e Soldagem SMD',
    caption: 'Confecção de placas de circuito impresso e testes embarcados.',
    defaultUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80',
    spanClass: 'h-48 sm:h-52',
  },
  {
    id: 'slot-3',
    tag: 'MANUFATURA & LASER',
    title: 'Corte a Laser & Usinagem CNC',
    caption: 'Precisão milimétrica em acrílico, MDF e polímeros.',
    defaultUrl:
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=700&q=80',
    spanClass: 'h-48 sm:h-52',
  },
  {
    id: 'slot-4',
    tag: 'ROBÓTICA & COMUNIDADE',
    title: 'Oficinas, Pesquisa e Extensão no IFES Serra',
    caption: 'Trabalho em equipe unindo estudantes, servidores e comunidade externa.',
    defaultUrl:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    spanClass: 'sm:col-span-2 h-48 sm:h-52',
  },
];

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

  // Carrossel "RECURSOS DISPONÍVEIS" com rolagem contínua suave que pausa no hover e acende o card sob o mouse
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [customSlotImages, setCustomSlotImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('labmaker_about_slots');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleSlotImageUpload = (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const next = { ...customSlotImages, [slotId]: reader.result };
        setCustomSlotImages(next);
        localStorage.setItem('labmaker_about_slots', JSON.stringify(next));
      }
    };
    reader.readAsDataURL(file);
  };

  // Rolagem contínua tipo carrossel que para instantaneamente ao aproximar o mouse
  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track || machines.length === 0) return;

    let animId: number;
    const speed = 0.7; // velocidade suave em pixels por frame

    const step = () => {
      if (!isPaused && track) {
        track.scrollLeft += speed;
        // Loop infinito suave quando chega na metade da pista duplicada
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, machines.length]);

  const handlePrevCarousel = () => {
    playClick();
    const track = carouselTrackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    if (track.scrollLeft <= 10 && halfWidth > 0) {
      track.scrollLeft += halfWidth;
    }
    track.scrollBy({ left: -370, behavior: 'smooth' });
  };

  const handleNextCarousel = () => {
    playClick();
    const track = carouselTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: 370, behavior: 'smooth' });
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

  // Lista duplicada para o carrossel infinito contínuo
  const carouselMachines = machines.length > 0 ? [...machines, ...machines] : [];

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

      {/* 1.5. SEÇÃO SOBRE O LABMAKER — INFORMATIVA E COM SLOTS DE IMAGENS HARMÔNICOS */}
      <section
        id="sobre"
        className="scroll-mt-20 bg-lbmk-cover py-20 border-b-4 border-surface-ink"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Cabeçalho da Seção Sobre */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand text-lime border-2 border-surface-ink shadow-neo-sm font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider">
                PROJETO DE EXTENSÃO · IDENTIDADE & INOVAÇÃO
              </span>
              <h2 className="font-display font-extrabold text-brand text-3xl sm:text-5xl uppercase tracking-tight leading-[1.06]">
                PRIMEIRO DE TUDO: O QUE É O LABMAKER?
              </h2>
              <p className="text-surface-ink text-base sm:text-lg font-medium leading-relaxed">
                O <strong>LabMaker IFES Campus Serra</strong> é um laboratório criativo, aberto e
                multidisciplinar onde estudantes, docentes e a comunidade externa desenvolvem
                projetos práticos que unem <strong>tecnologia, inovação e educação</strong>.
              </p>
            </div>

            {/* Pílulas de Palavras-Chave Oficiais */}
            <div className="flex flex-wrap gap-2">
              {[
                '🧠 Criatividade',
                '🤖 Tecnologia',
                '💡 Inovação',
                '🖨️ Impressoras 3D',
                '🛠️ Mão na Massa',
              ].map((kw) => (
                <span
                  key={kw}
                  className="px-3.5 py-2 rounded-xl bg-white text-brand border-2 border-surface-ink shadow-neo-sm font-display font-bold text-xs uppercase"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Grid Principal: Informações Estruturadas (5 cols) + Mosaico Harmônico de Slots de Imagens (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Coluna Esquerda: Características, Objetivo e Setores do Lab */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              {/* Card 1: Características Principais */}
              <div className="bg-white rounded-2xl border-[2.5px] border-surface-ink shadow-neo p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand text-accent border-2 border-surface-ink flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-pixel text-[8px] text-brand uppercase">ESTRUTURA</span>
                    <h3 className="font-display font-bold text-brand text-lg uppercase">
                      CARACTERÍSTICAS PRINCIPAIS
                    </h3>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm sm:text-base text-surface-ink font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <span>
                      Equipado com ferramentas manuais e digitais de ponta: impressoras 3D (FDM e
                      Resina SLA 8K), fresadora de PCI, router CNC, corte a laser CO2 e kits de
                      robótica.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <span>
                      Estimula a aprendizagem prática (<em>learning by doing</em>), o trabalho em
                      equipe multidisciplinar e a resolução de problemas reais da sociedade e da
                      indústria.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Nosso Objetivo */}
              <div className="bg-brand text-white rounded-2xl border-[2.5px] border-surface-ink shadow-neo p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent text-surface-ink border-2 border-surface-ink flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-pixel text-[8px] text-lime uppercase">PROPÓSITO</span>
                    <h3 className="font-display font-bold text-white text-lg uppercase">
                      NOSSO OBJETIVO NO CAMPUS
                    </h3>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-brand-light leading-relaxed font-medium">
                  Criar um espaço de <strong>inovação aberta</strong> no IFES Campus Serra onde a
                  comunidade acadêmica e parceiros externos possam experimentar, criar, aprender e
                  transformar ideias em protótipos e soluções reais.
                </p>
              </div>

              {/* Card 3: Divisão das Bancadas do Laboratório */}
              <div className="bg-white rounded-2xl border-[2.5px] border-surface-ink shadow-neo p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand" />
                  <h4 className="font-display font-bold text-brand text-sm uppercase tracking-wider">
                    SETORES & ARMÁRIOS TÉCNICOS DO LAB
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-lime/40 border border-surface-ink/20">
                    <p className="font-display font-bold text-brand uppercase">01. Ferramentas & EPI</p>
                    <p className="text-surface-ink/80 mt-1">
                      Instrumentos de bancada, medição e proteção individual obrigatória.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/30 border border-surface-ink/20">
                    <p className="font-display font-bold text-brand uppercase">
                      02. Eletrônica & PCI
                    </p>
                    <p className="text-surface-ink/80 mt-1">
                      Componentes SMD, sensores, microcontroladores ESP32 e Arduino.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-light/40 border border-surface-ink/20">
                    <p className="font-display font-bold text-brand uppercase">
                      03. Informática & 3D
                    </p>
                    <p className="text-surface-ink/80 mt-1">
                      Estações CAD/CAM, filamentos técnicos, resinas e acabamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Mosaico Harmônico de Slots de Imagens (Bento Grid com suporte a foto customizada) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {DEFAULT_ABOUT_SLOTS.map((slot, index) => {
                const imgSrc = customSlotImages[slot.id] || slot.defaultUrl;
                return (
                  <div
                    key={slot.id}
                    onMouseEnter={playHover}
                    className={`group relative rounded-2xl overflow-hidden border-[2.5px] border-surface-ink shadow-neo-lg bg-arcade-bg flex flex-col justify-between p-5 ${slot.spanClass}`}
                  >
                    <img
                      src={imgSrc}
                      alt={slot.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-65 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/45 to-transparent" />

                    {/* Topo do Slot: Etiqueta + Botão para personalizar foto do slot */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-brand/95 text-lime border border-surface-ink font-pixel text-[8px] uppercase shadow-neo-sm">
                        SLOT 0{index + 1} · {slot.tag}
                      </span>

                      <label
                        title="Clique para enviar uma foto real do laboratório para este slot"
                        className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-accent text-surface-ink border border-surface-ink font-display font-bold text-[11px] uppercase inline-flex items-center gap-1.5 cursor-pointer shadow-neo-sm transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Trocar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotImageUpload(slot.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Base do Slot: Título e Legenda */}
                    <div className="relative z-10 space-y-1">
                      <h3 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide drop-shadow">
                        {slot.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 leading-snug max-w-xl">
                        {slot.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
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

          {/* Bloco MÃO NA MASSA — RECURSOS DISPONÍVEIS (Carrossel contínuo que para no hover e acende o item quando o mouse chega perto) */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredCardKey(null);
            }}
            className="relative"
          >
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-pixel text-brand text-[10px] sm:text-xs tracking-[0.16em] uppercase">
                  MÃO NA MASSA
                </p>
                <h2 className="font-display font-bold text-brand text-3xl sm:text-5xl uppercase tracking-tight mt-1">
                  RECURSOS DISPONÍVEIS
                </h2>
                <p className="text-gray-600 text-base sm:text-lg mt-1 font-medium">
                  Aproxime o mouse para pausar o carrossel e acender o equipamento desejado. ✨
                </p>
              </div>
              <span
                className={`self-start sm:self-auto px-3 py-1.5 rounded-lg border-2 border-surface-ink font-pixel text-[8px] uppercase transition-colors ${
                  isPaused
                    ? 'bg-accent text-surface-ink shadow-neo-sm'
                    : 'bg-white text-brand'
                }`}
              >
                {isPaused ? '⏸ CARROSSEL PAUSADO' : '▶ ROLAGEM AUTOMÁTICA'}
              </span>
            </div>

            <div className="relative flex items-center">
              {/* Seta quadrada amarela esquerda */}
              <button
                type="button"
                onClick={handlePrevCarousel}
                aria-label="Recurso anterior"
                className="absolute -left-2 sm:-left-4 z-30 w-11 h-11 rounded-[8px] bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo flex items-center justify-center active:translate-y-0.5 transition-all"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.8]" />
              </button>

              {/* Pista do Carrossel Contínuo */}
              <div
                ref={carouselTrackRef}
                className="w-full flex items-stretch gap-6 overflow-x-hidden py-4 px-3 sm:px-6 select-none"
              >
                {carouselMachines.map((mac, idx) => {
                  const cardKey = `${mac.id}-${idx}`;
                  const isLit = hoveredCardKey === cardKey;

                  return (
                    <article
                      key={cardKey}
                      onMouseEnter={() => {
                        playHover();
                        setHoveredCardKey(cardKey);
                      }}
                      onMouseLeave={() => setHoveredCardKey(null)}
                      className={`group relative shrink-0 w-[300px] sm:w-[350px] h-[380px] sm:h-[400px] rounded-[18px] overflow-hidden border-[3px] bg-arcade-bg flex flex-col justify-end p-6 cursor-pointer transition-all duration-300 ${
                        isLit
                          ? 'border-accent shadow-[0_0_32px_rgba(253,186,90,0.55),6px_6px_0px_#3A3A3A] -translate-y-2 scale-[1.02] brightness-110 z-20'
                          : 'border-surface-ink shadow-neo-lg brightness-[0.55] saturate-75 hover:brightness-105'
                      }`}
                    >
                      {/* Imagem de fundo: escura/sombreada em repouso, acende com brilho total ao aproximar o mouse */}
                      <img
                        src={mac.image_url}
                        alt={mac.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isLit
                            ? 'opacity-100 scale-105 brightness-110 saturate-110'
                            : 'opacity-35 scale-100 brightness-50'
                        }`}
                      />

                      {/* Camada de sombra escura que clareia quando o mouse chega perto */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          isLit
                            ? 'bg-gradient-to-t from-[#060913]/95 via-[#060913]/35 to-transparent opacity-90'
                            : 'bg-gradient-to-t from-[#03050A] via-[#050811]/85 to-[#050811]/70 opacity-100'
                        }`}
                      />

                      {/* Halo de luz no topo quando aceso */}
                      {isLit && (
                        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-60 h-32 rounded-full bg-accent/30 blur-2xl" />
                      )}

                      {/* Status pill no canto superior direito */}
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`px-2.5 py-1 rounded font-pixel text-[8px] uppercase border transition-transform ${
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
                        {/* Ícone em quadradinho azul com borda amarela que brilha quando aceso */}
                        <div
                          className={`w-11 h-11 rounded-[10px] border-2 flex items-center justify-center transition-all duration-300 ${
                            isLit
                              ? 'bg-accent text-surface-ink border-white shadow-[0_0_16px_rgba(253,186,90,0.8)] scale-110'
                              : 'bg-brand text-white border-accent shadow-neo-sm'
                          }`}
                        >
                          {renderMachineIcon(mac.icon_type)}
                        </div>

                        <h3
                          className={`font-pixel text-sm sm:text-base tracking-wide uppercase transition-colors ${
                            isLit ? 'text-white drop-shadow-[0_2px_8px_rgba(253,186,90,0.6)]' : 'text-accent'
                          }`}
                        >
                          {mac.name}
                        </h3>

                        <p
                          className={`text-sm sm:text-base leading-snug transition-colors ${
                            isLit ? 'text-white font-medium' : 'text-gray-300'
                          }`}
                        >
                          {mac.short_desc}
                        </p>

                        <p
                          className={`text-xs font-mono pt-1 transition-all duration-300 ${
                            isLit ? 'text-lime opacity-100' : 'text-arcade-cyan/70 opacity-75'
                          }`}
                        >
                          {mac.specs}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Seta quadrada amarela direita */}
              <button
                type="button"
                onClick={handleNextCarousel}
                aria-label="Próximo recurso"
                className="absolute -right-2 sm:-right-4 z-30 w-11 h-11 rounded-[8px] bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo flex items-center justify-center active:translate-y-0.5 transition-all"
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

      {/* 5. CONHEÇA A NOSSA EQUIPE DO LABMAKER (Tema Escuro #0A0E1A fiel à Imagem 5) */}
      <section id="equipe" className="scroll-mt-20 bg-arcade-bg text-white py-20 border-b-4 border-accent">
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
      <section id="faq" className="scroll-mt-20 bg-scanlines-light py-20">
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
