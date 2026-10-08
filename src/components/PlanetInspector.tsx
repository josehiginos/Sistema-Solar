import React from 'react';
import { PlanetData, PLANETS_DATA, SUN_DATA } from '../data/planetsData';
import { Globe, X, Compass, Thermometer, Orbit, Wind, ArrowRight, Sparkles } from 'lucide-react';
import { spaceAudio } from '../utils/audioSynth';

interface PlanetInspectorProps {
  selectedPlanet: PlanetData | null;
  onClose: () => void;
  onSelectPlanet: (planet: PlanetData | null) => void;
  onFocusEarthSatellites: () => void;
}

export const PlanetInspector: React.FC<PlanetInspectorProps> = ({
  selectedPlanet,
  onClose,
  onSelectPlanet,
  onFocusEarthSatellites,
}) => {
  if (!selectedPlanet) return null;

  return (
    <div className="w-80 md:w-96 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 text-slate-200 flex flex-col gap-3.5 shadow-2xl animate-in fade-in slide-in-from-left duration-200">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shrink-0"
            style={{ backgroundColor: selectedPlanet.visualColor }}
          />
          <div>
            <h3 className="text-base font-bold text-white tracking-wide font-tech">
              {selectedPlanet.portugueseName.toUpperCase()}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {selectedPlanet.type === 'rochoso'
                ? 'Planeta Rochoso / Terrestre'
                : selectedPlanet.type === 'gigante_gasoso'
                ? 'Gigante Gasoso'
                : 'Gigante de Gelo'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Descrição */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {selectedPlanet.description}
      </p>

      {/* Grid de Telemetria Orbital Real */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5 mb-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Orbit className="w-3 h-3 text-sky-400" />
            Parâmetros Orbitais Reais
          </span>
          <span className="text-[10px] font-mono text-sky-400">KEPLERIANOS</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">SEMI-EIXO MAIOR (a)</div>
            <div className="font-mono tabular-nums font-semibold text-white">
              {selectedPlanet.semiMajorAxisAU} <span className="text-[10px] text-slate-400 font-normal">UA</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              ~{(selectedPlanet.semiMajorAxisAU * 149.6).toFixed(1)}M km
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-mono">PERÍODO ORBITAL (T)</div>
            <div className="font-mono tabular-nums font-semibold text-white">
              {selectedPlanet.orbitalPeriodDays >= 365
                ? `${(selectedPlanet.orbitalPeriodDays / 365.25).toFixed(2)} anos`
                : `${selectedPlanet.orbitalPeriodDays.toFixed(1)} dias`}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {selectedPlanet.orbitalPeriodDays.toFixed(0)} dias terrestres
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-mono">EXCENTRICIDADE (e)</div>
            <div className="font-mono tabular-nums font-semibold text-white">
              {selectedPlanet.eccentricity.toFixed(4)}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {selectedPlanet.eccentricity > 0.1 ? 'Órbita Oval Acentuada' : 'Quase Circular'}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-mono">VELOCIDADE MÉDIA</div>
            <div className="font-mono tabular-nums font-semibold text-white">
              {selectedPlanet.orbitalSpeedKmS} <span className="text-[10px] text-slate-400 font-normal">km/s</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              ~{(selectedPlanet.orbitalSpeedKmS * 3600).toLocaleString('pt-BR')} km/h
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Características Físicas */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5">
        <div>
          <span className="text-[10px] font-mono text-slate-400 block">DIÂMETRO EQUATORIAL</span>
          <span className="font-mono tabular-nums font-semibold text-white">
            {selectedPlanet.diameterKm.toLocaleString('pt-BR')} km
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-400 block">TEMPERATURA MÉDIA</span>
          <span className="font-mono tabular-nums font-semibold text-white">
            {selectedPlanet.meanTemperatureC > 0 ? `+${selectedPlanet.meanTemperatureC}` : selectedPlanet.meanTemperatureC}°C
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-400 block">ROTAÇÃO AXIAL</span>
          <span className="font-mono tabular-nums font-semibold text-white">
            {Math.abs(selectedPlanet.rotationPeriodHours).toFixed(1)}h
          </span>
          <span className="text-[9px] text-slate-500 block">
            {selectedPlanet.rotationPeriodHours < 0 ? 'Retrógrada' : 'Prógrada'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-400 block">LUAS CONHECIDAS</span>
          <span className="font-mono tabular-nums font-semibold text-white">
            {selectedPlanet.moonsCount}
          </span>
        </div>
      </div>

      {/* Atmosfera */}
      <div className="text-xs">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-0.5">
          Composição Atmosférica:
        </span>
        <div className="p-2 bg-slate-900/70 rounded border border-slate-800 text-[11px] text-slate-300">
          {selectedPlanet.atmosphere}
        </div>
      </div>

      {/* Curiosidade Astronômica */}
      <div className="p-2.5 bg-sky-950/30 border border-sky-800/40 rounded-lg text-xs text-sky-200">
        <div className="flex items-center gap-1.5 font-medium text-sky-400 text-[11px] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Fato Notável:
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {selectedPlanet.curiosity}
        </p>
      </div>

      {/* Botão Especial caso seja a Terra: Ir para Satélites */}
      {selectedPlanet.id === 'earth' && (
        <button
          onClick={onFocusEarthSatellites}
          className="w-full py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
        >
          <Orbit className="w-4 h-4" />
          Explorar a Nuvem de Satélites da Terra
        </button>
      )}

      {/* Navegação Rápida entre Planetas */}
      <div className="pt-2 border-t border-slate-800">
        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
          Saltar para Outro Planeta:
        </span>
        <div className="flex flex-wrap gap-1">
          {PLANETS_DATA.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelectPlanet(p);
                spaceAudio.playTelemetryChirp();
              }}
              className={`px-2 py-0.5 text-[11px] rounded transition ${
                selectedPlanet.id === p.id
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.portugueseName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
