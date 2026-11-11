# LABMAKER · IFES Campus Serra

Plataforma web full-stack oficial do **Laboratório Maker do IFES Campus Serra**, combinando identidade visual moderna institucional com detalhes de HUD 8-bits, gamificação (**MakerLab Quest**), quadro colaborativo de tarefas, agendamento de máquinas, empréstimos de recursos e painel administrativo completo.

---

## 1. Stack Tecnológica

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + React Router v6 + Framer Motion + Lucide Icons
- **Backend:** Node.js + Express + TypeScript (`tsx`)
- **Banco de Dados:** SQLite (`node:sqlite` persistido em `server/labmaker.db` com seeds automáticos)
- **Áudio & Efeitos:** Sintetizador Web Audio API 8-bits (`SFX: ON/OFF`) e filtro CRT (`CRT: ON/OFF`) com persistência em `localStorage` e respeito a `prefers-reduced-motion`.

---

## 2. Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Popular o banco SQLite (opcional — o servidor já executa automaticamente na primeira inicialização)
npm run seed

# 3. Iniciar Backend (porta 3001) + Frontend Vite (porta 5173) simultaneamente
npm run dev
```

> **Nota para este ambiente Windows:** Caso o Node.js não esteja no `PATH` global da máquina, um runtime portátil Node v22.14.0 já foi configurado em `.runtime/node-v22.14.0-win-x64`.

Acesse no navegador: **`http://localhost:5173`**

---

## 3. Contas de Teste (Perfis de Acesso)

Na página **Acesso ao Laboratório (`/acesso`)** ou na barra rápida do topo da Home, você pode alternar com **1 clique** entre os 3 perfis ou usar as credenciais abaixo:

| Perfil | Nome | E-mail | Senha | O que acessa |
| :--- | :--- | :--- | :--- | :--- |
| **1. VISITANTE** | Visitante Demo | `visitante@ifes.edu.br` | `visitante123` | Home, Catálogo de Serviços, Recursos Disponíveis, Galeria de Projetos, Tutoriais, Equipe, Agenda (somente leitura) e Check-in. Abas restritas exibem cadeado na Dock. |
| **2. ALUNO / SERVIDOR** | Lucas Almeida | `aluno@ifes.edu.br` | `aluno123` | Tudo do visitante + Painel do Aluno (`/aluno`), Quadro Kanban Colaborativo (`labmaker-tarefas.app`), Reserva de Máquinas (com Termos), Empréstimos (com Política), Reposição, Sugestões, Linha do Tempo e **MakerLab Quest** (`/quest`). |
| **3. ADMINISTRADOR** | Profa. Rosiane Rocha | `admin@ifes.edu.br` | `admin123` | Tudo do aluno + **Painel Administrativo** (`/admin`): Aprovação e Bloqueio de Horários, CRUD de Máquinas e Estoque, Moderação de Projetos/Sugestões, Relatórios com Exportação CSV de Check-ins, Editor de Conteúdo do Site (CMS) e Gestão de Usuários. |
