import React from 'react';
import { Minus, Plus, RotateCcw, Satellite, Layers, Orbit, Sparkles, AlertCircle } from 'lucide-react';
import { REAL_SATELLITE_STATISTICS, FAMOUS_SATELLITES, FamousSatellite } from '../data/satellitesData';
import { spaceAudio } from '../utils/audioSynth';

interface SatelliteControlsProps {
  count: number;
  onCountChange: (newCount: number) => void;
  orbitFilter: 'ALL' | 'LEO' | 'MEO' | 'GEO';
  onFilterChange: (filter: 'ALL' | 'LEO' | 'MEO' | 'GEO') => void;
  colorMode: 'BY_REGIME' | 'UNIFORM_GOLD' | 'UNIFORM_CYAN';
  onColorModeChange: (mode: 'BY_REGIME' | 'UNIFORM_GOLD' | 'UNIFORM_CYAN') => void;
  selectedSatellite: FamousSatellite | null;
  onSelectSatellite: (sat: FamousSatellite | null) => void;
  onFocusEarth: () => void;
}

export const SatelliteControls: React.FC<SatelliteControlsProps> = ({
  count,
  onCountChange,
  orbitFilter,
  onFilterChange,
  colorMode,
  onColorModeChange,
  selectedSatellite,
  onSelectSatellite,
  onFocusEarth,
}) => {
  const realCount = REAL_SATELLITE_STATISTICS.realActiveSatellites;

  const handleStep = (delta: number) => {
    const updated = Math.max(0, Math.min(30000, count + delta));
    onCountChange(updated);
    spaceAudio.playTelemetryChirp();
  };

  const setPreset = (val: number) => {
    onCountChange(val);
    spaceAudio.playBeep(620, 0.08);
  };

  // Cálculos dinâmicos proporcionais à densidade
  const calcLeo = Math.round(count * 0.875);
  const calcMeo = Math.round(count * 0.025);
  const calcGeo = Math.round(count * 0.058);

  return (
    <div className="w-80 md:w-96 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 text-slate-200 flex flex-col gap-4 shadow-2xl">
      {/* Cabeçalho do Painel */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase font-tech">
            Satélites da Terra
          </h2>
        </div>
        <button
          onClick={onFocusEarth}
          className="text-xs px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-colors flex items-center gap-1.5"
          title="Focar câmera na Terra"
        >
          <Orbit className="w-3.5 h-3.5" />
          Focar Terra
        </button>
      </div>

      {/* Contador Principal e Status Real */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Total em Órbita
          </span>
          <span className="text-xs font-mono text-sky-400">
            {count === realCount ? '● CONTROLE REAL' : count > realCount ? '▲ ACIMA DO REAL' : '▼ ABAIXO DO REAL'}
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className="text-3xl font-tech font-bold text-white tabular-nums tracking-tight">
            {count.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            satélites ativos
          </span>
        </div>

        {/* Barra de Proporção LEO / MEO / GEO */}
        <div className="mt-3">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: '87.5%' }} className="bg-sky-400" title="LEO (Baixa Órbita)" />
            <div style={{ width: '2.5%' }} className="bg-amber-400" title="MEO (Órbita Média)" />
            <div style={{ width: '5.8%' }} className="bg-pink-400" title="GEO (Geoestacionária)" />
            <div style={{ width: '4.2%' }} className="bg-emerald-400" title="Outros/Polar" />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              LEO {calcLeo.toLocaleString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              MEO {calcMeo.toLocaleString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              GEO {calcGeo.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Controles para Aumentar e Diminuir Satélites */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-slate-300 flex justify-between items-center">
          <span>Ajustar Quantidade:</span>
          <span className="text-slate-400">0 - 30.000</span>
        </label>

        {/* Slider Contínuo */}
        <input
          type="range"
          min="0"
          max="30000"
          step="50"
          value={count}
          onChange={(e) => onCountChange(Number(e.target.value))}
          className="w-full accent-sky-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />

        {/* Botões de Incremento e Decremento */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={() => handleStep(-1000)}
            disabled={count <= 0}
            className="px-2 py-1.5 text-xs font-mono font-medium rounded bg-slate-900 border border-slate-700/80 hover:bg-slate-800 active:scale-95 transition text-slate-300 disabled:opacity-40"
          >
            -1.000
          </button>
          <button
            onClick={() => handleStep(-100)}
            disabled={count <= 0}
            className="px-2 py-1.5 text-xs font-mono font-medium rounded bg-slate-900 border border-slate-700/80 hover:bg-slate-800 active:scale-95 transition text-slate-300 disabled:opacity-40"
          >
            -100
          </button>
          <button
            onClick={() => handleStep(+100)}
            disabled={count >= 30000}
            className="px-2 py-1.5 text-xs font-mono font-medium rounded bg-slate-900 border border-slate-700/80 hover:bg-slate-800 active:scale-95 transition text-slate-300 disabled:opacity-40"
          >
            +100
          </button>
          <button
            onClick={() => handleStep(+1000)}
            disabled={count >= 30000}
            className="px-2 py-1.5 text-xs font-mono font-medium rounded bg-slate-900 border border-slate-700/80 hover:bg-slate-800 active:scale-95 transition text-slate-300 disabled:opacity-40"
          >
            +1.000
          </button>
        </div>
      </div>

      {/* Presets Históricos e Comparativos com Destaque para o REAL */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
          Cenários e Marcos Reais:
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setPreset(realCount)}
            className={`col-span-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center justify-between ${
              count === realCount
                ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/90 border-sky-500/40 text-sky-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              NÚMERO REAL ATUAL
            </span>
            <span className="font-mono tabular-nums font-bold">10.650</span>
          </button>

          <button
            onClick={() => setPreset(150)}
            className={`px-2.5 py-1.5 text-[11px] rounded border transition text-left ${
              count === 150
                ? 'bg-slate-800 border-slate-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="text-[10px] text-slate-400">Pioneiros & Estações</div>
            <div className="font-mono font-semibold">150</div>
          </button>

          <button
            onClick={() => setPreset(2500)}
            className={`px-2.5 py-1.5 text-[11px] rounded border transition text-left ${
              count === 2500
                ? 'bg-slate-800 border-slate-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="text-[10px] text-slate-400">Ano 2018 (Pré-Starlink)</div>
            <div className="font-mono font-semibold">2.500</div>
          </button>

          <button
            onClick={() => setPreset(25000)}
            className={`col-span-2 px-2.5 py-1.5 text-[11px] rounded border transition text-left flex justify-between items-center ${
              count === 25000
                ? 'bg-slate-800 border-slate-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-[10px] text-slate-400">Projeção Futura (Megaconstelações 2030)</div>
              <div className="font-mono font-semibold">25.000</div>
            </div>
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Filtro por Regime Orbital */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-800/80">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
          Filtrar por Camada Orbital:
        </span>
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
          {(['ALL', 'LEO', 'MEO', 'GEO'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => onFilterChange(reg)}
              className={`py-1 text-xs font-mono font-medium rounded transition ${
                orbitFilter === reg
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg === 'ALL' ? 'Todos' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Modo de Cor dos Satélites */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-400 font-mono text-[11px]">Cores:</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => onColorModeChange('BY_REGIME')}
            className={`px-2 py-0.5 text-[10px] rounded font-mono ${
              colorMode === 'BY_REGIME'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Por Regime
          </button>
          <button
            onClick={() => onColorModeChange('UNIFORM_GOLD')}
            className={`px-2 py-0.5 text-[10px] rounded font-mono ${
              colorMode === 'UNIFORM_GOLD'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Dourado
          </button>
        </div>
      </div>

      {/* Lista de Satélites Famosos em Destaque */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
          Missões Famosas Rastreadas:
        </span>
        <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1">
          {FAMOUS_SATELLITES.map((sat) => {
            const isSelected = selectedSatellite?.id === sat.id;
            return (
              <button
                key={sat.id}
                onClick={() => {
                  onSelectSatellite(isSelected ? null : sat);
                  spaceAudio.playTelemetryChirp();
                }}
                className={`w-full text-left p-1.5 rounded text-xs transition border flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-400/80 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: sat.color }}
                  />
                  <span className="truncate font-medium">{sat.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                  {sat.altitudeKm} km
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalhes do Satélite Selecionado */}
      {selectedSatellite && (
        <div className="p-2.5 bg-slate-900 rounded-lg border border-sky-500/30 text-xs flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-sky-300">{selectedSatellite.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {selectedSatellite.orbitType}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {selectedSatellite.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <div>Altitude: <span className="text-white">{selectedSatellite.altitudeKm.toLocaleString('pt-BR')} km</span></div>
            <div>Velocidade: <span className="text-white">{selectedSatellite.orbitalSpeedKmS} km/s</span></div>
            <div>Inclinação: <span className="text-white">{selectedSatellite.inclinationDeg}°</span></div>
            <div>Período: <span className="text-white">{selectedSatellite.periodMinutes} min</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
