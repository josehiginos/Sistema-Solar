/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { SolarSystemScene, SceneVisualMode } from './components/SolarSystemScene';
import { SatelliteControls } from './components/SatelliteControls';
import { PlanetInspector } from './components/PlanetInspector';
import { PlaybackControls } from './components/PlaybackControls';
import { TopBar } from './components/TopBar';
import { ScientificGuideModal } from './components/ScientificGuideModal';
import { PlanetData, PLANETS_DATA } from './data/planetsData';
import { FamousSatellite, REAL_SATELLITE_STATISTICS } from './data/satellitesData';
import { Satellite, Globe2, HelpCircle, Layers, ChevronRight, ChevronLeft } from 'lucide-react';
import { spaceAudio } from './utils/audioSynth';

export default function App() {
  // Estado dos satélites (Valor inicial = Número real oficial de satélites ativos: 10.650)
  const [satelliteCount, setSatelliteCount] = useState<number>(REAL_SATELLITE_STATISTICS.realActiveSatellites);
  const [satelliteOrbitFilter, setSatelliteOrbitFilter] = useState<'ALL' | 'LEO' | 'MEO' | 'GEO'>('ALL');
  const [colorMode, setColorMode] = useState<'BY_REGIME' | 'UNIFORM_GOLD' | 'UNIFORM_CYAN'>('BY_REGIME');
  const [selectedSatellite, setSelectedSatellite] = useState<FamousSatellite | null>(null);

  // Estado dos corpos celestes e câmera
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [viewMode, setViewMode] = useState<'SOLAR_SYSTEM' | 'EARTH_SATELLITES'>('SOLAR_SYSTEM');

  // Estado de simulação temporal e visual
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [showOrbitPaths, setShowOrbitPaths] = useState<boolean>(true);
  const [showSatelliteLabels, setShowSatelliteLabels] = useState<boolean>(true);

  // Modo visual de contraste e brilho da cena 3D
  const [sceneVisualMode, setSceneVisualMode] = useState<SceneVisualMode>('STANDARD');
  const [sceneBrightness, setSceneBrightness] = useState<number>(1.0);

  // Estado dos painéis da interface
  const [isSatellitesPanelOpen, setIsSatellitesPanelOpen] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Ações de conveniência
  const handleSelectPlanet = useCallback((planet: PlanetData | null) => {
    setSelectedPlanet(planet);
    if (planet?.id === 'earth') {
      setIsSatellitesPanelOpen(true);
    }
  }, []);

  const handleFocusEarth = useCallback(() => {
    setViewMode('EARTH_SATELLITES');
    const earth = PLANETS_DATA.find((p) => p.id === 'earth') || null;
    setSelectedPlanet(earth);
    setIsSatellitesPanelOpen(true);
    spaceAudio.playTelemetryChirp();
  }, []);

  const handleResetCamera = useCallback(() => {
    setViewMode('SOLAR_SYSTEM');
    setSelectedPlanet(null);
    setSelectedSatellite(null);
    spaceAudio.playTelemetryChirp();
  }, []);

  const handleResetSatellitesToReal = useCallback(() => {
    setSatelliteCount(REAL_SATELLITE_STATISTICS.realActiveSatellites);
    setSatelliteOrbitFilter('ALL');
    spaceAudio.playBeep(640, 0.08);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
      {/* 1. Barra Superior (Top Bar Contract) */}
      <TopBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectPlanet={handleSelectPlanet}
        onOpenGuide={() => setIsGuideOpen(true)}
        satelliteCount={satelliteCount}
        onResetSatellites={handleResetSatellitesToReal}
      />

      {/* 2. Palco Principal: Cena 3D Three.js */}
      <main className="w-full h-full pt-14">
        <SolarSystemScene
          satelliteCount={satelliteCount}
          selectedPlanetId={selectedPlanet?.id || null}
          onSelectPlanet={handleSelectPlanet}
          selectedSatelliteId={selectedSatellite?.id || null}
          onSelectSatellite={setSelectedSatellite}
          isPaused={isPaused}
          timeSpeed={timeSpeed}
          showOrbitPaths={showOrbitPaths}
          satelliteOrbitFilter={satelliteOrbitFilter}
          colorMode={colorMode}
          showSatelliteLabels={showSatelliteLabels}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sceneVisualMode={sceneVisualMode}
          sceneBrightness={sceneBrightness}
        />
      </main>

      {/* 3. Painel Esquerdo: Inspetor Científico do Planeta Selecionado */}
      {selectedPlanet && (
        <aside className="absolute left-4 top-20 z-20 max-h-[calc(100vh-140px)] overflow-y-auto pointer-events-auto">
          <PlanetInspector
            selectedPlanet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
            onSelectPlanet={handleSelectPlanet}
            onFocusEarthSatellites={handleFocusEarth}
          />
        </aside>
      )}

      {/* 4. Painel Direito: Controles de Satélites da Terra */}
      <aside
        className={`absolute right-4 top-20 z-20 transition-transform duration-300 pointer-events-auto max-h-[calc(100vh-140px)] overflow-y-auto ${
          isSatellitesPanelOpen ? 'translate-x-0' : 'translate-x-[calc(100%+16px)]'
        }`}
      >
        <SatelliteControls
          count={satelliteCount}
          onCountChange={setSatelliteCount}
          orbitFilter={satelliteOrbitFilter}
          onFilterChange={setSatelliteOrbitFilter}
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          selectedSatellite={selectedSatellite}
          onSelectSatellite={setSelectedSatellite}
          onFocusEarth={handleFocusEarth}
        />
      </aside>

      {/* Botão flutuante para reabrir painel de satélites se fechado */}
      <button
        onClick={() => setIsSatellitesPanelOpen(!isSatellitesPanelOpen)}
        className="absolute right-4 top-16 z-20 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-slate-800 shadow-xl transition-all"
        title={isSatellitesPanelOpen ? 'Recolher Painel de Satélites' : 'Expandir Painel de Satélites'}
        aria-label="Alternar Painel de Satélites"
      >
        {isSatellitesPanelOpen ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium pr-1">
            <Satellite className="w-4 h-4" />
            <span>Satélites ({satelliteCount.toLocaleString('pt-BR')})</span>
          </div>
        )}
      </button>

      {/* 5. Barra Inferior Central: Controles de Reprodução e Simulação */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <PlaybackControls
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          timeSpeed={timeSpeed}
          onTimeSpeedChange={setTimeSpeed}
          showOrbitPaths={showOrbitPaths}
          onToggleOrbitPaths={() => setShowOrbitPaths(!showOrbitPaths)}
          onResetCamera={handleResetCamera}
          sceneVisualMode={sceneVisualMode}
          onVisualModeChange={setSceneVisualMode}
          sceneBrightness={sceneBrightness}
          onBrightnessChange={setSceneBrightness}
        />
      </div>

      {/* 6. Barra Flutuante Inferior Esquerda: Seletor Rápido de Planetas */}
      <div className="absolute bottom-5 left-4 z-20 hidden lg:flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-1.5 rounded-xl text-xs">
        <span className="text-[10px] font-mono text-slate-400 px-1 uppercase">Planetas:</span>
        {PLANETS_DATA.map((p) => {
          const isSelected = selectedPlanet?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                handleSelectPlanet(p);
                spaceAudio.playTelemetryChirp();
              }}
              className={`px-2 py-1 rounded transition text-xs flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: p.visualColor }}
              />
              <span>{p.portugueseName}</span>
            </button>
          );
        })}
      </div>

      {/* 7. Guia Científico Modal */}
      <ScientificGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
