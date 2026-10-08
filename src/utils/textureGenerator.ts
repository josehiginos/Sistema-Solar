import * as THREE from 'three';

// Cache para evitar recriação desnecessária de texturas
const textureCache: Record<string, THREE.CanvasTexture> = {};

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/**
 * Textura procedural do Sol com granulação de plasma
 */
export function getSunTexture(): THREE.CanvasTexture {
  if (textureCache['sun']) return textureCache['sun'];

  const [canvas, ctx] = createCanvas(1024, 512);

  // Fundo base gradiente quente
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ff9900');
  grad.addColorStop(0.5, '#ffcc00');
  grad.addColorStop(1, '#ff6600');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Granulação de plasma solar
  const imgData = ctx.getImageData(0, 0, 1024, 512);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % 1024;
    const y = Math.floor((i / 4) / 1024);

    const noise1 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
    const noise2 = Math.sin(x * 0.12 + noise1 * 2) * Math.cos(y * 0.12);
    const factor = (noise1 * 0.6 + noise2 * 0.4 + 1) * 0.5;

    // Variação de calor e manchas solares
    data[i] = Math.min(255, Math.floor(255 * (0.85 + factor * 0.15))); // R
    data[i + 1] = Math.min(255, Math.floor(180 + factor * 65));        // G
    data[i + 2] = Math.min(255, Math.floor(20 + factor * 70));         // B
  }

  ctx.putImageData(imgData, 0, 0);

  // Manchas solares dinâmicas
  ctx.fillStyle = 'rgba(180, 50, 0, 0.4)';
  for (let s = 0; s < 14; s++) {
    const sx = Math.random() * 1024;
    const sy = 120 + Math.random() * 270;
    const sr = 6 + Math.random() * 16;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['sun'] = texture;
  return texture;
}

/**
 * Textura procedural da Terra (Oceanos, Continentes e Calotas Polares)
 */
export function getEarthTexture(): THREE.CanvasTexture {
  if (textureCache['earth']) return textureCache['earth'];

  const [canvas, ctx] = createCanvas(2048, 1024);

  // Oceanos profundos
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#0d3b66');
  oceanGrad.addColorStop(1, '#0a2342');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Calotas de gelo
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, 2048, 70); // Ártico
  ctx.fillRect(0, 950, 2048, 74); // Antártica

  // Continentes estilizados precisos
  ctx.fillStyle = '#2d6a4f';

  // Função auxiliar para desenhar massas de terra
  const drawLandBlob = (cx: number, cy: number, rx: number, ry: number, rotation: number = 0) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Américas
  drawLandBlob(580, 320, 160, 110, -0.2); // América do Norte
  drawLandBlob(540, 220, 110, 80, 0.1);   // Canadá / Alasca
  drawLandBlob(680, 620, 120, 190, 0.15); // América do Sul
  drawLandBlob(600, 480, 50, 25, 0.5);    // América Central

  // Eurásia
  drawLandBlob(1150, 310, 140, 100, 0.05); // Europa
  drawLandBlob(1420, 300, 240, 120, -0.1); // Sibéria / Rússia
  drawLandBlob(1500, 440, 150, 90, 0.2);   // Leste Asiático / China
  drawLandBlob(1340, 480, 90, 80, 0.4);    // Índia

  // África
  drawLandBlob(1120, 550, 130, 170, 0.08); // África

  // Oceania
  drawLandBlob(1700, 680, 110, 75, -0.1);  // Austrália

  // Detalhes de deserto (Saara, Outback, Gobi)
  ctx.fillStyle = '#b78c43';
  drawLandBlob(1120, 470, 110, 55, 0);     // Saara
  drawLandBlob(1460, 380, 80, 35, 0);      // Gobi
  drawLandBlob(1700, 680, 60, 40, 0);      // Deserto Australiano

  // Vegetação e relevo
  ctx.fillStyle = '#1b4332';
  drawLandBlob(670, 580, 95, 120, 0.2);    // Amazônia
  drawLandBlob(1130, 590, 80, 80, 0);      // Floresta do Congo

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['earth'] = texture;
  return texture;
}

/**
 * Textura procedural de nuvens transparentes da Terra
 */
export function getEarthCloudsTexture(): THREE.CanvasTexture {
  if (textureCache['earth_clouds']) return textureCache['earth_clouds'];

  const [canvas, ctx] = createCanvas(1024, 512);
  ctx.clearRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';

  // Espirais e faixas de ciclones e nuvens atmosféricas
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const rx = 40 + Math.random() * 120;
    const ry = 15 + Math.random() * 35;
    const rot = (Math.random() - 0.5) * 0.8;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['earth_clouds'] = texture;
  return texture;
}

/**
 * Textura procedural de Marte
 */
export function getMarsTexture(): THREE.CanvasTexture {
  if (textureCache['mars']) return textureCache['mars'];

  const [canvas, ctx] = createCanvas(1024, 512);

  // Poeira de óxido de ferro ferruginosa
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#c1440e');
  grad.addColorStop(0.5, '#d9531e');
  grad.addColorStop(1, '#a33306');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Calotas polares de dióxido de carbono/água
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 25);
  ctx.fillRect(0, 490, 1024, 22);

  // Manchas escuras de rocha basáltica (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = 'rgba(70, 25, 10, 0.45)';
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 1024;
    const y = 100 + Math.random() * 320;
    const rx = 30 + Math.random() * 80;
    const ry = 20 + Math.random() * 50;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['mars'] = texture;
  return texture;
}

/**
 * Textura procedural de Júpiter com faixas gasosas e a Grande Mancha Vermelha
 */
