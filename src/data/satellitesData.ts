export interface FamousSatellite {
  id: string;
  name: string;
  operator: string;
  country: string;
  orbitType: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  altitudeKm: number;
  inclinationDeg: number;
  periodMinutes: number;
  orbitalSpeedKmS: number;
  launchYear: number;
  role: string;
  description: string;
  color: string;
}

export const REAL_SATELLITE_STATISTICS = {
  // Dados consolidados ESA Space Debris Office, UCS Satellite Database & CelesTrak (2025/2026)
  realActiveSatellites: 10650,
  trackedDebrisAndInactive: 36500,
  leoCount: 9320,  // ~87.5% - Low Earth Orbit (160 - 2.000 km)
  meoCount: 266,   // ~2.5%  - Medium Earth Orbit (2.000 - 35.786 km)
  geoCount: 618,   // ~5.8%  - Geostationary Orbit (~35.786 km)
  heoCount: 446,   // ~4.2%  - Highly Elliptical & Polar
  // Constelações dominantes
  starlinkActiveCount: 6850,
  oneWebActiveCount: 648,
  kuiperTestCount: 45,
  globalNavigationSatellites: 128, // GPS, Galileo, GLONASS, BeiDou
};

export const FAMOUS_SATELLITES: FamousSatellite[] = [
  {
    id: 'iss',
    name: 'Estação Espacial Internacional (ISS)',
    operator: 'NASA / ESA / Roscosmos / JAXA / CSA',
    country: 'Internacional',
    orbitType: 'LEO',
    altitudeKm: 420,
    inclinationDeg: 51.64,
    periodMinutes: 92.68,
    orbitalSpeedKmS: 7.66,
    launchYear: 1998,
    role: 'Laboratório Orbital Habitado',
    description: 'A maior estrutura já construída pelo ser humano no espaço, permanentemente habitada por astronautas desde novembro de 2000.',
    color: '#38bdf8'
  },
  {
    id: 'hubble',
    name: 'Telescópio Espacial Hubble (HST)',
    operator: 'NASA / ESA',
    country: 'EUA / Europa',
    orbitType: 'LEO',
    altitudeKm: 540,
    inclinationDeg: 28.47,
    periodMinutes: 95.42,
    orbitalSpeedKmS: 7.59,
    launchYear: 1990,
    role: 'Astrofísica e Observação Cósmica',
    description: 'Revolucionou a astronomia ao fornecer imagens ultra-profundas do universo sem a distorção da atmosfera terrestre.',
    color: '#a855f7'
  },
  {
    id: 'starlink',
    name: 'Constelação Starlink (Exemplo LEO)',
    operator: 'SpaceX',
    country: 'EUA',
    orbitType: 'LEO',
    altitudeKm: 550,
    inclinationDeg: 53.05,
    periodMinutes: 95.6,
    orbitalSpeedKmS: 7.58,
    launchYear: 2019,
    role: 'Internet Banda Larga Global',
    description: 'Mais de 6.800 satélites operacionais interligados por laser formando a maior constelação da história.',
    color: '#22c55e'
  },
  {
    id: 'tiangong',
    name: 'Estação Espacial Tiangong (CSS)',
    operator: 'CNSA',
    country: 'China',
    orbitType: 'LEO',
    altitudeKm: 390,
    inclinationDeg: 41.47,
    periodMinutes: 92.1,
    orbitalSpeedKmS: 7.68,
    launchYear: 2021,
    role: 'Estação Espacial Chinesa',
    description: 'Estação orbital modular chinesa tripulada continuamente por taikonautas com laboratórios Wentian e Mengtian.',
    color: '#f97316'
  },
  {
    id: 'gps',
    name: 'GPS NAVSTAR IIF (Navegação Global)',
    operator: 'US Space Force',
    country: 'EUA',
    orbitType: 'MEO',
    altitudeKm: 20200,
    inclinationDeg: 55.0,
    periodMinutes: 718.0, // 11h 58min
    orbitalSpeedKmS: 3.87,
    launchYear: 2014,
    role: 'Posicionamento e Navegação Global',
    description: 'Constelação de 31 satélites em 6 planos orbitais garantindo precisão métrica de localização em qualquer lugar do globo.',
    color: '#eab308'
  },
  {
    id: 'galileo',
    name: 'Galileo FOC (Navegação Civil Europeia)',
    operator: 'ESA / EUSPA',
    country: 'União Europeia',
    orbitType: 'MEO',
    altitudeKm: 23222,
    inclinationDeg: 56.0,
    periodMinutes: 844.0, // 14h 04min
    orbitalSpeedKmS: 3.67,
    launchYear: 2016,
    role: 'Posicionamento de Alta Precisão',
    description: 'Sistema europeu de navegação por satélite, o mais preciso do mundo, sob controle estritamente civil.',
    color: '#3b82f6'
  },
  {
    id: 'goes16',
    name: 'GOES-16 (East Geostationary Weather)',
    operator: 'NOAA / NASA',
    country: 'EUA',
    orbitType: 'GEO',
    altitudeKm: 35786,
    inclinationDeg: 0.05,
    periodMinutes: 1436.0, // 23h 56min (Sincronizado com rotação da Terra)
    orbitalSpeedKmS: 3.07,
    launchYear: 2016,
    role: 'Monitoramento Meteorológico e Furacões',
    description: 'Permanece fixo sobre a mesma longitude na linha do Equador, gerando imagens a cada 30 segundos das Américas e tempestades.',
    color: '#ec4899'
  },
  {
    id: 'brasilsat',
    name: 'SGDC-1 (Satélite Geoestacionário Brasileiro)',
    operator: 'Telebras / Min. Defesa',
    country: 'Brasil',
    orbitType: 'GEO',
    altitudeKm: 35786,
    inclinationDeg: 0.02,
    periodMinutes: 1436.1,
    orbitalSpeedKmS: 3.07,
    launchYear: 2017,
    role: 'Banda Larga Nacional e Defesa Estratégica',
    description: 'Satélite geoestacionário de defesa e comunicações estratégicas do Brasil, posicionado na longitude 75° Oeste.',
    color: '#10b981'
  }
];

export interface GeneratedSatelliteInstance {
  id: number;
  orbitType: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  altitudeRatio: number; // Ratio em relação ao raio terrestre (R_earth = 1.0)
  inclinationRad: number; // Inclinação orbital
  raanRad: number;        // Ascensão reta do nodo ascendente
  speedRadPerSec: number; // Velocidade angular orbital
  currentAnomalyRad: number; // Posição angular atual
  colorHex: number;
}
