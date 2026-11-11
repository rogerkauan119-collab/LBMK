import express from 'express';
import cors from 'cors';
import { db } from './db.ts';
import { seedDatabase } from './seed.ts';

seedDatabase();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

// Helper para buscar conteúdo do site
function getSiteContentMap() {
  const rows = db.prepare('SELECT key, value_json FROM site_content').all() as Array<{
    key: string;
    value_json: string;
  }>;
  const result: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      result[r.key] = JSON.parse(r.value_json);
    } catch {
      result[r.key] = r.value_json;
    }
  }
  return result;
}

// 1. Bootstrap inicial de todos os dados públicos + estado
app.get('/api/bootstrap', (_req, res) => {
  const machines = db.prepare('SELECT * FROM machines ORDER BY id ASC').all();
  const projects = db.prepare('SELECT * FROM projects ORDER BY id DESC').all();
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id ASC').all();
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY date ASC, time_slot ASC').all();
  const checkins = db.prepare('SELECT * FROM checkins ORDER BY id DESC LIMIT 100').all();
  const inventory = db.prepare('SELECT * FROM inventory_items ORDER BY id ASC').all();
  const loans = db.prepare('SELECT * FROM loan_requests ORDER BY id DESC').all();
  const restocks = db.prepare('SELECT * FROM restock_requests ORDER BY id DESC').all();
  const suggestions = db.prepare('SELECT * FROM suggestions ORDER BY id DESC').all();
  const questsRaw = db.prepare('SELECT * FROM quests ORDER BY id ASC').all() as Array<Record<string, unknown>>;
  const tutorialsRaw = db.prepare('SELECT * FROM tutorials ORDER BY id ASC').all() as Array<Record<string, unknown>>;
  const notifications = db.prepare('SELECT * FROM notifications ORDER BY id DESC').all();
  const activityLogs = db.prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 40').all();
  const usersRaw = db
    .prepare('SELECT id, name, role, email, matricula, course, phone, xp, level, badges_json, created_at FROM users ORDER BY xp DESC')
    .all() as Array<Record<string, unknown>>;

  const quests = questsRaw.map((q) => ({
    ...q,
    completedBy: JSON.parse(String(q.completed_by_json || '[]')),
  }));

  const tutorials = tutorialsRaw.map((t) => ({
    ...t,
    steps: JSON.parse(String(t.steps_json || '[]')),
  }));

  const users = usersRaw.map((u) => ({
    ...u,
    badges: JSON.parse(String(u.badges_json || '[]')),
  }));

  res.json({
    siteContent: getSiteContentMap(),
    machines,
    projects,
    tasks,
    bookings,
    checkins,
    inventory,
    loans,
    restocks,
    suggestions,
    quests,
    tutorials,
    notifications,
    activityLogs,
    users,
  });
});

// 2. Autenticação por perfil ou credenciais
app.post('/api/auth/login', (req, res) => {
  const { email, password, quickRole } = req.body;

  if (quickRole) {
    const userRow = db
      .prepare('SELECT id, name, role, email, matricula, course, phone, xp, level, badges_json FROM users WHERE role = ? LIMIT 1')
      .get(quickRole) as Record<string, unknown> | undefined;

    if (!userRow) {
      res.status(404).json({ error: 'Perfil não encontrado.' });
      return;
    }

    res.json({
      user: {
        ...userRow,
        badges: JSON.parse(String(userRow.badges_json || '[]')),
      },
    });
    return;
  }

  const userRow = db
    .prepare('SELECT id, name, role, email, password, matricula, course, phone, xp, level, badges_json FROM users WHERE LOWER(email) = LOWER(?)')
    .get(String(email || '').trim()) as Record<string, unknown> | undefined;

  if (!userRow || userRow.password !== password) {
    res.status(401).json({ error: 'E-mail ou senha inválidos. Verifique as contas de teste!' });
    return;
  }

  delete userRow.password;
  res.json({
    user: {
      ...userRow,
      badges: JSON.parse(String(userRow.badges_json || '[]')),
    },
  });
});

