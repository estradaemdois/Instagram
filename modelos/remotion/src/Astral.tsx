import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random, Easing} from 'remotion';

// Cenas do astral desenhadas em código (motion graphics). Substituíveis por vídeo gerado (Kling) no futuro.
export type EstadoAstral = 'peso' | 'ligados' | 'luz' | 'leve' | 'distancia';
type Cor = {escuro: string; marca: string; destaque: string; texto: string};

const W = 1080, H = 1920;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Silhueta (busto) translúcida, com luz de contorno
const Silhueta: React.FC<{x: number; y: number; s: number; brilho: number; cor: string; aura?: number; corAura?: string}> = ({x, y, s, brilho, cor, aura = 0, corAura}) => {
  const id = `g${Math.round(x)}${Math.round(y)}`;
  const corpo = "M -34 -98 C -36 -70 -40 -58 -70 -48 C -150 -26 -205 10 -215 120 L -228 340 L 228 340 L 215 120 C 205 10 150 -26 70 -48 C 40 -58 36 -70 34 -98 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cor} stopOpacity={0.95} />
          <stop offset="0.7" stopColor={cor} stopOpacity={0.35} />
          <stop offset="1" stopColor={cor} stopOpacity={0} />
        </linearGradient>
      </defs>
      {aura > 0 && <ellipse cx={0} cy={40} rx={300} ry={420} fill={corAura} opacity={aura * 0.35} filter="url(#blurG)" />}
      <g opacity={brilho}>
        <ellipse cx={0} cy={-165} rx={66} ry={80} fill={`url(#${id})`} filter="url(#glow)" />
        <path d={corpo} fill={`url(#${id})`} filter="url(#glow)" />
        <ellipse cx={0} cy={-165} rx={66} ry={80} fill="none" stroke={cor} strokeWidth={2} opacity={0.8} />
        <path d={corpo} fill="none" stroke={cor} strokeWidth={2} opacity={0.6} />
      </g>
    </g>
  );
};

// Cordão: curva com ondulação; parte do meio pode "abrir" (dissolve) conforme `corte` 0..1
const Cordao: React.FC<{x1: number; y1: number; x2: number; y2: number; i: number; f: number; cor: string; espessura: number; corte?: number; opac?: number}> = ({x1, y1, x2, y2, i, f, cor, espessura, corte = 0, opac = 1}) => {
  const amp = 40 + i * 14;
  const sway = Math.sin(f / 22 + i * 1.7) * amp;
  const c1x = x1 + (x2 - x1) * 0.33, c1y = y1 + (y2 - y1) * 0.33 - 120 + sway + i * 25;
  const c2x = x1 + (x2 - x1) * 0.66, c2y = y1 + (y2 - y1) * 0.66 + 120 - sway - i * 20;
  const d = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  const L = 1600;
  // corte: some do meio para as pontas
  const meio = L / 2, gap = corte * L;
  const dash = corte > 0 ? `${Math.max(0, meio - gap / 2)} ${gap} ${L}` : `${L}`;
  return (
    <g opacity={opac}>
      <path d={d} stroke={cor} strokeWidth={espessura * 3} fill="none" opacity={0.18} strokeDasharray={dash} filter="url(#blur)" />
      <path d={d} stroke={cor} strokeWidth={espessura} fill="none" strokeLinecap="round" strokeDasharray={dash} />
      {/* energia escorrendo pelo cordão */}
      {corte === 0 && <path d={d} stroke={cor} strokeWidth={espessura * 1.6} fill="none" strokeDasharray="6 70" strokeDashoffset={-f * 4 - i * 30} opacity={0.9} />}
    </g>
  );
};

const Particulas: React.FC<{f: number; n: number; cor: string; subir?: boolean; opac?: number; seed?: string}> = ({f, n, cor, subir = false, opac = 0.6, seed = 'p'}) => (
  <>
    {Array.from({length: n}).map((_, k) => {
      const x0 = random(`${seed}x${k}`) * W, y0 = random(`${seed}y${k}`) * H;
      const v = 0.4 + random(`${seed}v${k}`) * 1.4;
      const y = subir ? ((y0 - f * v * 2) % H + H) % H : y0 + Math.sin(f / 30 + k) * 20;
      const x = x0 + Math.sin(f / 40 + k * 3) * 15;
      const r = 1.5 + random(`${seed}r${k}`) * 3.5;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 18 + k));
      return <circle key={k} cx={x} cy={y} r={r} fill={cor} opacity={opac * tw} />;
    })}
  </>
);

