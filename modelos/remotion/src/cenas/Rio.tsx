import React from 'react';
import {random} from 'remotion';

// Série "rio de luz" (prosperidade): 5 cenas desenhadas em código, 1080x1350.
export type CenaRio = 'parado' | 'fios' | 'nos' | 'amanhecer' | 'livre';
const W = 1080, H = 1350;

// Mulher de costas: cabelo escuro até os ombros, vestido longo de linho
const Mulher: React.FC<{x: number; y: number; s: number; cor: string; cabelo: string; passo?: boolean}> = ({x, y, s, cor, cabelo, passo}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -9 -150 C -26 -150 -30 -130 -28 -112 C -26 -96 -22 -88 -18 -84 L 18 -84 C 22 -88 26 -96 28 -112 C 30 -130 26 -150 9 -150 Z" fill={cabelo} />
    <path d={passo
      ? 'M -26 -86 C -40 -80 -44 -60 -42 -30 C -44 10 -52 60 -60 110 L 64 110 C 50 60 44 10 42 -30 C 44 -60 40 -80 26 -86 Z'
      : 'M -26 -86 C -40 -80 -44 -60 -42 -30 C -44 10 -50 60 -54 110 L 54 110 C 50 60 44 10 42 -30 C 44 -60 40 -80 26 -86 Z'} fill={cor} />
    <path d="M -42 -60 C -50 -20 -50 10 -46 30 M 42 -60 C 50 -20 50 10 46 30" stroke={cor} strokeWidth={10} strokeLinecap="round" fill="none" />
  </g>
);

const Colinas: React.FC<{cor1: string; cor2: string; base: number}> = ({cor1, cor2, base}) => (
  <>
    <path d={`M 0 ${base - 120} C 200 ${base - 220} 380 ${base - 160} 540 ${base - 190} C 720 ${base - 230} 880 ${base - 150} 1080 ${base - 210} L 1080 ${H} L 0 ${H} Z`} fill={cor2} />
    <path d={`M 0 ${base - 40} C 240 ${base - 120} 460 ${base - 40} 640 ${base - 90} C 820 ${base - 140} 960 ${base - 60} 1080 ${base - 100} L 1080 ${H} L 0 ${H} Z`} fill={cor1} />
  </>
);

// Rio: faixa que serpenteia da base até o horizonte
const rioPath = (h: number, base: number) => `M 400 ${H} C 470 ${base + 80} 690 ${base + 10} 570 ${h} L 590 ${h} C 740 ${base} 600 ${base + 90} 720 ${H} Z`;
const Ondas: React.FC<{base: number; cor: string; n: number; seed: string; op: number}> = ({base, cor, n, seed, op}) => (
  <>{Array.from({length: n}).map((_, k) => { const t = random(seed + k); const y = base - 120 + t * (H - base + 120); const x = 560 + Math.sin(t * 6) * 70 - 20 + (random(seed + 'x' + k) - 0.5) * (40 + t * 160); return <path key={k} d={`M ${x} ${y} q ${10 + t * 18} -4 ${20 + t * 36} 0`} stroke={cor} strokeWidth={1.4 + t * 1.4} fill="none" opacity={op} />; })}</>
);

const Brilhos: React.FC<{n: number; cor: string; area: [number, number, number, number]; seed: string; max?: number; op?: number}> = ({n, cor, area, seed, max = 3, op = 0.8}) => (
  <>{Array.from({length: n}).map((_, k) => (
    <circle key={k} cx={area[0] + random(seed + 'x' + k) * area[2]} cy={area[1] + random(seed + 'y' + k) * area[3]} r={0.8 + random(seed + 'r' + k) * max} fill={cor} opacity={op * (0.3 + random(seed + 'o' + k) * 0.7)} />
  ))}</>
);

