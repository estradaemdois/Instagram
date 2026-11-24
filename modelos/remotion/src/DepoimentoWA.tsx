import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';

// Depoimento com o print ORIGINAL do WhatsApp (inteiro, sem recorte: é o que mostra veracidade).
// modo "print": só o print, grande; "comentario": story seguinte com o trecho, a objeção e o comentário;
// "junto": print à esquerda e comentário à direita na mesma imagem.
export type ItemWA = {print: string; modo: 'print' | 'comentario' | 'junto'; trecho?: string; objecao: string; comentario: string};
export type PropsWA = {pasta: string; fontes: {titulo: string; texto: string; texto_forte: string}; assinatura: {nome: string; cargo?: string; foto: string}; aviso: string; itens: ItemWA[]};

const useFontes = (pasta: string, f: PropsWA['fontes']) => {
  const [h] = useState(() => delayRender('fontes WA'));
  useEffect(() => {
    Promise.all([
      new FontFace('WA-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('WA-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('WA-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

export const DepoimentoWA: React.FC<PropsWA> = ({pasta, fontes, assinatura, aviso, itens}) => {
  useFontes(pasta, fontes);
  const d = itens[useCurrentFrame()];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const Rotulo = () => <div style={{display: 'inline-block', background: 'rgba(0,160,170,0.8)', padding: '7px 16px', fontFamily: 'WA-texto', fontWeight: 600, fontSize: 26, letterSpacing: '0.08em'}}>DEPOIMENTO</div>;
  const Assin = ({t = 1}: {t?: number}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <Img src={arq(assinatura.foto)} style={{width: 62 * t, height: 62 * t, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)'}} />
      <div>
        <div style={{fontFamily: 'WA-titulo', fontWeight: 500, fontSize: 34 * t, lineHeight: 1}}>{assinatura.nome}</div>
        {assinatura.cargo && <div style={{fontFamily: 'WA-texto', fontWeight: 600, fontSize: 17 * t, letterSpacing: '0.3em', marginTop: 6, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
      </div>
    </div>
  );
  const Print = ({h}: {h: number}) => (
    <div style={{height: h, borderRadius: 28, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', display: 'inline-block'}}>
      <Img src={arq(d.print)} style={{height: '100%', display: 'block'}} />
    </div>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(170deg, #12404A 0%, #0B2A33 45%, #071C24 100%)', color: '#FFFFFF'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 80% 12%, rgba(120,220,230,0.16) 0%, rgba(0,0,0,0) 40%)'}} />
      {d.modo === 'print' && (
        <>
          <div style={{position: 'absolute', top: 215, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><Rotulo /></div>
          <div style={{position: 'absolute', top: 285, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><Print h={1300} /></div>
          <div style={{position: 'absolute', top: 1612, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><Assin t={0.8} /></div>
        </>
      )}
      {d.modo === 'comentario' && (
        <div style={{position: 'absolute', left: 80, right: 80, top: 300, bottom: 440, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div><Rotulo /></div>
          {d.trecho && <div style={{fontFamily: 'WA-titulo', fontWeight: 500, fontStyle: 'normal', fontSize: 64, lineHeight: 1.12, marginTop: 40, opacity: 0.95}}>“{d.trecho}”</div>}
          <div style={{width: 80, height: 3, background: '#01C2C1', margin: '54px 0 28px'}} />
          <div style={{fontFamily: 'WA-texto', fontWeight: 600, fontSize: 30, letterSpacing: '0.04em', opacity: 0.75}}>MUITA GENTE PERGUNTA</div>
          <div style={{fontFamily: 'WA-titulo', fontWeight: 500, fontSize: 70, lineHeight: 1.05, marginTop: 10}}>{d.objecao}</div>
          <div style={{fontFamily: 'WA-texto', fontWeight: 500, fontSize: 36, lineHeight: 1.45, marginTop: 22, opacity: 0.95, textWrap: 'pretty'} as React.CSSProperties}>{d.comentario}</div>
          <div style={{marginTop: 50}}><Assin /></div>
          <div style={{fontFamily: 'WA-texto', fontWeight: 500, fontSize: 21, opacity: 0.6, marginTop: 20}}>{aviso}</div>
        </div>
      )}
      {d.modo === 'junto' && (
        <>
          <div style={{position: 'absolute', top: 230, left: 50}}><Rotulo /></div>
          <div style={{position: 'absolute', top: 300, left: 50}}><Print h={1200} /></div>
          <div style={{position: 'absolute', top: 300, left: 50 + 1200 * 0.466 + 46, right: 50, height: 1200, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{width: 60, height: 3, background: '#01C2C1', marginBottom: 22}} />
            <div style={{fontFamily: 'WA-texto', fontWeight: 600, fontSize: 21, letterSpacing: '0.06em', opacity: 0.75}}>MUITA GENTE PERGUNTA</div>
            <div style={{fontFamily: 'WA-titulo', fontWeight: 500, fontSize: 50, lineHeight: 1.06, marginTop: 10}}>{d.objecao}</div>
            <div style={{fontFamily: 'WA-texto', fontWeight: 500, fontSize: 27, lineHeight: 1.45, marginTop: 20, opacity: 0.95}}>{d.comentario}</div>
          </div>
          <div style={{position: 'absolute', top: 1540, left: 50}}><Assin t={0.85} /></div>
          <div style={{position: 'absolute', top: 1545, right: 50, width: 400, textAlign: 'right', fontFamily: 'WA-texto', fontWeight: 500, fontSize: 19, lineHeight: 1.35, opacity: 0.6}}>{aviso}</div>
        </>
      )}
    </AbsoluteFill>
  );
};
