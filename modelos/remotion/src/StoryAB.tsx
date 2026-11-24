import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender, random} from 'remotion';

// Stories 9:16 no estilo do feed @apometria_brasil. Deixa o meio livre (y ~1000–1400)
// para a figurinha do Instagram (enquete, quiz, caixinha) ou mostra a prévia do post.
// Zonas do Instagram: 250 px livres no topo e 420 px embaixo.
export type StoryItem = {imagem: string; rotulo: string; titulo: string; texto?: string; previa?: string; dica?: string};
export type PropsStoryAB = {pasta: string; fontes: {titulo: string; texto: string; texto_forte: string}; assinatura: {nome: string; cargo?: string; foto: string}; stories: StoryItem[]};

const useFontes = (pasta: string, f: PropsStoryAB['fontes']) => {
  const [h] = useState(() => delayRender('fontes story'));
  useEffect(() => {
    Promise.all([
      new FontFace('ST-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('ST-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('ST-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

const Brilho: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <circle r={10} fill="#FFFFFF" opacity={0.25} filter="url(#st-blur)" />
    <path d="M0 -14 C1.2 -3 3 -1.2 14 0 C3 1.2 1.2 3 0 14 C-1.2 3 -3 1.2 -14 0 C-3 -1.2 -1.2 -3 0 -14 Z" fill="#FFFFFF" />
  </g>
);

export const StoryAB: React.FC<PropsStoryAB> = ({pasta, fontes, assinatura, stories}) => {
  useFontes(pasta, fontes);
  const i = useCurrentFrame();
  const s = stories[i];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  return (
    <AbsoluteFill style={{background: '#1B1530'}}>
      <Img src={arq(s.imagem)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,24,48,0.85) 0%, rgba(60,45,120,0.55) 30%, rgba(60,50,120,0.25) 55%, rgba(20,40,70,0.45) 78%, rgba(14,24,48,0.85) 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="st-blur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6" /></filter></defs>
        {Array.from({length: 14}).map((_, k) => (
          <Brilho key={k} x={60 + random(`sx${i}-${k}`) * 960} y={260 + random(`sy${i}-${k}`) * 1200} s={0.4 + random(`ss${i}-${k}`) * 0.9} o={0.55 + random(`so${i}-${k}`) * 0.45} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 70, right: 70, top: 300, color: '#FFFFFF', textShadow: '0 2px 18px rgba(0,0,0,0.5)'}}>
        <div style={{display: 'inline-block', background: 'rgba(0,160,170,0.75)', padding: '8px 18px', fontFamily: 'ST-texto', fontWeight: 600, fontSize: 32, marginBottom: 20, textShadow: 'none'}}>{s.rotulo}</div>
        <div style={{fontFamily: 'ST-titulo', fontWeight: 500, fontSize: 92, lineHeight: 1.02, textWrap: 'balance'} as React.CSSProperties}>{s.titulo.split(' / ').map((t, k) => <div key={k}>{t}</div>)}</div>
        {s.texto && <div style={{fontFamily: 'ST-texto', fontWeight: 500, fontSize: 38, lineHeight: 1.4, marginTop: 26, opacity: 0.95, textWrap: 'pretty'} as React.CSSProperties}>{s.texto}</div>}
      </div>
      {s.previa && (
        <div style={{position: 'absolute', left: 330, top: 820, width: 420, height: 525, transform: 'rotate(-3deg)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.55)', border: '4px solid rgba(255,255,255,0.9)'}}>
          <Img src={arq(s.previa)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      )}
      {s.dica && <div style={{position: 'absolute', left: 0, width: 1080, top: s.previa ? 1372 : 1290, textAlign: 'center', fontFamily: 'ST-texto', fontWeight: 600, fontSize: 34, color: '#FFFFFF', textShadow: '0 2px 14px rgba(0,0,0,0.6)'}}>{s.dica}</div>}
      <div style={{position: 'absolute', left: 70, bottom: 425, display: 'flex', alignItems: 'center', gap: 16}}>
        <Img src={arq(assinatura.foto)} style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)'}} />
        <div style={{color: '#FFFFFF'}}>
          <div style={{fontFamily: 'ST-titulo', fontWeight: 500, fontSize: 34, lineHeight: 1}}>{assinatura.nome}</div>
          {assinatura.cargo && <div style={{fontFamily: 'ST-texto', fontWeight: 600, fontSize: 18, letterSpacing: '0.3em', marginTop: 6, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