// 3. Check-in ("ACESSO AO LABORATÓRIO") — Registra acesso e autentica Aluno ou Visitante
app.post('/api/checkins', (req, res) => {
  const {
    user_type,
    full_name,
    matricula,
    course,
    email,
    phone,
    document_id,
    organization,
    reason,
  } = req.body;

  if (!full_name || !email || !reason) {
    res.status(400).json({ error: 'Preencha nome completo, e-mail e motivo do uso.' });
    return;
  }

  const normalizedType = user_type === 'VISITANTE' ? 'VISITANTE' : 'ALUNO';

  const result = db
    .prepare(`
      INSERT INTO checkins (user_type, full_name, matricula, course, email, phone, document_id, organization, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      normalizedType,
      full_name.trim(),
      matricula || '',
      course || '',
      email.trim(),
      phone || '',
      document_id || '',
      organization || (normalizedType === 'ALUNO' ? 'IFES Campus Serra' : 'Comunidade Externa'),
      reason.trim()
    );

  // Registra no histórico de utilização
  db.prepare(`
    INSERT INTO activity_logs (user_name, action, detail, category)
    VALUES (?, ?, ?, ?)
  `).run(full_name.trim(), 'CHECK-IN NO LABORATÓRIO', `${normalizedType}: ${reason.trim()}`, 'CHECKIN');

  // Verifica se já existe usuário com esse email, senão cria/atualiza para manter sessão viva
  let userRow = db
    .prepare('SELECT id, name, role, email, matricula, course, phone, xp, level, badges_json FROM users WHERE LOWER(email) = LOWER(?)')
    .get(email.trim()) as Record<string, unknown> | undefined;

  if (!userRow) {
    const insertU = db
      .prepare(`
        INSERT INTO users (name, role, email, password, matricula, course, phone, xp, level, badges_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        full_name.trim(),
        normalizedType,
        email.trim(),
        '123456',
        matricula || '',
        course || (normalizedType === 'VISITANTE' ? organization || 'Visitante Externo' : 'IFES Serra'),
        phone || '',
        normalizedType === 'ALUNO' ? 300 : 100,
        normalizedType === 'ALUNO' ? 2 : 1,
        JSON.stringify(['Check-in Confirmado'])
      );
    userRow = db
      .prepare('SELECT id, name, role, email, matricula, course, phone, xp, level, badges_json FROM users WHERE id = ?')
      .get(insertU.lastInsertRowid) as Record<string, unknown>;
  } else {
    // Soma +50 XP pelo check-in presencial
    const newXp = Number(userRow.xp || 0) + 50;
    const newLevel = Math.max(1, Math.floor(newXp / 300) + 1);
    db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, Number(userRow.id));
    userRow.xp = newXp;
    userRow.level = newLevel;
  }

  const newCheckin = db.prepare('SELECT * FROM checkins WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    checkin: newCheckin,
    user: {
      ...userRow,
      badges: JSON.parse(String(userRow.badges_json || '[]')),
    },
  });
});

