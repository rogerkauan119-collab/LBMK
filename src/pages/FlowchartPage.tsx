import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  LogIn,
  Home,
  HelpCircle,
  UserCheck,
  MapPin,
  Briefcase,
  Wrench,
  Layers,
  BookOpen,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  GitBranch,
  Edit3,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface FlowchartNodeItem {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  targetPath: string;
  targetLabel: string;
  visibility: 'PUBLICO_GERAL' | 'HERDADO_AMBOS';
  icon: React.ComponentType<{ className?: string }>;
  defaultNotes: string;
}

export const FLOWCHART_NODES: FlowchartNodeItem[] = [
  {
    id: 'indicativo-pessoas',
    order: 1,
    title: 'Indicativo de pessoas que podem usar o site',
    subtitle: 'Explicação dos perfis: Visitante, Aluno/Servidor e Administrador.',
    targetPath: '/',
    targetLabel: 'Ver na Home',
    visibility: 'HERDADO_AMBOS',
    icon: UserCheck,
    defaultNotes: 'Base: bloco "Quem pode usar nosso espaço?" + permissões de cada perfil.',
  },
  {
    id: 'entrar-no-ifes',
    order: 2,
    title: 'ENTRAR NO IFES',
    subtitle: 'Tela de Check-in presencial/digital e login institucional.',
    targetPath: '/acesso',
    targetLabel: 'Abrir Check-in / Login',
    visibility: 'HERDADO_AMBOS',
    icon: LogIn,
    defaultNotes: 'Base: autenticação rápida e formulário Aluno vs Visitante.',
  },
  {
    id: 'inicio-sobre',
    order: 3,
    title: 'INÍCIO / SOBRE',
    subtitle: 'Apresentação do LabMaker IFES Campus Serra e visão geral.',
    targetPath: '/',
    targetLabel: 'Ir para Início',
    visibility: 'HERDADO_AMBOS',
    icon: Home,
    defaultNotes: 'Base: hero principal, mascote pixel e resumo institucional.',
  },
  {
    id: 'perguntas',
    order: 4,
    title: 'PERGUNTAS',
    subtitle: 'Acordeão de Perguntas Frequentes (FAQ) sobre uso e regras.',
    targetPath: '/',
    targetLabel: 'Ver FAQ na Home',
    visibility: 'HERDADO_AMBOS',
    icon: HelpCircle,
    defaultNotes: 'Base: dúvidas sobre acesso, insumos, primeira impressão e empréstimos.',
  },
  {
    id: 'nossa-equipe',
    order: 5,
    title: 'NOSSA EQUIPE',
    subtitle: 'Gestores, orientadora e pesquisadores do laboratório.',
    targetPath: '/equipe',
    targetLabel: 'Abrir Equipe',
    visibility: 'HERDADO_AMBOS',
    icon: Users,
    defaultNotes: 'Base: tema escuro com card destacado da Orientadora e pesquisadores.',
  },
  {
    id: 'local-email',
    order: 6,
    title: 'INFORMAÇÕES SOBRE LOCAL DO LABORATÓRIO E E-MAIL',
    subtitle: 'Sala no campus, horários de atendimento, mapa e contato.',
    targetPath: '/local',
    targetLabel: 'Abrir Local & Contato',
    visibility: 'HERDADO_AMBOS',
    icon: MapPin,
    defaultNotes: 'Base: Bloco C Sala 104, horário Seg-Sex, radar GPS e formulário.',
  },
  {
    id: 'projetos',
    order: 7,
    title: 'PROJETOS',
    subtitle: 'Galeria de protótipos desenvolvidos no LabMaker com filtros.',
    targetPath: '/projetos',
    targetLabel: 'Abrir Projetos',
    visibility: 'HERDADO_AMBOS',
    icon: Briefcase,
    defaultNotes: 'Base: protótipos 3D, placa PCI robô seguidor, corte a laser e IoT.',
  },
  {
    id: 'equipamentos',
    order: 8,
    title: 'EQUIPAMENTOS',
    subtitle: 'Catálogo técnico de impressoras 3D, CNC, PCI e corte a laser.',
    targetPath: '/equipamentos',
    targetLabel: 'Abrir Equipamentos',
    visibility: 'HERDADO_AMBOS',
    icon: Wrench,
    defaultNotes: 'Base: especificações técnicas, status em tempo real e reserva.',
  },
  {
    id: 'catalogo-servicos',
    order: 9,
    title: 'CATÁLOGO DE SERVIÇOS (SHOWCASE)',
    subtitle: 'Showcase dos serviços prestados: 3D, PCI e Corte/Gravação Laser.',
    targetPath: '/equipamentos',
    targetLabel: 'Ver Serviços',
    visibility: 'HERDADO_AMBOS',
    icon: Layers,
    defaultNotes: 'Base: os 3 cards brancos de serviço do showcase principal.',
  },
  {
    id: 'tutoriais',
    order: 10,
    title: 'Tutoriais e materiais educativos.',
    subtitle: 'Guias passo a passo de fatiamento, Gerber no KiCad e vetores laser.',
    targetPath: '/projetos',
    targetLabel: 'Abrir Tutoriais',
    visibility: 'HERDADO_AMBOS',
    icon: BookOpen,
    defaultNotes: 'Base: materiais educativos com busca e filtro por categoria.',
  },
  {
    id: 'agenda-laboratorio',
    order: 11,
    title: 'agenda de laboratório',
    subtitle: 'Calendário de ocupação das máquinas (leitura p/ visitante, reserva p/ aluno).',
    targetPath: '/equipamentos',
    targetLabel: 'Ver Agenda',
    visibility: 'HERDADO_AMBOS',
    icon: Calendar,
    defaultNotes: 'Base: tabela/calendário de horários reservados e bloqueados.',
  },
];

