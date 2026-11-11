export type UserRole = 'VISITANTE' | 'ALUNO' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  matricula?: string;
  course?: string;
  phone?: string;
  xp: number;
  level: number;
  badges: string[];
}

export interface Machine {
  id: number;
  name: string;
  code: string;
  category: string;
  short_desc: string;
  specs: string;
  status: 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO';
  image_url: string;
  icon_type: string;
}

export interface Booking {
  id: number;
  user_id?: number;
  user_name: string;
  machine_id: number;
  machine_name: string;
  date: string;
  time_slot: string;
  purpose: string;
  terms_accepted: number;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CONCLUIDO' | 'BLOQUEADO';
  created_at: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  author: string;
  description: string;
  status: string;
  image_url: string;
  approved: number;
  created_at?: string;
}

export interface TaskItem {
  id: number;
  title: string;
  project_name: string;
  status: 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  assignee: string;
  priority: string;
  updated_at?: string;
}

export interface CheckinRecord {
  id: number;
  user_type: 'ALUNO' | 'VISITANTE';
  full_name: string;
  matricula: string;
  course: string;
  email: string;
  phone: string;
  document_id: string;
  organization: string;
  reason: string;
  created_at: string;
}

export interface InventoryItem {
  id: number;
  item_name: string;
  category: string;
  unit: string;
  quantity_total: number;
  quantity_available: number;
  min_threshold: number;
  loanable: number;
}

export interface LoanRequest {
  id: number;
  user_id?: number;
  user_name: string;
  item_id: number;
  item_name: string;
  quantity: number;
  return_date: string;
  purpose: string;
  policy_accepted: number;
  status: 'SOLICITADO' | 'ATIVO' | 'DEVOLVIDO' | 'ATRASADO';
  created_at: string;
}

export interface RestockRequest {
  id: number;
  user_id?: number;
  user_name: string;
  material_name: string;
  category: string;
  quantity_needed: string;
  urgency: 'BAIXA' | 'MEDIA' | 'ALTA';
  justification: string;
  status: 'ABERTO' | 'EM_COTACAO' | 'ATENDIDO';
  created_at: string;
}

export interface SuggestionItem {
  id: number;
  user_id?: number;
  user_name: string;
  title: string;
  category: string;
  description: string;
  status: 'EM_ANALISE' | 'APROVADA' | 'IMPLEMENTADA' | 'ARQUIVADA';
  admin_reply: string;
  created_at: string;
}

export interface QuestItem {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  badge_icon: string;
  difficulty: 'INICIANTE' | 'MAKER' | 'MESTRE';
  category: string;
  completedBy: string[];
}

export interface TutorialItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  level: string;
  summary: string;
  steps: string[];
}

export interface NotificationItem {
  id: number;
  user_role: string;
  title: string;
  message: string;
  type: 'DEVOLUCAO' | 'AGENDAMENTO' | 'XP' | 'AVISO';
  read: number;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user_name: string;
  action: string;
  detail: string;
  category: string;
  created_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: 'cube' | 'bolt' | 'flame';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge?: string;
  isLead?: boolean;
  image: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  subtitle: string;
  hours: string;
  locationRoom: string;
  email: string;
  phone: string;
  address: string;
}

export interface SiteContentMap {
  about: AboutContent;
  services: ServiceItem[];
  team: TeamMember[];
  faq: FaqItem[];
}

export interface BootstrapData {
  siteContent: SiteContentMap;
  machines: Machine[];
  projects: ProjectItem[];
  tasks: TaskItem[];
  bookings: Booking[];
  checkins: CheckinRecord[];
  inventory: InventoryItem[];
  loans: LoanRequest[];
  restocks: RestockRequest[];
  suggestions: SuggestionItem[];
  quests: QuestItem[];
  tutorials: TutorialItem[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  users: User[];
}
