import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BootstrapData,
  User,
  UserRole,
  TaskItem,
  Booking,
  CheckinRecord,
  LoanRequest,
  RestockRequest,
  SuggestionItem,
  Machine,
  InventoryItem,
  ProjectItem,
} from '../types';
import { soundFX } from '../services/soundFX';

interface ToastMessage {
  id: number;
  title: string;
  message: string;
  variant: 'success' | 'error' | 'info';
}

interface AppContextValue {
  // Perfil e sessão
  user: User;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  switchProfileQuick: (role: UserRole) => Promise<void>;
  logoutToVisitor: () => void;

  // Toggles SFX e CRT
  sfxEnabled: boolean;
  crtEnabled: boolean;
  toggleSfx: () => void;
  toggleCrt: () => void;
  playClick: () => void;
  playHover: () => void;

  // Dados da aplicação
  data: BootstrapData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

  // Ações de negócio
  registerCheckin: (payload: Omit<CheckinRecord, 'id' | 'created_at'>) => Promise<boolean>;
  createTask: (payload: Partial<TaskItem>) => Promise<boolean>;
  updateTaskStatus: (id: number, status: TaskItem['status']) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  createBooking: (payload: {
    machine_id: number;
    date: string;
    time_slot: string;
    purpose: string;
    terms_accepted: boolean;
    is_block?: boolean;
  }) => Promise<boolean>;
  updateBookingStatus: (id: number, status: Booking['status']) => Promise<void>;
  createLoan: (payload: {
    item_id: number;
    quantity: number;
    return_date: string;
    purpose: string;
    policy_accepted: boolean;
  }) => Promise<boolean>;
  updateLoanStatus: (id: number, status: LoanRequest['status']) => Promise<void>;
  createRestock: (payload: Partial<RestockRequest>) => Promise<boolean>;
  updateRestockStatus: (id: number, status: RestockRequest['status']) => Promise<void>;
  createSuggestion: (payload: { title: string; category: string; description: string }) => Promise<boolean>;
  updateSuggestion: (id: number, status: SuggestionItem['status'], admin_reply?: string) => Promise<void>;
  completeQuest: (questId: number) => Promise<void>;
  saveMachine: (payload: Partial<Machine> & { id?: number }) => Promise<void>;
  deleteMachine: (id: number) => Promise<void>;
  saveInventoryItem: (payload: Partial<InventoryItem> & { id?: number }) => Promise<void>;
  saveProject: (payload: Partial<ProjectItem> & { id?: number }) => Promise<void>;
  updateSiteContent: (key: string, value: unknown) => Promise<void>;
  createUserAdmin: (payload: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    matricula?: string;
    course?: string;
  }) => Promise<boolean>;
  updateUserRole: (id: number, role: UserRole) => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  pushToast: (title: string, message: string, variant?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: number) => void;
}

