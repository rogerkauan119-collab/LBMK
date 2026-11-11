import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Mail, Clock, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { data, playClick } = useApp();
  const about = data?.siteContent?.about;

  return (
    <footer className="bg-arcade-bg text-white border-t-4 border-accent pb-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Coluna 1: Identidade */}
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="font-pixel text-white text-sm tracking-wider">LABMAKER</span>
            <span className="font-pixel text-accent text-[9px] mt-1">IFES CAMPUS SERRA</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Laboratório de Prototipagem, Manufatura Digital, Eletrônica e Inovação Aberta do Instituto
            Federal do Espírito Santo — Campus Serra.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-dark border border-arcade-cyan/40 text-arcade-cyan font-pixel text-[8px]">
            STATUS: ONLINE · MODO MAKER 8-BITS
          </div>
        </div>

        {/* Coluna 2: Navegação do Mapa do Site */}
        <div>
          <h3 className="font-display font-bold text-accent uppercase tracking-wider text-base mb-3">
            Mapa do Site
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/" onClick={playClick} className="hover:text-accent transition-colors">
                Início & Recursos Disponíveis
              </Link>
            </li>
            <li>
              <Link to="/equipamentos" onClick={playClick} className="hover:text-accent transition-colors">
                Equipamentos, Serviços & Agenda
              </Link>
            </li>
            <li>
              <Link to="/projetos" onClick={playClick} className="hover:text-accent transition-colors">
                Projetos, Quadro de Tarefas & Tutoriais
              </Link>
            </li>
            <li>
              <Link to="/equipe" onClick={playClick} className="hover:text-accent transition-colors">
                Nossa Equipe (Pesquisadores & Gestores)
              </Link>
            </li>
            <li>
              <Link to="/local" onClick={playClick} className="hover:text-accent transition-colors">
                Localização, Horários & Contato
              </Link>
            </li>
            <li>
              <Link to="/acesso" onClick={playClick} className="hover:text-lime text-lime font-semibold transition-colors">
                Check-in Presencial / Entrar no IFES
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Links Oficiais IFES & MakerLab Quest */}
        <div>
          <h3 className="font-display font-bold text-accent uppercase tracking-wider text-base mb-3">
            Portais & Plataformas
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li>
              <Link
                to="/quest"
                onClick={playClick}
                className="inline-flex items-center gap-2 text-arcade-cyan hover:text-accent font-semibold transition-colors"
              >
                <Trophy className="w-4 h-4" />
                Plataforma MakerLab Quest
              </Link>
            </li>
            <li>
              <a
                href="https://serra.ifes.edu.br"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                Portal IFES Campus Serra <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a
                href="https://suap.ifes.edu.br"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                SUAP — Sistema Unificado IFES <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a
                href="https://ifes.edu.br"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                Site Oficial da Reitoria IFES <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Atendimento */}
        <div>
          <h3 className="font-display font-bold text-accent uppercase tracking-wider text-base mb-3">
            Atendimento & Local
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-1" />
              <span>{about?.locationRoom || 'Bloco C · Sala 104 — IFES Campus Serra (Manguinhos)'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime shrink-0" />
              <span>{about?.hours || 'Seg a Sex · 08h00 às 21h00'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-arcade-cyan shrink-0" />
              <a
                href={`mailto:${about?.email || 'labmaker.serra@ifes.edu.br'}`}
                className="hover:underline text-arcade-cyan"
              >
                {about?.email || 'labmaker.serra@ifes.edu.br'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <span>© 2026 LABMAKER · IFES Campus Serra. Cultura Maker, Ensino, Pesquisa e Extensão.</span>
        <span className="font-pixel text-[9px] text-accent">PRESS START TO PROTOTYPE_</span>
      </div>
    </footer>
  );
};
