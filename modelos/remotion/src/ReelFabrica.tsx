import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, continueRender, delayRender, Easing} from 'remotion';
import {CenaAstral, EstadoAstral} from './Astral';
import type {Identidade} from './Carrossel';

// Reels 9:16 genérico: cenas (astral em motion graphics ou vídeo real), legenda palavra a palavra, música com ducking, assinatura.
export type Cena =
  | {tipo: 'astral'; estado: EstadoAstral; inicio: number; fim: number; tela?: string}
  | {tipo: 'video'; arquivo: string; inicio: number; fim: number; tela?: string; inicioClipe?: number};
export type Fala = {texto: string; inicio: number; fim: number};
export type PropsReel = {
  pasta: string; identidade: Identidade; duracao: number;
  cenas: Cena[]; falas: Fala[]; narracao?: string; musica?: string; volumeMusica?: number;
};

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const familia = (papel: string) => `Fabrica-${papel}`;
const rgb = (c: string) => `rgb(${c})`;

const useFontes = (pasta: string, id: Identidade) => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    Promise.all(Object.entries(id.fontes).map(([papel, f]) =>
      new FontFace(familia(papel === 'titulo_italico' ? 'titulo' : papel), `url(${staticFile(`${pasta}/${f.arquivo}`)})`, {weight: f.peso, style: f.estilo ?? (papel === 'titulo_italico' ? 'italic' : 'normal')})
        .load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, id]);
};

// Texto grande na tela (topo, fora da área coberta pelo Instagram)
const TextoTela: React.FC<{txt: string; dur: number; id: Identidade}> = ({txt, dur, id}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'}), interpolate(f, [dur - 10, dur], [1, 0], {extrapolateLeft: 'clamp'}));
  const y = interpolate(f, [0, 14], [18, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top: 300, left: 0, width: 1080, padding: '0 70px', boxSizing: 'border-box', textAlign: 'center', opacity: o, transform: `translateY(${y}px)`, fontFamily: familia('titulo'), fontSize: 76, lineHeight: 1.15, color: id.cores.texto, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>
      {txt.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, k) => p.startsWith('*')
        ? <span key={k} style={{fontStyle: 'italic', color: id.cores.destaque}}>{p.slice(1, -1)}</span>
        : <span key={k}>{p}</span>)}
    </div>
  );
};

// Legenda dinâmica: mostra a frase em blocos curtos e acende a palavra falada
const Legenda: React.FC<{falas: Fala[]; id: Identidade}> = ({falas, id}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fala = falas.find((x) => t >= x.inicio && t < x.fim);
  if (!fala) return null;
  const palavras = fala.texto.split(/\s+/).filter(Boolean);
  // tempo de cada palavra proporcional ao tamanho
  const pesos = palavras.map((w) => w.length + 2);
  const tot = pesos.reduce((a, b) => a + b, 0);
  let acc = fala.inicio; const ini = pesos.map((p) => { const a = acc; acc += (p / tot) * (fala.fim - fala.inicio); return a; });
  const atual = Math.max(0, ini.findIndex((a, k) => t >= a && (k === ini.length - 1 || t < ini[k + 1])));
  const bloco = Math.floor(atual / 4) * 4; // até 4 palavras por vez
  return (
    <div style={{position: 'absolute', top: 1290, left: 60, right: 60, textAlign: 'center', fontFamily: familia('rotulo'), fontWeight: 700, fontSize: 58, lineHeight: 1.2, color: '#FFFFFF', textShadow: '0 3px 18px rgba(0,0,0,0.85)'}}>
      {palavras.slice(bloco, bloco + 4).map((w, k) => (
        <span key={k} style={{color: bloco + k === atual ? id.cores.destaque : '#FFFFFF', marginRight: 14}}>{w}</span>
      ))}
    </div>
  );
};

const Video: React.FC<{src: string; dur: number; inicioClipe?: number}> = ({src, dur, inicioClipe = 0}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.06]);
  return (
    <AbsoluteFill>
      <OffthreadVideo src={src} muted startFrom={s(inicioClipe)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, filter: 'saturate(0.7) contrast(1.05) brightness(0.85)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,28,30,0.45) 0%, rgba(10,28,30,0.1) 35%, rgba(10,28,30,0.25) 60%, rgba(10,28,30,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

const Transicao: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = Math.max(interpolate(f, [0, 8], [1, 0], {extrapolateRight: 'clamp'}), interpolate(f, [dur - 8, dur], [0, 1], {extrapolateLeft: 'clamp'}));
  return <AbsoluteFill style={{background: '#000', opacity: o * 0.85}} />;
};

const Assinatura: React.FC<{pasta: string; id: Identidade}> = ({pasta, id}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: o}}>
      <Img src={staticFile(`${pasta}/${id.logo}`)} style={{height: 120, width: 'auto'}} />
      <div style={{fontFamily: familia('rotulo'), fontWeight: 600, fontSize: 40, letterSpacing: '0.3em', paddingLeft: '0.3em', color: id.cores.destaque}}>{id.nome}</div>
    </div>
  );
};

export const ReelFabrica: React.FC<PropsReel> = ({pasta, identidade: id, duracao, cenas, falas, narracao, musica, volumeMusica = 0.22}) => {
  useFontes(pasta, id);
  const {durationInFrames} = useVideoConfig();
  // ducking: música mais baixa enquanto há fala
  const volumeMus = (fr: number) => {
    const t = fr / FPS;
    const falando = falas.some((x) => t >= x.inicio - 0.15 && t < x.fim + 0.15);
    const base = falando ? volumeMusica * 0.35 : volumeMusica;
    const fadeOut = interpolate(fr, [durationInFrames - s(1.5), durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return base * fadeOut;
  };
  const cores = {escuro: id.cores.escuro, marca: id.cores.marca, destaque: id.cores.destaque, texto: id.cores.texto};
  return (
    <AbsoluteFill style={{background: rgb(id.cores.escuro)}}>
      {cenas.map((c, i) => {
        const dur = s(c.fim - c.inicio);
        return (
          <Sequence key={i} from={s(c.inicio)} durationInFrames={dur}>
            {c.tipo === 'astral' ? <CenaAstral estado={c.estado} dur={dur} cores={cores} /> : <Video src={staticFile(`${pasta}/${c.arquivo}`)} dur={dur} inicioClipe={c.inicioClipe} />}
            <Transicao dur={dur} />
            {c.tela && <TextoTela txt={c.tela} dur={dur} id={id} />}
          </Sequence>
        );
      })}
      <Legenda falas={falas} id={id} />
      <Sequence from={s(Math.max(0, duracao - 3))}><Assinatura pasta={pasta} id={id} /></Sequence>
      {narracao && <Audio src={staticFile(`${pasta}/${narracao}`)} />}
      {musica && <Audio src={staticFile(`${pasta}/${musica}`)} volume={volumeMus} />}
    </AbsoluteFill>
  );
};
