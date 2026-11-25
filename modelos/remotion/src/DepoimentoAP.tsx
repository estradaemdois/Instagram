import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';

// Depoimento v2 (25/11/2026): assinatura "Paulo Rodrigues · Apometria" em destaque no topo,
// etiqueta "Depoimento após a Apometria" (ou "Relato depois da Apometria"), print ORIGINAL do WhatsApp inteiro,
// comentário num cartão separado do print e símbolo da Apometria Brasil no rodapé. Sem aviso de autorização.
export type ItemAP = {print: string; etiqueta: string; objecao: string; comentario: string};
export type PropsAP = {pasta: string; fontes: {titulo: string; texto: string; texto_forte: string}; foto: string; simbolo: string; itens: ItemAP[]};

const useFontes = (pasta: string, f: PropsAP['fontes']) => {
  const [h] = useState(() => delayRender('fontes AP'));
  useEffect(() => {
    Promise.all([
      new FontFace('AP-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('AP-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('AP-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

const TURQ = '#01C2C1', MENTA = '#CAE9E1';

export const DepoimentoAP: React.FC<PropsAP> = ({pasta, fontes, foto, simbolo, itens}) => {
  useFontes(pasta, fontes);
  const d = itens[useCurrentFrame()];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const H = 1010, W = Math.round(H * 0.466);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(175deg, #10414B 0%, #0A2A33 50%, #061820 100%)', color: '#FFFFFF'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 8%, rgba(1,194,193,0.20) 0%, rgba(0,0,0,0) 45%)'}} />

      {/* Assinatura em destaque */}
      <div style={{position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28}}>
        <div style={{width: 112, height: 112, borderRadius: '50%', padding: 4, background: `linear-gradient(140deg, ${TURQ}, ${MENTA})`}}>
          <Img src={arq(foto)} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0A2A33'}} />
        </div>
        <div>
          <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 25, letterSpacing: '0.42em', color: MENTA, marginLeft: 4}}>PAULO RODRIGUES</div>
          <div style={{fontFamily: 'AP-titulo', fontWeight: 500, fontSize: 104, lineHeight: 0.95, letterSpacing: '0.02em',
            background: `linear-gradient(90deg, #FFFFFF 0%, ${MENTA} 45%, ${TURQ} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>Apometria</div>
        </div>
      </div>

      {/* Etiqueta */}
      <div style={{position: 'absolute', top: 372, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
        <div style={{width: 90, height: 1.5, background: `linear-gradient(90deg, rgba(1,194,193,0), ${TURQ})`}} />
        <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 24, letterSpacing: '0.28em', color: TURQ}}>{d.etiqueta.toUpperCase()}</div>
        <div style={{width: 90, height: 1.5, background: `linear-gradient(90deg, ${TURQ}, rgba(1,194,193,0))`}} />
      </div>

      {/* Print original */}
      <div style={{position: 'absolute', top: 440, left: 52, width: W, height: H, borderRadius: 28, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
        <Img src={arq(d.print)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
      </div>

      {/* Comentário separado */}
      <div style={{position: 'absolute', top: 440, left: 52 + W + 34, right: 52, height: H, display: 'flex', alignItems: 'center'}}>
        <div style={{width: '100%', background: 'rgba(202,233,225,0.06)', border: '1.5px solid rgba(1,194,193,0.45)', borderRadius: 26, padding: '42px 34px'}}>
          <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 19, letterSpacing: '0.22em', color: TURQ}}>MUITA GENTE PERGUNTA</div>
          <div style={{fontFamily: 'AP-titulo', fontWeight: 500, fontSize: 50, lineHeight: 1.06, marginTop: 14}}>{d.objecao}</div>
          <div style={{width: 50, height: 2, background: TURQ, margin: '26px 0'}} />
          <div style={{fontFamily: 'AP-texto', fontWeight: 500, fontSize: 26, lineHeight: 1.5, opacity: 0.95}}>{d.comentario}</div>
        </div>
      </div>

      {/* Rodapé com símbolo */}
      <div style={{position: 'absolute', top: 1490, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <div style={{width: 120, height: 1, background: 'rgba(202,233,225,0.35)'}} />
        <Img src={arq(simbolo)} style={{width: 58, height: 58, opacity: 0.9}} />
        <div style={{width: 120, height: 1, background: 'rgba(202,233,225,0.35)'}} />
      </div>
    </AbsoluteFill>
  );
};
