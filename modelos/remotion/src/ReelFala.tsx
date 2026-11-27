import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender, interpolate} from 'remotion';

// Reels com o Paulo falando (9:16): corte sem pausas, zoom alternado a cada corte (esconde o "pulo"),
// título no alto, legenda palavra a palavra com destaque turquesa e assinatura.
type Palavra = {p: string; i: number; f: number; seg: number};
export type PropsReelFala = {
  pasta: string; video: string; duracao: number; inicios: number[]; blocos: Palavra[][];
  fontes: {titulo: string; texto: string; texto_forte: string};
  assinatura: {nome: string; cargo?: string; foto: string};
  rotulo?: string; titulo: string; chamada_final?: string;
  sem_zoom?: boolean; legenda_alto_ate?: number; simbolo?: string; faixa_legenda?: boolean;
};

const useFontes = (pasta: string, f: PropsReelFala['fontes']) => {
  const [h] = useState(() => delayRender('fontes fala'));
  useEffect(() => {
    Promise.all([
      new FontFace('RF-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('RF-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('RF-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

export const ReelFala: React.FC<PropsReelFala> = ({pasta, video, duracao, inicios, blocos, fontes, assinatura, rotulo, titulo, chamada_final, sem_zoom, legenda_alto_ate, simbolo, faixa_legenda}) => {
  useFontes(pasta, fontes);
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = fr / fps;
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  let seg = 0; inicios.forEach((x, k) => { if (t >= x) seg = k; });
  const zoom = sem_zoom || seg % 2 === 0 ? 1.0 : 1.09;
  const bloco = blocos.find((b) => t >= b[0].i - 0.05 && t <= b[b.length - 1].f + 0.12);
  const fimChamada = duracao - 3;
  return (
    <AbsoluteFill style={{background: '#0C2430'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 62%'}}>
        <OffthreadVideo src={arq(video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* faixa escura suave no alto para o título e embaixo para a legenda */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,28,38,0.78) 0%, rgba(8,28,38,0.45) 22%, rgba(8,28,38,0) 38%, rgba(8,28,38,0) 62%, rgba(8,28,38,0.55) 82%, rgba(8,28,38,0.75) 100%)'}} />
      {/* título e assinatura */}
      <div style={{position: 'absolute', top: 230, left: 70, right: 70, color: '#FFFFFF', textShadow: '0 2px 18px rgba(0,0,0,0.5)'}}>
        {rotulo && <div style={{display: 'inline-block', background: 'rgba(0,160,170,0.8)', padding: '7px 16px', fontFamily: 'RF-texto', fontWeight: 600, fontSize: 30, textShadow: 'none', marginBottom: 16}}>{rotulo}</div>}
        <div style={{fontFamily: 'RF-titulo', fontWeight: 500, fontSize: 84, lineHeight: 1.02}}>{titulo.split(' / ').map((x, k) => <div key={k}>{x}</div>)}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 22}}>
          <Img src={arq(assinatura.foto)} style={{width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.9)'}} />
          <div>
            <div style={{fontFamily: 'RF-titulo', fontWeight: 500, fontSize: 32, lineHeight: 1}}>{assinatura.nome}</div>
            {assinatura.cargo && <div style={{fontFamily: 'RF-texto', fontWeight: 600, fontSize: 16, letterSpacing: '0.3em', marginTop: 5, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
          </div>
        </div>
      </div>
      {/* legenda */}
      {bloco && (
        <div style={{position: 'absolute', left: 70, right: 70, top: t < (legenda_alto_ate ?? inicios[2] ?? 0) ? 600 : 1480, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 14px', fontFamily: 'RF-texto', fontWeight: 600, fontSize: 54, lineHeight: 1.12, textAlign: 'center', ...(faixa_legenda ? {background: 'rgba(8,28,38,0.55)', borderRadius: 26, padding: '14px 26px', left: 90, right: 90} : {})}}>
          {bloco.map((w, k) => {
            const ativa = t >= w.i - 0.03 && t <= w.f + 0.05;
            const dita = t >= w.i - 0.03;
            return <span key={k} style={{color: ativa ? '#01C2C1' : '#FFFFFF', opacity: dita ? 1 : 0.55, textShadow: '0 3px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)'}}>{w.p}</span>;
          })}
        </div>
      )}
      {chamada_final && t > fimChamada && (
        <div style={{position: 'absolute', left: 70, top: 610, display: 'flex', opacity: interpolate(t, [fimChamada, fimChamada + 0.4], [0, 1], {extrapolateRight: 'clamp'})}}>
          <div style={{background: 'rgba(1,160,160,0.92)', borderRadius: 40, padding: '16px 34px', fontFamily: 'RF-texto', fontWeight: 600, fontSize: 34, color: '#FFFFFF'}}>{chamada_final}</div>
        </div>
      )}
      {simbolo && <Img src={arq(simbolo)} style={{position: 'absolute', right: 36, bottom: 40, width: 46, height: 46, opacity: 0.85}} />}
    </AbsoluteFill>
  );
};
