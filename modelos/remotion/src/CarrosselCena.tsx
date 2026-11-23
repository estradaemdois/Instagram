import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';
import type {Identidade, Lamina} from './Carrossel';

// Visual "cena" (23/11/2026): a imagem ocupa a lâmina inteira e o texto fica no espaço vazio da cena
// (céu, névoa ou grama), com um véu suave só atrás do texto. Sem a faixa verde do modelo antigo.
export type LaminaCena = Lamina & {
  posicao: 'topo' | 'base';     // onde fica o bloco de texto
  claro?: boolean;              // cena clara: texto escuro e véu claro
  veu?: number;                 // força do véu atrás do texto (0 a 1). Padrão 0,55
};
export type PropsCena = {pasta: string; identidade: Identidade; laminas: LaminaCena[]};

const familia = (papel: string) => `Cena-${papel}`;
const useFontes = (pasta: string, id: Identidade) => {
  const [h] = useState(() => delayRender('fontes da marca'));
  useEffect(() => {
    Promise.all(
      Object.entries(id.fontes).map(([papel, f]) =>
        new FontFace(familia(papel === 'titulo_italico' ? 'titulo' : papel), `url(${staticFile(`${pasta}/${f.arquivo}`)})`, {
          weight: f.peso,
          style: f.estilo ?? (papel === 'titulo_italico' ? 'italic' : 'normal'),
        }).load().then((x) => document.fonts.add(x))
      )
    ).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
  }, [h, pasta, id]);
};

const Titulo: React.FC<{txt: string; size: number; cor: string; destaque: string; peso: number}> = ({txt, size, cor, destaque, peso}) => (
  <div style={{fontFamily: familia('titulo'), fontWeight: peso, fontSize: size, lineHeight: 1.2, color: cor, textWrap: 'balance'} as React.CSSProperties}>
    {txt.split(' / ').map((linha, i) => (
      <div key={i}>
        {linha.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, k) => {
          if (!p.startsWith('*')) return <span key={k}>{p}</span>;
          const m = p.slice(1, -1).match(/^(.*?)([.,!?;:…]*)$/)!;
          return <span key={k}><span style={{fontStyle: 'italic', color: destaque}}>{m[1]}</span>{m[2]}</span>;
        })}
      </div>
    ))}
  </div>
);

// Chamada com "*trecho*" em itálico (ex.: comente *FLUIR*)
const Rica: React.FC<{txt: string}> = ({txt}) => (
  <>{txt.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, k) => p.startsWith('*') ? <b key={k} style={{fontWeight: 700}}>{p.slice(1, -1)}</b> : <span key={k}>{p}</span>)}</>
);

export const CarrosselCena: React.FC<PropsCena> = ({pasta, identidade: id, laminas}) => {
  useFontes(pasta, id);
  const i = useCurrentFrame();
  const l = laminas[i];
  const total = laminas.length;
  const capa = i === 0 && total > 1;
  const ultima = i === total - 1;
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const escuroRGB = id.cores.escuro;
  const claroRGB = '250,247,240';
  const veuRGB = l.claro ? claroRGB : escuroRGB;
  const corTexto = l.claro ? `rgb(${escuroRGB})` : id.cores.texto;
  const corDestaque = l.claro ? '#8A6A22' : id.cores.destaque; // dourado mais fundo para ler no claro
  const v = l.veu ?? 0.55;
  const topo = l.posicao === 'topo';
  // Véu: degradê que nasce na borda onde está o texto e some no meio da imagem (sem faixa marcada)
  const veu = topo
    ? `linear-gradient(180deg, rgba(${veuRGB},${v}) 0%, rgba(${veuRGB},${v * 0.8}) 30%, rgba(${veuRGB},${v * 0.35}) 48%, rgba(${veuRGB},0) 62%)`
    : `linear-gradient(0deg, rgba(${veuRGB},${v}) 0%, rgba(${veuRGB},${v * 0.8}) 34%, rgba(${veuRGB},${v * 0.35}) 52%, rgba(${veuRGB},0) 66%)`;
  const sombra = l.claro ? 'none' : '0 2px 18px rgba(0,0,0,0.35)';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={arq(l.imagem)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: veu}} />
      <div style={{position: 'absolute', left: 90, width: 900, textAlign: 'center', textWrap: 'pretty', textShadow: sombra,
        ...(topo ? {top: l.topo ?? 110} : {bottom: 150})} as React.CSSProperties}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 30}}>
          <div style={{width: 44, height: 1.5, background: corDestaque}} />
          <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 23, letterSpacing: '0.28em', paddingLeft: '0.28em', color: corDestaque}}>{l.rotulo}</div>
          <div style={{width: 44, height: 1.5, background: corDestaque}} />
        </div>
        <Titulo txt={l.titulo} size={capa ? 82 : 66} cor={corTexto} destaque={corDestaque} peso={Number(id.fontes.titulo.peso)} />
        <div style={{fontFamily: familia('texto'), fontWeight: Number(id.fontes.texto.peso), fontSize: capa ? 36 : 33, lineHeight: 1.45, color: corTexto, marginTop: 30, opacity: 0.95}}>{l.texto}</div>
        {l.chamada && !ultima && <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 27, letterSpacing: '0.06em', color: corDestaque, marginTop: 38}}><Rica txt={l.chamada} /></div>}
      </div>
      {ultima ? (<>
        <AbsoluteFill style={{background: `linear-gradient(0deg, rgba(${escuroRGB},0.78) 0%, rgba(${escuroRGB},0.55) 18%, rgba(${escuroRGB},0) 34%)`}} />
        <div style={{position: 'absolute', left: 0, width: 1080, bottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textShadow: '0 2px 12px rgba(0,0,0,0.4)'}}>
          {l.chamada && <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 28, letterSpacing: '0.04em', lineHeight: 1.4, color: id.cores.texto, width: 860, textAlign: 'center', marginBottom: 26}}><Rica txt={l.chamada} /></div>}
          <Img src={arq(id.logo)} style={{height: 72, width: 'auto'}} />
          <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 30, letterSpacing: '0.3em', paddingLeft: '0.3em', color: id.cores.destaque}}>{id.nome}</div>
        </div>
      </>) : (
        <div style={{position: 'absolute', left: 70, right: 70, ...(topo ? {bottom: 50} : {top: 50}), display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 20, letterSpacing: '0.25em', color: id.cores.texto, opacity: 0.8, textShadow: '0 1px 8px rgba(0,0,0,0.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Img src={arq(id.logo)} style={{height: 36, width: 'auto'}} />{id.nome}
          </div>
          <div>{i + 1}/{total}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
