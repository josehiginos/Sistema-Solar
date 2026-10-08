import React from 'react';
import { X, Orbit, Satellite, ShieldAlert, Award, Compass, Globe } from 'lucide-react';
import { REAL_SATELLITE_STATISTICS } from '../data/satellitesData';

interface ScientificGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificGuideModal: React.FC<ScientificGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-5 text-slate-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white font-tech tracking-wide uppercase">
              Mecânica Orbital & Satélites Artificiais
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seção 1: O Número Real de Satélites */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
            <Satellite className="w-4 h-4 text-sky-400" />
            <span>1. O Censo Orbital Real da Terra (2025/2026)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            De acordo com o banco de dados oficial da <strong className="text-white">ESA Space Debris Office</strong> e da <strong className="text-white">UCS Satellite Database</strong>, existem atualmente cerca de <strong className="text-sky-300">10.650 satélites operacionais ativos</strong> orbitando a Terra. Além disso, há mais de 36.500 fragmentos de lixo espacial catalogados maiores que 10 cm.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900 border border-slate-800 rounded-lg p-3 mt-1 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">LEO (Baixa Órbita)</span>
              <span className="font-bold text-sky-400 text-sm">~9.320</span>
              <span className="text-[10px] text-slate-400 block">160 – 2.000 km</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">MEO (Média Órbita)</span>
              <span className="font-bold text-amber-400 text-sm">~266</span>
              <span className="text-[10px] text-slate-400 block">GPS / Galileo</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">GEO (Geoestacionária)</span>
              <span className="font-bold text-pink-400 text-sm">~618</span>
              <span className="text-[10px] text-slate-400 block">35.786 km</span>
            </div>
          </div>
        </div>

        {/* Seção 2: As 3 Leis de Kepler */}
        <div className="flex flex-col gap-2 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>2. As Órbitas Reais dos Planetas (Leis de Kepler)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Esta simulação reproduz as órbitas dos planetas utilizando os parâmetros astronômicos reais da mecânica celeste:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-white">1ª Lei (Órbitas Elípticas):</strong> A órbita de cada planeta é uma elipse com o Sol situado em um dos focos (com deslocamento focal <span className="font-mono text-emerald-400">c = a · e</span>). Mercúrio, com excentricidade <span className="font-mono text-emerald-400">e = 0.2056</span>, possui a órbita mais ovalada.
            </li>
            <li>
              <strong className="text-white">2ª Lei (Áreas Iguais):</strong> A linha imaginária ligando o Sol ao planeta varre áreas iguais em intervalos de tempo iguais — planetas aceleram no periélio e desaceleram no afélio.
            </li>
            <li>
              <strong className="text-white">3ª Lei (Harmônica):</strong> O quadrado do período orbital é proporcional ao cubo do semi-eixo maior (<span className="font-mono text-emerald-400">T² ∝ a³</span>). Por isso, Mercúrio completa uma volta em 88 dias, enquanto Netuno leva quase 165 anos!
            </li>
          </ul>
        </div>

        {/* Seção 3: Megaconstelações e Síndrome de Kessler */}
        <div className="flex flex-col gap-2 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>3. Megaconstelações & Sustentabilidade Espacial</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            O crescimento exponencial do número de satélites nos últimos 5 anos é impulsionado por megaconstelações de banda larga como a <strong className="text-white">Starlink</strong> (SpaceX) e <strong className="text-white">OneWeb</strong>. A agência espacial ESA desenvolveu o conceito da <strong className="text-white">Síndrome de Kessler</strong>: o risco de uma colisão em cascata tornar as órbitas baixas inutilizáveis. Experimente no simulador aumentar para 25.000 satélites para visualizar essa densidade!
          </p>
        </div>

        {/* Rodapé com botão de fechar */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition"
          >
            Entendido, Voltar à Simulação
          </button>
        </div>
      </div>
    </div>
  );
};
