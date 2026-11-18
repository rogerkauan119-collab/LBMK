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
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  RefreshCw,
  AlertCircle,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type AuthMode = 'LOGIN' | 'REGISTER' | 'RESET';

export const CheckInLoginPage: React.FC = () => {
  const {
    user,
    isAuthenticated,
    data,
    loginWithCredentials,
    registerAccount,
    resetPassword,
    switchProfileQuick,
    logoutToVisitor,
    playClick,
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';

  const [mode, setMode] = useState<AuthMode>(() => {
    const initialMode = searchParams.get('modo')?.toUpperCase();
    if (initialMode === 'CADASTRO' || initialMode === 'REGISTER') return 'REGISTER';
    if (initialMode === 'RECUPERAR' || initialMode === 'RESET') return 'RESET';
    return 'LOGIN';
  });

  // Estado de carregamento e mensagens inline
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // 1. Estados da aba ENTRAR (Login)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 2. Estados da aba CRIAR CONTA (Cadastro)
  const [visitorType, setVisitorType] = useState<'ALUNO' | 'VISITANTE'>('ALUNO');
  const [fullName, setFullName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [course, setCourse] = useState('Sistemas de Informação (BSI)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // 3. Estados da aba RECUPERAR SENHA
  const [resetEmail, setResetEmail] = useState('');
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    playClick();
    setFormError(null);
    setFormSuccess(null);
    setMode(nextMode);
  };

  // Cálculo simples da força da senha no cadastro
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { level: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    if (score <= 1) return { level: 33, label: 'Fraca', color: 'bg-red-500' };
    if (score <= 2) return { level: 66, label: 'Média', color: 'bg-accent' };
    return { level: 100, label: 'Forte', color: 'bg-green-600' };
  };

  const passStrength = getPasswordStrength(password);

  // Submissão de Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setFormError(null);
    setFormSuccess(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setFormError('Informe seu e-mail (ou matrícula) e sua senha.');
      return;
    }

    setSubmitting(true);
    const res = await loginWithCredentials(loginIdentifier.trim(), loginPassword);
    setSubmitting(false);

    if (!res.ok) {
      setFormError(res.error || 'E-mail/matrícula ou senha incorretos.');
      return;
    }

    if (redirectPath) {
      navigate(redirectPath);
    } else if (res.user?.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/aluno');
    }
  };

  // Submissão de Cadastro de Nova Conta
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setFormError(null);
    setFormSuccess(null);

    if (password.length < 4) {
      setFormError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    setSubmitting(true);
    const res = await registerAccount({
      user_type: visitorType,
      full_name: fullName,
      matricula: visitorType === 'ALUNO' ? matricula : '',
      course: visitorType === 'ALUNO' ? course : '',
      email,
      phone,
      document_id: visitorType === 'VISITANTE' ? documentId : '',
      organization: visitorType === 'VISITANTE' ? organization : 'IFES Campus Serra',
      password,
    });
    setSubmitting(false);

    if (!res.ok) {
      setFormError(res.error || 'Não foi possível concluir o cadastro.');
      return;
    }

    setFullName('');
    setPassword('');
    setConfirmPassword('');

    if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate('/aluno');
    }
  };

  // Submissão de Recuperação de Senha
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setFormError(null);
    setFormSuccess(null);

    if (newPassword.length < 4) {
      setFormError('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError('As senhas digitadas não coincidem.');
      return;
    }

    setSubmitting(true);
    const res = await resetPassword({
      email: resetEmail,
      matriculaOrPhone: resetConfirmation,
      newPassword,
    });
    setSubmitting(false);

    if (!res.ok) {
      setFormError(res.error || 'Não foi possível redefinir a senha.');
      return;
    }

    setLoginIdentifier(resetEmail);
    setLoginPassword('');
    setResetPasswordFields();
    setMode('LOGIN');
    setFormSuccess('Senha atualizada com sucesso! Digite sua nova senha abaixo para entrar.');
  };

  const setResetPasswordFields = () => {
    setResetConfirmation('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const recentCheckins = (data?.checkins || []).slice(0, 5);

  return (
    <div className="flex-1 bg-scanlines-light py-10 px-4 sm:px-6 pb-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Cabeçalho da página */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded bg-brand text-accent font-pixel text-[9px] uppercase tracking-widest">
            PORTAL DE AUTENTICAÇÃO · IFES SERRA
          </span>
          <h1 className="font-display font-bold text-brand text-3xl sm:text-5xl uppercase mt-2">
            ACESSO AO LABORATÓRIO
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Entre com sua conta para acessar agendamentos, empréstimos, reposição de materiais e o
            MakerLab Quest, ou cadastre-se gratuitamente.
          </p>
        </div>

        {/* Banner de Sessão Ativa caso o usuário já esteja logado */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl border-2 border-surface-ink shadow-neo p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-lime text-surface-ink border-2 border-surface-ink flex items-center justify-center shrink-0 font-display font-extrabold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand text-white font-pixel text-[7px] uppercase">
                    SESSÃO ATIVA · {user.role}
                  </span>
                  <span className="font-pixel text-[8px] text-green-700">
                    LVL {user.level} ({user.xp} XP)
                  </span>
                </div>
                <p className="font-display font-bold text-lg text-surface-ink mt-0.5">
                  {user.name}{' '}
                  <span className="text-sm font-normal text-gray-500">({user.email})</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  navigate(user.role === 'ADMIN' ? '/admin' : '/aluno');
                }}
                className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white border-2 border-surface-ink shadow-neo-sm font-display font-bold text-xs uppercase flex items-center gap-1.5"
              >
                IR PARA MEU PAINEL <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  logoutToVisitor();
                }}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-300 font-display font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> SAIR DA CONTA
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA PRINCIPAL (7 cols): Card de Autenticação Completo com 3 Abas (Entrar, Criar Conta, Recuperar Senha) */}
          <div className="lg:col-span-7 bg-white rounded-[22px] border-[2.5px] border-surface-ink shadow-neo-lg overflow-hidden">
            {/* Barra de Abas do Sistema de Login */}
            <div className="bg-brand p-3 border-b-[3px] border-accent grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => switchMode('LOGIN')}
                className={`py-3 px-3 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-2 ${
                  mode === 'LOGIN'
                    ? 'bg-accent text-surface-ink border-surface-ink shadow-neo-sm'
                    : 'bg-brand-dark/60 text-white border-white/15 hover:bg-brand-dark'
                }`}
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('REGISTER')}
                className={`py-3 px-3 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-2 ${
                  mode === 'REGISTER'
                    ? 'bg-accent text-surface-ink border-surface-ink shadow-neo-sm'
                    : 'bg-brand-dark/60 text-white border-white/15 hover:bg-brand-dark'
                }`}
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>Criar Conta</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('RESET')}
                className={`py-3 px-3 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-2 ${
                  mode === 'RESET'
                    ? 'bg-accent text-surface-ink border-surface-ink shadow-neo-sm'
                    : 'bg-brand-dark/60 text-white border-white/15 hover:bg-brand-dark'
                }`}
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>Recuperar Senha</span>
              </button>
            </div>

            {/* Alertas inline de erro ou sucesso */}
            {formError && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-400 text-red-800 flex items-start gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-lime/40 border-2 border-green-600 text-green-950 flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* MODO 1: ENTRAR NA CONTA (LOGIN) */}
            {mode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <span className="font-pixel text-brand text-[9px] uppercase">
                    LOGIN INSTITUCIONAL OU CADASTRADO
                  </span>
                  <h2 className="font-display font-bold text-brand text-2xl sm:text-3xl uppercase mt-1">
                    ENTRAR NA SUA CONTA
                  </h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    Use seu e-mail cadastrado ou número de matrícula/SIAPE e sua senha.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="login-identifier"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1.5"
                  >
                    E-MAIL OU MATRÍCULA / SIAPE *
                  </label>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    autoComplete="username"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Ex.: aluno@ifes.edu.br ou 20252BSI0372"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand"
                    >
                      SENHA DE ACESSO *
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('RESET')}
                      className="text-xs font-bold text-brand hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPass ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((prev) => !prev)}
                      aria-label="Mostrar ou ocultar senha"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand"
                    >
                      {showLoginPass ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-surface-ink">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-brand rounded"
                    />
                    <span>Manter minha conta conectada neste navegador</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-brand hover:bg-brand-dark disabled:opacity-60 text-white border-2 border-surface-ink shadow-neo font-display font-bold text-base uppercase tracking-wider active:translate-y-0.5 transition-all"
                >
                  {submitting ? 'AUTENTICANDO...' : 'ENTRAR NO LABMAKER'}
                </button>

                <div className="pt-3 border-t border-gray-200 text-center text-sm">
                  <span className="text-gray-600">Ainda não possui uma conta no LabMaker? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('REGISTER')}
                    className="font-display font-bold uppercase text-brand hover:underline"
                  >
                    Criar conta agora →
                  </button>
                </div>
              </form>
            )}

            {/* MODO 2: CRIAR NOVA CONTA (CADASTRO COMPLETO) */}
            {mode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <span className="font-pixel text-brand text-[9px] uppercase">
                    NOVO CADASTRO DE USUÁRIO
                  </span>
                  <h2 className="font-display font-bold text-brand text-2xl sm:text-3xl uppercase mt-1">
                    CRIAR CONTA NO LABMAKER
                  </h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    Preencha seus dados e cadastre uma senha para liberar todas as abas e serviços.
                  </p>
                </div>

                {/* Seletor Aluno / Visitante em cartões */}
                <div>
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-2">
                    SELECIONE SEU VÍNCULO *
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setVisitorType('ALUNO');
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                        visitorType === 'ALUNO'
                          ? 'bg-brand text-white border-surface-ink shadow-neo-sm'
                          : 'bg-[#F4F3EF] text-surface-ink border-gray-300 hover:border-brand'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          visitorType === 'ALUNO'
                            ? 'bg-accent text-surface-ink'
                            : 'bg-brand/10 text-brand'
                        }`}
                      >
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-bold uppercase text-sm sm:text-base">
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
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                        visitorType === 'VISITANTE'
                          ? 'bg-brand text-white border-surface-ink shadow-neo-sm'
                          : 'bg-[#F4F3EF] text-surface-ink border-gray-300 hover:border-brand'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          visitorType === 'VISITANTE'
                            ? 'bg-lime text-surface-ink'
                            : 'bg-brand/10 text-brand'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-bold uppercase text-sm sm:text-base">
                          EXTERNO / PARCEIRO
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            visitorType === 'VISITANTE' ? 'text-brand-light' : 'text-gray-500'
                          }`}
                        >
                          Comunidade externa
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="reg-name"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      NOME COMPLETO *
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex.: Lucas Almeida da Silva"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                    />
                  </div>

                  {visitorType === 'ALUNO' ? (
                    <>
                      <div>
                        <label
                          htmlFor="reg-matricula"
                          className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                        >
                          MATRÍCULA / SIAPE *
                        </label>
                        <input
                          id="reg-matricula"
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
                          htmlFor="reg-course"
                          className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                        >
                          CURSO / SETOR *
                        </label>
                        <select
                          id="reg-course"
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
                          htmlFor="reg-doc"
                          className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                        >
                          DOCUMENTO (CPF / RG) *
                        </label>
                        <input
                          id="reg-doc"
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
                          htmlFor="reg-org"
                          className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                        >
                          INSTITUIÇÃO / EMPRESA *
                        </label>
                        <input
                          id="reg-org"
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
                      htmlFor="reg-email"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      E-MAIL DE ACESSO *
                    </label>
                    <input
                      id="reg-email"
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
                      htmlFor="reg-phone"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      TELEFONE / WHATSAPP *
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(27) 99999-0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                    />
                  </div>

                  {/* Senha e Confirmar Senha */}
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      CADASTRAR SENHA *
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showRegPass ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass((prev) => !prev)}
                        aria-label="Mostrar ou ocultar senha"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand"
                      >
                        {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full ${passStrength.color} transition-all`}
                            style={{ width: `${passStrength.level}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-gray-600">
                          Força: {passStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-confirm-password"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      CONFIRMAR SENHA *
                    </label>
                    <input
                      id="reg-confirm-password"
                      type={showRegPass ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha criada"
                      className={`w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 text-surface-ink font-medium ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-500'
                          : 'border-surface-ink/20 focus:border-brand'
                      }`}
                    />
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">
                        As senhas ainda não coincidem.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-brand hover:bg-brand-dark disabled:opacity-60 text-white border-2 border-surface-ink shadow-neo font-display font-bold text-base uppercase tracking-wider active:translate-y-0.5 transition-all"
                >
                  {submitting ? 'CRIANDO CONTA...' : 'CRIAR CONTA E ENTRAR'}
                </button>

                <div className="pt-2 border-t border-gray-200 text-center text-sm">
                  <span className="text-gray-600">Já possui conta cadastrada? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('LOGIN')}
                    className="font-display font-bold uppercase text-brand hover:underline"
                  >
                    Fazer login →
                  </button>
                </div>
              </form>
            )}

            {/* MODO 3: RECUPERAR / REDEFINIR SENHA */}
            {mode === 'RESET' && (
              <form onSubmit={handleResetSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <span className="font-pixel text-brand text-[9px] uppercase">
                    RECUPERAÇÃO DE ACESSO
                  </span>
                  <h2 className="font-display font-bold text-brand text-2xl sm:text-3xl uppercase mt-1">
                    REDEFINIR SUA SENHA
                  </h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    Informe o e-mail da sua conta e defina uma nova senha de acesso imediato.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="reset-email"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                  >
                    E-MAIL CADASTRADO *
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="seu.nome@academico.ifes.edu.br"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reset-confirm"
                    className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                  >
                    MATRÍCULA / SIAPE OU TELEFONE (OPCIONAL PARA VALIDAÇÃO)
                  </label>
                  <input
                    id="reset-confirm"
                    type="text"
                    value={resetConfirmation}
                    onChange={(e) => setResetConfirmation(e.target.value)}
                    placeholder="Ex.: 20252BSI0372"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="reset-new-pass"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      NOVA SENHA *
                    </label>
                    <div className="relative">
                      <input
                        id="reset-new-pass"
                        type={showResetPass ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nova senha"
                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPass((prev) => !prev)}
                        aria-label="Mostrar ou ocultar senha"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand"
                      >
                        {showResetPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reset-confirm-pass"
                      className="block font-display font-bold text-xs uppercase tracking-wider text-brand mb-1"
                    >
                      CONFIRMAR NOVA SENHA *
                    </label>
                    <input
                      id="reset-confirm-pass"
                      type={showResetPass ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F5F2] border-2 border-surface-ink/20 focus:border-brand text-surface-ink font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover text-surface-ink border-2 border-surface-ink shadow-neo font-display font-bold text-base uppercase tracking-wider active:translate-y-0.5 transition-all"
                >
                  {submitting ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
                </button>
              </form>
            )}
          </div>

          {/* COLUNA LATERAL (5 cols): Contas de Demonstração 1-Clique + Credenciais de Teste + Últimos Acessos */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-arcade-bg text-white rounded-[22px] border-2 border-accent shadow-neo-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-accent text-[9px] uppercase flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" /> ACESSO RÁPIDO (CONTAS DEMO)
                </span>
                <span className="px-2 py-0.5 rounded bg-lime text-surface-ink font-pixel text-[8px]">
                  ATIVO: {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Para testar rapidamente cada nível de acesso ou preencher automaticamente o login:
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    switchProfileQuick('ALUNO');
                    navigate(redirectPath || '/aluno');
                  }}
                  className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-accent/60 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <p className="font-pixel text-[9px] text-accent">
                        ENTRAR COMO ALUNO (LUCAS ALMEIDA)
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        E-mail: aluno@ifes.edu.br · Senha: aluno123
                      </p>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-lime shrink-0">ENTRAR →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchProfileQuick('ADMIN');
                    navigate('/admin');
                  }}
                  className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-arcade-cyan/60 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-arcade-cyan shrink-0" />
                    <div>
                      <p className="font-pixel text-[9px] text-arcade-cyan">
                        ENTRAR COMO ADMIN (PROFA. ROSIANE)
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        E-mail: admin@ifes.edu.br · Senha: admin123
                      </p>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-arcade-cyan shrink-0">ENTRAR →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logoutToVisitor();
                    navigate('/');
                  }}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-lime/40 flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-lime shrink-0" />
                    <div>
                      <p className="font-pixel text-[9px] text-lime">
                        MODO VISITANTE (DESLOGADO)
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Visualizar apenas as abas do público externo
                      </p>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-accent shrink-0">USAR →</span>
                </button>
              </div>
            </div>

            {/* Últimos Acessos Registrados */}
            <div className="bg-white rounded-[22px] border-2 border-surface-ink shadow-neo p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-brand text-lg uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4" /> ÚLTIMOS ACESSOS NO LAB
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
                      <p className="text-gray-600 mt-0.5">{c.course || c.organization}</p>
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
