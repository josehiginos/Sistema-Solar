export interface PlanetData {
  id: string;
  name: string;
  portugueseName: string;
  type: 'estrela' | 'rochoso' | 'gigante_gasoso' | 'gigante_gelo';
  semiMajorAxisAU: number; // Distância média do Sol em UA
  eccentricity: number;     // Excentricidade da órbita real
  inclinationDeg: number;   // Inclinação orbital em graus
  orbitalPeriodDays: number;// Período orbital em dias terrestres
  orbitalSpeedKmS: number;  // Velocidade orbital média (km/s)
  diameterKm: number;       // Diâmetro equatorial em km
  rotationPeriodHours: number; // Período de rotação em horas
  axialTiltDeg: number;     // Inclinação axial (graus)
  meanTemperatureC: number; // Temperatura média em °C
  gravityM_S2: number;      // Gravidade superficial (m/s²)
  moonsCount: number;       // Número de luas conhecidas
  visualColor: string;      // Cor representativa
  accentColor: string;
  ringSystem?: {
    innerRadiusScale: number;
    outerRadiusScale: number;
    opacity: number;
  };
  description: string;
  atmosphere: string;
  curiosity: string;
}

export const PLANETS_DATA: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    portugueseName: 'Mercúrio',
    type: 'rochoso',
    semiMajorAxisAU: 0.387,
    eccentricity: 0.2056,
    inclinationDeg: 7.00,
    orbitalPeriodDays: 87.97,
    orbitalSpeedKmS: 47.36,
    diameterKm: 4879,
    rotationPeriodHours: 1407.6, // 58.6 dias
    axialTiltDeg: 0.03,
    meanTemperatureC: 167,
    gravityM_S2: 3.7,
    moonsCount: 0,
    visualColor: '#8a8a8f',
    accentColor: '#94a3b8',
    description: 'O planeta mais interno e veloz do Sistema Solar. Possui uma superfície repleta de crateras semelhante à da Lua e uma das órbitas mais excêntricas.',
    atmosphere: 'Exosfera tênue (oxigênio, sódio, hidrogênio, hélio)',
    curiosity: 'Um ano em Mercúrio dura apenas 88 dias terrestres, mas um ciclo de dia e noite demora quase 176 dias terrestres!'
  },
  {
    id: 'venus',
    name: 'Venus',
    portugueseName: 'Vênus',
    type: 'rochoso',
    semiMajorAxisAU: 0.723,
    eccentricity: 0.0067,
    inclinationDeg: 3.39,
    orbitalPeriodDays: 224.7,
    orbitalSpeedKmS: 35.02,
    diameterKm: 12104,
    rotationPeriodHours: -5832.5, // 243 dias retrógrado
    axialTiltDeg: 177.36,
    meanTemperatureC: 464,
    gravityM_S2: 8.87,
    moonsCount: 0,
    visualColor: '#e0ae6f',
    accentColor: '#f59e0b',
    description: 'O planeta mais quente do Sistema Solar, envolvido por uma densa atmosfera tóxica de dióxido de carbono que produz um efeito estufa descontrolado.',
    atmosphere: '96.5% CO₂, 3.5% Nitrogênio, nuvens espessas de ácido sulfúrico',
    curiosity: 'Gira no sentido horário (retrógrado) de forma tão lenta que seu dia é mais longo que seu ano!'
  },
  {
    id: 'earth',
    name: 'Earth',
    portugueseName: 'Terra',
    type: 'rochoso',
    semiMajorAxisAU: 1.000,
    eccentricity: 0.0167,
    inclinationDeg: 0.00,
    orbitalPeriodDays: 365.256,
    orbitalSpeedKmS: 29.78,
    diameterKm: 12742,
    rotationPeriodHours: 23.934,
    axialTiltDeg: 23.44,
    meanTemperatureC: 15,
    gravityM_S2: 9.807,
    moonsCount: 1, // A Lua (+ milhares de satélites artificiais)
    visualColor: '#2b82c9',
    accentColor: '#0ea5e9',
    description: 'O único mundo conhecido com vida e água líquida superficial abundante. Abriga também a colossal infraestrutura espacial humana com mais de 10.000 satélites ativos.',
    atmosphere: '78.08% Nitrogênio, 20.95% Oxigênio, 0.93% Argônio, 0.04% CO₂',
    curiosity: 'Possui atualmente mais de 10.600 satélites artificiais operacionais orbitando ao seu redor, formando a espinha dorsal de telecomunicações e observação do planeta.'
  },
  {
    id: 'mars',
    name: 'Mars',
    portugueseName: 'Marte',
    type: 'rochoso',
    semiMajorAxisAU: 1.524,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    orbitalPeriodDays: 686.98,
    orbitalSpeedKmS: 24.07,
    diameterKm: 6779,
    rotationPeriodHours: 24.623,
    axialTiltDeg: 25.19,
    meanTemperatureC: -63,
    gravityM_S2: 3.72,
    moonsCount: 2, // Fobos e Deimos
    visualColor: '#c1440e',
    accentColor: '#ef4444',
    description: 'O Planeta Vermelho, rico em óxidos de ferro, com leitos de rios secos, calotas polares de gelo e o Monte Olimpo, o maior vulcão do Sistema Solar.',
    atmosphere: '95.3% CO₂, 2.6% Nitrogênio, 1.9% Argônio',
    curiosity: 'Abriga o Olympus Mons com 21,9 km de altura, quase 2,5 vezes a altitude do Monte Everest!'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    portugueseName: 'Júpiter',
    type: 'gigante_gasoso',
    semiMajorAxisAU: 5.204,
    eccentricity: 0.0485,
    inclinationDeg: 1.30,
    orbitalPeriodDays: 4332.59, // ~11.86 anos
    orbitalSpeedKmS: 13.07,
    diameterKm: 139820,
    rotationPeriodHours: 9.925,
    axialTiltDeg: 3.13,
    meanTemperatureC: -110,
    gravityM_S2: 24.79,
    moonsCount: 95,
    visualColor: '#bca188',
    accentColor: '#d97706',
    description: 'O maior planeta do Sistema Solar, possuindo mais que o dobro da massa de todos os outros planetas combinados e a famosa Grande Mancha Vermelha.',
    atmosphere: '89.8% Hidrogênio, 10.2% Hélio, traços de metano e amônia',
    curiosity: 'Possui a rotação mais rápida do Sistema Solar (um dia dura menos de 10 horas) e um campo magnético 20.000 vezes mais forte que o da Terra.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    portugueseName: 'Saturno',
    type: 'gigante_gasoso',
    semiMajorAxisAU: 9.582,
    eccentricity: 0.0555,
    inclinationDeg: 2.49,
    orbitalPeriodDays: 10759.22, // ~29.45 anos
    orbitalSpeedKmS: 9.69,
    diameterKm: 116460,
    rotationPeriodHours: 10.656,
    axialTiltDeg: 26.73,
    meanTemperatureC: -140,
    gravityM_S2: 10.44,
    moonsCount: 146,
    visualColor: '#e2bf7d',
    accentColor: '#eab308',
    ringSystem: {
      innerRadiusScale: 1.25,
      outerRadiusScale: 2.35,
      opacity: 0.85,
    },
    description: 'A joia dos anéis do Sistema Solar. Possui um complexo e majestoso sistema de anéis composto por bilhões de pedaços de gelo e rocha.',
    atmosphere: '96.3% Hidrogênio, 3.25% Hélio, traços de metano',
    curiosity: 'A densidade média de Saturno é de apenas 0,687 g/cm³ — se existisse uma banheira gigante de água, Saturno flutuaria!'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    portugueseName: 'Urano',
    type: 'gigante_gelo',
    semiMajorAxisAU: 19.22,
    eccentricity: 0.0463,
    inclinationDeg: 0.77,
    orbitalPeriodDays: 30685.4, // ~84 anos
    orbitalSpeedKmS: 6.81,
    diameterKm: 50724,
    rotationPeriodHours: -17.24, // retrógrado
    axialTiltDeg: 97.77, // Rola de lado!
    meanTemperatureC: -195,
    gravityM_S2: 8.69,
    moonsCount: 28,
    visualColor: '#72b5c8',
    accentColor: '#06b6d4',
    ringSystem: {
      innerRadiusScale: 1.3,
      outerRadiusScale: 1.7,
      opacity: 0.35,
    },
    description: 'O gigante de gelo com a rotação mais peculiar: gira praticamente deitado em relação ao seu plano orbital, provocando estações extremas de 42 anos.',
    atmosphere: '82.5% Hidrogênio, 15.2% Hélio, 2.3% Metano',
    curiosity: 'Sua cor azul-esverdeada é causada pelo gás metano na atmosfera superior, que absorve os comprimentos de onda de luz vermelha.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    portugueseName: 'Netuno',
    type: 'gigante_gelo',
    semiMajorAxisAU: 30.05,
    eccentricity: 0.0095,
    inclinationDeg: 1.77,
    orbitalPeriodDays: 60189.0, // ~164.8 anos
    orbitalSpeedKmS: 5.43,
    diameterKm: 49244,
    rotationPeriodHours: 16.11,
    axialTiltDeg: 28.32,
    meanTemperatureC: -201,
    gravityM_S2: 11.15,
    moonsCount: 16,
    visualColor: '#2b5ea8',
    accentColor: '#3b82f6',
    ringSystem: {
      innerRadiusScale: 1.2,
      outerRadiusScale: 1.5,
      opacity: 0.25,
    },
    description: 'O planeta mais distante do Sistema Solar, um mundo gelado e dinâmico com os ventos supersônicos mais violentos conhecidos, ultrapassando 2.000 km/h.',
    atmosphere: '80% Hidrogênio, 19% Hélio, 1.5% Metano',
    curiosity: 'Foi o primeiro planeta cuja existência foi prevista matematicamente por Urbain Le Verrier antes de ser observado através de um telescópio!'
  }
];

export const SUN_DATA = {
  id: 'sun',
  name: 'Sun',
  portugueseName: 'Sol',
  type: 'estrela' as const,
  diameterKm: 1392700,
  massKg: '1.989 × 10³⁰ kg',
  surfaceTemperatureK: 5778,
  coreTemperatureK: 15700000,
  rotationPeriodDays: 25.38,
  spectralClass: 'G2V (Anã Amarela)',
  description: 'A estrela no centro do Sistema Solar que concentra 99,86% de toda a massa do sistema, fornecendo luz, calor e a atração gravitacional que rege as órbitas dos planetas.'
};
