import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'labmaker.db');
export const db = new DatabaseSync(dbPath);

export function initDatabase() {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('VISITANTE', 'ALUNO', 'ADMIN')),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      matricula TEXT,
      course TEXT,
      phone TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      badges_json TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_type TEXT NOT NULL CHECK(user_type IN ('ALUNO', 'VISITANTE')),
      full_name TEXT NOT NULL,
      matricula TEXT,
      course TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      document_id TEXT,
      organization TEXT,
      reason TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      category TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      specs TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DISPONIVEL' CHECK(status IN ('DISPONIVEL', 'EM_USO', 'MANUTENCAO')),
      image_url TEXT NOT NULL,
      icon_type TEXT NOT NULL DEFAULT 'printer'
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      machine_id INTEGER NOT NULL,
      machine_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      purpose TEXT NOT NULL,
      terms_accepted INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK(status IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'CONCLUIDO', 'BLOQUEADO')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'CONCLUIDO',
      image_url TEXT NOT NULL,
      approved INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      project_name TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('A_FAZER', 'EM_ANDAMENTO', 'CONCLUIDA')),
      assignee TEXT NOT NULL,
      priority TEXT DEFAULT 'MEDIA',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity_total INTEGER NOT NULL,
      quantity_available INTEGER NOT NULL,
      min_threshold INTEGER DEFAULT 5,
      loanable INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS loan_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      return_date TEXT NOT NULL,
      purpose TEXT NOT NULL,
      policy_accepted INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'ATIVO' CHECK(status IN ('SOLICITADO', 'ATIVO', 'DEVOLVIDO', 'ATRASADO')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS restock_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      material_name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity_needed TEXT NOT NULL,
      urgency TEXT NOT NULL CHECK(urgency IN ('BAIXA', 'MEDIA', 'ALTA')),
      justification TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ABERTO' CHECK(status IN ('ABERTO', 'EM_COTACAO', 'ATENDIDO')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'EM_ANALISE' CHECK(status IN ('EM_ANALISE', 'APROVADA', 'IMPLEMENTADA', 'ARQUIVADA')),
      admin_reply TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      xp_reward INTEGER NOT NULL,
      badge_icon TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('INICIANTE', 'MAKER', 'MESTRE')),
      category TEXT NOT NULL,
      completed_by_json TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS tutorials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      duration TEXT NOT NULL,
      level TEXT NOT NULL,
      summary TEXT NOT NULL,
      steps_json TEXT NOT NULL,
      video_url TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_role TEXT DEFAULT 'ALUNO',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('DEVOLUCAO', 'AGENDAMENTO', 'XP', 'AVISO')),
      read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      detail TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
