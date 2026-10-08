import React, { useState } from 'react';
import {
  Play,
  Pause,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize2,
  Compass,
  Sun,
  Moon,
  Contrast,
  Sliders,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { spaceAudio } from '../utils/audioSynth';
import { SceneVisualMode } from './SolarSystemScene';

interface PlaybackControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  timeSpeed: number;
  onTimeSpeedChange: (speed: number) => void;
  showOrbitPaths: boolean;
  onToggleOrbitPaths: () => void;
  onResetCamera: () => void;
  sceneVisualMode: SceneVisualMode;
  onVisualModeChange: (mode: SceneVisualMode) => void;
  sceneBrightness: number;
  onBrightnessChange: (brightness: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPaused,
  onTogglePause,
  timeSpeed,
  onTimeSpeedChange,
  showOrbitPaths,
  onToggleOrbitPaths,
  onResetCamera,
  sceneVisualMode,
  onVisualModeChange,
  sceneBrightness,
  onBrightnessChange,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisualPanelOpen, setIsVisualPanelOpen] = useState(false);

  const speeds = [0.2, 1, 5, 20, 80];

  const handleToggleAudio = () => {
    const muted = spaceAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleCycleVisualMode = () => {
    if (sceneVisualMode === 'STANDARD') {
      onVisualModeChange('HIGH_CONTRAST');
    } else if (sceneVisualMode === 'HIGH_CONTRAST') {
      onVisualModeChange('NIGHT_OBSERVATORY');
    } else {
      onVisualModeChange('STANDARD');
    }
    spaceAudio.playTelemetryChirp();
  };

  return (
    <div className="relative">
      {/* Popover Flutuante de Ajuste Visual & Brilho da Cena 3D */}
      {isVisualPanelOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col gap-3.5 text-slate-200 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-tech">
                Brilho & Contraste da Cena 3D
              </h4>
            </div>
            <button
              onClick={() => setIsVisualPanelOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Seletor de Modo de Contraste e Visualização */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
              Modo de Visualização Orbital:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  onVisualModeChange('STANDARD');
                  spaceAudio.playTelemetryChirp();
                }}
                className={`p-2 rounded-lg border text-left transition flex flex-col gap-1 ${
                  sceneVisualMode === 'STANDARD'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span>🌌 Padrão</span>
                </div>
                <span className="text-[10px] leading-tight text-slate-400">
                  Espaço realista cósmico
                </span>
              </button>

              <button
                onClick={() => {
                  onVisualModeChange('HIGH_CONTRAST');
                  spaceAudio.playTelemetryChirp();
                }}
                className={`p-2 rounded-lg border text-left transition flex flex-col gap-1 ${
                  sceneVisualMode === 'HIGH_CONTRAST'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>⚡ Alto Contraste</span>
                </div>
                <span className="text-[10px] leading-tight text-slate-400">
                  Fundo breu total & órbitas nítidas
                </span>
              </button>

              <button
                onClick={() => {
                  onVisualModeChange('NIGHT_OBSERVATORY');
                  spaceAudio.playTelemetryChirp();
                }}
                className={`p-2 rounded-lg border text-left transition flex flex-col gap-1 ${
                  sceneVisualMode === 'NIGHT_OBSERVATORY'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span>🔭 Noturno</span>
                </div>
                <span className="text-[10px] leading-tight text-slate-400">
                  Filtro observatório anti-ofuscamento
                </span>
              </button>
            </div>
          </div>

          {/* Slider Contínuo de Brilho da Cena */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Brilho Geral:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tabular-nums">
                  {Math.round(sceneBrightness * 100)}%
                </span>
                <button
                  onClick={() => onBrightnessChange(1.0)}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-1"
                  title="Redefinir brilho para 100%"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  100%
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={sceneBrightness}
              onChange={(e) => onBrightnessChange(parseFloat(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />

            {/* Atalhos Rápidos de Brilho */}
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
              {[0.7, 1.0, 1.3, 1.7].map((b) => (
                <button
                  key={b}
                  onClick={() => onBrightnessChange(b)}
                  className={`py-1 rounded border transition ${
                    Math.abs(sceneBrightness - b) < 0.05
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {Math.round(b * 100)}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Barra Principal de Controles */}
      <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl px-4 py-2.5 flex items-center gap-3 md:gap-4 shadow-2xl text-slate-300">
        {/* Botão Play / Pause */}
        <button
          onClick={() => {
            onTogglePause();
            spaceAudio.playBeep(isPaused ? 580 : 380, 0.05);
          }}
          className="w-9 h-9 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center transition active:scale-95 shadow-md shadow-sky-500/20"
          title={isPaused ? 'Iniciar Simulação' : 'Pausar Simulação'}
          aria-label={isPaused ? 'Iniciar' : 'Pausar'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current ml-0.5" /> : <Pause className="w-4 h-4 fill-current" />}
        </button>

        {/* Seletor de Velocidade da Simulação */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <span className="text-[10px] font-mono text-slate-400 px-1 hidden sm:inline">VEL:</span>
          {speeds.map((spd) => (
            <button
              key={spd}
              onClick={() => {
                onTimeSpeedChange(spd);
                spaceAudio.playTelemetryChirp();
              }}
              className={`px-2 py-0.5 text-xs font-mono rounded transition ${
                timeSpeed === spd
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Botão Seletor de Brilho & Modo de Contraste */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsVisualPanelOpen(!isVisualPanelOpen)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition flex items-center gap-1.5 ${
              isVisualPanelOpen || sceneVisualMode !== 'STANDARD'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
            title="Ajustar Brilho Geral e Modo de Alto Contraste"
          >
            {sceneVisualMode === 'HIGH_CONTRAST' ? (
              <Contrast className="w-3.5 h-3.5 text-white" />
            ) : sceneVisualMode === 'NIGHT_OBSERVATORY' ? (
              <Moon className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {sceneVisualMode === 'HIGH_CONTRAST'
                ? 'Alto Contraste'
                : sceneVisualMode === 'NIGHT_OBSERVATORY'
                ? 'Brilho Noturno'
                : 'Brilho'}
            </span>
            <span className="text-[10px] opacity-75 tabular-nums">
              {Math.round(sceneBrightness * 100)}%
            </span>
          </button>

          {/* Botão rápido para ciclar modo com 1 clique */}
          <button
            onClick={handleCycleVisualMode}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Alternar rapidamente entre Padrão, Alto Contraste e Brilho Noturno"
            aria-label="Alternar modo visual"
          >
            <Contrast className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Alternar Linhas Orbitais Reais */}
        <button
          onClick={() => {
            onToggleOrbitPaths();
            spaceAudio.playBeep(520, 0.05);
          }}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition flex items-center gap-1.5 ${
            showOrbitPaths
              ? 'bg-slate-900 border-sky-500/40 text-sky-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Mostrar ou ocultar linhas de trajetória orbital"
        >
          {showOrbitPaths ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Órbitas</span>
        </button>

        {/* Reset de Câmera */}
        <button
          onClick={() => {
            onResetCamera();
            spaceAudio.playTelemetryChirp();
          }}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Restaurar Visão Geral da Câmera"
          aria-label="Restaurar Câmera"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Áudio Espacial */}
        <button
          onClick={handleToggleAudio}
          className={`p-1.5 rounded-lg border transition ${
            !isMuted
              ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title={isMuted ? 'Ativar Áudio Cósmico' : 'Desativar Áudio'}
          aria-label="Alternar Áudio"
        >
          {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Tela Cheia */}
        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition hidden md:block"
          title="Modo Tela Cheia"
          aria-label="Tela Cheia"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

