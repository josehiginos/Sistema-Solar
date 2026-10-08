import React from 'react';
import { PlanetData, PLANETS_DATA } from '../data/planetsData';
import { REAL_SATELLITE_STATISTICS } from '../data/satellitesData';
import { spaceAudio } from '../utils/audioSynth';

interface TopBarProps {
  viewMode: 'SOLAR_SYSTEM' | 'EARTH_SATELLITES';
  onViewModeChange: (mode: 'SOLAR_SYSTEM' | 'EARTH_SATELLITES') => void;
  onSelectPlanet: (planet: PlanetData | null) => void;
  onOpenGuide: () => void;
  satelliteCount: number;
  onResetSatellites: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onViewModeChange,
  onSelectPlanet,
  onOpenGuide,
  satelliteCount,
  onResetSatellites,
}) => {
  const realCount = REAL_SATELLITE_STATISTICS.realActiveSatellites;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between">
      {/* Zona 1: Wordmark da marca em elemento de texto único */}
      <button
        onClick={() => {
          onViewModeChange('SOLAR_SYSTEM');
          onSelectPlanet(null);
          spaceAudio.playTelemetryChirp();
        }}
        className="text-base md:text-lg font-bold tracking-wider text-white font-tech uppercase hover:text-sky-400 transition-colors whitespace-nowrap"
      >
        Orbital Solaris 3D
      </button>

      {/* Zona 2: Links de navegação e modos */}
      <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-300">
        <button
          onClick={() => {
            onViewModeChange('SOLAR_SYSTEM');
            onSelectPlanet(null);
            spaceAudio.playTelemetryChirp();
          }}
          className={`transition-colors whitespace-nowrap ${
            viewMode === 'SOLAR_SYSTEM'
              ? 'text-sky-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Visão Geral
        </button>

        <button
          onClick={() => {
            onViewModeChange('EARTH_SATELLITES');
            const earth = PLANETS_DATA.find((p) => p.id === 'earth') || null;
            onSelectPlanet(earth);
            spaceAudio.playTelemetryChirp();
          }}
          className={`transition-colors whitespace-nowrap ${
            viewMode === 'EARTH_SATELLITES'
              ? 'text-sky-400 font-semibold'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Terra & Satélites
        </button>

        <button
          onClick={() => {
            const mars = PLANETS_DATA.find((p) => p.id === 'mars') || null;
            onViewModeChange('SOLAR_SYSTEM');
            onSelectPlanet(mars);
            spaceAudio.playTelemetryChirp();
          }}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Marte
        </button>

        <button
          onClick={() => {
            const jupiter = PLANETS_DATA.find((p) => p.id === 'jupiter') || null;
            onViewModeChange('SOLAR_SYSTEM');
            onSelectPlanet(jupiter);
            spaceAudio.playTelemetryChirp();
          }}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Júpiter
        </button>

        <button
          onClick={() => {
            const saturn = PLANETS_DATA.find((p) => p.id === 'saturn') || null;
            onViewModeChange('SOLAR_SYSTEM');
            onSelectPlanet(saturn);
            spaceAudio.playTelemetryChirp();
          }}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Saturno
        </button>

        <button
          onClick={onOpenGuide}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Guia Científico
        </button>
      </nav>

      {/* Zona 3: 1-2 ações primárias com texto de linha única */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            onResetSatellites();
            spaceAudio.playTelemetryChirp();
          }}
          className="px-3 py-1.5 text-xs font-mono font-medium text-sky-300 bg-sky-950/70 border border-sky-600/50 hover:bg-sky-900/60 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
          title="Restaurar frota para o número real oficial de 10.650 satélites"
        >
          <span>Real:</span>
          <span className="font-bold tabular-nums text-white">10.650</span>
        </button>

        <button
          onClick={() => {
            onViewModeChange(viewMode === 'SOLAR_SYSTEM' ? 'EARTH_SATELLITES' : 'SOLAR_SYSTEM');
            spaceAudio.playTelemetryChirp();
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          {viewMode === 'SOLAR_SYSTEM' ? 'Explorar Satélites' : 'Sistema Solar'}
        </button>
      </div>
    </header>
  );
};
