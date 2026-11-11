import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Printer,
  Cog,
  Droplet,
  Flame,
  Zap,
  Calendar,
  Lock,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MachinesPage: React.FC = () => {
  const { data, user, playClick } = useApp();
  const navigate = useNavigate();

  const machines = data?.machines || [];
  const bookings = data?.bookings || [];
  const services = data?.siteContent?.services || [];

  const renderMachineIcon = (iconType: string) => {
    switch (iconType) {
      case 'cpu':
        return <Cpu className="w-5 h-5 text-white" />;
      case 'printer':
        return <Printer className="w-5 h-5 text-white" />;
      case 'cog':
        return <Cog className="w-5 h-5 text-white" />;
      case 'droplet':
        return <Droplet className="w-5 h-5 text-white" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-white" />;
      default:
        return <Zap className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="flex-1 bg-scanlines-light pb-32">
      {/* Banner */}
      <section className="bg-royal-grid text-white py-14 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/25 font-pixel text-[9px] text-accent uppercase">
              PARQUE TECNOLÓGICO DO CAMPUS SERRA
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase mt-2">
              EQUIPAMENTOS, SERVIÇOS & AGENDA
            </h1>
            <p className="text-brand-light text-base mt-2 max-w-2xl">
              Conheça as especificações técnicas das nossas máquinas de manufatura aditiva,
              subtrativa e eletrônica, e consulte a agenda oficial do laboratório.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              if (user.role === 'VISITANTE') {
                navigate('/acesso?redirect=/aluno');
              } else {
                navigate('/aluno');
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm"
          >
            <Calendar className="w-4 h-4" />
            {user.role === 'VISITANTE' ? 'CHECK-IN PARA AGENDAR HORÁRIO' : 'RESERVAR HORÁRIO AGORA'}
            {user.role === 'VISITANTE' && <Lock className="w-4 h-4" />}
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 1. Catálogo de Serviços Prestados */}
        <div>
          <p className="font-pixel text-brand text-[10px] uppercase">SERVIÇOS PRESTADOS</p>
          <h2 className="font-display font-bold text-brand text-2xl sm:text-4xl uppercase mt-1 mb-6">
            CATÁLOGO DE SERVIÇOS TÉCNICOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="card-scanlines-white rounded-2xl border-2 border-surface-ink shadow-neo p-6 space-y-3"
              >
                <div className="text-2xl">
                  {srv.icon === 'cube' && '🧊'}
                  {srv.icon === 'bolt' && '⚡'}
                  {srv.icon === 'flame' && '🔥'}
                </div>
                <h3 className="font-pixel text-brand text-xs sm:text-sm uppercase">{srv.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{srv.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Grade Completa de Máquinas & Bancadas */}
        <div>
          <p className="font-pixel text-brand text-[10px] uppercase">MÃO NA MASSA</p>
          <h2 className="font-display font-bold text-brand text-2xl sm:text-4xl uppercase mt-1 mb-6">
            MÁQUINAS & ESTAÇÕES DE PROTOTIPAGEM
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {machines.map((mac) => (
              <article
                key={mac.id}
                className="group relative h-[390px] rounded-[18px] overflow-hidden border-[3px] border-surface-ink shadow-neo-lg bg-arcade-bg flex flex-col justify-between p-6"
              >
                <img
                  src={mac.image_url}
                  alt={mac.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/75 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/70 border border-white/20 text-brand-light font-mono text-xs">
                    {mac.code}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded font-pixel text-[8px] uppercase border border-surface-ink ${
                      mac.status === 'DISPONIVEL'
                        ? 'bg-lime text-surface-ink'
                        : mac.status === 'EM_USO'
                        ? 'bg-accent text-surface-ink'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {mac.status === 'DISPONIVEL'
                      ? 'DISPONÍVEL'
                      : mac.status === 'EM_USO'
                      ? 'EM USO'
                      : 'MANUTENÇÃO'}
                  </span>
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="w-11 h-11 rounded-[10px] bg-brand border-2 border-accent flex items-center justify-center shadow-neo-sm">
                    {renderMachineIcon(mac.icon_type)}
                  </div>
                  <h3 className="font-pixel text-accent text-sm uppercase">{mac.name}</h3>
                  <p className="text-sm text-gray-200 leading-snug">{mac.short_desc}</p>
                  <p className="text-xs text-arcade-cyan font-mono">{mac.specs}</p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        if (user.role === 'VISITANTE') {
                          navigate('/acesso?redirect=/aluno');
                        } else {
                          navigate('/aluno');
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink font-display font-bold uppercase text-xs tracking-wider"
                    >
                      {user.role === 'VISITANTE'
                        ? 'CHECK-IN PARA RESERVAR ESTA MÁQUINA'
                        : 'RESERVAR ESTE EQUIPAMENTO'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3. Agenda do Laboratório (Calendário; somente leitura para visitante) */}
        <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
          <div className="bg-brand px-6 py-5 border-b-2 border-accent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-pixel text-accent text-[9px] uppercase">
                CALENDÁRIO DE OCUPAÇÃO DE BANCADAS
              </span>
              <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                AGENDA DO LABORATÓRIO
              </h2>
            </div>

            {user.role === 'VISITANTE' ? (
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-dark border border-lime text-lime font-pixel text-[8px]">
                <Lock className="w-3.5 h-3.5" /> MODO SOMENTE LEITURA (VISITANTE)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/aluno')}
                className="px-4 py-2 rounded-lg bg-accent text-surface-ink font-pixel text-[8px] border border-surface-ink"
              >
                + NOVO AGENDAMENTO
              </button>
            )}
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-surface-ink font-display font-bold text-xs uppercase text-brand">
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Horário</th>
                  <th className="py-3 px-3">Equipamento</th>
                  <th className="py-3 px-3">Responsável</th>
                  <th className="py-3 px-3">Finalidade</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F6F5F2]">
                    <td className="py-3.5 px-3 font-mono font-bold text-surface-ink">{b.date}</td>
                    <td className="py-3.5 px-3 font-mono text-brand font-semibold">
                      {b.time_slot}
                    </td>
                    <td className="py-3.5 px-3 font-display font-bold uppercase">
                      {b.machine_name}
                    </td>
                    <td className="py-3.5 px-3">{b.user_name}</td>
                    <td className="py-3.5 px-3 text-gray-600">{b.purpose}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-pixel text-[8px] uppercase ${
                          b.status === 'APROVADO'
                            ? 'bg-lime text-surface-ink'
                            : b.status === 'BLOQUEADO'
                            ? 'bg-red-500 text-white'
                            : 'bg-accent text-surface-ink'
                        }`}
                      >
                        {b.status === 'APROVADO' && <CheckCircle2 className="w-3 h-3" />}
                        {b.status === 'PENDENTE' && <Clock className="w-3 h-3" />}
                        {b.status === 'BLOQUEADO' && <ShieldAlert className="w-3 h-3" />}
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
