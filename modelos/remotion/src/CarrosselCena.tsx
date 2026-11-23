import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';
import type {Identidade} from './Carrossel';
import {Rio, CenaRio} from './cenas/Rio';

// Carrossel com cena ocupando a lâmina inteira (sem faixa de cor) e texto no espaço vazio da cena.
// A cena pode ser desenhada em código (`cena`) ou uma imagem gerada (Kling/Gemini) em `imagem`.
export type LaminaCena = {
  rotulo: string; titulo: string; texto: string; chamada?: string;
  cena?: CenaRio; imagem?: string;
  posicao: 'topo' | 'base'; tema: 'escuro' | 'claro';
};
export type PropsCarrosselCena = {pasta: string; identidade: Identidade; laminas: LaminaCena[]};

const familia = (papel: string) => `Fabrica-${papel}`;
const useFontes = (pasta: string, id: Identidade) => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    Promise.all(Object.entries(id.fontes).map(([papel, f]) =>
      new FontFace(familia(papel === 'titulo_italico' ? 'titulo' : papel), `url(${staticFile(`${pasta}/${f.arquivo}`)})`, {weight: f.peso, style: f.estilo ?? (papel === 'titulo_italico' ? 'italic' : 'normal')})
        .load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, id]);
};

const Titulo: React.FC<{txt: string; cor: string; dest: string; size: number}> = ({txt, cor, dest, size}) => (
  <div style={{fontFamily: familia('titulo'), fontWeight: 500, fontSize: size, lineHeight: 1.18, color: cor, textWrap: 'balance'} as React.CSSProperties}>
    {txt.split(' / ').map((linha, i) => (
      <div key={i}>{linha.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, k) => {
        if (!p.startsWith('*')) return <span key={k}>{p}</span>;
        const m = p.slice(1, -1).match(/^(.*?)([.,!?;:…]*)$/)!;
        return <span key={k}><span style={{fontStyle: 'italic', color: dest}}>{m[1]}</span>{m[2]}</span>;
      })}</div>
    ))}
  </div>
);

export const CarrosselCena: React.FC<PropsCarrosselCena> = ({pasta, identidade: id, laminas}) => {
  useFontes(pasta, id);
  const i = useCurrentFrame();
  const l = laminas[i];
  const total = laminas.length;
  const ultima = i === total - 1;
  const claro = l.tema === 'claro';
  const corTexto = claro ? '#24302D' : id.cores.texto;
  const corDest = claro ? '#9A7426' : id.cores.destaque;
  const sombra = claro ? 'none' : '0 2px 18px rgba(0,0,0,0.55)';
  const bloco = (
    <div style={{textAlign: 'center', textShadow: sombra}}>
      <div style={{fontFamily: familia('rotulo'), fontWeight: 600, fontSize: 24, letterSpacing: '0.28em', paddingLeft: '0.28em', color: corDest, marginBottom: 26}}>{l.rotulo}</div>
      <Titulo txt={l.titulo} cor={corTexto} dest={corDest} size={i === 0 ? 82 : 70} />
      <div style={{fontFamily: familia('texto'), fontWeight: 400, fontSize: 35, lineHeight: 1.45, color: corTexto, opacity: 0.95, marginTop: 28, textWrap: 'pretty'} as React.CSSProperties}>{l.texto.replace(/ (\S+)$/, '\u00a0$1')}</div>
      {l.chamada && <div style={{fontFamily: familia('rotulo'), fontWeight: 600, fontSize: 28, letterSpacing: '0.04em', color: corDest, marginTop: 30, textWrap: 'balance'} as React.CSSProperties}>{l.chamada.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, k) => p.startsWith('*') ? <span key={k} style={{letterSpacing: '0.12em'}}>{p.slice(1, -1)}</span> : <span key={k}>{p}</span>)}</div>}
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#0A1C1E'}}>
      {l.imagem ? <Img src={staticFile(`${pasta}/${l.imagem}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : l.cena ? <Rio cena={l.cena} /> : null}
      <div style={{position: 'absolute', left: 90, width: 900, ...(l.posicao === 'topo' ? {top: 110} : {bottom: 150})}}>{bloco}</div>
      {ultima ? (
        <div style={{position: 'absolute', left: 0, width: 1080, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <Img src={staticFile(`${pasta}/${id.logo}`)} style={{height: 64, width: 'auto'}} />
          <div style={{fontFamily: familia('rotulo'), fontWeight: 600, fontSize: 26, letterSpacing: '0.3em', paddingLeft: '0.3em', color: id.cores.texto}}>{id.nome}</div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: 70, right: 70, bottom: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: familia('rotulo'), fontWeight: 600, fontSize: 20, letterSpacing: '0.25em', color: claro ? '#24302D' : id.cores.texto, opacity: 0.85}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}><Img src={staticFile(`${pasta}/${id.logo}`)} style={{height: 34, width: 'auto', filter: claro ? 'brightness(0.18)' : 'none'}} />{id.nome}</div>
          <div>{i + 1}/{total}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
