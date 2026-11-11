import React, { useState } from 'react';
import { MapPin, Clock, Mail, Phone, Send, Navigation, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationPage: React.FC = () => {
  const { data, pushToast, playClick } = useApp();
  const about = data?.siteContent?.about;

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('Agendamento de Visita Técnica');
  const [message, setMessage] = useState('');

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    pushToast(
      'MENSAGEM ENVIADA!',
      `Obrigado, ${senderName}! A coordenação do LabMaker responderá pelo e-mail ${senderEmail}.`,
      'success'
    );
    setSenderName('');
    setSenderEmail('');
    setMessage('');
  };

  return (
    <div className="flex-1 bg-scanlines-light pb-32">
      <section className="bg-royal-dots text-white py-14 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/25 font-pixel text-[9px] text-accent uppercase">
            MAPA DO CAMPUS & ATENDIMENTO
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase mt-2">
            LOCALIZAÇÃO, HORÁRIOS & CONTATO
          </h1>
          <p className="text-brand-light text-base mt-2 max-w-2xl">
            Venha conhecer o LabMaker presencialmente no IFES Campus Serra ou envie uma mensagem
            direta para nossa equipe técnica.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna Esquerda: Informações + Mapa esquemático do campus */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand text-accent flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-brand text-lg uppercase">
                SALA & BLOCO NO CAMPUS
              </h2>
              <p className="text-sm font-semibold text-surface-ink">
                {about?.locationRoom || 'Bloco C · Sala 104 (Térreo) — IFES Campus Serra'}
              </p>
              <p className="text-xs text-gray-600">
                {about?.address || 'Rodovia ES-010, Km 6,5 — Manguinhos, Serra - ES, CEP 29173-087'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-accent text-surface-ink flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-brand text-lg uppercase">
                HORÁRIO DE FUNCIONAMENTO
              </h2>
              <p className="text-sm font-semibold text-surface-ink">
                {about?.hours || 'Segunda a Sexta · 08h00 às 21h00'}
              </p>
              <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Monitores presentes nos 3 turnos
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-lime text-surface-ink flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-brand text-lg uppercase">
                E-MAIL INSTITUCIONAL
              </h2>
              <a
                href={`mailto:${about?.email || 'labmaker.serra@ifes.edu.br'}`}
                className="text-sm font-bold text-brand hover:underline block"
              >
                {about?.email || 'labmaker.serra@ifes.edu.br'}
              </a>
              <p className="text-xs text-gray-600">Atendimento a alunos, docentes e empresas</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-arcade-bg text-arcade-cyan flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-brand text-lg uppercase">
                TELEFONE / RAMAL
              </h2>
              <p className="text-sm font-semibold text-surface-ink">
                {about?.phone || '(27) 3348-9200 · Ramal 9245'}
              </p>
              <p className="text-xs text-gray-600">Coordenação de Laboratórios — Campus Serra</p>
            </div>
          </div>

          {/* Mapa Visual Interativo do Campus Serra */}
          <div className="bg-arcade-bg text-white rounded-2xl border-2 border-surface-ink shadow-neo-lg overflow-hidden">
            <div className="bg-brand px-6 py-4 border-b-2 border-accent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-accent" />
                <span className="font-pixel text-[10px] text-white uppercase">
                  RADAR DE LOCALIZAÇÃO · IFES CAMPUS SERRA (MANGUINHOS)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-lime text-surface-ink font-pixel text-[8px]">
                GPS: -20.1976, -40.2173
              </span>
            </div>

            <div className="p-6 bg-arcade-grid relative min-h-[270px] flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/15">
                  <p className="font-pixel text-[8px] text-gray-400">PORTARIA PRINCIPAL</p>
                  <p className="font-display font-bold text-sm mt-1">Rodovia ES-010 (Manguinhos)</p>
                  <p className="text-xs text-gray-400 mt-1">Identifique-se na guarita do campus</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/15">
                  <p className="font-pixel text-[8px] text-arcade-cyan">BLOCO ACADÊMICO C</p>
                  <p className="font-display font-bold text-sm mt-1">Corredor Térreo de Engenharias</p>
                  <p className="text-xs text-gray-400 mt-1">Ao lado do Lab de Robótica e Automação</p>
                </div>

                <div className="p-4 rounded-xl bg-brand border-2 border-accent shadow-neo-yellow">
                  <p className="font-pixel text-[8px] text-accent">DESTINO · SALA 104</p>
                  <p className="font-display font-bold text-base mt-1 text-white">
                    LABMAKER IFES SERRA
                  </p>
                  <p className="text-xs text-brand-light mt-1">
                    Faça o Check-in no totem da entrada!
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
                <span>Ônibus Transcol: Linhas 806, 831 e 845 (Parada IFES Serra)</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=IFES+Campus+Serra"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-accent text-surface-ink font-pixel text-[8px] uppercase"
                >
                  ABRIR NO GOOGLE MAPS ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Contato Direto */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[22px] border-2 border-surface-ink shadow-neo-lg overflow-hidden">
            <div className="bg-brand px-6 py-5 border-b-2 border-accent">
              <span className="font-pixel text-accent text-[9px] uppercase">FALE CONOSCO</span>
              <h2 className="font-display font-bold text-white text-2xl uppercase mt-1">
                ENVIAR MENSAGEM AO LABMAKER
              </h2>
            </div>

            <form onSubmit={handleSendContact} className="p-6 space-y-4">
              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  SEU NOME *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  SEU E-MAIL *
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  ASSUNTO *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                >
                  <option value="Agendamento de Visita Técnica">Agendamento de Visita Técnica</option>
                  <option value="Parceria com Comunidade Externa / Empresa">
                    Parceria com Comunidade Externa / Empresa
                  </option>
                  <option value="Dúvida sobre Impressão 3D / PCI / Laser">
                    Dúvida sobre Impressão 3D / PCI / Laser
                  </option>
                  <option value="Projeto de Pesquisa ou Extensão">
                    Projeto de Pesquisa ou Extensão
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase text-brand mb-1">
                  MENSAGEM *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva sua dúvida ou proposta de visita/projeto..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo font-display font-bold uppercase text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> ENVIAR MENSAGEM
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
