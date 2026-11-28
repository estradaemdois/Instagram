import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';

// Estilo do feed @budmedoficial (prints de 28/11/2026): fundo cinza-claro com pontilhado,
// grande anel verde com a foto em círculo no alto, logo branco no anel, título centralizado
// em Montserrat ExtraBold com duas cores de verde, caixa verde com texto branco e botão verde-escuro.
// No título, o trecho entre *asteriscos* sai no verde-vivo; o resto, no verde-escuro.
export type LaminaBM = {imagem: string; titulo: string; texto?: string; chamada?: string; foco?: string};
export type PropsBM = {pasta: string; fontes: {normal: string; media: string; forte: string}; laminas: LaminaBM[]};

export const CORES_BM = {
  fundo: '#F6F6F6',
  anel: '#01CB37',
  caixa: '#01D343',
  botao: '#009734',
  tituloEscuro: '#0A9743',
  tituloVivo: '#08CF4E',
};

const useFonte = (pasta: string, f: PropsBM['fontes']) => {
  const [h] = useState(() => delayRender('fonte BM'));
  useEffect(() => {
    Promise.all(
      [[f.normal, '500'], [f.media, '600'], [f.forte, '800']].map(([a, w]) =>
        new FontFace('BM', `url(${staticFile(`${pasta}/${a}`)})`, {weight: w}).load().then((x) => document.fonts.add(x)),
      ),
    ).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

// Logo: gota com a folha estilizada + BUDMED
const Logo: React.FC<{cor: string; y: number}> = ({cor, y}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
    <svg width={36} height={44} viewBox="0 0 46 56">
      <path d="M23 3 C30 15 41 26 41 37 A18 18 0 0 1 5 37 C5 26 16 15 23 3 Z" fill="none" stroke={cor} strokeWidth={3.5} />
      {[0, 60, 120].map((a) => (
        <line key={a} x1={23} y1={28} x2={23} y2={46} stroke={cor} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${a} 23 37)`} />
      ))}
    </svg>
    <div style={{fontFamily: 'BM', color: cor, fontSize: 16, letterSpacing: '0.06em'}}>
      <span style={{fontWeight: 800}}>BUD</span><span style={{fontWeight: 500}}>MED</span>
    </div>
  </div>
);

// Detalhe lateral: linha fina com canto arredondado + pontinhos verdes
const Lateral: React.FC<{lado: 'esq' | 'dir'}> = ({lado}) => {
  const x = lado === 'esq' ? 30 : 1050;
  return (
    <>
      <div
        style={{
          position: 'absolute', top: 600, height: 300, width: 60,
          [lado === 'esq' ? 'left' : 'right']: 30,
          border: `3px solid ${CORES_BM.anel}`,
          [lado === 'esq' ? 'borderRight' : 'borderLeft']: 'none',
          borderTop: 'none',
          [lado === 'esq' ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: 40,
        } as React.CSSProperties}
      />
      {[0, 1, 2, 3].map((k) => (
        <div key={k} style={{position: 'absolute', left: x - 7, top: 470 + k * 30, width: 14, height: 14, borderRadius: 3, background: CORES_BM.anel}} />
      ))}
    </>
  );
};

const Titulo: React.FC<{t: string; capa: boolean}> = ({t, capa}) => (
  <div style={{fontFamily: 'BM', fontWeight: 800, fontSize: capa ? 66 : 58, lineHeight: 1.08, letterSpacing: '-0.01em', textAlign: 'center', maxWidth: 800, textWrap: 'balance'} as React.CSSProperties}>
    {t.split('*').map((s, k) => (
      <span key={k} style={{color: k % 2 ? CORES_BM.tituloVivo : CORES_BM.tituloEscuro}}>{s}</span>
    ))}
  </div>
);

export const CarrosselBM: React.FC<PropsBM> = ({pasta, fontes, laminas}) => {
  useFonte(pasta, fontes);
  const i = useCurrentFrame();
  const l = laminas[i];
  const capa = i === 0;
  const cx = 540, cy = 320, rFoto = 420, rAnel = 505;
  return (
    <AbsoluteFill style={{background: CORES_BM.fundo, overflow: 'hidden'}}>
      {/* pontilhado sutil do fundo */}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(0,0,0,0.045) 1.4px, transparent 1.6px)', backgroundSize: '16px 16px'}} />
      <Lateral lado="esq" />
      <Lateral lado="dir" />
      {/* anel verde */}
      <div style={{position: 'absolute', left: cx - rAnel, top: cy - rAnel, width: rAnel * 2, height: rAnel * 2, borderRadius: '50%', background: CORES_BM.anel}} />
      {/* foto em círculo */}
      <div style={{position: 'absolute', left: cx - rFoto, top: cy - rFoto, width: rFoto * 2, height: rFoto * 2, borderRadius: '50%', overflow: 'hidden', background: '#DDE'}}>
        <Img src={staticFile(`${pasta}/${l.imagem}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: l.foco ?? 'center'}} />
      </div>
      <Logo cor="#FFFFFF" y={cy + rFoto + 10} />
      {/* textos */}
      <div style={{position: 'absolute', left: 90, right: 90, top: cy + rAnel + 34, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <Titulo t={l.titulo} capa={capa} />
        {l.texto && (
          <div style={{background: CORES_BM.caixa, color: '#FFFFFF', borderRadius: 22, padding: '20px 34px', width: '100%', boxSizing: 'border-box', fontFamily: 'BM', fontWeight: 500, fontSize: 29, lineHeight: 1.35, textAlign: 'center', textWrap: 'pretty'} as React.CSSProperties}>
            {l.texto}
          </div>
        )}
        {l.chamada && (
          <div style={{background: CORES_BM.botao, color: '#FFFFFF', borderRadius: 16, padding: '12px 30px', fontFamily: 'BM', fontWeight: 600, fontSize: 23, lineHeight: 1.3, textAlign: 'center', maxWidth: 620}}>
            {l.chamada}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
