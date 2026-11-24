import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender, random} from 'remotion';

// Moldura de depoimento para stories (1080x1920), identidade Paulo Rodrigues · Apometria.
// Respeita as áreas do Instagram (250 px em cima, 420 px embaixo).
export type ItemDepo = {print: string; largura?: number; objecao: string; comentario: string};
export type PropsDepo = {pasta: string; fontes: {titulo: string; texto: string; texto_forte: string}; assinatura: {nome: string; cargo?: string; foto: string}; aviso: string; itens: ItemDepo[]};

const useFontes = (pasta: string, f: PropsDepo['fontes']) => {
  const [h] = useState(() => delayRender('fontes depo'));
  useEffect(() => {
    Promise.all([
      new FontFace('DP-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('DP-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('DP-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

const Brilho: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <path d="M0 -14 C1.2 -3 3 -1.2 14 0 C3 1.2 1.2 3 0 14 C-1.2 3 -3 1.2 -14 0 C-3 -1.2 -1.2 -3 0 -14 Z" fill="#FFFFFF" />
  </g>
);

export const DepoimentoAB: React.FC<PropsDepo> = ({pasta, fontes, assinatura, aviso, itens}) => {
  useFontes(pasta, fontes);
  const i = useCurrentFrame();
  const d = itens[i];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(170deg, #12404A 0%, #0B2A33 45%, #071C24 100%)'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 80% 12%, rgba(120,220,230,0.16) 0%, rgba(0,0,0,0) 40%), radial-gradient(circle at 10% 70%, rgba(1,194,193,0.10) 0%, rgba(0,0,0,0) 45%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 0}).map((_, k) => (
          <Brilho key={k} x={50 + random(`dx${i}-${k}`) * 980} y={260 + random(`dy${i}-${k}`) * 1250} s={0.3 + random(`ds${i}-${k}`) * 0.6} o={0.35 + random(`do${i}-${k}`) * 0.4} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 70, right: 70, top: 270, bottom: 430, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FFFFFF'}}>
        <div style={{alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{background: 'rgba(0,160,170,0.8)', padding: '7px 16px', fontFamily: 'DP-texto', fontWeight: 600, fontSize: 28, letterSpacing: '0.08em'}}>DEPOIMENTO</div>
          <div style={{fontFamily: 'DP-texto', fontWeight: 500, fontSize: 26, opacity: 0.8}}>Relato de quem passou pelo atendimento</div>
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0}}>
          <div style={{width: d.largura ?? 900, borderRadius: 26, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)'}}>
            <Img src={arq(d.print)} style={{width: '100%', display: 'block'}} />
          </div>
        </div>
        <div style={{alignSelf: 'stretch'}}>
          <div style={{width: 70, height: 3, background: '#01C2C1', marginBottom: 20}} />
          <div style={{fontFamily: 'DP-titulo', fontWeight: 500, fontSize: 62, lineHeight: 1.05}}>{d.objecao}</div>
          <div style={{fontFamily: 'DP-texto', fontWeight: 500, fontSize: 32, lineHeight: 1.42, marginTop: 16, opacity: 0.95, textWrap: 'pretty'} as React.CSSProperties}>{d.comentario}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 30}}>
            <Img src={arq(assinatura.foto)} style={{width: 66, height: 66, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)'}} />
            <div>
              <div style={{fontFamily: 'DP-titulo', fontWeight: 500, fontSize: 36, lineHeight: 1}}>{assinatura.nome}</div>
              {assinatura.cargo && <div style={{fontFamily: 'DP-texto', fontWeight: 600, fontSize: 18, letterSpacing: '0.3em', marginTop: 6, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
            </div>
          </div>
          <div style={{fontFamily: 'DP-texto', fontWeight: 500, fontSize: 20, opacity: 0.6, marginTop: 18}}>{aviso}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