export const Rio: React.FC<{cena: CenaRio}> = ({cena}) => {
  const defs = (
    <defs>
      <filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      <filter id="bl"><feGaussianBlur stdDeviation="30" /></filter>
      <filter id="bl2"><feGaussianBlur stdDeviation="8" /></filter>
      <linearGradient id="rioEsc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#5E5132" stopOpacity="0.8" /><stop offset="1" stopColor="#C9A24A" stopOpacity="0.2" /></linearGradient>
      <linearGradient id="rioClaro" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#E8C877" /><stop offset="1" stopColor="#F6E7B8" stopOpacity="0.8" /></linearGradient>
      <radialGradient id="esfera"><stop offset="0" stopColor="#FFF8E6" /><stop offset="0.5" stopColor="#E9CF8C" stopOpacity="0.8" /><stop offset="1" stopColor="#C9A24A" stopOpacity="0" /></radialGradient>
    </defs>
  );

  if (cena === 'parado' || cena === 'fios') {
    const base = 1000;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {defs}
        <rect width={W} height={H} fill="url(#ceuNoite)" />
        <linearGradient id="ceuNoite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050D0E" /><stop offset="0.6" stopColor="#0A1C1E" /><stop offset="1" stopColor="#14464A" /></linearGradient>
        <rect width={W} height={H} fill="url(#ceuNoite)" />
        {cena === 'fios' && <Brilhos n={60} cor="#C9A24A" area={[0, 620, W, 600]} seed="f" max={2.2} op={0.5} />}
        <Colinas cor1="#071315" cor2="#0B1F21" base={base} />
        <path d={rioPath(base - 150, base)} fill="url(#rioEsc)" opacity={0.55} />
        <Ondas base={base} cor="#C9A24A" n={10} seed="pe" op={0.25} />
        <path d={rioPath(base - 150, base)} fill="#C9A24A" opacity={0.12} filter="url(#bl)" />
        {/* pedras represando */}
        {Array.from({length: 7}).map((_, k) => <ellipse key={k} cx={545 + k * 20 + (k % 2) * 6} cy={base - 40 + (k % 3) * 6} rx={20 + (k % 3) * 6} ry={11} fill="#0E1A1B" stroke="#2C3B3C" strokeWidth={1.5} />)}
        {cena === 'fios' && (
          <g>
            {/* névoa nos ombros (cansaço) */}
            <ellipse cx={385} cy={base + 60} rx={70} ry={38} fill="#9AA3A6" opacity={0.35} filter="url(#bl2)" />
            {/* família ao longe (sombras simples) */}
            {[0, 1, 2].map((k) => <g key={k} opacity={0.75}><circle cx={95 + k * 48} cy={base - 210 + (k === 1 ? -6 : 0)} r={13} fill="#3A5153" /><path d={`M ${78 + k * 48} ${base - 195} q 17 -8 34 0 l 6 70 l -46 0 z`} fill="#3A5153" /></g>)}
            {/* casa com janela embaçada */}
            <path d={`M 860 ${base - 120} L 940 ${base - 175} L 1020 ${base - 120} L 1020 ${base - 50} L 860 ${base - 50} Z`} fill="#22383A" stroke="#4A6466" strokeWidth={2} />
            <rect x={922} y={base - 110} width={34} height={30} fill="#C9A24A" opacity={0.35} filter="url(#bl2)" />
            <rect x={924} y={base - 108} width={30} height={26} fill="#8A7340" opacity={0.5} />
            {/* três fios de luz fosca */}
            <path d={`M 380 ${base + 30} C 300 ${base - 40} 200 ${base - 80} 145 ${base - 175}`} stroke="#C9A24A" strokeWidth={4} fill="none" opacity={0.85} filter="url(#gl)" />
            <path d={`M 390 ${base + 35} C 405 ${base + 10} 420 ${base + 25} 430 ${base + 45}`} stroke="#C9A24A" strokeWidth={4} fill="none" opacity={0.7} filter="url(#gl)" />
            <path d={`M 393 ${base + 30} C 560 ${base - 60} 780 ${base - 40} 925 ${base - 95}`} stroke="#C9A24A" strokeWidth={4} fill="none" opacity={0.85} filter="url(#gl)" />
          </g>
        )}
        <ellipse cx={385} cy={base + 20} rx={60} ry={90} fill="#C9A24A" opacity={0.08} filter="url(#bl)" />
        <Mulher x={385} y={base + 95} s={0.66} cor="#3B5A5C" cabelo="#243334" />
      </svg>
    );
  }

  if (cena === 'nos') {
    // mulher no terço de cima, aura com três nós; esfera de luz solta o do ombro; 2/3 de baixo livres
    const cx = 540, cy = 300;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {defs}
        <linearGradient id="ceuPet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C5F63" /><stop offset="0.45" stopColor="#14464A" /><stop offset="1" stopColor="#0A1C1E" /></linearGradient>
        <rect width={W} height={H} fill="url(#ceuPet)" />
        <path d={`M 0 640 C 300 634 700 646 1080 638`} stroke="#C9A24A" strokeWidth={2} opacity={0.35} fill="none" />
        <Brilhos n={50} cor="#E9CF8C" area={[200, 60, 680, 380]} seed="n" max={2.2} op={0.5} />
        <ellipse cx={cx} cy={cy + 40} rx={170} ry={230} fill="#C9A24A" opacity={0.18} filter="url(#bl)" />
        {/* contorno de luz (aura) com fio dourado */}
        <ellipse cx={cx} cy={cy + 40} rx={165} ry={255} stroke="#E2C378" strokeWidth={3} fill="none" filter="url(#gl)" opacity={0.9} />
        <g transform={`translate(${cx},${cy + 130}) scale(1.35)`}><Mulher x={0} y={0} s={1} cor="#0E2426" cabelo="#071214" /></g>
        <linearGradient id="nevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14464A" stopOpacity="0" /><stop offset="1" stopColor="#14464A" stopOpacity="1" /></linearGradient>
        <rect x={0} y={cy + 150} width={W} height={150} fill="url(#nevoa)" />
        {/* nós: fio dourado embolado em 3 pontos (nuca e cintura presos; ombro se soltando) */}
        {[[cx + 10, cy - 214], [cx + 160, cy + 120]].map(([x, y], k) => (
          <g key={k}>{[0, 1, 2, 3].map((j) => <ellipse key={j} cx={x} cy={y} rx={16} ry={7} transform={`rotate(${j * 45} ${x} ${y})`} fill="none" stroke="#5E4B22" strokeWidth={5} />)}<circle cx={x} cy={y} r={5} fill="#3A2E14" /></g>
        ))}
        <g>{[0, 1].map((j) => <ellipse key={j} cx={cx - 158} cy={cy - 40} rx={15} ry={6} transform={`rotate(${j * 70} ${cx - 158} ${cy - 40})`} fill="none" stroke="#B8954A" strokeWidth={4} />)}</g>
        <path d={`M ${cx - 158} ${cy - 40} C ${cx - 190} ${cy - 80} ${cx - 200} ${cy - 130} ${cx - 210} ${cy - 175}`} stroke="#F2DFA6" strokeWidth={3} fill="none" filter="url(#gl)" />
        <circle cx={cx - 200} cy={cy - 60} r={60} fill="url(#esfera)" />
        <circle cx={cx - 200} cy={cy - 60} r={14} fill="#FFF8E6" filter="url(#gl)" />
      </svg>
    );
  }

  if (cena === 'amanhecer') {
    const base = 1020;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {defs}
        <linearGradient id="ceuAm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B9CBC5" /><stop offset="0.45" stopColor="#E1D9C7" /><stop offset="0.75" stopColor="#F1E3C2" /><stop offset="1" stopColor="#C6D4CF" /></linearGradient>
        <rect width={W} height={H} fill="url(#ceuAm)" />
        <ellipse cx={540} cy={base - 210} rx={420} ry={120} fill="#F3D99A" opacity={0.45} filter="url(#bl)" />
        <Colinas cor1="#7E978D" cor2="#A9BAB1" base={base} />
        <path d={rioPath(base - 160, base)} fill="url(#rioClaro)" opacity={0.8} />
        <Ondas base={base} cor="#FFFFFF" n={22} seed="am" op={0.85} />
        <path d={rioPath(base - 160, base)} fill="#FFF1C7" opacity={0.25} filter="url(#bl)" />
        
        {/* pedras abertas no meio */}
        {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={k < 2 ? 470 + k * 24 : 660 + (k - 2) * 24} cy={base - 30} rx={20} ry={10} fill="#6E7F77" />)}
        {/* casa com janelas abertas e cortina */}
        <path d={`M 800 ${base - 175} L 880 ${base - 235} L 960 ${base - 175} L 960 ${base - 105} L 800 ${base - 105} Z`} fill="#EDE5D3" stroke="#8E9E96" strokeWidth={2} />
        {[826, 904].map((x) => (<g key={x}><rect x={x} y={base - 165} width={30} height={34} fill="#3E4F49" /><path d={`M ${x} ${base - 165} l -14 6 l 0 34 l 14 -6 z`} fill="#F4EFE6" stroke="#8E9E96" strokeWidth={1.5} /><path d={`M ${x + 30} ${base - 165} l 14 6 l 0 34 l -14 -6 z`} fill="#F4EFE6" stroke="#8E9E96" strokeWidth={1.5} /><path d={`M ${x + 4} ${base - 163} c 8 6 2 14 10 22 c 4 4 2 8 0 10 l -10 0 z`} fill="#FFFFFF" opacity={0.95} /></g>))}
        <Mulher x={300} y={base + 30} s={0.5} cor="#3E524C" cabelo="#2A2F2B" />
      </svg>
    );
  }

  // livre: vale claro, rio correndo, mulher caminhando no meio
  const base = 900;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {defs}
      <linearGradient id="ceuCl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FAF7F0" /><stop offset="0.6" stopColor="#F4EFE6" /><stop offset="1" stopColor="#EADFC4" /></linearGradient>
      <rect width={W} height={H} fill="url(#ceuCl)" />
      <Colinas cor1="#8FA889" cor2="#B7C7B0" base={base} />
      <path d={`M 0 1180 C 300 1130 700 1160 1080 1120 L 1080 ${H} L 0 ${H} Z`} fill="#5E7A5A" />
      <path d={`M 40 ${H} C 120 1120 720 1080 620 ${base - 140} L 645 ${base - 140} C 790 1070 280 1140 220 ${H} Z`} fill="url(#rioClaro)" />
      <path d={`M 40 ${H} C 120 1120 720 1080 620 ${base - 140} L 645 ${base - 140} C 790 1070 280 1140 220 ${H} Z`} fill="#FFF3CF" opacity={0.3} filter="url(#bl)" />
      {Array.from({length: 16}).map((_, k) => { const t = random('lh' + k); const y = base - 120 + t * 420; const x = 620 - t * 420 + (random('lw' + k) - 0.5) * 80; return <path key={k} d={`M ${x} ${y} q 16 -6 32 0`} stroke="#FFFFFF" strokeWidth={2.2} fill="none" opacity={0.85} />; })}
      <Brilhos n={30} cor="#C9A24A" area={[200, 760, 680, 300]} seed="lv" max={2} op={0.6} />
      <Mulher x={760} y={base + 120} s={0.55} cor="#E7DCC4" cabelo="#3A2F28" passo />
    </svg>
  );
};
