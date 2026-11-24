import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender, random} from 'remotion';

// Estilo do feed @apometria_brasil (análise de 24/11/2026): imagem cinematográfica na lâmina inteira,
// tratamento lilás/turquesa, brilhos brancos, título em serifada fina branca à esquerda,
// rótulo em caixinha turquesa translúcida. Assinatura do Paulo (foto + nome) em todas as lâminas;
// sem assinatura, usa o símbolo do logo no canto inferior direito.
export type LaminaAB = {imagem: string; rotulo?: string; titulo: string; texto?: string; chamada?: string; assinatura?: boolean};
export type PropsAB = {
  pasta: string;
  fontes: {titulo: string; texto: string; texto_forte: string};
  logo: string;
  assinatura?: {nome: string; cargo?: string; foto: string};
  laminas: LaminaAB[];
};

const useFontes = (pasta: string, f: PropsAB['fontes']) => {
  const [h] = useState(() => delayRender('fontes AB'));
  useEffect(() => {
    Promise.all([
      new FontFace('AB-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('AB-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('AB-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

// Brilho de 4 pontas
const Brilho: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <circle r={10} fill="#FFFFFF" opacity={0.25} filter="url(#ab-blur)" />
    <path d="M0 -14 C1.2 -3 3 -1.2 14 0 C3 1.2 1.2 3 0 14 C-1.2 3 -3 1.2 -14 0 C-3 -1.2 -1.2 -3 0 -14 Z" fill="#FFFFFF" />
  </g>
);

export const CarrosselAB: React.FC<PropsAB> = ({pasta, fontes, logo, assinatura, laminas}) => {
  useFontes(pasta, fontes);
  const i = useCurrentFrame();
  const l = laminas[i];
  const capa = i === 0;
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  return (
    <AbsoluteFill style={{background: '#1B1530'}}>
      <Img src={arq(l.imagem)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      {/* tratamento de cor: lilás em cima, azul-petróleo profundo embaixo */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(120,110,190,0.10) 0%, rgba(40,70,110,0.06) 35%, rgba(12,45,60,0.38) 62%, rgba(8,28,38,0.90) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 75% 20%, rgba(120,220,230,0.18) 0%, rgba(0,0,0,0) 45%)', mixBlendMode: 'screen'}} />
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="ab-blur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6" /></filter></defs>
        {Array.from({length: 11}).map((_, k) => (
          <Brilho key={k} x={60 + random(`bx${i}-${k}`) * 960} y={60 + random(`by${i}-${k}`) * 700} s={0.35 + random(`bs${i}-${k}`) * 0.9} o={0.55 + random(`bo${i}-${k}`) * 0.45} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 70, right: 120, bottom: assinatura ? 210 : 140, color: '#FFFFFF', textShadow: '0 2px 18px rgba(0,0,0,0.45)'}}>
        {l.rotulo && (
          <div style={{display: 'inline-block', background: 'rgba(0,160,170,0.72)', padding: '6px 14px', fontFamily: 'AB-texto', fontWeight: 500, fontSize: capa ? 34 : 28, lineHeight: 1.15, marginBottom: 14, textShadow: 'none'}}>{l.rotulo}</div>
        )}
        <div style={{fontFamily: 'AB-titulo', fontWeight: 500, fontSize: capa ? 112 : 82, lineHeight: 1.0, letterSpacing: '-0.01em', textWrap: 'balance'} as React.CSSProperties}>
          {l.titulo.split(' / ').map((t, k) => <div key={k}>{t}</div>)}
        </div>
        {l.texto && <div style={{fontFamily: 'AB-texto', fontWeight: 500, fontSize: capa ? 36 : 31, lineHeight: 1.4, marginTop: 24, opacity: 0.95, textWrap: 'pretty'} as React.CSSProperties}>{l.texto}</div>}
        {l.chamada && (
          <div style={{display: 'inline-block', marginTop: 28, background: 'rgba(1,160,160,0.88)', color: '#FFFFFF', borderRadius: 14, padding: '12px 26px', fontFamily: 'AB-texto', fontWeight: 600, fontSize: 28, textShadow: 'none'}}>{l.chamada}</div>
        )}
      </div>
      {assinatura && (
        <div style={{position: 'absolute', left: 70, bottom: 70, display: 'flex', alignItems: 'center', gap: 18}}>
          <Img src={arq(assinatura.foto)} style={{width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)'}} />
          <div style={{color: '#FFFFFF'}}>
            <div style={{fontFamily: 'AB-titulo', fontWeight: 500, fontSize: 44, lineHeight: 1}}>{assinatura.nome}</div>
            {assinatura.cargo && <div style={{fontFamily: 'AB-texto', fontWeight: 600, fontSize: 20, letterSpacing: '0.3em', marginTop: 6, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
          </div>
        </div>
      )}
      {!assinatura && <Img src={arq(logo)} style={{position: 'absolute', right: 56, bottom: 56, height: 78, width: 'auto', opacity: 0.95}} />}
    </AbsoluteFill>
  );
};