export const FlowchartPage: React.FC = () => {
  const { playClick, playHover, pushToast } = useApp();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>(FLOWCHART_NODES[0].id);
  const [notesByNode, setNotesByNode] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('labmaker_flowchart_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState('');

  const selectedNode =
    FLOWCHART_NODES.find((n) => n.id === selectedId) || FLOWCHART_NODES[0];

  const handleSelectNode = (node: FlowchartNodeItem) => {
    playClick();
    setSelectedId(node.id);
    setEditingNote(false);
  };

  const startEditingNote = () => {
    playClick();
    setDraftNote(notesByNode[selectedNode.id] ?? selectedNode.defaultNotes);
    setEditingNote(true);
  };

  const saveNote = () => {
    playClick();
    const updated = { ...notesByNode, [selectedNode.id]: draftNote };
    setNotesByNode(updated);
    localStorage.setItem('labmaker_flowchart_notes', JSON.stringify(updated));
    setEditingNote(false);
    pushToast('BASE ATUALIZADA', `Anotação salva para "${selectedNode.title}".`, 'success');
  };

  return (
    <div className="flex-1 bg-scanlines-light pb-16">
      {/* Banner superior idêntico ao padrão do site */}
      <section className="bg-royal-grid text-white py-12 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/25 font-pixel text-[9px] text-accent uppercase">
              <GitBranch className="w-3.5 h-3.5 text-lime" /> ARQUITETURA BASE DO SITE
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase mt-2">
              FLUXOGRAMA & ESTRUTURA BASE
            </h1>
            <p className="text-brand-light text-base mt-2 max-w-2xl">
              Todos os 11 balões do fluxograma mapeados de forma interativa para servir de base às
              próximas alterações e evoluções do LabMaker.
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-arcade-bg border-2 border-accent shadow-neo text-xs space-y-1 shrink-0">
            <p className="font-pixel text-[8px] text-lime uppercase">STATUS DA BASE</p>
            <p className="font-display font-bold text-base text-white">
              {FLOWCHART_NODES.length} BALÕES CONECTADOS
            </p>
            <p className="text-gray-400">Clique em qualquer balão para inspecionar ou navegar</p>
          </div>
        </div>
      </section>

      {/* Área principal do Fluxograma */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda (7 cols): Lista visual fiel aos balões do fluxograma */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-brand text-[9px] uppercase tracking-widest">
              BALÕES DO FLUXOGRAMA (1 A 11)
            </span>
            <span className="font-mono text-xs text-gray-500">
              Base editável para futuras mudanças
            </span>
          </div>

          {FLOWCHART_NODES.map((node) => {
            const Icon = node.icon;
            const isSelected = node.id === selectedNode.id;

            return (
              <motion.div
                key={node.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => handleSelectNode(node)}
                  onMouseEnter={playHover}
                  className={`flex-1 text-left p-4 rounded-[14px] border-[2.5px] transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-brand text-white border-surface-ink shadow-neo'
                      : 'bg-white text-surface-ink border-surface-ink shadow-neo-sm hover:bg-brand-light/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                        isSelected
                          ? 'bg-accent text-surface-ink border-surface-ink'
                          : 'bg-brand text-white border-surface-ink'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-pixel text-[8px] px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-lime text-surface-ink'
                              : 'bg-brand-light/50 text-brand'
                          }`}
                        >
                          #{String(node.order).padStart(2, '0')}
                        </span>
                        <h2 className="font-display font-bold text-sm sm:text-base uppercase truncate">
                          {node.title}
                        </h2>
                      </div>
                      <p
                        className={`text-xs mt-0.5 truncate ${
                          isSelected ? 'text-brand-light' : 'text-gray-600'
                        }`}
                      >
                        {node.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-accent' : 'text-brand'
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Coluna Direita (5 cols): Bloco Amarelo "Itens Herdados" + Painel Base do Balão Selecionado */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {/* Quadro Amarelo igual ao do fluxograma enviado */}
          <div className="rounded-[18px] bg-[#FEF08A] text-surface-ink border-[2.5px] border-surface-ink shadow-neo-lg p-6 space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded bg-surface-ink text-accent font-pixel text-[8px] uppercase">
              DESTINO NO FLUXOGRAMA
            </span>
            <h3 className="font-display font-bold text-2xl uppercase leading-tight">
              Itens herdados:
              <br />
              PÚBLICO GERAL / PÚBLICO INTERNO
            </h3>
            <p className="text-sm text-surface-ink/85 leading-relaxed">
              Todos os 11 balões ao lado são herdados tanto pelo{' '}
              <strong>Público Geral (Visitante)</strong> quanto pelo{' '}
              <strong>Público Interno (Aluno/Servidor)</strong>.
            </p>
          </div>

          {/* Card de Base / Detalhes do Balão Selecionado */}
          <div className="bg-white rounded-[20px] border-[2.5px] border-surface-ink shadow-neo-lg overflow-hidden">
            <div className="bg-brand px-6 py-4 border-b-[3px] border-accent flex items-center justify-between">
              <div>
                <span className="font-pixel text-accent text-[8px] uppercase">
                  BALÃO #{String(selectedNode.order).padStart(2, '0')} SELECIONADO
                </span>
                <h3 className="font-display font-bold text-white text-xl uppercase mt-0.5">
                  {selectedNode.title}
                </h3>
              </div>
              <selectedNode.icon className="w-6 h-6 text-accent shrink-0" />
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="font-display font-bold text-xs uppercase text-brand mb-1">
                  DESCRIÇÃO DA SEÇÃO
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.subtitle}</p>
              </div>

              {/* Anotação de base editável para planejar alterações futuras */}
              <div className="p-4 rounded-xl bg-[#F6F5F2] border border-surface-ink/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[8px] text-brand uppercase">
                    NOTAS DE BASE (PARA ALTERAÇÕES FUTURAS)
                  </span>
                  {!editingNote && (
                    <button
                      type="button"
                      onClick={startEditingNote}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar nota
                    </button>
                  )}
                </div>

                {editingNote ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-brand text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNote(false)}
                        className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveNote}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-lime text-surface-ink border border-surface-ink text-xs font-bold"
                      >
                        <Check className="w-3.5 h-3.5" /> Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">
                    {notesByNode[selectedNode.id] ?? selectedNode.defaultNotes}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  navigate(selectedNode.targetPath);
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-sm flex items-center justify-center gap-2 transition-all"
              >
                {selectedNode.targetLabel}
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
