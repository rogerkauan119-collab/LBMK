import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Calendar,
  Wrench,
  Package,
  CheckSquare,
  BarChart3,
  FileEdit,
  Users,
  Download,
  Lock,
  Trash2,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

type AdminTab =
  | 'AGENDAMENTOS'
  | 'MAQUINAS'
  | 'ESTOQUE'
  | 'MODERACAO'
  | 'RELATORIOS'
  | 'CMS'
  | 'USUARIOS';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    data,
    createBooking,
    updateBookingStatus,
    saveMachine,
    deleteMachine,
    saveInventoryItem,
    updateLoanStatus,
    updateRestockStatus,
    updateSuggestion,
    saveProject,
    updateSiteContent,
    createUserAdmin,
    updateUserRole,
    playClick,
    pushToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('AGENDAMENTOS');

  // Form Bloquear Horário
  const [blockMachineId, setBlockMachineId] = useState<number>(1);
  const [blockDate, setBlockDate] = useState('2026-11-18');
  const [blockSlot, setBlockSlot] = useState('14:00 - 16:00');
  const [blockReason, setBlockReason] = useState('Manutenção preventiva e calibração');

  // Form Nova Máquina CRUD
  const [macName, setMacName] = useState('');
  const [macCode, setMacCode] = useState('');
  const [macCategory, setMacCategory] = useState('Manufatura Aditiva');
  const [macDesc, setMacDesc] = useState('');
  const [macSpecs, setMacSpecs] = useState('');

  // Form Novo Item Estoque
  const [invName, setInvName] = useState('');
  const [invCat, setInvCat] = useState('Embarcados');
  const [invTotal, setInvTotal] = useState(10);

  // Form Editor do Site (CMS)
  const about = data?.siteContent?.about;
  const [cmsTitle, setCmsTitle] = useState(about?.title || 'LABMAKER · IFES CAMPUS SERRA');
  const [cmsSubtitle, setCmsSubtitle] = useState(about?.subtitle || '');
  const [cmsHours, setCmsHours] = useState(about?.hours || 'Segunda a Sexta · 08h00 às 21h00');
  const [cmsRoom, setCmsRoom] = useState(
    about?.locationRoom || 'Bloco C · Sala 104 (Térreo) — IFES Campus Serra'
  );
  const [cmsEmail, setCmsEmail] = useState(about?.email || 'labmaker.serra@ifes.edu.br');

  // Form Cadastrar Usuário
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<UserRole>('ALUNO');
  const [uMatricula, setUMatricula] = useState('');
  const [uCourse, setUCourse] = useState('Engenharia de Controle e Automação');

  if (user.role !== 'ADMIN') {
    return <Navigate to="/acesso?redirect=/admin" replace />;
  }

  const machines = data?.machines || [];
  const bookings = data?.bookings || [];
  const inventory = data?.inventory || [];
  const loans = data?.loans || [];
  const restocks = data?.restocks || [];
  const suggestions = data?.suggestions || [];
  const projects = data?.projects || [];
  const checkins = data?.checkins || [];
  const usersList = data?.users || [];

  const handleBlockSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    await createBooking({
      machine_id: blockMachineId,
      date: blockDate,
      time_slot: blockSlot,
      purpose: blockReason,
      terms_accepted: true,
      is_block: true,
    });
  };

  const handleCreateMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    await saveMachine({
      name: macName,
      code: macCode,
      category: macCategory,
      short_desc: macDesc,
      specs: macSpecs,
      status: 'DISPONIVEL',
      icon_type: 'printer',
    });
    setMacName('');
    setMacCode('');
    setMacDesc('');
    setMacSpecs('');
  };

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    await saveInventoryItem({
      item_name: invName,
      category: invCat,
      unit: 'Unidade',
      quantity_total: invTotal,
      quantity_available: invTotal,
      loanable: 1,
    });
    setInvName('');
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    await updateSiteContent('about', {
      ...about,
      title: cmsTitle,
      subtitle: cmsSubtitle,
      hours: cmsHours,
      locationRoom: cmsRoom,
      email: cmsEmail,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await createUserAdmin({
      name: uName,
      email: uEmail,
      role: uRole,
      matricula: uMatricula,
      course: uCourse,
    });
    if (ok) {
      setUName('');
      setUEmail('');
      setUMatricula('');
    }
  };

  // Exportação CSV de Check-ins e Relatórios
  const handleExportCsv = () => {
    playClick();
    const headers = ['ID,Tipo,Nome,Matricula,Curso,Email,Telefone,Organizacao,Motivo,DataHora'];
    const rows = checkins.map((c) =>
      [
        c.id,
        c.user_type,
        `"${c.full_name.replace(/"/g, '""')}"`,
        `"${c.matricula || ''}"`,
        `"${c.course || ''}"`,
        c.email,
        `"${c.phone || ''}"`,
        `"${c.organization || ''}"`,
        `"${c.reason.replace(/"/g, '""')}"`,
        c.created_at,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'relatorio_checkins_labmaker_ifes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    pushToast(
      'RELATÓRIO CSV EXPORTADO!',
      'Arquivo relatorio_checkins_labmaker_ifes.csv gerado com sucesso.',
      'success'
    );
  };

  return (
    <div className="flex-1 bg-scanlines-light pb-32">
      {/* Banner Admin */}
      <section className="bg-arcade-bg text-white py-10 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded bg-lime text-surface-ink font-pixel text-[8px] uppercase">
              MODO GESTOR · PERMISSÃO TOTAL
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase mt-2">
              PAINEL ADMINISTRATIVO · LABMAKER
            </h1>
            <p className="text-gray-400 text-sm">
              Gestora Logada: {user.name} ({user.email})
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-xs"
          >
            <Download className="w-4 h-4" /> EXPORTAR CHECK-INS (.CSV)
          </button>
        </div>

        {/* Abas do Admin */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-wrap gap-2">
          {[
            { id: 'AGENDAMENTOS', label: 'Agendamentos & Bloqueios', icon: Calendar },
            { id: 'MAQUINAS', label: 'CRUD Máquinas', icon: Wrench },
            { id: 'ESTOQUE', label: 'Estoque, Empréstimos & Reposição', icon: Package },
            { id: 'MODERACAO', label: 'Moderar Sugestões & Projetos', icon: CheckSquare },
            { id: 'RELATORIOS', label: 'Relatórios & Check-ins', icon: BarChart3 },
            { id: 'CMS', label: 'Editor do Site', icon: FileEdit },
            { id: 'USUARIOS', label: 'Usuários & Permissões', icon: Users },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab(t.id as AdminTab);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold uppercase text-xs sm:text-sm border-2 transition-all ${
                  active
                    ? 'bg-lime text-surface-ink border-surface-ink shadow-neo-sm'
                    : 'bg-white/5 text-white border-white/15 hover:border-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* 1. GESTÃO DE AGENDAMENTOS E BLOQUEAR HORÁRIOS INDISPONÍVEIS */}
        {activeTab === 'AGENDAMENTOS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
              <div className="bg-arcade-bg px-6 py-4 border-b-2 border-accent">
                <span className="font-pixel text-accent text-[8px] uppercase">
                  MANUTENÇÃO OU AULA PRÁTICA
                </span>
                <h2 className="font-display font-bold text-white text-xl uppercase mt-1 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" /> BLOQUEAR HORÁRIO INDISPONÍVEL
                </h2>
              </div>
              <form onSubmit={handleBlockSchedule} className="p-6 space-y-4">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    MÁQUINA A BLOQUEAR
                  </label>
                  <select
                    value={blockMachineId}
                    onChange={(e) => setBlockMachineId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      DATA
                    </label>
                    <input
                      type="date"
                      required
                      value={blockDate}
                      onChange={(e) => setBlockDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      PERÍODO
                    </label>
                    <select
                      value={blockSlot}
                      onChange={(e) => setBlockSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    >
                      <option value="08:00 - 12:00">08:00 - 12:00 (Manhã Inteira)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00</option>
                      <option value="14:00 - 18:00">14:00 - 18:00 (Tarde Inteira)</option>
                      <option value="18:30 - 21:00">18:30 - 21:00 (Noite)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    MOTIVO DO BLOQUEIO
                  </label>
                  <input
                    type="text"
                    required
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-xs"
                >
                  BLOQUEAR HORÁRIO NO CALENDÁRIO
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                GERENCIAR RESERVAS E BLOQUEIOS
              </h2>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-display font-bold text-brand text-base uppercase">
                        {b.machine_name} · {b.date} ({b.time_slot})
                      </p>
                      <p className="text-xs text-gray-600">
                        Solicitante: <strong>{b.user_name}</strong> — {b.purpose}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          updateBookingStatus(b.id, e.target.value as typeof b.status)
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-surface-ink font-pixel text-[8px]"
                      >
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="APROVADO">APROVADO</option>
                        <option value="CONCLUIDO">CONCLUÍDO</option>
                        <option value="REJEITADO">REJEITADO</option>
                        <option value="BLOQUEADO">BLOQUEADO</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. GERENCIAR MÁQUINAS (CRUD COMPLETO) */}
        {activeTab === 'MAQUINAS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                ADICIONAR NOVA MÁQUINA
              </h2>
              <form onSubmit={handleCreateMachine} className="space-y-3.5">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    NOME DO EQUIPAMENTO *
                  </label>
                  <input
                    type="text"
                    required
                    value={macName}
                    onChange={(e) => setMacName(e.target.value)}
                    placeholder="Ex.: SCANNER 3D CR-SCAN FERRET"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      CÓDIGO PATRIMÔNIO *
                    </label>
                    <input
                      type="text"
                      required
                      value={macCode}
                      onChange={(e) => setMacCode(e.target.value)}
                      placeholder="SCN-3D-07"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      CATEGORIA
                    </label>
                    <input
                      type="text"
                      value={macCategory}
                      onChange={(e) => setMacCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    DESCRIÇÃO CURTA *
                  </label>
                  <input
                    type="text"
                    required
                    value={macDesc}
                    onChange={(e) => setMacDesc(e.target.value)}
                    placeholder="Digitalização tridimensional de peças para engenharia reversa."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    ESPECIFICAÇÕES TÉCNICAS
                  </label>
                  <input
                    type="text"
                    value={macSpecs}
                    onChange={(e) => setMacSpecs(e.target.value)}
                    placeholder="Precisão 0.1mm / Exportação STL e OBJ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand text-white border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> CADASTRAR EQUIPAMENTO
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                CATÁLOGO DE MÁQUINAS ({machines.length})
              </h2>
              <div className="space-y-3">
                {machines.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-display font-bold text-brand text-base uppercase">
                        {m.name} <span className="font-mono text-xs text-gray-500">({m.code})</span>
                      </p>
                      <p className="text-xs text-gray-600">{m.short_desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={m.status}
                        onChange={(e) =>
                          saveMachine({
                            id: m.id,
                            name: m.name,
                            status: e.target.value as typeof m.status,
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-surface-ink font-pixel text-[8px]"
                      >
                        <option value="DISPONIVEL">DISPONÍVEL</option>
                        <option value="EM_USO">EM USO</option>
                        <option value="MANUTENCAO">MANUTENÇÃO</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteMachine(m.id)}
                        aria-label="Remover máquina"
                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. GESTÃO DE ESTOQUE, EMPRÉSTIMOS E REPOSIÇÃO */}
        {activeTab === 'ESTOQUE' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cadastrar Item de Estoque */}
              <div className="lg:col-span-4 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
                <h3 className="font-display font-bold text-brand text-xl uppercase">
                  NOVO ITEM DE ESTOQUE
                </h3>
                <form onSubmit={handleCreateInventory} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                    placeholder="Nome do Kit / Ferramenta / Insumo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                  />
                  <input
                    type="text"
                    value={invCat}
                    onChange={(e) => setInvCat(e.target.value)}
                    placeholder="Categoria (ex.: IoT, Metrologia)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                  />
                  <input
                    type="number"
                    min={1}
                    value={invTotal}
                    onChange={(e) => setInvTotal(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand text-white font-display font-bold uppercase text-xs border-2 border-surface-ink"
                  >
                    ADICIONAR AO INVENTÁRIO
                  </button>
                </form>
              </div>

              {/* Lista de Inventário com ajuste rápido */}
              <div className="lg:col-span-8 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
                <h3 className="font-display font-bold text-brand text-xl uppercase">
                  CONTROLE DE INVENTÁRIO & INSUMOS
                </h3>
                <div className="space-y-2.5">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-sm text-surface-ink">{item.item_name}</p>
                        <p className="text-xs text-gray-500">
                          Categoria: {item.category} · Disponível: {item.quantity_available}/
                          {item.quantity_total}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            saveInventoryItem({
                              id: item.id,
                              quantity_available: Math.max(0, item.quantity_available - 1),
                            })
                          }
                          className="w-8 h-8 rounded bg-gray-200 font-bold"
                        >
                          -
                        </button>
                        <span className="font-pixel text-xs w-8 text-center">
                          {item.quantity_available}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            saveInventoryItem({
                              id: item.id,
                              quantity_available: item.quantity_available + 1,
                              quantity_total: Math.max(
                                item.quantity_total,
                                item.quantity_available + 1
                              ),
                            })
                          }
                          className="w-8 h-8 rounded bg-accent font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controle de Empréstimos e Pedidos de Reposição */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-3">
                <h3 className="font-display font-bold text-brand text-xl uppercase">
                  GESTÃO DE EMPRÉSTIMOS ATIVOS
                </h3>
                {loans.map((l) => (
                  <div
                    key={l.id}
                    className="p-3.5 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-surface-ink">
                        {l.quantity}x {l.item_name} — {l.user_name}
                      </p>
                      <p className="text-gray-600">Devolução: {l.return_date}</p>
                    </div>
                    <select
                      value={l.status}
                      onChange={(e) => updateLoanStatus(l.id, e.target.value as typeof l.status)}
                      className="px-2 py-1 rounded bg-white border border-surface-ink font-pixel text-[8px]"
                    >
                      <option value="ATIVO">ATIVO</option>
                      <option value="DEVOLVIDO">DEVOLVIDO</option>
                      <option value="ATRASADO">ATRASADO</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-3">
                <h3 className="font-display font-bold text-brand text-xl uppercase">
                  PEDIDOS DE REPOSIÇÃO DE MATERIAIS
                </h3>
                {restocks.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-surface-ink">
                        {r.material_name} ({r.quantity_needed})
                      </p>
                      <p className="text-gray-600">
                        Por {r.user_name} · Urgência: {r.urgency}
                      </p>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateRestockStatus(r.id, e.target.value as typeof r.status)
                      }
                      className="px-2 py-1 rounded bg-white border border-surface-ink font-pixel text-[8px]"
                    >
                      <option value="ABERTO">ABERTO</option>
                      <option value="EM_COTACAO">EM COTAÇÃO</option>
                      <option value="ATENDIDO">ATENDIDO</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MODERAÇÃO DE SUGESTÕES E PROJETOS */}
        {activeTab === 'MODERACAO' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                MODERAR SUGESTÕES DOS ALUNOS
              </h2>
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand">{s.title}</span>
                    <select
                      value={s.status}
                      onChange={(e) =>
                        updateSuggestion(s.id, e.target.value as typeof s.status, s.admin_reply)
                      }
                      className="px-2 py-1 rounded bg-white border border-surface-ink font-pixel text-[8px]"
                    >
                      <option value="EM_ANALISE">EM ANÁLISE</option>
                      <option value="APROVADA">APROVADA</option>
                      <option value="IMPLEMENTADA">IMPLEMENTADA</option>
                      <option value="ARQUIVADA">ARQUIVADA</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-600">{s.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                MODERAR PROJETOS DA GALERIA
              </h2>
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-bold text-brand text-sm">{p.title}</p>
                    <p className="text-xs text-gray-600">
                      Autor: {p.author} · Categoria: {p.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveProject({ id: p.id, approved: p.approved ? 0 : 1 })}
                    className={`px-3 py-1.5 rounded font-pixel text-[8px] border border-surface-ink ${
                      p.approved ? 'bg-lime text-surface-ink' : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {p.approved ? 'VISÍVEL' : 'OCULTO'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. RELATÓRIOS (GRÁFICOS E EXPORTAÇÃO CSV; INCLUI CHECK-INS) */}
        {activeTab === 'RELATORIOS' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5">
                <p className="font-pixel text-[8px] text-gray-500">TOTAL DE CHECK-INS</p>
                <p className="font-pixel text-2xl text-brand mt-2">{checkins.length}</p>
              </div>
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5">
                <p className="font-pixel text-[8px] text-gray-500">RESERVAS DE MÁQUINAS</p>
                <p className="font-pixel text-2xl text-accent mt-2">{bookings.length}</p>
              </div>
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5">
                <p className="font-pixel text-[8px] text-gray-500">PROJETOS CATALOGADOS</p>
                <p className="font-pixel text-2xl text-green-700 mt-2">{projects.length}</p>
              </div>
              <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5">
                <p className="font-pixel text-[8px] text-gray-500">EMPRÉSTIMOS REALIZADOS</p>
                <p className="font-pixel text-2xl text-brand-dark mt-2">{loans.length}</p>
              </div>
            </div>

            {/* Gráfico de barras de utilização por área técnica */}
            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-brand text-2xl uppercase">
                  DEMANDA POR BANCADA TÉCNICA (%)
                </h2>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-accent text-surface-ink font-pixel text-[8px] border border-surface-ink flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> BAIXAR CSV COMPLETO
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Impressão 3D (FDM & SLA)', pct: 44, color: 'bg-brand' },
                  { label: "Fabricação de PCI's & Solda SMD", pct: 28, color: 'bg-accent' },
                  { label: 'Corte & Gravação a Laser CO2', pct: 18, color: 'bg-lime' },
                  { label: 'Usinagem CNC & Bancada IoT', pct: 10, color: 'bg-arcade-cyan' },
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{bar.label}</span>
                      <span className="font-pixel text-[9px]">{bar.pct}%</span>
                    </div>
                    <div className="w-full h-4 rounded-lg bg-gray-200 overflow-hidden border border-black/10">
                      <div className={`h-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Check-ins Presenciais */}
            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo overflow-hidden">
              <div className="bg-brand px-6 py-4 border-b-2 border-accent">
                <h3 className="font-display font-bold text-white text-xl uppercase">
                  REGISTRO DE ACESSOS (CHECK-INS NO LABORATÓRIO)
                </h3>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-surface-ink font-display font-bold text-xs uppercase text-brand">
                      <th className="py-2.5 px-3">Vínculo</th>
                      <th className="py-2.5 px-3">Nome Completo</th>
                      <th className="py-2.5 px-3">Matrícula / Doc</th>
                      <th className="py-2.5 px-3">Curso / Origem</th>
                      <th className="py-2.5 px-3">Motivo da Utilização</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {checkins.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-pixel text-[7px] ${
                              c.user_type === 'ALUNO'
                                ? 'bg-brand text-white'
                                : 'bg-lime text-surface-ink'
                            }`}
                          >
                            {c.user_type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold">{c.full_name}</td>
                        <td className="py-3 px-3 font-mono text-xs">
                          {c.matricula || c.document_id || '—'}
                        </td>
                        <td className="py-3 px-3">{c.course || c.organization}</td>
                        <td className="py-3 px-3 text-gray-600">{c.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. EDITOR DE INFORMAÇÕES DO SITE (CMS) */}
        {activeTab === 'CMS' && (
          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg max-w-3xl overflow-hidden">
            <div className="bg-brand px-6 py-5 border-b-2 border-accent">
              <span className="font-pixel text-accent text-[9px] uppercase">
                CMS INSTITUCIONAL
              </span>
              <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                EDITOR DE INFORMAÇÕES DO SITE
              </h2>
            </div>

            <form onSubmit={handleSaveCms} className="p-6 space-y-4">
              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  TÍTULO PRINCIPAL DA HOME
                </label>
                <input
                  type="text"
                  value={cmsTitle}
                  onChange={(e) => setCmsTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  TEXTO INSTITUCIONAL / SUBTÍTULO
                </label>
                <textarea
                  rows={3}
                  value={cmsSubtitle}
                  onChange={(e) => setCmsSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    HORÁRIO DE ATENDIMENTO
                  </label>
                  <input
                    type="text"
                    value={cmsHours}
                    onChange={(e) => setCmsHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    E-MAIL DE CONTATO
                  </label>
                  <input
                    type="email"
                    value={cmsEmail}
                    onChange={(e) => setCmsEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  LOCALIZAÇÃO / SALA NO CAMPUS
                </label>
                <input
                  type="text"
                  value={cmsRoom}
                  onChange={(e) => setCmsRoom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm"
              >
                SALVAR ALTERAÇÕES NO SITE
              </button>
            </form>
          </div>
        )}

        {/* 7. CADASTRAR USUÁRIOS E DEFINIR PERMISSÕES */}
        {activeTab === 'USUARIOS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                CADASTRAR NOVO USUÁRIO
              </h2>
              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    NOME COMPLETO *
                  </label>
                  <input
                    type="text"
                    required
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    placeholder="Nome do estudante ou servidor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    E-MAIL INSTITUCIONAL *
                  </label>
                  <input
                    type="email"
                    required
                    value={uEmail}
                    onChange={(e) => setUEmail(e.target.value)}
                    placeholder="usuario@ifes.edu.br"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      PERFIL DE ACESSO *
                    </label>
                    <select
                      value={uRole}
                      onChange={(e) => setURole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    >
                      <option value="ALUNO">ALUNO / SERVIDOR</option>
                      <option value="ADMIN">ADMINISTRADOR</option>
                      <option value="VISITANTE">VISITANTE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                      MATRÍCULA / SIAPE
                    </label>
                    <input
                      type="text"
                      value={uMatricula}
                      onChange={(e) => setUMatricula(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                    CURSO / DEPARTAMENTO
                  </label>
                  <input
                    type="text"
                    value={uCourse}
                    onChange={(e) => setUCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand text-white border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-xs"
                >
                  CADASTRAR E LIBERAR PERMISSÃO
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <h2 className="font-display font-bold text-brand text-2xl uppercase">
                USUÁRIOS CADASTRADOS ({usersList.length})
              </h2>
              <div className="space-y-3">
                {usersList.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl bg-[#F6F5F2] border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-brand text-sm">{u.name}</p>
                      <p className="text-xs text-gray-600">
                        {u.email} · {u.course || 'IFES Serra'} · {u.xp} XP
                      </p>
                    </div>
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-surface-ink font-pixel text-[8px]"
                    >
                      <option value="VISITANTE">VISITANTE</option>
                      <option value="ALUNO">ALUNO</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
