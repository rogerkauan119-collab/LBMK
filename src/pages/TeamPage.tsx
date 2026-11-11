import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Award, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TeamPage: React.FC = () => {
  const { data, playHover, playClick } = useApp();
  const team = data?.siteContent?.team || [];

  return (
    <div className="flex-1 bg-arcade-bg text-white py-16 px-4 sm:px-6 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho fiel à Imagem 5 */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-arcade-cyan/40 text-arcade-cyan font-pixel text-[9px] uppercase">
            <Sparkles className="w-3.5 h-3.5" /> CORPO TÉCNICO & PESQUISADORES
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
            CONHEÇA A NOSSA <span className="text-arcade-cyan">EQUIPE</span> DO LABMAKER
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Você aprenderá com pesquisadores e docentes dedicados à inovação e tecnologia no IFES
            Serra.
          </p>
        </div>

        {/* Grade de 5 cards verticais idênticos à referência */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {team.map((member) => (
            <article
              key={member.id}
              onMouseEnter={playHover}
              className={`group relative h-[410px] rounded-[16px] overflow-hidden flex flex-col justify-end p-5 transition-all duration-300 hover:-translate-y-2 ${
                member.isLead
                  ? 'border-[2.5px] border-accent shadow-[0_0_28px_rgba(253,185,78,0.3)]'
                  : 'border border-white/15 bg-[#121829]'
              }`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/65 to-transparent" />

              <div className="relative z-10 space-y-2">
                {member.badge && (
                  <span className="inline-block w-full text-center py-1.5 px-2 rounded-[4px] bg-accent text-surface-ink font-pixel text-[8px] tracking-widest uppercase">
                    {member.badge}
                  </span>
                )}
                <h2 className="font-pixel text-white text-xs sm:text-[13px] leading-snug uppercase">
                  {member.name}
                </h2>
                <p className="text-xs text-gray-300 leading-snug">{member.role}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Bloco inferior de mentoria e iniciação científica */}
        <div className="rounded-2xl bg-[#11182B] border-2 border-accent/60 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="font-pixel text-lime text-[9px] uppercase flex items-center gap-2">
              <Award className="w-4 h-4" /> BOLSAS, MONITORIA & EXTENSÃO
            </span>
            <h3 className="font-display font-bold text-white text-2xl uppercase">
              QUER FAZER PARTE DA EQUIPE DO LABMAKER?
            </h3>
            <p className="text-sm text-gray-300 max-w-2xl">
              Participe das missões na plataforma MakerLab Quest, acumule XP operando impressoras 3D
              e fresadoras de PCI e inscreva-se nos editais semestrais de monitoria voluntária e
              bolsistas do IFES Campus Serra.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/quest"
              onClick={playClick}
              className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink font-display font-bold uppercase text-sm border-2 border-surface-ink shadow-neo-sm"
            >
              ABRIR MAKERLAB QUEST
            </Link>
            <Link
              to="/local"
              onClick={playClick}
              className="px-5 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-display font-bold uppercase text-sm border border-white/20 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> FALAR COM A COORDENAÇÃO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
