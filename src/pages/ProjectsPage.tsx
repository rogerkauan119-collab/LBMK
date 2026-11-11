import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProjectsPage: React.FC = () => {
  const { data, user, saveProject, playClick } = useApp();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tutorialCategory, setTutorialCategory] = useState<string>('TODOS');
  const [showNewModal, setShowNewModal] = useState(false);

  // Novo projeto form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Impressão 3D');
  const [description, setDescription] = useState('');

  const projects = (data?.projects || []).filter((p) => p.approved === 1 || user.role === 'ADMIN');
  const tutorials = data?.tutorials || [];

  const categories = ['TODOS', 'Impressão 3D', 'Fabricação de PCI', 'Corte a Laser', 'IoT & Embarcados', 'Usinagem CNC'];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = categoryFilter === 'TODOS' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredTutorials = tutorials.filter((t) => {
    const matchesCat = tutorialCategory === 'TODOS' || t.category === tutorialCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    await saveProject({
      title,
      category,
      author: user.name,
      description,
      status: 'EM_ANDAMENTO',
      approved: user.role === 'ADMIN' ? 1 : 1,
    });
    setTitle('');
    setDescription('');
    setShowNewModal(false);
  };

  return (
    <div className="flex-1 bg-scanlines-light pb-32">
      {/* Banner superior */}
      <section className="bg-royal-grid text-white py-14 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 font-pixel text-[9px] text-accent uppercase">
              PORTFÓLIO & BASE DE CONHECIMENTO
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase mt-2">
              PROJETOS & TUTORIAIS MAKER
            </h1>
            <p className="text-brand-light text-base mt-2 max-w-2xl">
              Explore os protótipos criados por estudantes e pesquisadores do IFES Campus Serra e
              acesse guias práticos passo a passo para operar as máquinas com segurança.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {user.role !== 'VISITANTE' ? (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowNewModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm"
              >
                <PlusCircle className="w-4 h-4" /> PUBLICAR PROJETO
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/acesso?redirect=/projetos')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm"
              >
                FAZER CHECK-IN PARA PUBLICAR <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Barra de Busca + Filtros de Categoria */}
        <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-brand absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar projetos, placas PCI, impressão 3D, corte a laser ou tutoriais..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm font-medium focus:border-brand"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playClick();
                  setCategoryFilter(cat);
                }}
                className={`px-3.5 py-2 rounded-xl font-display font-bold uppercase text-xs border transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand text-white border-surface-ink shadow-neo-sm'
                    : 'bg-[#F6F5F2] text-surface-ink border-gray-300 hover:border-brand'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Seção 1: Galeria de Projetos */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-pixel text-brand text-[9px] uppercase">GALERIA DO CAMPUS</p>
              <h2 className="font-display font-bold text-brand text-2xl sm:text-4xl uppercase">
                PROJETOS DESENVOLVIDOS NO LABMAKER
              </h2>
            </div>
            <span className="font-pixel text-[10px] text-brand bg-brand-light/40 px-3 py-1.5 rounded-lg border border-brand/20">
              {filteredProjects.length} PROJETOS
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-surface-ink p-10 text-center">
              <p className="font-pixel text-xs text-brand">NENHUM PROJETO ENCONTRADO_</p>
              <p className="text-sm text-gray-600 mt-2">
                Tente limpar o filtro de busca ou escolher outra categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <article
                  key={proj.id}
                  className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div className="relative h-48 bg-arcade-bg overflow-hidden border-b-2 border-surface-ink">
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-brand text-accent border border-accent font-pixel text-[8px] uppercase">
                        {proj.category}
                      </span>
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded font-pixel text-[8px] uppercase border border-surface-ink ${
                          proj.status === 'CONCLUIDO'
                            ? 'bg-lime text-surface-ink'
                            : 'bg-accent text-surface-ink'
                        }`}
                      >
                        {proj.status === 'CONCLUIDO' ? 'CONCLUÍDO' : 'EM CURSO'}
                      </span>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <h3 className="font-display font-bold text-brand text-xl leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-[#F6F5F2] border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-surface-ink flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand" /> {proj.author}
                    </span>
                    <span className="font-pixel text-[8px] text-green-700">VERIFICADO IFES</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Seção 2: Tutoriais e Materiais Educativos */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-pixel text-brand text-[9px] uppercase">APRENDA NA PRÁTICA</p>
              <h2 className="font-display font-bold text-brand text-2xl sm:text-4xl uppercase">
                TUTORIAIS & MATERIAIS EDUCATIVOS
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['TODOS', 'Impressão 3D', 'Fabricação de PCI', 'Corte a Laser'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playClick();
                    setTutorialCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-pixel text-[8px] uppercase border ${
                    tutorialCategory === cat
                      ? 'bg-accent text-surface-ink border-surface-ink shadow-neo-sm'
                      : 'bg-white text-surface-ink border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTutorials.map((tut) => (
              <div
                key={tut.id}
                className="card-scanlines-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-brand text-white font-pixel text-[8px] uppercase">
                      {tut.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-brand" /> {tut.duration} · {tut.level}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-brand text-xl flex items-start gap-2">
                    <BookOpen className="w-5 h-5 text-accent shrink-0 mt-1" />
                    <span>{tut.title}</span>
                  </h3>

                  <p className="text-sm text-gray-600">{tut.summary}</p>

                  <ol className="space-y-2 pt-2 border-t border-gray-200 text-xs text-surface-ink">
                    {tut.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Publicar Projeto */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg max-w-lg w-full overflow-hidden">
            <div className="bg-brand px-6 py-4 border-b-2 border-accent flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-xl uppercase">
                CADASTRAR NOVO PROJETO MAKER
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-white font-pixel text-xs"
              >
                X
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  TÍTULO DO PROJETO *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Robô Seguidor de Linha com Visão ESP32-CAM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>
              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  CATEGORIA TÉCNICA *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                >
                  <option value="Impressão 3D">Impressão 3D</option>
                  <option value="Fabricação de PCI">Fabricação de PCI</option>
                  <option value="Corte a Laser">Corte a Laser</option>
                  <option value="IoT & Embarcados">IoT & Embarcados</option>
                  <option value="Usinagem CNC">Usinagem CNC</option>
                </select>
              </div>
              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  DESCRIÇÃO TÉCNICA E RESULTADOS *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva materiais usados, máquinas operadas e aplicação..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 font-display font-bold uppercase text-xs"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand text-white border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-xs"
                >
                  SALVAR NA GALERIA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
