import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { PlanetData, PLANETS_DATA } from '../data/planetsData';
import { FAMOUS_SATELLITES, FamousSatellite } from '../data/satellitesData';
import {
  getSunTexture,
  getEarthTexture,
  getEarthCloudsTexture,
  getMarsTexture,
  getJupiterTexture,
  getSaturnTexture,
  getSaturnRingsTexture,
  getVenusTexture,
  getMercuryTexture,
  getUranusTexture,
  getNeptuneTexture,
} from '../utils/textureGenerator';

export type SceneVisualMode = 'STANDARD' | 'HIGH_CONTRAST' | 'NIGHT_OBSERVATORY';

interface SolarSystemSceneProps {
  satelliteCount: number;
  selectedPlanetId: string | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  selectedSatelliteId: string | null;
  onSelectSatellite: (sat: FamousSatellite | null) => void;
  isPaused: boolean;
  timeSpeed: number; // 1 = 1 dia / segundo aproximado
  showOrbitPaths: boolean;
  satelliteOrbitFilter: 'ALL' | 'LEO' | 'MEO' | 'GEO';
  colorMode: 'BY_REGIME' | 'UNIFORM_GOLD' | 'UNIFORM_CYAN';
  showSatelliteLabels: boolean;
  viewMode: 'SOLAR_SYSTEM' | 'EARTH_SATELLITES';
  onViewModeChange: (mode: 'SOLAR_SYSTEM' | 'EARTH_SATELLITES') => void;
  sceneVisualMode: SceneVisualMode;
  sceneBrightness: number;
}

// Escala astronômica calibrada para visualização harmoniosa em Three.js
const AU_SCALE = 38.0; // 1 UA = 38 unidades Three.js
const EARTH_RADIUS_UNITS = 2.4; // Raio base da Terra na visualização