export const CenaAstral: React.FC<{estado: EstadoAstral; dur: number; cores: Cor}> = ({estado, dur, cores}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const cinza = '#9AA3A6';
  const A = {x: 540, y: 1000};
  const fundo = estado === 'leve'
    ? `radial-gradient(circle at 50% 42%, rgba(201,162,74,0.35) 0%, rgb(${cores.marca}) 45%, rgb(${cores.escuro}) 100%)`
    : `radial-gradient(circle at 50% 45%, rgb(${cores.marca}) 0%, rgb(${cores.escuro}) 60%, #050c0d 100%)`;
  const zoom = interpolate(f, [0, dur], [1.0, 1.06]);
  let conteudo: React.ReactNode = null;

  if (estado === 'peso') {
    // pessoa sozinha com cordões puxando para fora da tela (para trás)
    const tensao = interpolate(p, [0, 1], [0.6, 1]);
    conteudo = (
      <>
        <Particulas f={f} n={40} cor={cinza} opac={0.3} />
        {[0, 1, 2, 3, 4].map((i) => <Cordao key={i} x1={A.x + 20} y1={A.y - 10} x2={1300} y2={300 + i * 260} i={i} f={f * tensao} cor={cinza} espessura={3} />)}
        <Silhueta x={A.x} y={A.y} s={1.15} brilho={0.55} cor="#C8D2D4" />
      </>
    );
  } else if (estado === 'ligados') {
    // dois corpos; a outra pessoa se afasta, os cordões continuam
    const bx = interpolate(p, [0, 1], [820, 900]);
    const bs = interpolate(p, [0, 1], [0.75, 0.6]);
    conteudo = (
      <>
        <Particulas f={f} n={40} cor={cinza} opac={0.3} />
        {[0, 1, 2, 3].map((i) => <Cordao key={i} x1={360} y1={1000} x2={bx - 20} y2={760 + i * 8} i={i} f={f} cor={cinza} espessura={3} />)}
        <Silhueta x={360} y={1060} s={1.0} brilho={0.6} cor="#C8D2D4" />
        <Silhueta x={bx} y={820} s={bs} brilho={0.35} cor="#AEB8BA" />
      </>
    );
  } else if (estado === 'distancia') {
    // atendimento à distância: campo de luz em anéis ao redor da pessoa
    conteudo = (
      <>
        <Particulas f={f} n={60} cor={cores.destaque} opac={0.35} seed="d" />
        {[0, 1, 2, 3].map((k) => {
          const t = ((f / fps) * 0.35 + k / 4) % 1;
          return <circle key={k} cx={A.x} cy={A.y} r={120 + t * 700} fill="none" stroke={cores.destaque} strokeWidth={3} opacity={(1 - t) * 0.6} />;
        })}
        {[0, 1, 2, 3, 4].map((i) => <Cordao key={i} x1={A.x + 20} y1={A.y - 10} x2={1300} y2={300 + i * 260} i={i} f={f} cor={cinza} espessura={3} opac={0.7} />)}
        <Silhueta x={A.x} y={A.y} s={1.0} brilho={0.7} cor="#D8E0E1" aura={interpolate(p, [0, 1], [0.2, 0.7])} corAura={cores.destaque} />
      </>
    );
  } else if (estado === 'luz') {
    // luz dourada desce e os cordões se desfazem do meio para as pontas
    const luz = interpolate(p, [0, 0.4], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    const corte = interpolate(p, [0.25, 0.85], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    const corC = corte > 0.05 ? cores.destaque : cinza;
    conteudo = (
      <>
        <ellipse cx={A.x} cy={interpolate(luz, [0, 1], [-300, 700])} rx={520} ry={700} fill={cores.destaque} opacity={0.22 * luz} filter="url(#blurG)" />
        <Particulas f={f} n={70} cor={cores.destaque} opac={0.5 * luz} subir seed="l" />
        {[0, 1, 2, 3, 4].map((i) => <Cordao key={i} x1={A.x + 20} y1={A.y - 10} x2={1300} y2={300 + i * 260} i={i} f={f * (1 - corte * 0.8)} cor={corC} espessura={3} corte={corte} opac={1 - corte * 0.6} />)}
        <Silhueta x={A.x} y={A.y} s={1.0} brilho={interpolate(p, [0, 1], [0.6, 0.85])} cor="#E4EAEB" aura={luz * 0.8} corAura={cores.destaque} />
      </>
    );
  } else {
    // leve: sem cordões, aura dourada, partículas subindo
    conteudo = (
      <>
        <Particulas f={f} n={80} cor={cores.destaque} opac={0.55} subir seed="v" />
        <Silhueta x={A.x} y={A.y} s={1.0} brilho={0.92} cor="#F2F0E8" aura={0.9 + 0.1 * Math.sin(f / 15)} corAura={cores.destaque} />
      </>
    );
  }

  return (
    <AbsoluteFill style={{background: fundo}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{transform: `scale(${zoom})`}}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="blur"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="blurG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60" /></filter>
        </defs>
        {conteudo}
      </svg>
      {/* grão e vinheta para parecer filme */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
