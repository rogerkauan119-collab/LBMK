import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckInLoginPage: React.FC = () => {
  const {
    user,
    data,
    registerCheckin,
    loginWithCredentials,
    switchProfileQuick,
    playClick,
  } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';

  // Seletor Aluno ou Visitante no formulário de Check-in
  const [visitorType, setVisitorType] = useState<'ALUNO' | 'VISITANTE'>('ALUNO');
  const [fullName, setFullName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [course, setCourse] = useState('Sistemas de Informação (BSI)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [organization, setOrganization] = useState('');
  const [reason, setReason] = useState('');

  // Login por credenciais (para contas existentes / Admin)
  const [loginEmail, setLoginEmail] = useState('aluno@ifes.edu.br');
  const [loginPassword, setLoginPassword] = useState('aluno123');

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await registerCheckin({
      user_type: visitorType,
      full_name: fullName,
      matricula: visitorType === 'ALUNO' ? matricula : '',
      course: visitorType === 'ALUNO' ? course : '',
      email,
      phone,
      document_id: visitorType === 'VISITANTE' ? documentId : '',
      organization: visitorType === 'VISITANTE' ? organization : 'IFES Campus Serra',
      reason,
    });
    if (ok) {
      setFullName('');
      setReason('');
      if (redirectPath) {
        navigate(redirectPath);
      } else if (visitorType === 'ALUNO') {
        navigate('/aluno');
      } else {
        navigate('/');
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const ok = await loginWithCredentials(loginEmail, loginPassword);
    if (ok) {
      if (redirectPath) {
        navigate(redirectPath);
      } else if (loginEmail.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/aluno');
      }
    }
  };

  const recentCheckins = (data?.checkins || []).slice(0, 5);

  return (
    <div className="flex-1 bg-scanlines-light py-12 px-4 sm:px-6 pb-32">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Cabeçalho da página */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded bg-brand text-accent font-pixel text-[9px] uppercase tracking-widest">
            CHECK-IN & AUTENTICAÇÃO
          </span>
          <h1 className="font-display font-bold text-brand text-3xl sm:text-5xl uppercase mt-2">
            ACESSO AO LABORATÓRIO
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Registre sua presença no LabMaker IFES Campus Serra para alimentar as estatísticas de
            utilização e liberar os recursos do seu perfil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA PRINCIPAL (7 cols): Card branco de cantos arredondados sobre fundo cinza-quente, cabeçalho azul com rótulo amarelo */}
          <div className="lg:col-span-7 bg-white rounded-[22px] border-[2.5px] border-surface-ink shadow-neo-lg overflow-hidden">
            {/* Cabeçalho azul com rótulo pequeno em amarelo */}
            <div className="bg-brand px-6 sm:px-8 py-5 border-b-[3px] border-accent">
              <span className="font-pixel text-accent text-[9px] uppercase tracking-widest">
                CHECK-IN PRESENCIAL & DIGITAL
              </span>
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl uppercase mt-1">
                ACESSO AO LABORATÓRIO
              </h2>
              <p className="text-brand-light text-sm mt-0.5">
                Escolha seu vínculo abaixo e preencha os dados para registrar o acesso.
              </p>
            </div>

            <form onSubmit={handleCheckinSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Seletor Aluno / Visitante em cartões */}
              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-2.5">
                  SELECIONE SEU VÍNCULO COM O LABMAKER
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setVisitorType('ALUNO');
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                      visitorType === 'ALUNO'
                        ? 'bg-brand text-white border-surface-ink shadow-neo'
                        : 'bg-[#F4F3EF] text-surface-ink border-gray-300 hover:border-brand'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        visitorType === 'ALUNO'
                          ? 'bg-accent text-surface-ink'
                          : 'bg-brand/10 text-brand'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold uppercase text-base">
                        ALUNO / SERVIDOR
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          visitorType === 'ALUNO' ? 'text-brand-light' : 'text-gray-500'
                        }`}
                      >
                        Público interno IFES Serra
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setVisitorType('VISITANTE');
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                      visitorType === 'VISITANTE'
                        ? 'bg-brand text-white border-surface-ink shadow-neo'
                        : 'bg-[#F4F3EF] text-surface-ink border-gray-300 hover:border-brand'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        visitorType === 'VISITANTE'
                          ? 'bg-lime text-surface-ink'
                          : 'bg-brand/10 text-brand'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold uppercase text-base">VISITANTE</p>
                      <p
                        className={`text-xs mt-0.5 ${
                          visitorType === 'VISITANTE' ? 'text-brand-light' : 'text-gray-500'
                        }`}
                      >
                        Comunidade externa / Parceiro
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Campos do formulário com labels em caixa alta azul */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkin-name"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                  >
                    NOME COMPLETO *
                  </label>
                  <input
                    id="checkin-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      visitorType === 'ALUNO'
                        ? 'Ex.: Lucas Almeida da Silva'
                        : 'Ex.: Mariana Costa'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>

                {visitorType === 'ALUNO' ? (
                  <>
                    <div>
                      <label
                        htmlFor="checkin-matricula"
                        className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                      >
                        MATRÍCULA / SIAPE *
                      </label>
                      <input
                        id="checkin-matricula"
                        type="text"
                        required
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Ex.: 20252BSI0372"
                        className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkin-course"
                        className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                      >
                        CURSO / SETOR *
                      </label>
                      <select
                        id="checkin-course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                      >
                        <option value="Sistemas de Informação (BSI)">
                          Sistemas de Informação (BSI)
                        </option>
                        <option value="Engenharia de Controle e Automação">
                          Engenharia de Controle e Automação
                        </option>
                        <option value="Técnico em Automação Industrial">
                          Técnico em Automação Industrial
                        </option>
                        <option value="Técnico em Informática / IoT">
                          Técnico em Informática / IoT
                        </option>
                        <option value="Técnico em Mecatrônica">Técnico em Mecatrônica</option>
                        <option value="Mestrado Profissional em Computação">
                          Mestrado em Computação Aplicada
                        </option>
                        <option value="Servidor Docente / TAE">Servidor Docente / TAE</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="checkin-doc"
                        className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                      >
                        DOCUMENTO DE IDENTIFICAÇÃO (RG/CPF) *
                      </label>
                      <input
                        id="checkin-doc"
                        type="text"
                        required
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                        placeholder="Ex.: 123.456.789-00"
                        className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkin-org"
                        className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                      >
                        INSTITUIÇÃO / EMPRESA / ORIGEM *
                      </label>
                      <input
                        id="checkin-org"
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Ex.: Incubadora Serra / Comunidade"
                        className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="checkin-email"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                  >
                    E-MAIL DE CONTATO *
                  </label>
                  <input
                    id="checkin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.nome@academico.ifes.edu.br"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkin-phone"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                  >
                    TELEFONE / WHATSAPP *
                  </label>
                  <input
                    id="checkin-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(27) 99999-0000"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkin-reason"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                  >
                    MOTIVO DO USO / ATIVIDADE NO LABORATÓRIO *
                  </label>
                  <textarea
                    id="checkin-reason"
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ex.: Impressão 3D de engrenagem para TCC, fresagem de placa PCI, soldagem de sensores ou visita técnica..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>
              </div>

              {/* Botão de largura total azul: REGISTRAR ACESSO */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo font-display font-bold text-lg uppercase tracking-wider active:translate-y-0.5 transition-all"
              >
                REGISTRAR ACESSO
              </button>
            </form>
          </div>

          {/* COLUNA LATERAL (5 cols): Login Rápido de Contas de Teste + Últimos Check-ins */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card Contas de Teste 1-Clique */}
            <div className="bg-arcade-bg text-white rounded-[22px] border-2 border-accent shadow-neo-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-accent text-[9px] uppercase">
                  CONTAS DE TESTE (1 CLIQUE)
                </span>
                <span className="px-2 py-0.5 rounded bg-lime text-surface-ink font-pixel text-[8px]">
                  ATIVO: {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Alterne instantaneamente entre os 3 perfis solicitados para inspecionar a Dock, as
                rotas protegidas e o painel administrativo:
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    switchProfileQuick('VISITANTE');
                    navigate('/');
                  }}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-lime/50 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-lime" />
                    <div>
                      <p className="font-pixel text-[9px] text-lime">1. PERFIL VISITANTE</p>
                      <p className="text-xs text-gray-300">
                        visitante@ifes.edu.br · Cadeados visíveis na Dock
                      </p>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-accent">USAR →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchProfileQuick('ALUNO');
                    navigate(redirectPath || '/aluno');
                  }}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-accent/60 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-pixel text-[9px] text-accent">
                        2. ALUNO (LUCAS ALMEIDA)
                      </p>
                      <p className="text-xs text-gray-300">
                        aluno@ifes.edu.br (Senha: aluno123) · Kanban + Quest
                      </p>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-lime">USAR →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchProfileQuick('ADMIN');
                    navigate('/admin');
                  }}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-arcade-cyan/60 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-arcade-cyan" />
                    <div>
                      <p className="font-pixel text-[9px] text-arcade-cyan">
                        3. ADMIN (PROFA. ROSIANE ROCHA)
                      </p>
                      <p className="text-xs text-gray-300">
                        admin@ifes.edu.br (Senha: admin123) · Painel Completo
                      </p>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-arcade-cyan">USAR →</span>
                </button>
              </div>
            </div>

            {/* Card Login tradicional por E-mail e Senha */}
            <div className="bg-white rounded-[22px] border-2 border-surface-ink shadow-neo p-6 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-brand" />
                <h3 className="font-display font-bold text-brand text-xl uppercase">
                  JÁ TEM CONTA? AUTENTICAR COM SENHA
                </h3>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block font-display font-bold text-xs uppercase text-brand mb-1"
                  >
                    E-MAIL INSTITUCIONAL
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block font-display font-bold text-xs uppercase text-brand mb-1"
                  >
                    SENHA
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-gray-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo-sm font-display font-bold uppercase text-sm"
                >
                  ENTRAR NA CONTA
                </button>
              </form>
            </div>

            {/* Últimos Check-ins Registrados */}
            <div className="bg-white rounded-[22px] border-2 border-surface-ink shadow-neo p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-brand text-lg uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4" /> ÚLTIMOS CHECK-INS NO LAB
                </h3>
                <span className="font-pixel text-[8px] text-gray-500">
                  TOTAL: {data?.checkins.length || 0}
                </span>
              </div>
              <div className="space-y-2.5">
                {recentCheckins.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-[#F6F5F2] border border-black/5 flex items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-surface-ink flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        {c.full_name}
                      </p>
                      <p className="text-gray-600 mt-0.5">{c.reason}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-pixel text-[7px] shrink-0 ${
                        c.user_type === 'ALUNO'
                          ? 'bg-brand text-white'
                          : 'bg-lime text-surface-ink'
                      }`}
                    >
                      {c.user_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