// Dados orbitais pré-calculados para os satélites sintéticos
interface SatelliteParticleData {
  regime: 'LEO' | 'MEO' | 'GEO';
  r: number;            // Distância em relação ao centro da Terra
  inc: number;          // Inclinação em radianos
  raan: number;         // Ascensão reta do nodo ascendente
  currentAnomalyRad: number; // Anomalia orbital atual em radianos
  angSpeed: number;     // Velocidade angular (rad/s base)
  color: THREE.Color;
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  satelliteCount,
  selectedPlanetId,
  onSelectPlanet,
  selectedSatelliteId,
  onSelectSatellite,
  isPaused,
  timeSpeed,
  showOrbitPaths,
  satelliteOrbitFilter,
  colorMode,
  showSatelliteLabels,
  viewMode,
  onViewModeChange,
  sceneVisualMode,
  sceneBrightness,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Referências Three.js mutáveis mantidas fora do ciclo do React
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunPointLightRef = useRef<THREE.PointLight | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);

  // Meshes dos planetas e órbita
  const planetMeshesRef = useRef<Map<string, {
    group: THREE.Group;
    mesh: THREE.Mesh;
    clouds?: THREE.Mesh;
    orbitLine: THREE.Line;
    data: PlanetData;
    trueAngle: number;
    pos: THREE.Vector3;
  }>>(new Map());

  const earthGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const earthCloudsMeshRef = useRef<THREE.Mesh | null>(null);

  // Satélites instanciados
  const maxSatellites = 35000;
  const satelliteMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const satelliteDataRef = useRef<SatelliteParticleData[]>([]);

  // Linhas orbitais dos satélites famosos
  const famousSatMarkersRef = useRef<Map<string, {
    marker: THREE.Mesh;
    orbitLine: THREE.Line;
    data: FamousSatellite;
    angle: number;
  }>>(new Map());

  // Anel GEO visual
  const geoRingMeshRef = useRef<THREE.Line | null>(null);

  // Controle de Câmera e Interação
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraPositionDesiredRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 75, 130));
  const isUserInteractingRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 150,
    theta: 0.8,
    phi: 1.1,
  });

  // Geração determinística e eficiente de dados de satélites
  const initSatelliteData = useCallback(() => {
    const list: SatelliteParticleData[] = [];
    const earthR = EARTH_RADIUS_UNITS;

    // Proporções reais: ~88% LEO, ~3% MEO, ~6% GEO, ~3% Polar
    for (let i = 0; i < maxSatellites; i++) {
      const rand = Math.random();
      let regime: 'LEO' | 'MEO' | 'GEO';
      let r: number;
      let inc: number;
      let angSpeed: number;
      let col = new THREE.Color();

      if (rand < 0.875) {
        // LEO: 200km a 1200km acima da superfície da Terra
        // Raio da Terra = 6371km. 550km = +8.6% do raio
        regime = 'LEO';
        const altRatio = 0.04 + Math.pow(Math.random(), 1.8) * 0.22;
        r = earthR * (1 + altRatio);
        // Inclinações reais comuns: Starlink (53°, 70°), ISS (51.6°), Polar (97°)
        const incType = Math.random();
        if (incType < 0.60) {
          inc = (52 + (Math.random() - 0.5) * 6) * (Math.PI / 180); // Concha Starlink
        } else if (incType < 0.85) {
          inc = (97 + (Math.random() - 0.5) * 4) * (Math.PI / 180); // Órbita Sol-Síncrona Polar
        } else {
          inc = Math.random() * Math.PI; // Distribuição geral
        }
        // Lei de Kepler: velocidade orbital proporcional a 1 / sqrt(r)
        angSpeed = 1.6 / Math.pow(r / earthR, 1.5);
        col.setHex(0x38bdf8); // Ciano LEO
      } else if (rand < 0.935) {
        // GEO: Cinturão Geoestacionário a 35.786 km (~6.61 raios terrestres)
        regime = 'GEO';
        // Pequena dispersão no anel GEO
        r = earthR * (6.61 + (Math.random() - 0.5) * 0.12);
        // GEO tem inclinação muito próxima de 0° (equatorial)
        inc = (Math.random() - 0.5) * 0.05;
        // Órbita síncrona com rotação da Terra
        angSpeed = 0.25;
        col.setHex(0xec4899); // Rosa/Magenta GEO
      } else {
        // MEO: 2.000km a 24.000km (GPS a ~20.200km, ~4.17 raios terrestres)
        regime = 'MEO';
        const altFactor = 2.2 + Math.random() * 2.3;
        r = earthR * altFactor;
        inc = (55 + (Math.random() - 0.5) * 8) * (Math.PI / 180); // GPS 55°
        angSpeed = 0.65 / Math.pow(r / earthR, 1.5);
        col.setHex(0xeab308); // Âmbar/Dourado MEO
      }

      const raan = Math.random() * Math.PI * 2;
      const currentAnomalyRad = Math.random() * Math.PI * 2;

      list.push({
        regime,
        r,
        inc,
        raan,
        currentAnomalyRad,
        angSpeed,
        color: col,
      });
    }

    satelliteDataRef.current = list;
  }, []);

  // Inicialização Three.js
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    initSatelliteData();

    // 1. Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712); // Obsidian deep space
    scene.fog = new THREE.FogExp2(0x030712, 0.0007);

    // 2. Câmera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 80, 150);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Luzes
    // Luz ambiente suave do cosmos
    const ambientLight = new THREE.AmbientLight(0x2d3748, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Luz pontual central emitida pelo Sol (ilumina as faces dos planetas)
    const sunPointLight = new THREE.PointLight(0xfff7ed, 4.2, 2500, 0.4);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);
    sunPointLightRef.current = sunPointLight;

    // 5. Estrelas de Fundo (Starfield cósmico)
    const starCount = 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 900 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Cores sutis de estrelas (brancas, azuladas, amareladas)
      const starHue = Math.random();
      if (starHue < 0.2) {
        starColors[i * 3] = 0.8; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;
      } else if (starHue < 0.35) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.7;
      } else {
        starColors[i * 3] = 0.95; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 0.95;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);
    starfieldRef.current = starfield;

    // 6. Sol central
    const sunRadius = 7.5;
    const sunGeo = new THREE.SphereGeometry(sunRadius, 48, 48);
    const sunTexture = getSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xffffff,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Corona / Brilho do Sol
    const coronaGeo = new THREE.SphereGeometry(sunRadius * 1.25, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    scene.add(coronaMesh);

    // 7. Planetas e Órbitas Elípticas Reais
    const planetTextureMap: Record<string, () => THREE.CanvasTexture> = {
      mercury: getMercuryTexture,
      venus: getVenusTexture,
      earth: getEarthTexture,
      mars: getMarsTexture,
      jupiter: getJupiterTexture,
      saturn: getSaturnTexture,
      uranus: getUranusTexture,
      neptune: getNeptuneTexture,
    };

    // Escala calibrada para diâmetros visuais
    const planetVisualRadii: Record<string, number> = {
      mercury: 1.1,
      venus: 2.1,
      earth: EARTH_RADIUS_UNITS,
      mars: 1.5,
      jupiter: 5.6,
      saturn: 4.8,
      uranus: 3.4,
      neptune: 3.2,
    };

    // Construção das órbitas reais de cada planeta
    PLANETS_DATA.forEach((planet) => {
      const pGroup = new THREE.Group();
      scene.add(pGroup);

      // Raio semi-maior escalado
      // Distância logarítmica/calibrada para visualização harmoniosa no Three.js
      // a_scaled preserva as proporções e Kepler com elegância
      const a = Math.pow(planet.semiMajorAxisAU, 0.72) * AU_SCALE + 12;
      const e = planet.eccentricity;
      const b = a * Math.sqrt(1 - e * e); // Semi-eixo menor
      const c = a * e; // Deslocamento focal (Sol em um dos focos!)
      const incRad = (planet.inclinationDeg * Math.PI) / 180;

      // 7.1. Geometria da Órbita Elíptica Real
      const orbitSegments = 240;
      const orbitPoints: THREE.Vector3[] = [];

      for (let i = 0; i <= orbitSegments; i++) {
        const theta = (i / orbitSegments) * Math.PI * 2;
        // Equação da elipse com o Sol no foco (x = 0, z = 0):
        // Posição no plano orbital
        const xOrb = a * Math.cos(theta) - c;
        const zOrb = b * Math.sin(theta);
        // Rotação pela inclinação orbital em torno do eixo X
        const yRot = zOrb * Math.sin(incRad);
        const zRot = zOrb * Math.cos(incRad);

        orbitPoints.push(new THREE.Vector3(xOrb, yRot, zRot));
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(planet.visualColor).multiplyScalar(0.7),
        transparent: true,
        opacity: 0.38,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // 7.2. Planeta Mesh
      const pRadius = planetVisualRadii[planet.id] || 2.0;
      const pGeo = new THREE.SphereGeometry(pRadius, 36, 36);
      const getTex = planetTextureMap[planet.id];
      const pMat = new THREE.MeshStandardMaterial({
        map: getTex ? getTex() : undefined,
        roughness: 0.75,
        metalness: 0.1,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pGroup.add(pMesh);

      // Inclinação axial do planeta
      pMesh.rotation.z = (planet.axialTiltDeg * Math.PI) / 180;

      let cloudsMesh: THREE.Mesh | undefined;

      // Especial para a Terra: Nuvens e atmosfera
      if (planet.id === 'earth') {
        earthGroupRef.current = pGroup;
        earthMeshRef.current = pMesh;

        // Camada de nuvens translúcidas
        const cloudsGeo = new THREE.SphereGeometry(pRadius * 1.025, 36, 36);
        const cloudsMat = new THREE.MeshStandardMaterial({
          map: getEarthCloudsTexture(),
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
        });
        cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
        pGroup.add(cloudsMesh);
        earthCloudsMeshRef.current = cloudsMesh;

        // Brilho atmosférico sutil
        const atmosGeo = new THREE.SphereGeometry(pRadius * 1.055, 32, 32);
        const atmosMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide,
        });
        pGroup.add(new THREE.Mesh(atmosGeo, atmosMat));
      }

      // Especial para Saturno: Anéis majestosos em 3D
      if (planet.id === 'saturn' && planet.ringSystem) {
        const ringInner = pRadius * planet.ringSystem.innerRadiusScale;
        const ringOuter = pRadius * planet.ringSystem.outerRadiusScale;
        const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 64);

        // Ajustar coordenadas UV para anel concêntrico
        const pos = ringGeo.attributes.position;
        const uv = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const v = new THREE.Vector3().fromBufferAttribute(pos, i);
          const r = v.length();
          const normalizedR = (r - ringInner) / (ringOuter - ringInner);
          uv.setXY(i, normalizedR, 0.5);
        }

        const ringMat = new THREE.MeshStandardMaterial({
          map: getSaturnRingsTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
          roughness: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        pMesh.add(ringMesh);
      }

      // Especial para Urano: Anéis verticais tênues
      if (planet.id === 'uranus' && planet.ringSystem) {
        const ringInner = pRadius * 1.25;
        const ringOuter = pRadius * 1.6;
        const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x75c8d6,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.28,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        pMesh.add(ringMesh);
      }

      // Salva no registro
      const initialAngle = Math.random() * Math.PI * 2;
      planetMeshesRef.current.set(planet.id, {
        group: pGroup,
        mesh: pMesh,
        clouds: cloudsMesh,
        orbitLine,
        data: planet,
        trueAngle: initialAngle,
        pos: new THREE.Vector3(),
      });
    });

    // 8. Nuvem Instanciada de Satélites da Terra
    // Geometria compacta de ponto/cubo de satélite
    const satGeo = new THREE.BoxGeometry(0.045, 0.045, 0.045);
    const satMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const satInstMesh = new THREE.InstancedMesh(satGeo, satMat, maxSatellites);
    satInstMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    satInstMesh.count = Math.min(satelliteCount, maxSatellites);

    // Cores individuais por instância
    const dummyMatrix = new THREE.Matrix4();
    for (let i = 0; i < maxSatellites; i++) {
      dummyMatrix.setPosition(0, 0, 0);
      satInstMesh.setMatrixAt(i, dummyMatrix);
      const satData = satelliteDataRef.current[i];
      if (satData) {
        satInstMesh.setColorAt(i, satData.color);
      }
    }
    if (satInstMesh.instanceColor) {
      satInstMesh.instanceColor.needsUpdate = true;
    }

    if (earthGroupRef.current) {
      earthGroupRef.current.add(satInstMesh);
    }
    satelliteMeshRef.current = satInstMesh;

    // 8.1. Anel Geoestacionário (GEO Ring equatorial visível)
    const geoPoints: THREE.Vector3[] = [];
    const geoRadius = EARTH_RADIUS_UNITS * 6.61;
    for (let i = 0; i <= 120; i++) {
      const th = (i / 120) * Math.PI * 2;
      geoPoints.push(new THREE.Vector3(Math.cos(th) * geoRadius, 0, Math.sin(th) * geoRadius));
    }
    const geoGeo = new THREE.BufferGeometry().setFromPoints(geoPoints);
    const geoMat = new THREE.LineBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.28,
    });
    const geoRing = new THREE.Line(geoGeo, geoMat);
    if (earthGroupRef.current) {
      earthGroupRef.current.add(geoRing);
    }
    geoRingMeshRef.current = geoRing;

    // 8.2. Satélites Famosos com Órbitas e Marcadores Individuais
    FAMOUS_SATELLITES.forEach((famSat) => {
      // Cálculo do raio e inclinação na escala da cena
      let altR: number;
      if (famSat.orbitType === 'LEO') {
        altR = EARTH_RADIUS_UNITS * (1.0 + (famSat.altitudeKm / 6371.0) * 1.5);
      } else if (famSat.orbitType === 'GEO') {
        altR = EARTH_RADIUS_UNITS * 6.61;
      } else {
        altR = EARTH_RADIUS_UNITS * (1.0 + (famSat.altitudeKm / 6371.0) * 0.75);
      }

      const incR = (famSat.inclinationDeg * Math.PI) / 180;

      // Traçado da órbita do satélite famoso
      const fOrbitPts: THREE.Vector3[] = [];
      const segments = 90;
      for (let s = 0; s <= segments; s++) {
        const th = (s / segments) * Math.PI * 2;
        const x0 = altR * Math.cos(th);
        const z0 = altR * Math.sin(th);
        // Rotaciona pela inclinação orbital
        const yRot = z0 * Math.sin(incR);
        const zRot = z0 * Math.cos(incR);
        fOrbitPts.push(new THREE.Vector3(x0, yRot, zRot));
      }

      const fOrbitGeo = new THREE.BufferGeometry().setFromPoints(fOrbitPts);
      const fOrbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(famSat.color),
        transparent: true,
        opacity: 0.55,
      });
      const fOrbitLine = new THREE.Line(fOrbitGeo, fOrbitMat);

      // Marcador visual (pequena esfera brilhante)
      const fMarkerGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const fMarkerMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(famSat.color),
      });
      const fMarker = new THREE.Mesh(fMarkerGeo, fMarkerMat);

      if (earthGroupRef.current) {
        earthGroupRef.current.add(fOrbitLine);
        earthGroupRef.current.add(fMarker);
      }

      famousSatMarkersRef.current.set(famSat.id, {
        marker: fMarker,
        orbitLine: fOrbitLine,
        data: famSat,
        angle: Math.random() * Math.PI * 2,
      });
    });

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Limpeza ao desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [initSatelliteData]);

  // Atualização dinâmica do número de satélites e cores
  useEffect(() => {
    const satMesh = satelliteMeshRef.current;
    if (!satMesh) return;

    // Atualiza contagem ativa
    const countToRender = Math.min(Math.max(0, satelliteCount), maxSatellites);
    satMesh.count = countToRender;

    // Atualiza cores das instâncias baseado no modo escolhido
    const dummyColor = new THREE.Color();
    for (let i = 0; i < countToRender; i++) {
      const item = satelliteDataRef.current[i];
      if (!item) continue;

      if (colorMode === 'UNIFORM_GOLD') {
        dummyColor.setHex(0xfbbf24);
      } else if (colorMode === 'UNIFORM_CYAN') {
        dummyColor.setHex(0x38bdf8);
      } else {
        // BY_REGIME
        dummyColor.copy(item.color);
      }

      satMesh.setColorAt(i, dummyColor);
    }

    if (satMesh.instanceColor) {
      satMesh.instanceColor.needsUpdate = true;
    }
  }, [satelliteCount, colorMode]);

  // Visibilidade de Linhas Orbitais
  useEffect(() => {
    planetMeshesRef.current.forEach((val) => {
      val.orbitLine.visible = showOrbitPaths;
    });
    if (geoRingMeshRef.current) {
      geoRingMeshRef.current.visible = showOrbitPaths;
    }
  }, [showOrbitPaths]);

  // Atualização do Modo Visual (Alto Contraste / Brilho Noturno / Padrão) e Exposição
  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    if (!scene) return;

    // 1. Fundo e Nevoeiro
    if (sceneVisualMode === 'HIGH_CONTRAST') {
      scene.background = new THREE.Color(0x000000); // Breu total para contraste máximo
      scene.fog = null;
    } else if (sceneVisualMode === 'NIGHT_OBSERVATORY') {
      scene.background = new THREE.Color(0x0a0505); // Filtro avermelhado anti-ofuscamento
      scene.fog = new THREE.FogExp2(0x0a0505, 0.0008);
    } else {
      scene.background = new THREE.Color(0x030712); // Padrão espaço profundo
      scene.fog = new THREE.FogExp2(0x030712, 0.0007);
    }

    // 2. Estrelas de Fundo
    if (starfieldRef.current) {
      const starMat = starfieldRef.current.material as THREE.PointsMaterial;
      if (sceneVisualMode === 'HIGH_CONTRAST') {
        starMat.opacity = 0.35; // Estrelas tênues para dar foco total e contraste extremo às órbitas
      } else if (sceneVisualMode === 'NIGHT_OBSERVATORY') {
        starMat.opacity = 0.55;
      } else {
        starMat.opacity = 0.85;
      }
    }

    // 3. Iluminação e Exposição Geral da Cena 3D
    if (renderer) {
      const baseExposure = sceneVisualMode === 'HIGH_CONTRAST' ? 1.35 : sceneVisualMode === 'NIGHT_OBSERVATORY' ? 1.05 : 1.15;
      renderer.toneMappingExposure = baseExposure * sceneBrightness;
    }

    if (ambientLightRef.current) {
      if (sceneVisualMode === 'HIGH_CONTRAST') {
        ambientLightRef.current.color.setHex(0x64748b);
        ambientLightRef.current.intensity = 1.3 * sceneBrightness;
      } else if (sceneVisualMode === 'NIGHT_OBSERVATORY') {
        ambientLightRef.current.color.setHex(0x451a1a);
        ambientLightRef.current.intensity = 0.85 * sceneBrightness;
      } else {
        ambientLightRef.current.color.setHex(0x2d3748);
        ambientLightRef.current.intensity = 0.9 * sceneBrightness;
      }
    }

    if (sunPointLightRef.current) {
      if (sceneVisualMode === 'HIGH_CONTRAST') {
        sunPointLightRef.current.intensity = 5.6 * sceneBrightness;
      } else if (sceneVisualMode === 'NIGHT_OBSERVATORY') {
        sunPointLightRef.current.intensity = 3.6 * sceneBrightness;
      } else {
        sunPointLightRef.current.intensity = 4.2 * sceneBrightness;
      }
    }

    // 4. Trajetórias Orbitais dos Planetas e Anel GEO (Melhor contraste contra o fundo espacial)
    planetMeshesRef.current.forEach((val) => {
      const mat = val.orbitLine.material as THREE.LineBasicMaterial;
      if (sceneVisualMode === 'HIGH_CONTRAST') {
        mat.opacity = 0.95;
        mat.color.copy(new THREE.Color(val.data.accentColor).multiplyScalar(1.5));
      } else if (sceneVisualMode === 'NIGHT_OBSERVATORY') {
        mat.opacity = 0.82;
        mat.color.setHex(0xfb923c); // Laranja âmbar nítido de observatório
      } else {
        mat.opacity = 0.38;
        mat.color.copy(new THREE.Color(val.data.visualColor).multiplyScalar(0.7));
      }
      mat.needsUpdate = true;
    });

    if (geoRingMeshRef.current) {
      const geoMat = geoRingMeshRef.current.material as THREE.LineBasicMaterial;
      if (sceneVisualMode === 'HIGH_CONTRAST') {
        geoMat.opacity = 0.90;
        geoMat.color.setHex(0xf43f5e);
      } else if (sceneVisualMode === 'NIGHT_OBSERVATORY') {
        geoMat.opacity = 0.78;
        geoMat.color.setHex(0xf87171);
      } else {
        geoMat.opacity = 0.28;
        geoMat.color.setHex(0xec4899);
      }
      geoMat.needsUpdate = true;
    }
  }, [sceneVisualMode, sceneBrightness]);

  // Troca de Visão e Foco de Câmera
  useEffect(() => {
    if (viewMode === 'EARTH_SATELLITES') {
      // Posiciona a câmera próximo da Terra para visualização detalhada dos satélites
      cameraSphericalRef.current.radius = 16.5;
      cameraSphericalRef.current.phi = 1.15;
    } else if (viewMode === 'SOLAR_SYSTEM' && !selectedPlanetId) {
      // Visão ampla do Sistema Solar
      cameraSphericalRef.current.radius = 160;
      cameraSphericalRef.current.phi = 0.95;
      cameraTargetRef.current.set(0, 0, 0);
    }
  }, [viewMode, selectedPlanetId]);

  // Loop de Animação e Física Orbital
  useEffect(() => {
    let lastTime = performance.now();
    const tempMatrix = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempEuler = new THREE.Euler();
    const tempQuaternion = new THREE.Quaternion();

    const animate = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const simSpeed = isPaused ? 0 : timeSpeed;

      // 1. Atualiza órbitas planetárias reais
      planetMeshesRef.current.forEach((p) => {
        const planet = p.data;
        // Velocidade angular baseada no período orbital real (365 dias para a Terra = velocidade padrão)
        // dTheta = (2*PI / T_orbit_in_days) * delta * simSpeed
        const orbitalRadPerSec = (Math.PI * 2 / Math.max(15, planet.orbitalPeriodDays)) * 14.0 * simSpeed;
        p.trueAngle += orbitalRadPerSec * deltaSeconds;

        // Posição na elipse com o Sol no foco
        const a = Math.pow(planet.semiMajorAxisAU, 0.72) * AU_SCALE + 12;
        const e = planet.eccentricity;
        const b = a * Math.sqrt(1 - e * e);
        const c = a * e;
        const incRad = (planet.inclinationDeg * Math.PI) / 180;

        const xOrb = a * Math.cos(p.trueAngle) - c;
        const zOrb = b * Math.sin(p.trueAngle);
        const yRot = zOrb * Math.sin(incRad);
        const zRot = zOrb * Math.cos(incRad);

        p.group.position.set(xOrb, yRot, zRot);
        p.pos.copy(p.group.position);

        // Rotação do planeta em seu próprio eixo
        const rotSpeed = (Math.PI * 2 / Math.max(1, Math.abs(planet.rotationPeriodHours))) * 6.0;
        p.mesh.rotation.y += rotSpeed * deltaSeconds * (planet.rotationPeriodHours < 0 ? -1 : 1);

        if (p.clouds) {
          // Rotação das nuvens terrestres ligeiramente mais veloz
          p.clouds.rotation.y += rotSpeed * 1.15 * deltaSeconds;
        }
      });

      // 2. Atualiza a nuvem de satélites terrestres instanciados
      const satMesh = satelliteMeshRef.current;
      if (satMesh && satMesh.count > 0) {
        const count = satMesh.count;
        const filter = satelliteOrbitFilter;

        for (let i = 0; i < count; i++) {
          const sat = satelliteDataRef.current[i];
          if (!sat) continue;

          // Se estiver filtrado por regime, esconde instâncias fora do filtro
          const matchesFilter = filter === 'ALL' || sat.regime === filter;
          if (!matchesFilter) {
            tempMatrix.makeScale(0, 0, 0);
            satMesh.setMatrixAt(i, tempMatrix);
            continue;
          }

          // Propaga anomalia orbital com base na velocidade angular de Kepler
          sat.currentAnomalyRad += sat.angSpeed * deltaSeconds * (0.8 + simSpeed * 0.4);

          // Coordenadas esféricas na órbita inclinada:
          // x_orb = r * cos(M), z_orb = r * sin(M)
          const x0 = sat.r * Math.cos(sat.currentAnomalyRad);
          const z0 = sat.r * Math.sin(sat.currentAnomalyRad);

          // Rotação pela inclinação orbital
          const y1 = z0 * Math.sin(sat.inc);
          const z1 = z0 * Math.cos(sat.inc);

          // Rotação pela ascensão reta do nodo ascendente (RAAN)
          const cosR = Math.cos(sat.raan);
          const sinR = Math.sin(sat.raan);
          const xFinal = x0 * cosR - z1 * sinR;
          const zFinal = x0 * sinR + z1 * cosR;
          const yFinal = y1;

          tempPos.set(xFinal, yFinal, zFinal);
          tempEuler.set(0, 0, 0);
          tempQuaternion.setFromEuler(tempEuler);
          tempMatrix.compose(tempPos, tempQuaternion, new THREE.Vector3(1, 1, 1));

          satMesh.setMatrixAt(i, tempMatrix);
        }

        satMesh.instanceMatrix.needsUpdate = true;
      }

      // 3. Atualiza satélites famosos
      famousSatMarkersRef.current.forEach((f) => {
        let altR: number;
        if (f.data.orbitType === 'LEO') {
          altR = EARTH_RADIUS_UNITS * (1.0 + (f.data.altitudeKm / 6371.0) * 1.5);
        } else if (f.data.orbitType === 'GEO') {
          altR = EARTH_RADIUS_UNITS * 6.61;
        } else {
          altR = EARTH_RADIUS_UNITS * (1.0 + (f.data.altitudeKm / 6371.0) * 0.75);
        }

        const incR = (f.data.inclinationDeg * Math.PI) / 180;
        // Velocidade angular
        const speed = (Math.PI * 2 / (f.data.periodMinutes * 60)) * 600 * (1 + simSpeed * 0.5);
        f.angle += speed * deltaSeconds;

        const x0 = altR * Math.cos(f.angle);
        const z0 = altR * Math.sin(f.angle);
        const yRot = z0 * Math.sin(incR);
        const zRot = zOrbPlane(z0, incR);

        f.marker.position.set(x0, yRot, zRot);
      });

      function zOrbPlane(z: number, inc: number) {
        return z * Math.cos(inc);
      }

      // 4. Suavização da Câmera (Damping / Lerp)
      const camera = cameraRef.current;
      if (camera) {
        let targetLookAt = new THREE.Vector3(0, 0, 0);

        if (viewMode === 'EARTH_SATELLITES' && earthGroupRef.current) {
          targetLookAt.copy(earthGroupRef.current.position);
        } else if (selectedPlanetId) {
          const selectedP = planetMeshesRef.current.get(selectedPlanetId);
          if (selectedP) {
            targetLookAt.copy(selectedP.group.position);
          }
        }

        // Interpola suavemente o ponto focal da câmera
        cameraTargetRef.current.lerp(targetLookAt, 0.08);

        // Calcula a posição da câmera com coordenadas esféricas relativas ao ponto focal
        const sp = cameraSphericalRef.current;
        const camX = cameraTargetRef.current.x + sp.radius * Math.sin(sp.phi) * Math.sin(sp.theta);
        const camY = cameraTargetRef.current.y + sp.radius * Math.cos(sp.phi);
        const camZ = cameraTargetRef.current.z + sp.radius * Math.sin(sp.phi) * Math.cos(sp.theta);

        cameraPositionDesiredRef.current.set(camX, camY, camZ);
        camera.position.lerp(cameraPositionDesiredRef.current, 0.08);
        camera.lookAt(cameraTargetRef.current);
      }

      // 5. Render
      if (rendererRef.current && sceneRef.current && camera) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPaused, timeSpeed, satelliteOrbitFilter, viewMode, selectedPlanetId]);

  // Tratamento de Interação do Mouse / Touch para Órbita da Câmera
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isUserInteractingRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isUserInteractingRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };

    const sp = cameraSphericalRef.current;
    sp.theta -= dx * 0.006;
    sp.phi = Math.max(0.08, Math.min(Math.PI - 0.08, sp.phi - dy * 0.006));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isUserInteractingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sp = cameraSphericalRef.current;
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    const minRadius = viewMode === 'EARTH_SATELLITES' ? 4.8 : 8.0;
    const maxRadius = 450;
    sp.radius = Math.max(minRadius, Math.min(maxRadius, sp.radius * zoomFactor));
  };

  // Raycasting para clique em planetas e satélites
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!container || !camera || !scene) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Testa colisão com planetas
    const planetMeshesList: THREE.Mesh[] = [];
    planetMeshesRef.current.forEach((p) => {
      planetMeshesList.push(p.mesh);
    });

    const intersects = raycaster.intersectObjects(planetMeshesList, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      // Procura qual planeta foi clicado
      for (const [pId, pVal] of planetMeshesRef.current.entries()) {
        if (pVal.mesh === hitMesh) {
          if (pId === 'earth') {
            onViewModeChange('EARTH_SATELLITES');
          }
          onSelectPlanet(pVal.data);
          return;
        }
      }
    }
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      {/* Indicador de Modo de Câmera e Visual na base */}
      <div className="absolute top-16 left-6 pointer-events-none z-10 flex flex-col gap-1 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MODO: {viewMode === 'EARTH_SATELLITES' ? 'FOCO NA TERRA & SATÉLITES' : 'SISTEMA SOLAR (ÓRBITAS REAIS)'}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400/90">
          <span className="text-sky-400 font-semibold">
            {sceneVisualMode === 'HIGH_CONTRAST' ? '⚡ ALTO CONTRASTE (VÁCUO TOTAL)' : sceneVisualMode === 'NIGHT_OBSERVATORY' ? '🔭 BRILHO NOTURNO (OBSERVATÓRIO)' : '🌌 PADRÃO CÓSMICO'}
          </span>
          <span>·</span>
          <span>BRILHO: {Math.round(sceneBrightness * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
