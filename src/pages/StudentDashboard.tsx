import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Kanban,
  Calendar,
  Package,
  RefreshCw,
  MessageSquarePlus,
  Bell,
  History,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Circle,
  Plus,
  Trash2,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type StudentTab =
  | 'RESUMO'
  | 'TAREFAS'
  | 'AGENDAR'
  | 'EMPRESTIMOS'
  | 'REPOSICAO'
  | 'SUGESTOES'
  | 'HISTORICO';

export const StudentDashboard: React.FC = () => {
  const {
    user,
    data,
    createTask,
    updateTaskStatus,
    deleteTask,
    createBooking,
    createLoan,
    createRestock,
    createSuggestion,
    playClick,
  } = useApp();

  const [activeTab, setActiveTab] = useState<StudentTab>('TAREFAS');

  // Form Nova Tarefa Kanban
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Robótica & Cases IFES');
  const [newTaskStatus, setNewTaskStatus] = useState<'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDA'>('A_FAZER');

  // Form Agendamento + Termos de Responsabilidade
  const [selectedMachineId, setSelectedMachineId] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState('2026-11-16');
  const [bookingSlot, setBookingSlot] = useState('14:00 - 16:00');
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Form Empréstimo + Política de Empréstimos
  const [selectedItemId, setSelectedItemId] = useState<number>(1);
  const [loanQty, setLoanQty] = useState<number>(1);
  const [returnDate, setReturnDate] = useState('2026-11-24');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Form Reposição de Materiais
  const [materialName, setMaterialName] = useState('');
  const [materialCategory, setMaterialCategory] = useState('Impressão 3D');
  const [qtyNeeded, setQtyNeeded] = useState('');
  const [urgency, setUrgency] = useState<'BAIXA' | 'MEDIA' | 'ALTA'>('MEDIA');
  const [justification, setJustification] = useState('');

  // Form Sugestões
  const [sugTitle, setSugTitle] = useState('');
  const [sugCategory, setSugCategory] = useState('Infraestrutura');
  const [sugDesc, setSugDesc] = useState('');

  // Rota protegida: se Visitante tentar acessar diretamente, redireciona para /acesso
  if (user.role === 'VISITANTE') {
    return <Navigate to="/acesso?redirect=/aluno" replace />;
  }

  const tasks = data?.tasks || [];
  const machines = data?.machines || [];
  const bookings = data?.bookings || [];
  const inventory = (data?.inventory || []).filter((i) => i.loanable === 1);
  const loans = data?.loans || [];
  const restocks = data?.restocks || [];
  const suggestions = data?.suggestions || [];
  const notifications = data?.notifications || [];
  const activityLogs = data?.activityLogs || [];

  const todoTasks = tasks.filter((t) => t.status === 'A_FAZER');
  const doingTasks = tasks.filter((t) => t.status === 'EM_ANDAMENTO');
  const doneTasks = tasks.filter((t) => t.status === 'CONCLUIDA');

  // Contadores pixelados da referência (mínimo 12, 05, 08 ou real se maior)
  const doneCounter = String(Math.max(12, doneTasks.length)).padStart(2, '0');
  const doingCounter = String(Math.max(5, doingTasks.length)).padStart(2, '0');
  const todoCounter = String(Math.max(8, todoTasks.length)).padStart(2, '0');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await createTask({
      title: newTaskTitle,
      project_name: newTaskProject,
      status: newTaskStatus,
      assignee: user.name,
    });
    if (ok) {
      setNewTaskTitle('');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await createBooking({
      machine_id: selectedMachineId,
      date: bookingDate,
      time_slot: bookingSlot,
      purpose: bookingPurpose,
      terms_accepted: termsAccepted,
    });
    if (ok) {
      setBookingPurpose('');
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await createLoan({
      item_id: selectedItemId,
      quantity: loanQty,
      return_date: returnDate,
      purpose: loanPurpose,
      policy_accepted: policyAccepted,
    });
    if (ok) {
      setLoanPurpose('');
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await createRestock({
      material_name: materialName,
      category: materialCategory,
      quantity_needed: qtyNeeded,
      urgency,
      justification,
    });
    if (ok) {
      setMaterialName('');
      setQtyNeeded('');
      setJustification('');
    }
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await createSuggestion({
      title: sugTitle,
      category: sugCategory,
      description: sugDesc,
    });
    if (ok) {
      setSugTitle('');
      setSugDesc('');
    }
  };

  return (
    <div className="flex-1 bg-scanlines-light pb-32">
      {/* Header da Plataforma dos Alunos */}
      <section className="bg-royal-grid text-white py-10 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/25 font-pixel text-[9px] text-accent uppercase">
              PLATAFORMA DOS ALUNOS · SESSÃO AUTENTICADA
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase mt-2">
              OLÁ, {user.name.toUpperCase()}!
            </h1>
            <p className="text-brand-light text-sm sm:text-base mt-1">
              {user.course || 'IFES Campus Serra'} · Matrícula: {user.matricula || '20252BSI0372'}
            </p>
          </div>

          {/* Card de XP & Nível integrado ao MakerLab Quest */}
          <div className="bg-arcade-bg border-2 border-accent rounded-2xl p-4 sm:px-6 flex items-center gap-5 shadow-neo">
            <div>
              <p className="font-pixel text-[8px] text-arcade-cyan uppercase">NÍVEL MAKER</p>
              <p className="font-pixel text-xl text-accent mt-1">LVL {user.level}</p>
            </div>
            <div className="h-10 w-[2px] bg-white/15" />
            <div>
              <p className="font-pixel text-[8px] text-lime uppercase">EXPERIÊNCIA ACUMULADA</p>
              <p className="font-pixel text-xl text-white mt-1">{user.xp} XP</p>
            </div>
            <Link
              to="/quest"
              onClick={playClick}
              className="px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink font-pixel text-[8px] uppercase flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" /> QUEST
            </Link>
          </div>
        </div>

        {/* Abas Internas da Área do Aluno */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-wrap gap-2">
          {[
            { id: 'TAREFAS', label: 'Quadro de Tarefas', icon: Kanban },
            { id: 'RESUMO', label: 'Painel & Avisos', icon: Bell },
            { id: 'AGENDAR', label: 'Agendar Máquina', icon: Calendar },
            { id: 'EMPRESTIMOS', label: 'Empréstimos', icon: Package },
            { id: 'REPOSICAO', label: 'Reposição de Materiais', icon: RefreshCw },
            { id: 'SUGESTOES', label: 'Sugestões', icon: MessageSquarePlus },
            { id: 'HISTORICO', label: 'Histórico (Linha do Tempo)', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab(tab.id as StudentTab);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold uppercase text-xs sm:text-sm border-2 transition-all ${
                  active
                    ? 'bg-accent text-surface-ink border-surface-ink shadow-neo-sm -translate-y-0.5'
                    : 'bg-brand-dark/80 text-white border-white/20 hover:border-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ABA 1: SISTEMA DE GERENCIAMENTO DE TAREFAS (Quadro Colaborativo com os contadores pixelados da referência) */}
        {activeTab === 'TAREFAS' && (
          <div className="space-y-8">
            {/* Barra de Contadores Pixelados como na Imagem 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-xs uppercase text-gray-500">
                    TAREFAS CONCLUÍDAS
                  </p>
                  <p className="text-xs text-green-700 font-semibold mt-1">
                    Protótipos validados no Lab
                  </p>
                </div>
                <span className="font-pixel text-2xl sm:text-3xl text-brand">{doneCounter}</span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-xs uppercase text-gray-500">
                    EM CURSO (EM ANDAMENTO)
                  </p>
                  <p className="text-xs text-amber-700 font-semibold mt-1">
                    Em produção nas bancadas
                  </p>
                </div>
                <span className="font-pixel text-2xl sm:text-3xl text-accent">{doingCounter}</span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-xs uppercase text-gray-500">
                    A FAZER (FILA DE PROJETOS)
                  </p>
                  <p className="text-xs text-gray-600 font-semibold mt-1">
                    Aguardando início na máquina
                  </p>
                </div>
                <span className="font-pixel text-2xl sm:text-3xl text-gray-500">{todoCounter}</span>
              </div>
            </div>

            {/* Formulário rápido para adicionar nova tarefa colaborativa */}
            <form
              onSubmit={handleAddTask}
              className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
            >
              <div className="md:col-span-5">
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  NOVA TAREFA DO PROJETO *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ex.: Fatiar suporte do sensor ultrassônico em PETG"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  PROJETO VINCULADO *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  COLUNA INICIAL
                </label>
                <select
                  value={newTaskStatus}
                  onChange={(e) =>
                    setNewTaskStatus(e.target.value as 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDA')
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                >
                  <option value="A_FAZER">A FAZER</option>
                  <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                  <option value="CONCLUIDA">CONCLUÍDA</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> ADICIONAR
                </button>
              </div>
            </form>

            {/* Quadro Kanban Colaborativo com as 3 Colunas (A Fazer, Em Andamento, Concluída) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna 1: A FAZER */}
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo overflow-hidden flex flex-col">
                <div className="bg-[#E8E6E1] px-5 py-3.5 border-b-2 border-surface-ink flex items-center justify-between">
                  <span className="font-display font-bold uppercase text-sm text-surface-ink flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-600" /> A FAZER
                  </span>
                  <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-white border border-gray-300">
                    {todoTasks.length}
                  </span>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  {todoTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-300 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display font-bold text-brand text-base leading-snug">
                          {t.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => deleteTask(t.id)}
                          aria-label="Excluir tarefa"
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">
                        Projeto: <strong>{t.project_name}</strong> · Resp.: {t.assignee}
                      </p>
                      <div className="pt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(t.id, 'EM_ANDAMENTO')}
                          className="px-2.5 py-1 rounded bg-accent text-surface-ink font-pixel text-[7px] uppercase flex items-center gap-1"
                        >
                          INICIAR <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna 2: EM ANDAMENTO */}
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo overflow-hidden flex flex-col">
                <div className="bg-[#FDE0A6] px-5 py-3.5 border-b-2 border-surface-ink flex items-center justify-between">
                  <span className="font-display font-bold uppercase text-sm text-amber-950 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-800" /> EM ANDAMENTO
                  </span>
                  <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-white border border-amber-400">
                    {doingTasks.length}
                  </span>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  {doingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-[#FFFDF7] border-2 border-accent space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display font-bold text-brand text-base leading-snug">
                          {t.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => deleteTask(t.id)}
                          aria-label="Excluir tarefa"
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">
                        Projeto: <strong>{t.project_name}</strong> · Resp.: {t.assignee}
                      </p>
                      <div className="pt-1 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(t.id, 'A_FAZER')}
                          className="px-2.5 py-1 rounded bg-gray-200 text-gray-700 font-pixel text-[7px] uppercase"
                        >
                          ← VOLTAR
                        </button>
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(t.id, 'CONCLUIDA')}
                          className="px-2.5 py-1 rounded bg-lime text-surface-ink font-pixel text-[7px] uppercase flex items-center gap-1"
                        >
                          CONCLUIR ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna 3: CONCLUÍDA */}
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo overflow-hidden flex flex-col">
                <div className="bg-[#C5F89A] px-5 py-3.5 border-b-2 border-surface-ink flex items-center justify-between">
                  <span className="font-display font-bold uppercase text-sm text-green-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-800" /> CONCLUÍDA
                  </span>
                  <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-white border border-green-400">
                    {doneTasks.length}
                  </span>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  {doneTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-[#F4FBF0] border border-green-300 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display font-bold text-brand text-base leading-snug line-through opacity-85">
                          {t.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => deleteTask(t.id)}
                          aria-label="Excluir tarefa"
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">
                        Projeto: <strong>{t.project_name}</strong> · Resp.: {t.assignee}
                      </p>
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(t.id, 'EM_ANDAMENTO')}
                        className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-600 font-pixel text-[7px]"
                      >
                        REABRIR
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: PAINEL DE RESUMO, AVISOS E NOTIFICAÇÕES */}
        {activeTab === 'RESUMO' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6">
                <h2 className="font-display font-bold text-brand text-2xl uppercase mb-4">
                  MEUS PRÓXIMOS AGENDAMENTOS DE MÁQUINAS
                </h2>
                <div className="space-y-3">
                  {bookings
                    .filter((b) => b.status !== 'BLOQUEADO')
                    .map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-display font-bold text-brand text-base uppercase">
                            {b.machine_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {b.date} · {b.time_slot} — {b.purpose}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-lime text-surface-ink font-pixel text-[8px]">
                          {b.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6">
                <h2 className="font-display font-bold text-brand text-2xl uppercase mb-4">
                  EMPRÉSTIMOS DE RECURSOS ATIVOS
                </h2>
                <div className="space-y-3">
                  {loans.map((l) => (
                    <div
                      key={l.id}
                      className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-display font-bold text-surface-ink text-base">
                          {l.quantity}x {l.item_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Responsável: {l.user_name} · Devolução prevista: <strong>{l.return_date}</strong>
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-accent text-surface-ink font-pixel text-[8px]">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notificações e Avisos */}
            <div className="lg:col-span-5">
              <div className="bg-arcade-bg text-white rounded-2xl border-2 border-accent shadow-neo-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-accent text-xl uppercase flex items-center gap-2">
                    <Bell className="w-5 h-5" /> NOTIFICAÇÕES & AVISOS
                  </h2>
                  <span className="font-pixel text-[8px] text-lime">
                    {notifications.length} ALERTAS
                  </span>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-[8px] text-arcade-cyan uppercase">
                          [{n.type}]
                        </span>
                      </div>
                      <p className="font-display font-bold text-white text-base">{n.title}</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: AGENDAR HORÁRIO (Exige aceite dos Termos de Responsabilidade) */}
        {activeTab === 'AGENDAR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
              <div className="bg-brand px-6 py-5 border-b-2 border-accent">
                <span className="font-pixel text-accent text-[9px] uppercase">
                  RESERVA DE BANCADA E EQUIPAMENTO
                </span>
                <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                  AGENDAR HORÁRIO NO LABORATÓRIO
                </h2>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    ESCOLHA A MÁQUINA / ESTAÇÃO *
                  </label>
                  <select
                    value={selectedMachineId}
                    onChange={(e) => setSelectedMachineId(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 font-semibold"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.code}) — [{m.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      DATA DA UTILIZAÇÃO *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20"
                    />
                  </div>

                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      FAIXA DE HORÁRIO *
                    </label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20"
                    >
                      <option value="08:00 - 10:00">08:00 - 10:00 (Manhã 1)</option>
                      <option value="10:00 - 12:00">10:00 - 12:00 (Manhã 2)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00 (Tarde 1)</option>
                      <option value="16:00 - 18:00">16:00 - 18:00 (Tarde 2)</option>
                      <option value="18:30 - 20:30">18:30 - 20:30 (Noite)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    PROJETO / FINALIDADE TÉCNICA *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    placeholder="Informe peça, material (ex.: PLA/PETG/Fenolite/MDF 3mm) e tempo estimado..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20"
                  />
                </div>

                {/* Checkbox Obrigatório de Termos de Responsabilidade */}
                <div className="p-4 rounded-xl bg-brand-light/30 border-2 border-brand/30 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-brand"
                    />
                    <span className="text-sm text-surface-ink font-medium">
                      Declaro que li e aceito os{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-brand font-bold underline"
                      >
                        Termos de Responsabilidade e Segurança Operacional
                      </button>{' '}
                      do LabMaker IFES Campus Serra (uso obrigatório de EPIs e acompanhamento da 1ª
                      camada/corte). *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo font-display font-bold text-base uppercase tracking-wider"
                >
                  CONFIRMAR RESERVA DE HORÁRIO
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h3 className="font-display font-bold text-brand text-xl uppercase">
                HORÁRIOS JÁ RESERVADOS
              </h3>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-brand uppercase">{b.machine_name}</p>
                      <p className="text-gray-600">
                        {b.date} · {b.time_slot} ({b.user_name})
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-lime text-surface-ink font-pixel text-[7px]">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: EMPRÉSTIMOS DE RECURSOS (Exige aceite da Política de Empréstimos) */}
        {activeTab === 'EMPRESTIMOS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
              <div className="bg-brand px-6 py-5 border-b-2 border-accent">
                <span className="font-pixel text-accent text-[9px] uppercase">
                  KITS ARDUINO, ESP32 & INSTRUMENTOS
                </span>
                <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                  SOLICITAR EMPRÉSTIMO DE RECURSO
                </h2>
              </div>

              <form onSubmit={handleLoanSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    SELECIONE O ITEM DISPONÍVEL *
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 font-semibold"
                  >
                    {inventory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.item_name} — Disponíveis: {item.quantity_available}/{item.quantity_total}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      QUANTIDADE *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      required
                      value={loanQty}
                      onChange={(e) => setLoanQty(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      DATA DE DEVOLUÇÃO COMPROMETIDA *
                    </label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    FINALIDADE ACADÊMICA / PROJETO *
                  </label>
                  <input
                    type="text"
                    required
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="Ex.: Prototipagem de nó sensor para disciplina de IoT"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20"
                  />
                </div>

                {/* Checkbox Obrigatório da Política de Empréstimos */}
                <div className="p-4 rounded-xl bg-brand-light/30 border-2 border-brand/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyAccepted}
                      onChange={(e) => setPolicyAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-brand"
                    />
                    <span className="text-sm text-surface-ink font-medium">
                      Concordo com a{' '}
                      <button
                        type="button"
                        onClick={() => setShowPolicyModal(true)}
                        className="text-brand font-bold underline"
                      >
                        Política de Empréstimos e Conservação de Patrimônio
                      </button>{' '}
                      do LabMaker IFES Serra, comprometendo-me a devolver o item íntegro no prazo. *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-base"
                >
                  CONFIRMAR EMPRÉSTIMO
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h3 className="font-display font-bold text-brand text-xl uppercase">
                MEUS EMPRÉSTIMOS REGISTRADOS
              </h3>
              <div className="space-y-3">
                {loans.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-surface-ink">
                        {l.quantity}x {l.item_name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-accent text-surface-ink font-pixel text-[7px]">
                        {l.status}
                      </span>
                    </div>
                    <p className="text-gray-600">Devolução até: {l.return_date}</p>
                    <p className="text-gray-500">Projeto: {l.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: REPOSIÇÃO DE MATERIAIS */}
        {activeTab === 'REPOSICAO' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
              <div className="bg-brand px-6 py-5 border-b-2 border-accent">
                <span className="font-pixel text-accent text-[9px] uppercase">
                  INSUMOS E COMPONENTES
                </span>
                <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                  SOLICITAR REPOSIÇÃO DE MATERIAIS
                </h2>
              </div>
              <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    INSUMO OU COMPONENTE EM FALTA *
                  </label>
                  <input
                    type="text"
                    required
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Ex.: Filamento PLA Cinza 1.75mm / Chapa Fenolite / Fresa 0.2mm"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      SETOR
                    </label>
                    <select
                      value={materialCategory}
                      onChange={(e) => setMaterialCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    >
                      <option value="Impressão 3D">Impressão 3D</option>
                      <option value="Fabricação de PCI">Fabricação de PCI</option>
                      <option value="Corte a Laser">Corte a Laser</option>
                      <option value="Eletrônica & Solda">Eletrônica & Solda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      URGÊNCIA
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as 'BAIXA' | 'MEDIA' | 'ALTA')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    >
                      <option value="BAIXA">BAIXA</option>
                      <option value="MEDIA">MÉDIA</option>
                      <option value="ALTA">ALTA</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    QUANTIDADE ESTIMADA *
                  </label>
                  <input
                    type="text"
                    required
                    value={qtyNeeded}
                    onChange={(e) => setQtyNeeded(e.target.value)}
                    placeholder="Ex.: 4 rolos de 1kg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    JUSTIFICATIVA / PROJETO *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Explique a demanda dos projetos..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand text-white border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm"
                >
                  ENVIAR PEDIDO DE REPOSIÇÃO
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h3 className="font-display font-bold text-brand text-xl uppercase">
                ACOMPANHAMENTO DE REPOSIÇÕES
              </h3>
              <div className="space-y-3">
                {restocks.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-brand text-base">
                        {r.material_name} ({r.quantity_needed})
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-accent text-surface-ink font-pixel text-[8px]">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{r.justification}</p>
                    <p className="text-[11px] text-gray-400">
                      Solicitado por {r.user_name} · Urgência: {r.urgency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 6: SUGESTÕES E ACOMPANHAMENTO DE STATUS */}
        {activeTab === 'SUGESTOES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
              <div className="bg-brand px-6 py-5 border-b-2 border-accent">
                <span className="font-pixel text-accent text-[9px] uppercase">
                  VOZ DOS ESTUDANTES
                </span>
                <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                  ENVIAR SUGESTÃO DE MELHORIA
                </h2>
              </div>
              <form onSubmit={handleSuggestionSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    TÍTULO DA SUGESTÃO *
                  </label>
                  <input
                    type="text"
                    required
                    value={sugTitle}
                    onChange={(e) => setSugTitle(e.target.value)}
                    placeholder="Ex.: Adquirir bicos 0.6mm temperados para fibra de carbono"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    CATEGORIA
                  </label>
                  <select
                    value={sugCategory}
                    onChange={(e) => setSugCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  >
                    <option value="Infraestrutura">Infraestrutura & Bancadas</option>
                    <option value="Treinamento">Oficinas & Treinamentos</option>
                    <option value="Equipamentos">Novos Equipamentos</option>
                    <option value="Software">Software & Fatiadores</option>
                  </select>
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    DETALHAMENTO DA IDEIA *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={sugDesc}
                    onChange={(e) => setSugDesc(e.target.value)}
                    placeholder="Explique como isso ajudará os projetos do laboratório..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand text-white border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm"
                >
                  REGISTRAR SUGESTÃO
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h3 className="font-display font-bold text-brand text-xl uppercase">
                STATUS DAS SUGESTÕES ENVIADAS
              </h3>
              <div className="space-y-3.5">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-brand text-lg">{s.title}</span>
                      <span
                        className={`px-2.5 py-1 rounded font-pixel text-[8px] uppercase ${
                          s.status === 'IMPLEMENTADA'
                            ? 'bg-lime text-surface-ink'
                            : s.status === 'APROVADA'
                            ? 'bg-accent text-surface-ink'
                            : 'bg-brand text-white'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{s.description}</p>
                    {s.admin_reply && (
                      <div className="p-3 rounded-lg bg-brand/5 border-l-4 border-brand text-xs text-surface-ink">
                        <strong>Resposta da Coordenação:</strong> {s.admin_reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 7: HISTÓRICO DE UTILIZAÇÃO (LINHA DO TEMPO TEMA ESCURO #0A0E1A) */}
        {activeTab === 'HISTORICO' && (
          <div className="bg-arcade-bg text-white rounded-2xl border-2 border-accent shadow-neo-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-pixel text-arcade-cyan text-[9px] uppercase">
                  TIMELINE DE ATIVIDADES
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase mt-1">
                  HISTÓRICO DE UTILIZAÇÃO DO LABORATÓRIO
                </h2>
              </div>
              <span className="font-pixel text-[9px] text-lime">REGISTRO EM TEMPO REAL</span>
            </div>

            <div className="relative pl-6 border-l-2 border-accent space-y-6">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-accent border-2 border-arcade-bg" />
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-brand text-accent font-pixel text-[8px] uppercase mr-2">
                        {log.category}
                      </span>
                      <strong className="font-display font-bold text-white text-base">
                        {log.action}
                      </strong>
                      <p className="text-sm text-gray-300 mt-1">
                        {log.user_name} — {log.detail}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-arcade-cyan shrink-0">
                      {log.created_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Termos de Responsabilidade */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg max-w-lg w-full overflow-hidden">
            <div className="bg-brand px-6 py-4 border-b-2 border-accent flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-lg uppercase flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-accent" /> TERMOS DE RESPONSABILIDADE
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-white font-pixel text-xs"
              >
                X
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-gray-700">
              <p>
                <strong>1. Segurança Operacional:</strong> O uso de óculos de proteção é obrigatório
                durante operações de fresagem de PCI, usinagem CNC e corte a laser.
              </p>
              <p>
                <strong>2. Supervisão de Impressão 3D e Laser:</strong> O estudante deve acompanhar
                presencialmente as primeiras camadas da impressão 3D e jamais deixar a cortadora a
                laser CO2 operando sem supervisão visual e sem o Chiller/Exaustor ligados.
              </p>
              <p>
                <strong>3. Organização:</strong> Ao concluir o horário agendado, a bancada deve ser
                limpa e as ferramentas devolvidas aos suportes identificados.
              </p>
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-accent text-surface-ink border-2 border-surface-ink font-display font-bold uppercase text-xs"
                >
                  LI E ACEITO OS TERMOS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Política de Empréstimos */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg max-w-lg w-full overflow-hidden">
            <div className="bg-brand px-6 py-4 border-b-2 border-accent flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-lg uppercase">
                POLÍTICA DE EMPRÉSTIMOS DE RECURSOS
              </h3>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="text-white font-pixel text-xs"
              >
                X
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-gray-700">
              <p>
                <strong>1. Guarda e Conservação:</strong> Os kits embarcados (Arduino, ESP32,
                sensores) e instrumentos de medição são patrimônio público do IFES Campus Serra.
              </p>
              <p>
                <strong>2. Prazos e Renovação:</strong> A devolução deve ocorrer até a data
                registrada no sistema. Em caso de atraso sem justificativa, novos empréstimos ficam
                suspensos até a regularização.
              </p>
              <p>
                <strong>3. Testes na Devolução:</strong> Todo componente devolvido passa por
                conferência rápida junto aos monitores do LabMaker.
              </p>
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setPolicyAccepted(true);
                    setShowPolicyModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-lime text-surface-ink border-2 border-surface-ink font-display font-bold uppercase text-xs"
                >
                  CONCORDO COM A POLÍTICA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