// 4. Tarefas do Quadro Colaborativo (Kanban)
app.post('/api/tasks', (req, res) => {
  const { title, project_name, status, assignee, priority } = req.body;
  if (!title || !project_name) {
    res.status(400).json({ error: 'Informe o título da tarefa e o projeto.' });
    return;
  }
  const st = ['A_FAZER', 'EM_ANDAMENTO', 'CONCLUIDA'].includes(status) ? status : 'A_FAZER';
  const r = db
    .prepare('INSERT INTO tasks (title, project_name, status, assignee, priority) VALUES (?, ?, ?, ?, ?)')
    .run(title.trim(), project_name.trim(), st, assignee || 'Equipe LabMaker', priority || 'MEDIA');

  db.prepare('INSERT INTO activity_logs (user_name, action, detail, category) VALUES (?, ?, ?, ?)').run(
    assignee || 'Aluno',
    'NOVA TAREFA CRIADA',
    `${title.trim()} (${project_name.trim()})`,
    'TAREFA'
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ task });
});

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status, title, assignee } = req.body;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(Number(id)) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
    return;
  }

  const nextStatus = status || existing.status;
  const nextTitle = title || existing.title;
  const nextAssignee = assignee || existing.assignee;

  db.prepare('UPDATE tasks SET status = ?, title = ?, assignee = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
    nextStatus,
    nextTitle,
    nextAssignee,
    Number(id)
  );

  db.prepare('INSERT INTO activity_logs (user_name, action, detail, category) VALUES (?, ?, ?, ?)').run(
    String(nextAssignee),
    'STATUS DE TAREFA',
    `"${nextTitle}" movida para ${nextStatus}`,
    'TAREFA'
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(Number(id));
  res.json({ task: updated });
});

app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// 5. Agendamentos de Máquinas e Bloqueios de Horário
app.post('/api/bookings', (req, res) => {
  const { user_id, user_name, machine_id, date, time_slot, purpose, terms_accepted, is_block } = req.body;

  if (!machine_id || !date || !time_slot || !purpose) {
    res.status(400).json({ error: 'Preencha máquina, data, horário e finalidade.' });
    return;
  }

  if (!is_block && !terms_accepted) {
    res.status(400).json({ error: 'É obrigatório aceitar os Termos de Responsabilidade.' });
    return;
  }

  const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(Number(machine_id)) as
    | { id: number; name: string }
    | undefined;
  if (!machine) {
    res.status(404).json({ error: 'Máquina não encontrada.' });
    return;
  }

  const conflict = db
    .prepare(
      "SELECT * FROM bookings WHERE machine_id = ? AND date = ? AND time_slot = ? AND status IN ('APROVADO', 'BLOQUEADO')"
    )
    .get(Number(machine_id), date, time_slot);

  if (conflict) {
    res.status(409).json({ error: 'Este horário já está reservado ou bloqueado para esta máquina.' });
    return;
  }

  const status = is_block ? 'BLOQUEADO' : 'APROVADO';
  const r = db
    .prepare(`
      INSERT INTO bookings (user_id, user_name, machine_id, machine_name, date, time_slot, purpose, terms_accepted, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      user_id || null,
      user_name || (is_block ? 'ADMIN - Bloqueio' : 'Aluno IFES'),
      machine.id,
      machine.name,
      date,
      time_slot,
      purpose.trim(),
      terms_accepted ? 1 : 0,
      status
    );

  db.prepare('INSERT INTO activity_logs (user_name, action, detail, category) VALUES (?, ?, ?, ?)').run(
    user_name || 'Admin',
    is_block ? 'HORÁRIO BLOQUEADO' : 'HORÁRIO AGENDADO',
    `${machine.name} em ${date} (${time_slot})`,
    'AGENDA'
  );

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ booking });
});

app.patch('/api/bookings/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, Number(req.params.id));
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(req.params.id));
  res.json({ booking });
});

// 6. Máquinas (CRUD Admin)
app.post('/api/machines', (req, res) => {
  const { name, code, category, short_desc, specs, status, image_url, icon_type } = req.body;
  if (!name || !code) {
    res.status(400).json({ error: 'Informe nome e código da máquina.' });
    return;
  }
  const r = db
    .prepare(`
      INSERT INTO machines (name, code, category, short_desc, specs, status, image_url, icon_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      name.toUpperCase(),
      code.toUpperCase(),
      category || 'Prototipagem',
      short_desc || '',
      specs || '',
      status || 'DISPONIVEL',
      image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
      icon_type || 'printer'
    );
  const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ machine });
});

