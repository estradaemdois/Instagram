import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender, random} from 'remotion';

// Depoimento no design system da Apometria Brasil (o mesmo do CarrosselAB/StoryAB):
// fundo de céu cinematográfico, tratamento azul profundo/petróleo com leve lilás, brilhos brancos,
// rótulo turquesa, print ORIGINAL do WhatsApp inteiro, assinatura do Paulo (foto + nome) e símbolo da Apometria Brasil no rodapé à direita.
export type ItemCeu = {print: string; rotulo: string};
export type PropsCeu = {pasta: string; fundo: string; fontes: {titulo: string; texto: string; texto_forte: string}; assinatura: {nome: string; cargo?: string; foto: string}; simbolo: string; itens: ItemCeu[]};

const useFontes = (pasta: string, f: PropsCeu['fontes']) => {
  const [h] = useState(() => delayRender('fontes ceu'));
  useEffect(() => {
    Promise.all([
      new FontFace('CE-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('CE-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('CE-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

const Brilho: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <circle r={10} fill="#FFFFFF" opacity={0.25} filter="url(#ce-blur)" />
    <path d="M0 -14 C1.2 -3 3 -1.2 14 0 C3 1.2 1.2 3 0 14 C-1.2 3 -3 1.2 -14 0 C-3 -1.2 -1.2 -3 0 -14 Z" fill="#FFFFFF" />
  </g>
);

export const DepoimentoCeu: React.FC<PropsCeu> = ({pasta, fundo, fontes, assinatura, simbolo, itens}) => {
  useFontes(pasta, fontes);
  const i = useCurrentFrame();
  const d = itens[i];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const H = 1110, W = Math.round(H * 0.466), topo = 330;
  // brilhos só nas laterais, longe do print
  const brilhos = Array.from({length: 12}).map((_, k) => {
    const lado = k % 2 === 0;
    const x = lado ? 40 + random(`cx${k}`) * (540 - W / 2 - 70) : 540 + W / 2 + 30 + random(`cx${k}`) * (540 - W / 2 - 70);
    return <Brilho key={k} x={x} y={300 + random(`cy${k}`) * 1150} s={0.35 + random(`cs${k}`) * 0.8} o={0.5 + random(`co${k}`) * 0.5} />;
  });
  return (
    <AbsoluteFill style={{background: '#0C2430'}}>
      <Img src={arq(fundo)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(120,110,190,0.14) 0%, rgba(20,55,75,0.30) 30%, rgba(12,45,60,0.45) 70%, rgba(8,28,38,0.85) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 75% 12%, rgba(120,220,230,0.18) 0%, rgba(0,0,0,0) 45%)', mixBlendMode: 'screen'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="ce-blur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6" /></filter></defs>
        {brilhos}
      </svg>
      {/* Rótulo turquesa, como no feed */}
      <div style={{position: 'absolute', top: 245, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(0,160,170,0.78)', padding: '10px 26px', fontFamily: 'CE-texto', fontWeight: 600, fontSize: 34, color: '#FFFFFF'}}>{d.rotulo}</div>
      </div>
      {/* Print original */}
      <div style={{position: 'absolute', top: topo, left: (1080 - W) / 2, width: W, height: H, borderRadius: 30, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
        <Img src={arq(d.print)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
      </div>
      {/* Rodapé: assinatura do Paulo à esquerda, símbolo à direita */}
      <div style={{position: 'absolute', top: topo + H + 34, left: 70, right: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Img src={arq(assinatura.foto)} style={{width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)'}} />
          <div>
            <div style={{fontFamily: 'CE-titulo', fontWeight: 500, fontSize: 44, lineHeight: 1}}>{assinatura.nome}</div>
            {assinatura.cargo && <div style={{fontFamily: 'CE-texto', fontWeight: 600, fontSize: 20, letterSpacing: '0.3em', marginTop: 6, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
          </div>
        </div>
        <Img src={arq(simbolo)} style={{width: 66, height: 66, opacity: 0.95}} />
      </div>
    </AbsoluteFill>
  );
};
