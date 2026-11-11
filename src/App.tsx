import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { MascotRobotPixel } from './components/ui/PixelArts';
import { HomePage } from './pages/HomePage';
import { CheckInLoginPage } from './pages/CheckInLoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MachinesPage } from './pages/MachinesPage';
import { TeamPage } from './pages/TeamPage';
import { LocationPage } from './pages/LocationPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { MakerLabQuestPage } from './pages/MakerLabQuestPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { loading, error, refreshData } = useApp();

  if (loading) {
    return (
      <div className="flex-1 bg-arcade-grid text-white flex flex-col items-center justify-center p-8 min-h-[70vh]">
        <MascotRobotPixel className="w-20 h-20 animate-bounce mb-6" />
        <p className="font-pixel text-accent text-sm sm:text-base tracking-widest">
          LOADING LABMAKER OS...<span className="cursor-pixel-blink">_</span>
        </p>
        <p className="text-xs text-arcade-cyan font-mono mt-2">
          Aquecendo bico 3D (210°C) · Carregando bancadas do IFES Campus Serra...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-arcade-grid text-white flex flex-col items-center justify-center p-8 min-h-[70vh] text-center">
        <p className="font-pixel text-red-400 text-sm uppercase">FALHA DE COMUNICAÇÃO COM O SERVIDOR</p>
        <p className="text-sm text-gray-300 mt-2 max-w-md">{error}</p>
        <button
          type="button"
          onClick={refreshData}
          className="mt-5 px-5 py-2.5 rounded-xl bg-accent text-surface-ink font-pixel text-[10px]"
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/acesso" element={<CheckInLoginPage />} />
          <Route path="/projetos" element={<ProjectsPage />} />
          <Route path="/equipamentos" element={<MachinesPage />} />
          <Route path="/equipe" element={<TeamPage />} />
          <Route path="/local" element={<LocationPage />} />
          <Route path="/aluno" element={<StudentDashboard />} />
          <Route path="/quest" element={<MakerLabQuestPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Header />
        <ToastContainer />
        <AnimatedRoutes />
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
