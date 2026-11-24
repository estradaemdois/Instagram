import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender, random, interpolate} from 'remotion';

// Vídeo no estilo do feed @apometria_brasil (mesma identidade do CarrosselAB).
// formato "reel" = 1080x1920 (respeita as áreas do Instagram: 250 px em cima, 420 px embaixo e a coluna de botões à direita);
// formato "feed" = 1080x1350 (capa de carrossel ou post em vídeo).
// O texto aparece desde o primeiro quadro, porque o primeiro quadro vira a capa.
export type PropsVideoAB = {
  pasta: string;
  fontes: {titulo: string; texto: string; texto_forte: string};
  assinatura: {nome: string; cargo?: string; foto: string};
  video: string;
  formato: 'reel' | 'feed';
  duracao: number;
  rotulo?: string;
  titulo: string;
  texto?: string;
};

const useFontes = (pasta: string, f: PropsVideoAB['fontes']) => {
  const [h] = useState(() => delayRender('fontes VideoAB'));
  useEffect(() => {
    Promise.all([
      new FontFace('VA-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('VA-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('VA-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

const Brilho: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <circle r={10} fill="#FFFFFF" opacity={0.25} filter="url(#va-blur)" />
    <path d="M0 -14 C1.2 -3 3 -1.2 14 0 C3 1.2 1.2 3 0 14 C-1.2 3 -3 1.2 -14 0 C-3 -1.2 -1.2 -3 0 -14 Z" fill="#FFFFFF" />
  </g>
);

export const VideoAB: React.FC<PropsVideoAB> = ({pasta, fontes, assinatura, video, formato, rotulo, titulo, texto}) => {
  useFontes(pasta, fontes);
  const f = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const reel = formato === 'reel';
  const baseAss = reel ? 440 : 70;
  const baseTexto = reel ? 560 : 210;
  return (
    <AbsoluteFill style={{background: '#0C2430'}}>
      <OffthreadVideo src={arq(video)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: reel
        ? 'linear-gradient(180deg, rgba(8,28,38,0.35) 0%, rgba(40,70,110,0.04) 25%, rgba(12,45,60,0.10) 45%, rgba(12,45,60,0.55) 62%, rgba(8,28,38,0.92) 82%, rgba(8,28,38,0.95) 100%)'
        : 'linear-gradient(180deg, rgba(120,110,190,0.10) 0%, rgba(40,70,110,0.06) 35%, rgba(12,45,60,0.38) 62%, rgba(8,28,38,0.90) 100%)'}} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="va-blur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6" /></filter></defs>
        {Array.from({length: 10}).map((_, k) => {
          const pisca = 0.5 + 0.5 * Math.sin((f / fps) * (1.2 + random(`vp${k}`) * 1.5) + random(`vf${k}`) * 6.28);
          return <Brilho key={k} x={60 + random(`vx${k}`) * (width - 120)} y={(reel ? 280 : 60) + random(`vy${k}`) * (reel ? 900 : 700)} s={0.35 + random(`vs${k}`) * 0.8} o={0.25 + 0.65 * pisca} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 70, right: reel ? 170 : 120, bottom: baseTexto, color: '#FFFFFF', textShadow: '0 2px 18px rgba(0,0,0,0.5)'}}>
        {rotulo && <div style={{display: 'inline-block', background: 'rgba(0,160,170,0.75)', padding: '6px 14px', fontFamily: 'VA-texto', fontWeight: 500, fontSize: 34, lineHeight: 1.15, marginBottom: 14, textShadow: 'none'}}>{rotulo}</div>}
        <div style={{fontFamily: 'VA-titulo', fontWeight: 500, fontSize: 104, lineHeight: 1.0, letterSpacing: '-0.01em'}}>
          {titulo.split(' / ').map((t, k) => <div key={k}>{t}</div>)}
        </div>
        {texto && <div style={{fontFamily: 'VA-texto', fontWeight: 500, fontSize: 35, lineHeight: 1.4, marginTop: 24, opacity: interpolate(f, [0, 1], [0.95, 0.95]), textWrap: 'pretty'} as React.CSSProperties}>{texto}</div>}
      </div>
      <div style={{position: 'absolute', left: 70, bottom: baseAss, display: 'flex', alignItems: 'center', gap: 18}}>
        <Img src={arq(assinatura.foto)} style={{width: reel ? 80 : 96, height: reel ? 80 : 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)'}} />
        <div style={{color: '#FFFFFF'}}>
          <div style={{fontFamily: 'VA-titulo', fontWeight: 500, fontSize: reel ? 40 : 44, lineHeight: 1}}>{assinatura.nome}</div>
          {assinatura.cargo && <div style={{fontFamily: 'VA-texto', fontWeight: 600, fontSize: 20, letterSpacing: '0.3em', marginTop: 6, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