app.patch('/api/machines/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM machines WHERE id = ?').get(Number(id)) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Máquina não encontrada.' });
    return;
  }
  const { name, code, category, short_desc, specs, status, image_url, icon_type } = req.body;
  db.prepare(`
    UPDATE machines
    SET name = ?, code = ?, category = ?, short_desc = ?, specs = ?, status = ?, image_url = ?, icon_type = ?
    WHERE id = ?
  `).run(
    name ?? existing.name,
    code ?? existing.code,
    category ?? existing.category,
    short_desc ?? existing.short_desc,
    specs ?? existing.specs,
    status ?? existing.status,
    image_url ?? existing.image_url,
    icon_type ?? existing.icon_type,
    Number(id)
  );
  const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(Number(id));
  res.json({ machine });
});

app.delete('/api/machines/:id', (req, res) => {
  db.prepare('DELETE FROM machines WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// 7. Estoque & Empréstimos (CRUD + Solicitação com Política de Empréstimos)
app.post('/api/inventory', (req, res) => {
  const { item_name, category, unit, quantity_total, quantity_available, min_threshold, loanable } = req.body;
  const r = db
    .prepare(`
      INSERT INTO inventory_items (item_name, category, unit, quantity_total, quantity_available, min_threshold, loanable)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      item_name,
      category || 'Componentes',
      unit || 'Unidade',
      Number(quantity_total || 1),
      Number(quantity_available ?? quantity_total ?? 1),
      Number(min_threshold || 2),
      loanable === false ? 0 : 1
    );
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ item });
});

app.patch('/api/inventory/:id', (req, res) => {
  const { quantity_available, quantity_total, item_name } = req.body;
  const existing = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(Number(req.params.id)) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Item não encontrado.' });
    return;
  }
  db.prepare('UPDATE inventory_items SET item_name = ?, quantity_total = ?, quantity_available = ? WHERE id = ?').run(
    item_name ?? existing.item_name,
    quantity_total !== undefined ? Number(quantity_total) : existing.quantity_total,
    quantity_available !== undefined ? Number(quantity_available) : existing.quantity_available,
    Number(req.params.id)
  );
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(Number(req.params.id));
  res.json({ item });
});

app.post('/api/loans', (req, res) => {
  const { user_id, user_name, item_id, quantity, return_date, purpose, policy_accepted } = req.body;
  if (!policy_accepted) {
    res.status(400).json({ error: 'Você precisa aceitar a Política de Empréstimos do LabMaker.' });
    return;
  }
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(Number(item_id)) as
    | { id: number; item_name: string; quantity_available: number }
    | undefined;

  if (!item || item.quantity_available < Number(quantity || 1)) {
    res.status(400).json({ error: 'Quantidade indisponível em estoque para empréstimo imediato.' });
    return;
  }

  const qty = Number(quantity || 1);
  db.prepare('UPDATE inventory_items SET quantity_available = quantity_available - ? WHERE id = ?').run(qty, item.id);

  const r = db
    .prepare(`
      INSERT INTO loan_requests (user_id, user_name, item_id, item_name, quantity, return_date, purpose, policy_accepted, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'ATIVO')
    `)
    .run(user_id || null, user_name || 'Aluno IFES', item.id, item.item_name, qty, return_date, purpose || 'Projeto acadêmico');

  db.prepare('INSERT INTO activity_logs (user_name, action, detail, category) VALUES (?, ?, ?, ?)').run(
    user_name || 'Aluno IFES',
    'EMPRÉSTIMO DE RECURSO',
    `${qty}x ${item.item_name} (Devolução: ${return_date})`,
    'EMPRESTIMO'
  );

  const loan = db.prepare('SELECT * FROM loan_requests WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ loan });
});

app.patch('/api/loans/:id', (req, res) => {
  const { status } = req.body;
  const loan = db.prepare('SELECT * FROM loan_requests WHERE id = ?').get(Number(req.params.id)) as
    | { id: number; item_id: number; quantity: number; status: string }
    | undefined;
  if (!loan) {
    res.status(404).json({ error: 'Empréstimo não encontrado.' });
    return;
  }
  if (status === 'DEVOLVIDO' && loan.status !== 'DEVOLVIDO') {
    db.prepare('UPDATE inventory_items SET quantity_available = quantity_available + ? WHERE id = ?').run(
      loan.quantity,
      loan.item_id
    );
  }
  db.prepare('UPDATE loan_requests SET status = ? WHERE id = ?').run(status, loan.id);
  const updated = db.prepare('SELECT * FROM loan_requests WHERE id = ?').get(loan.id);
  res.json({ loan: updated });
});

// 8. Pedidos de Reposição de Materiais
app.post('/api/restocks', (req, res) => {
  const { user_id, user_name, material_name, category, quantity_needed, urgency, justification } = req.body;
  if (!material_name || !justification) {
    res.status(400).json({ error: 'Informe o material e a justificativa.' });
    return;
  }
  const r = db
    .prepare(`
      INSERT INTO restock_requests (user_id, user_name, material_name, category, quantity_needed, urgency, justification, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ABERTO')
    `)
    .run(
      user_id || null,
      user_name || 'Aluno IFES',
      material_name.trim(),
      category || 'Insumos',
      quantity_needed || '1 unidade',
      urgency || 'MEDIA',
      justification.trim()
    );
  const restock = db.prepare('SELECT * FROM restock_requests WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ restock });
});

app.patch('/api/restocks/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE restock_requests SET status = ? WHERE id = ?').run(status, Number(req.params.id));
  const restock = db.prepare('SELECT * FROM restock_requests WHERE id = ?').get(Number(req.params.id));
  res.json({ restock });
});

// 9. Sugestões e Projetos (Submissão e Moderação Admin)
app.post('/api/suggestions', (req, res) => {
  const { user_id, user_name, title, category, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: 'Informe título e descrição da sugestão.' });
    return;
  }
  const r = db
    .prepare(`
      INSERT INTO suggestions (user_id, user_name, title, category, description, status)
      VALUES (?, ?, ?, ?, ?, 'EM_ANALISE')
    `)
    .run(user_id || null, user_name || 'Aluno IFES', title.trim(), category || 'Melhoria', description.trim());
  const suggestion = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ suggestion });
});

app.patch('/api/suggestions/:id', (req, res) => {
  const { status, admin_reply } = req.body;
  const existing = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(Number(req.params.id)) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Sugestão não encontrada.' });
    return;
  }
  db.prepare('UPDATE suggestions SET status = ?, admin_reply = ? WHERE id = ?').run(
    status ?? existing.status,
    admin_reply !== undefined ? admin_reply : existing.admin_reply,
    Number(req.params.id)
  );
  const suggestion = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(Number(req.params.id));
  res.json({ suggestion });
});

app.post('/api/projects', (req, res) => {
  const { title, category, author, description, status, image_url, approved } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: 'Informe título e descrição do projeto.' });
    return;
  }
  const r = db
    .prepare(`
      INSERT INTO projects (title, category, author, description, status, image_url, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      title.trim(),
      category || 'Impressão 3D',
      author || 'Equipe LabMaker',
      description.trim(),
      status || 'EM_ANDAMENTO',
      image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      approved === false ? 0 : 1
    );
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json({ project });
});

app.patch('/api/projects/:id', (req, res) => {
  const { approved, status } = req.body;
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(Number(req.params.id)) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Projeto não encontrado.' });
    return;
  }
  db.prepare('UPDATE projects SET approved = ?, status = ? WHERE id = ?').run(
    approved !== undefined ? (approved ? 1 : 0) : existing.approved,
    status ?? existing.status,
    Number(req.params.id)
  );
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(Number(req.params.id));
  res.json({ project });
});

// 10. MakerLab Quest — Concluir Missão e ganhar XP
app.post('/api/quests/:id/complete', (req, res) => {
  const { email, userName } = req.body;
  const questId = Number(req.params.id);
  const quest = db.prepare('SELECT * FROM quests WHERE id = ?').get(questId) as Record<string, unknown> | undefined;

  if (!quest) {
    res.status(404).json({ error: 'Missão não encontrada.' });
    return;
  }

  const completedBy: string[] = JSON.parse(String(quest.completed_by_json || '[]'));
  const userEmail = String(email || 'aluno@ifes.edu.br').toLowerCase();

  if (!completedBy.includes(userEmail)) {
    completedBy.push(userEmail);
    db.prepare('UPDATE quests SET completed_by_json = ? WHERE id = ?').run(JSON.stringify(completedBy), questId);

    const userRow = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(userEmail) as
      | Record<string, unknown>
      | undefined;

    if (userRow) {
      const reward = Number(quest.xp_reward || 200);
      const nextXp = Number(userRow.xp || 0) + reward;
      const nextLevel = Math.max(1, Math.floor(nextXp / 300) + 1);
      const badges: string[] = JSON.parse(String(userRow.badges_json || '[]'));
      const badgeTitle = String(quest.title);
      if (!badges.includes(badgeTitle)) {
        badges.push(badgeTitle);
      }
      db.prepare('UPDATE users SET xp = ?, level = ?, badges_json = ? WHERE id = ?').run(
        nextXp,
        nextLevel,
        JSON.stringify(badges),
        Number(userRow.id)
      );

      db.prepare('INSERT INTO activity_logs (user_name, action, detail, category) VALUES (?, ?, ?, ?)').run(
        userName || String(userRow.name),
        'QUEST COMPLETADA!',
        `+${reward} XP na missão "${quest.title}"`,
        'QUEST'
      );
    }
  }

  res.json({ ok: true, completedBy });
});

// 11. Editor de Informações do Site (Admin CMS)
app.put('/api/site-content/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  db.prepare(`
    INSERT INTO site_content (key, value_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP
  `).run(key, JSON.stringify(value));

  res.json({ key, value });
});

// 12. Cadastrar Usuários e Definir Permissões (Admin)
app.post('/api/users', (req, res) => {
  const { name, email, password, role, matricula, course, phone } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    return;
  }
  const validRole = ['VISITANTE', 'ALUNO', 'ADMIN'].includes(role) ? role : 'ALUNO';
  try {
    const r = db
      .prepare(`
        INSERT INTO users (name, role, email, password, matricula, course, phone, xp, level, badges_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        name.trim(),
        validRole,
        email.trim(),
        password || 'ifes123',
        matricula || '',
        course || 'IFES Campus Serra',
        phone || '',
        validRole === 'ADMIN' ? 3000 : 300,
        validRole === 'ADMIN' ? 10 : 2,
        JSON.stringify([validRole === 'ADMIN' ? 'Gestor LabMaker' : 'Membro Verificado'])
      );
    const created = db
      .prepare('SELECT id, name, role, email, matricula, course, phone, xp, level, badges_json FROM users WHERE id = ?')
      .get(r.lastInsertRowid) as Record<string, unknown>;
    res.status(201).json({
      user: {
        ...created,
        badges: JSON.parse(String(created.badges_json || '[]')),
      },
    });
  } catch {
    res.status(409).json({ error: 'Já existe um usuário cadastrado com este e-mail.' });
  }
});

app.patch('/api/users/:id/role', (req, res) => {
  const { role } = req.body;
  const validRole = ['VISITANTE', 'ALUNO', 'ADMIN'].includes(role) ? role : 'ALUNO';
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(validRole, Number(req.params.id));
  const updated = db
    .prepare('SELECT id, name, role, email, matricula, course, phone, xp, level, badges_json FROM users WHERE id = ?')
    .get(Number(req.params.id)) as Record<string, unknown>;
  res.json({
    user: {
      ...updated,
      badges: JSON.parse(String(updated.badges_json || '[]')),
    },
  });
});

app.listen(PORT, () => {
  console.log(`[LABMAKER API] Servidor rodando em http://localhost:${PORT}`);
});