export function getJupiterTexture(): THREE.CanvasTexture {
  if (textureCache['jupiter']) return textureCache['jupiter'];

  const [canvas, ctx] = createCanvas(1024, 512);

  // Faixas atmosféricas paralelas
  const bands = [
    '#9e7b5a', '#cbb69d', '#8c603e', '#e4d3be', '#734426',
    '#dfcdb6', '#a1724d', '#c2a482', '#6b3e21', '#e2cfba'
  ];

  const bandH = 512 / bands.length;
  bands.forEach((c, idx) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, idx * bandH, 1024, bandH + 2);
  });

  // Turbulência de borda nas zonas
  for (let y = 0; y < 512; y += 12) {
    ctx.fillStyle = `rgba(${Math.floor(180 + Math.random() * 60)}, ${Math.floor(120 + Math.random() * 40)}, 80, 0.25)`;
    for (let x = 0; x < 1024; x += 30) {
      ctx.fillRect(x + Math.sin(y) * 8, y, 22, 6);
    }
  }

  // Grande Mancha Vermelha (Great Red Spot)
  ctx.save();
  ctx.translate(620, 310);
  ctx.rotate(-0.08);
  const spotGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 45);
  spotGrad.addColorStop(0, '#cc3b22');
  spotGrad.addColorStop(0.7, '#d65b38');
  spotGrad.addColorStop(1, 'rgba(214, 91, 56, 0)');
  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 52, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['jupiter'] = texture;
  return texture;
}

/**
 * Textura procedural de Saturno (Planeta)
 */
export function getSaturnTexture(): THREE.CanvasTexture {
  if (textureCache['saturn']) return textureCache['saturn'];

  const [canvas, ctx] = createCanvas(1024, 512);

  const bands = [
    '#ceb888', '#decfa6', '#c4ad7b', '#ebdcb7', '#bca36f',
    '#e5d5ae', '#c8b180', '#dfcca0', '#baa16d', '#decda1'
  ];

  const bandH = 512 / bands.length;
  bands.forEach((c, idx) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, idx * bandH, 1024, bandH + 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['saturn'] = texture;
  return texture;
}

/**
 * Textura procedural dos Anéis de Saturno com Divisão de Cassini
 */
export function getSaturnRingsTexture(): THREE.CanvasTexture {
  if (textureCache['saturn_rings']) return textureCache['saturn_rings'];

  // Para anéis, criamos um gradiente radial 1D que mapeia de raio interno a externo
  const [canvas, ctx] = createCanvas(512, 64);

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  // Anel C interno (tênue)
  grad.addColorStop(0.0, 'rgba(150, 130, 95, 0.05)');
  grad.addColorStop(0.15, 'rgba(180, 160, 120, 0.45)');
  // Anel B (denso e brilhante)
  grad.addColorStop(0.2, 'rgba(225, 205, 160, 0.95)');
  grad.addColorStop(0.55, 'rgba(235, 215, 175, 0.9)');
  // Divisão de Cassini (abertura escura)
  grad.addColorStop(0.58, 'rgba(20, 15, 10, 0.05)');
  grad.addColorStop(0.63, 'rgba(20, 15, 10, 0.05)');
  // Anel A
  grad.addColorStop(0.66, 'rgba(210, 190, 150, 0.85)');
  grad.addColorStop(0.92, 'rgba(190, 170, 130, 0.65)');
  // Encke division e borda externa
  grad.addColorStop(0.96, 'rgba(30, 25, 20, 0.1)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 64);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache['saturn_rings'] = texture;
  return texture;
}

/**
 * Textura procedural de Vênus
 */
export function getVenusTexture(): THREE.CanvasTexture {
  if (textureCache['venus']) return textureCache['venus'];

  const [canvas, ctx] = createCanvas(512, 256);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#d9a74a');
  grad.addColorStop(0.5, '#edd28d');
  grad.addColorStop(1, '#c9963e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Faixas atmosféricas suaves
  ctx.fillStyle = 'rgba(255, 240, 200, 0.25)';
  for (let i = 0; i < 16; i++) {
    const y = Math.random() * 256;
    ctx.fillRect(0, y, 512, 8 + Math.random() * 14);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['venus'] = texture;
  return texture;
}

/**
 * Textura procedural de Mercúrio
 */
export function getMercuryTexture(): THREE.CanvasTexture {
  if (textureCache['mercury']) return textureCache['mercury'];

  const [canvas, ctx] = createCanvas(512, 256);
  ctx.fillStyle = '#7a7a82';
  ctx.fillRect(0, 0, 512, 256);

  // Crateras lunares / mercurianas
  ctx.fillStyle = 'rgba(40, 40, 45, 0.35)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 3 + Math.random() * 14;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache['mercury'] = texture;
  return texture;
}

/**
 * Textura procedural de Urano
 */
export function getUranusTexture(): THREE.CanvasTexture {
  if (textureCache['uranus']) return textureCache['uranus'];

  const [canvas, ctx] = createCanvas(512, 256);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#75c8d6');
  grad.addColorStop(0.5, '#99e0ec');
  grad.addColorStop(1, '#68b9c8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  textureCache['uranus'] = texture;
  return texture;
}

/**
 * Textura procedural de Netuno
 */
export function getNeptuneTexture(): THREE.CanvasTexture {
  if (textureCache['neptune']) return textureCache['neptune'];

  const [canvas, ctx] = createCanvas(512, 256);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#1c4596');
  grad.addColorStop(0.5, '#2f68cc');
  grad.addColorStop(1, '#153980');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Faixas cirros brancas de metano de alta altitude
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillRect(0, 110, 512, 6);
  ctx.fillRect(0, 160, 512, 4);

  // Grande Mancha Escura (Dark Spot)
  ctx.fillStyle = 'rgba(10, 25, 65, 0.6)';
  ctx.beginPath();
  ctx.ellipse(320, 130, 36, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  textureCache['neptune'] = texture;
  return texture;
}
