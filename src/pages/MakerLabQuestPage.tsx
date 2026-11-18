import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Circle,
  Trophy,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const MAKERLAB_QUEST_URL =
  'https://script.google.com/macros/s/AKfycbzCpPMq2tkcmXh196XDrgDL3dj5tCcrxYHbr5IeUJVskY_YRmH9Ri_mPiFGxgrvI9fMZQ/exec';

export const MakerLabQuestPage: React.FC = () => {
  const { isAuthenticated, playClick, playHover } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/acesso?redirect=/quest" replace />;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Seção Principal fiel à imagem de referência: Explicação do Site + Mockup à direita + Botão Externo */}
      <section className="bg-royal-grid text-white py-16 sm:py-24 border-b-4 border-accent flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Coluna Esquerda: Explicação Clara sobre a Plataforma MakerLab Quest */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A41E0] border border-white/25 text-xs font-display font-bold uppercase tracking-wider text-brand-light">
              <span className="text-accent">☷</span> PLATAFORMA DOS ALUNOS
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl uppercase leading-[1.05] tracking-tight">
              MAKERLAB QUEST · PORTAL DE ATIVIDADES
            </h1>

            <p className="text-brand-light text-base sm:text-lg leading-relaxed max-w-xl">
              O <strong>MakerLab Quest</strong> é uma plataforma web dedicada exclusivamente à
              organização das tarefas, desafios práticos e acompanhamento dos projetos dos alunos do
              LabMaker IFES Campus Serra. Todo o gerenciamento das suas atividades acontece
              diretamente lá.
            </p>

            <div className="pt-2">
              <a
                href={MAKERLAB_QUEST_URL}
                target="_blank"
                rel="noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold uppercase tracking-wider text-sm sm:text-base transition-all active:translate-y-0.5"
              >
                ACESSAR MAKERLAB QUEST
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Coluna Direita: Janela Mockup fiel à Imagem de Referência */}
          <div className="lg:col-span-6">
            <div className="rounded-[24px] bg-[#E8E7E3] text-surface-ink p-5 sm:p-6 border-2 border-surface-ink shadow-neo-lg">
              {/* Barra superior de navegador com bolinhas laranja, verde e azul */}
              <div className="flex items-center gap-2 pb-4 px-1">
                <span className="w-3 h-3 rounded-full bg-[#FDBA5A]" />
                <span className="w-3 h-3 rounded-full bg-[#CEFFAD]" />
                <span className="w-3 h-3 rounded-full bg-[#172EB9]" />
                <span className="ml-2 font-mono text-xs text-gray-500">makerlab-quest.app</span>
              </div>

              {/* Card branco interno explicando o que você encontra no site */}
              <div className="bg-white rounded-[18px] p-5 shadow-sm border border-black/5 space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-display font-bold text-brand text-xs sm:text-sm uppercase tracking-wider">
                    O QUE VOCÊ ENCONTRA NO SITE
                  </span>
                  <span className="font-mono text-xs text-gray-400">Visão geral</span>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#E8E7E3]/80">
                  <div className="w-9 h-9 rounded-lg bg-[#CEFFAD] text-green-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand text-sm sm:text-base">
                      Protótipos & Atividades Concluídas
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                      REGISTRO DE ENTREGAS DO LABORATÓRIO
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#E8E7E3]/80">
                  <div className="w-9 h-9 rounded-lg bg-[#FDBA5A]/60 text-amber-900 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand text-sm sm:text-base">
                      Projetos & Missões em Andamento
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                      ACOMPANHAMENTO EM TEMPO REAL
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#E8E7E3]/80">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                    <Circle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand text-sm sm:text-base">
                      Novas Tarefas & Desafios Maker
                    </p>
                    <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                      ORGANIZAÇÃO COLABORATIVA DA EQUIPE
                    </p>
                  </div>
                </div>
              </div>

              {/* Três blocos inferiores no layout da imagem de referência */}
              <div className="grid grid-cols-3 gap-3.5 mt-4">
                <div className="bg-white rounded-2xl py-4 px-3 text-center border border-black/5">
                  <p className="font-pixel text-brand text-lg sm:text-xl">12</p>
                  <p className="font-display font-semibold text-[10px] sm:text-xs text-gray-500 uppercase mt-1">
                    CONCLUÍDAS
                  </p>
                </div>
                <div className="bg-white rounded-2xl py-4 px-3 text-center border border-black/5">
                  <p className="font-pixel text-accent text-lg sm:text-xl">05</p>
                  <p className="font-display font-semibold text-[10px] sm:text-xs text-gray-500 uppercase mt-1">
                    EM CURSO
                  </p>
                </div>
                <div className="bg-white rounded-2xl py-4 px-3 text-center border border-black/5">
                  <p className="font-pixel text-gray-500 text-lg sm:text-xl">08</p>
                  <p className="font-display font-semibold text-[10px] sm:text-xs text-gray-500 uppercase mt-1">
                    A FAZER
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa inferior explicativa rápida: Por que usar o MakerLab Quest? */}
      <section className="bg-scanlines-light py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand text-accent border border-surface-ink flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-brand text-lg uppercase">
              1. ACESSE PELO BOTÃO ACIMA
            </h2>
            <p className="text-sm text-surface-ink/85 leading-relaxed">
              Clique em <strong>Acessar MakerLab Quest</strong> para abrir a aplicação oficial em
              uma nova guia do navegador.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent text-surface-ink border border-surface-ink flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-brand text-lg uppercase">
              2. ESCOLHA SUAS ATIVIDADES
            </h2>
            <p className="text-sm text-surface-ink/85 leading-relaxed">
              Consulte os desafios e tarefas disponíveis para seu projeto ou equipe dentro da
              plataforma externa.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-lime text-surface-ink border border-surface-ink flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-brand text-lg uppercase">
              3. EVOLUA NO PRÓPRIO SITE
            </h2>
            <p className="text-sm text-surface-ink/85 leading-relaxed flex items-start gap-1">
              <span>
                Toda a pontuação, conclusão de etapas e histórico de evolução são gerenciados
                diretamente no sistema oficial do MakerLab Quest.
              </span>
              <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