const DEFAULT_VISITOR: User = {
  id: 1,
  name: 'Visitante',
  role: 'VISITANTE',
  email: 'visitante@ifes.edu.br',
  course: 'Comunidade Externa',
  xp: 120,
  level: 1,
  badges: ['Explorador do Lab'],
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('labmaker_user');
      return saved ? JSON.parse(saved) : DEFAULT_VISITOR;
    } catch {
      return DEFAULT_VISITOR;
    }
  });

  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('labmaker_sfx');
    return saved !== null ? saved === 'true' : true;
  });

  const [crtEnabled, setCrtEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('labmaker_crt');
    return saved !== null ? saved === 'true' : true;
  });

  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback(
    (title: string, message: string, variant: 'success' | 'error' | 'info' = 'info') => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, title, message, variant }]);
      if (variant === 'success') soundFX.success(sfxEnabled);
      if (variant === 'error') soundFX.error(sfxEnabled);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    [sfxEnabled]
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    localStorage.setItem('labmaker_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('labmaker_sfx', String(sfxEnabled));
  }, [sfxEnabled]);

  useEffect(() => {
    localStorage.setItem('labmaker_crt', String(crtEnabled));
  }, [crtEnabled]);

  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/bootstrap');
      if (!res.ok) throw new Error('Falha ao carregar dados do servidor.');
      const json: BootstrapData = await res.json();
      setData(json);

      // Sincroniza XP/nível do usuário logado se existir na lista
      setUser((prev) => {
        const match = json.users.find((u) => u.email.toLowerCase() === prev.email.toLowerCase());
        return match ? { ...prev, ...match } : prev;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de conexão com o LabMaker API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleSfx = () => {
    setSfxEnabled((prev) => {
      const next = !prev;
      if (next) soundFX.click(true);
      return next;
    });
  };

  const toggleCrt = () => {
    soundFX.click(sfxEnabled);
    setCrtEnabled((prev) => !prev);
  };

  const playClick = () => soundFX.click(sfxEnabled);
  const playHover = () => soundFX.hover(sfxEnabled);

  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        pushToast('ACESSO NEGADO', json.error || 'Credenciais inválidas.', 'error');
        return false;
      }
      setUser(json.user);
      pushToast('AUTENTICADO COM SUCESSO!', `Bem-vindo(a), ${json.user.name} [${json.user.role}]`, 'success');
      await refreshData();
      return true;
    } catch {
      pushToast('ERRO DE REDE', 'Não foi possível conectar ao servidor de autenticação.', 'error');
      return false;
    }
  };

  const switchProfileQuick = async (role: UserRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quickRole: role }),
      });
      const json = await res.json();
      if (res.ok && json.user) {
        setUser(json.user);
        pushToast(
          `PERFIL ATIVO: ${json.user.role}`,
          `Sessão alterada para ${json.user.name}`,
          'success'
        );
        await refreshData();
      }
    } catch {
      pushToast('ERRO', 'Não foi possível alternar o perfil.', 'error');
    }
  };

  const logoutToVisitor = () => {
    soundFX.click(sfxEnabled);
    setUser(DEFAULT_VISITOR);
    pushToast('MODO VISITANTE ATIVO', 'Você saiu da conta autenticada e está navegando como Visitante.', 'info');
  };

  const registerCheckin = async (payload: Omit<CheckinRecord, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        pushToast('ATENÇÃO NO CHECK-IN', json.error || 'Verifique os campos obrigatórios.', 'error');
        return false;
      }
      if (json.user) {
        setUser(json.user);
      }
      pushToast(
        'CHECK-IN REGISTRADO! (+50 XP)',
        `Acesso liberado para ${payload.full_name} como ${payload.user_type}.`,
        'success'
      );
      await refreshData();
      return true;
    } catch {
      pushToast('ERRO', 'Falha ao registrar o check-in.', 'error');
      return false;
    }
  };

  const createTask = async (payload: Partial<TaskItem>): Promise<boolean> => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        assignee: payload.assignee || user.name,
      }),
    });
    if (!res.ok) {
      pushToast('ERRO', 'Preencha o título e o projeto da tarefa.', 'error');
      return false;
    }
    pushToast('TAREFA ADICIONADA!', `"${payload.title}" entrou no quadro colaborativo.`, 'success');
    await refreshData();
    return true;
  };

  const updateTaskStatus = async (id: number, status: TaskItem['status']) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    soundFX.click(sfxEnabled);
    await refreshData();
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    pushToast('TAREFA REMOVIDA', 'Item removido do quadro.', 'info');
    await refreshData();
  };

  const createBooking = async (payload: {
    machine_id: number;
    date: string;
    time_slot: string;
    purpose: string;
    terms_accepted: boolean;
    is_block?: boolean;
  }): Promise<boolean> => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        user_id: user.id,
        user_name: payload.is_block ? `ADMIN (${user.name})` : user.name,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      pushToast('NÃO FOI POSSÍVEL AGENDAR', json.error || 'Verifique os dados informados.', 'error');
      return false;
    }
    pushToast(
      payload.is_block ? 'HORÁRIO BLOQUEADO' : 'RESERVA CONFIRMADA!',
      payload.is_block
        ? 'O período foi bloqueado no calendário.'
        : 'Seu agendamento de máquina foi registrado com sucesso.',
      'success'
    );
    await refreshData();
    return true;
  };

  const updateBookingStatus = async (id: number, status: Booking['status']) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    pushToast('AGENDAMENTO ATUALIZADO', `Status alterado para ${status}.`, 'success');
    await refreshData();
  };

  const createLoan = async (payload: {
    item_id: number;
    quantity: number;
    return_date: string;
    purpose: string;
    policy_accepted: boolean;
  }): Promise<boolean> => {
    const res = await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        user_id: user.id,
        user_name: user.name,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      pushToast('ERRO NO EMPRÉSTIMO', json.error || 'Verifique a disponibilidade.', 'error');
      return false;
    }
    pushToast('EMPRÉSTIMO REGISTRADO!', 'Retire seu equipamento na bancada técnica.', 'success');
    await refreshData();
    return true;
  };

  const updateLoanStatus = async (id: number, status: LoanRequest['status']) => {
    await fetch(`/api/loans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    pushToast('EMPRÉSTIMO ATUALIZADO', `Status atualizado para ${status}.`, 'success');
    await refreshData();
  };

  const createRestock = async (payload: Partial<RestockRequest>): Promise<boolean> => {
    const res = await fetch('/api/restocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        user_id: user.id,
        user_name: user.name,
      }),
    });
    if (!res.ok) {
      pushToast('ERRO', 'Preencha o material e a justificativa.', 'error');
      return false;
    }
    pushToast('SOLICITAÇÃO ENVIADA!', 'Pedido de reposição de insumo enviado à coordenação.', 'success');
    await refreshData();
    return true;
  };

  const updateRestockStatus = async (id: number, status: RestockRequest['status']) => {
    await fetch(`/api/restocks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    pushToast('REPOSIÇÃO ATUALIZADA', `Status alterado para ${status}.`, 'success');
    await refreshData();
  };

  const createSuggestion = async (payload: {
    title: string;
    category: string;
    description: string;
  }): Promise<boolean> => {
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        user_id: user.id,
        user_name: user.name,
      }),
    });
    if (!res.ok) {
      pushToast('ERRO', 'Informe título e descrição da sugestão.', 'error');
      return false;
    }
    pushToast('SUGESTÃO REGISTRADA!', 'Acompanhe o status de análise no seu painel.', 'success');
    await refreshData();
    return true;
  };

  const updateSuggestion = async (id: number, status: SuggestionItem['status'], admin_reply?: string) => {
    await fetch(`/api/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_reply }),
    });
    pushToast('MODERAÇÃO SALVA', 'Sugestão atualizada com sucesso.', 'success');
    await refreshData();
  };

  const completeQuest = async (questId: number) => {
    const res = await fetch(`/api/quests/${questId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, userName: user.name }),
    });
    if (res.ok) {
      soundFX.levelUp(sfxEnabled);
      pushToast('LEVEL UP! MISSÃO CONCLUÍDA!', 'XP e insígnia adicionados ao seu perfil Maker!', 'success');
      await refreshData();
    }
  };

  const saveMachine = async (payload: Partial<Machine> & { id?: number }) => {
    if (payload.id) {
      await fetch(`/api/machines/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      pushToast('MÁQUINA ATUALIZADA', `${payload.name} salva com sucesso.`, 'success');
    } else {
      await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      pushToast('MÁQUINA CADASTRADA', `${payload.name} adicionada ao catálogo.`, 'success');
    }
    await refreshData();
  };

  const deleteMachine = async (id: number) => {
    await fetch(`/api/machines/${id}`, { method: 'DELETE' });
    pushToast('MÁQUINA REMOVIDA', 'Equipamento excluído do catálogo.', 'info');
    await refreshData();
  };

  const saveInventoryItem = async (payload: Partial<InventoryItem> & { id?: number }) => {
    if (payload.id) {
      await fetch(`/api/inventory/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    pushToast('ESTOQUE ATUALIZADO', 'Item salvo no inventário do LabMaker.', 'success');
    await refreshData();
  };

  const saveProject = async (payload: Partial<ProjectItem> & { id?: number }) => {
    if (payload.id) {
      await fetch(`/api/projects/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    pushToast('PROJETO ATUALIZADO', 'Galeria de projetos sincronizada.', 'success');
    await refreshData();
  };

  const updateSiteContent = async (key: string, value: unknown) => {
    await fetch(`/api/site-content/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    pushToast('CONTEÚDO DO SITE SALVO!', `Seção "${key.toUpperCase()}" atualizada em tempo real.`, 'success');
    await refreshData();
  };

  const createUserAdmin = async (payload: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    matricula?: string;
    course?: string;
  }): Promise<boolean> => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      pushToast('ERRO AO CADASTRAR', json.error || 'Verifique os dados.', 'error');
      return false;
    }
    pushToast('USUÁRIO CADASTRADO!', `${payload.name} (${payload.role}) adicionado.`, 'success');
    await refreshData();
    return true;
  };

  const updateUserRole = async (id: number, role: UserRole) => {
    await fetch(`/api/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    pushToast('PERMISSÃO ATUALIZADA', `Perfil alterado para ${role}.`, 'success');
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginWithCredentials,
        switchProfileQuick,
        logoutToVisitor,
        sfxEnabled,
        crtEnabled,
        toggleSfx,
        toggleCrt,
        playClick,
        playHover,
        data,
        loading,
        error,
        refreshData,
        registerCheckin,
        createTask,
        updateTaskStatus,
        deleteTask,
        createBooking,
        updateBookingStatus,
        createLoan,
        updateLoanStatus,
        createRestock,
        updateRestockStatus,
        createSuggestion,
        updateSuggestion,
        completeQuest,
        saveMachine,
        deleteMachine,
        saveInventoryItem,
        saveProject,
        updateSiteContent,
        createUserAdmin,
        updateUserRole,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      <div className={crtEnabled ? 'crt-active min-h-screen flex flex-col' : 'min-h-screen flex flex-col'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
