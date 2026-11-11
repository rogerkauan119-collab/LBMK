import React from 'react';

// Mascote Pixel Art do LabMaker (Robozinho Maker com óculos de proteção em amarelo/ciano)
export const MascotRobotPixel: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    className={className}
    aria-label="Mascote Robô Pixel Art do LabMaker com óculos de proteção"
  >
    {/* Antena */}
    <rect x="7" y="0" width="2" height="1" fill="#FDB94E" />
    <rect x="7" y="1" width="2" height="1" fill="#CFD6FF" />
    {/* Cabeça azul royal */}
    <rect x="3" y="2" width="10" height="8" fill="#1A2FBF" />
    <rect x="2" y="3" width="1" height="6" fill="#0B1470" />
    <rect x="13" y="3" width="1" height="6" fill="#0B1470" />
    {/* Óculos de proteção amarelos com lentes ciano brilhantes */}
    <rect x="2" y="4" width="12" height="3" fill="#FDB94E" />
    <rect x="4" y="5" width="3" height="1" fill="#22D3EE" />
    <rect x="9" y="5" width="3" height="1" fill="#22D3EE" />
    {/* Boca LED verde-limão */}
    <rect x="5" y="8" width="6" height="1" fill="#8CF25A" />
    {/* Corpo / Peito */}
    <rect x="4" y="10" width="8" height="4" fill="#0B1B3A" />
    <rect x="6" y="11" width="4" height="2" fill="#FDB94E" />
    {/* Braços e Pernas */}
    <rect x="2" y="10" width="2" height="3" fill="#CFD6FF" />
    <rect x="12" y="10" width="2" height="3" fill="#CFD6FF" />
    <rect x="5" y="14" width="2" height="2" fill="#8CF25A" />
    <rect x="9" y="14" width="2" height="2" fill="#8CF25A" />
  </svg>
);

// Ilustrações Pixel Art de Impressora 3D, Cortadora a Laser, Placa PCI e Arduino
export const PixelMachineBadge: React.FC<{
  type: 'printer3d' | 'laser' | 'pcb' | 'arduino';
  className?: string;
}> = ({ type, className = 'w-12 h-12' }) => {
  if (type === 'printer3d') {
    return (
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
        <rect x="2" y="1" width="12" height="2" fill="#1A2FBF" />
        <rect x="2" y="3" width="2" height="11" fill="#0B1B3A" />
        <rect x="12" y="3" width="2" height="11" fill="#0B1B3A" />
        <rect x="4" y="5" width="8" height="1" fill="#CFD6FF" />
        <rect x="7" y="4" width="2" height="3" fill="#FDB94E" />
        <rect x="7" y="7" width="2" height="1" fill="#22D3EE" />
        <rect x="6" y="9" width="4" height="3" fill="#8CF25A" />
        <rect x="2" y="12" width="12" height="2" fill="#1A2FBF" />
      </svg>
    );
  }
  if (type === 'laser') {
    return (
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
        <rect x="1" y="2" width="14" height="2" fill="#0B1B3A" />
        <rect x="7" y="4" width="2" height="3" fill="#1A2FBF" />
        <rect x="7" y="7" width="2" height="5" fill="#FDB94E" />
        <rect x="6" y="11" width="4" height="1" fill="#FF4D4D" />
        <rect x="2" y="12" width="12" height="2" fill="#8CF25A" />
      </svg>
    );
  }
  if (type === 'pcb') {
    return (
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" fill="#0E5A36" />
        <rect x="5" y="5" width="6" height="6" fill="#0B1B3A" />
        <rect x="3" y="4" width="2" height="1" fill="#FDB94E" />
        <rect x="3" y="7" width="2" height="1" fill="#FDB94E" />
        <rect x="3" y="10" width="2" height="1" fill="#FDB94E" />
        <rect x="11" y="4" width="2" height="1" fill="#FDB94E" />
        <rect x="11" y="7" width="2" height="1" fill="#FDB94E" />
        <rect x="11" y="10" width="2" height="1" fill="#FDB94E" />
        <rect x="7" y="7" width="2" height="2" fill="#8CF25A" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" fill="#1A2FBF" />
      <rect x="1" y="5" width="3" height="3" fill="#CFD6FF" />
      <rect x="6" y="6" width="6" height="3" fill="#0B1B3A" />
      <rect x="4" y="4" width="8" height="1" fill="#FDB94E" />
      <rect x="4" y="11" width="8" height="1" fill="#8CF25A" />
    </svg>
  );
};
