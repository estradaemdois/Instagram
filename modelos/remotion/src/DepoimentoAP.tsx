import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';

// Depoimento v2 (25/11/2026): assinatura "Paulo Rodrigues · Apometria" em destaque no topo,
// etiqueta "Depoimento após a Apometria" (ou "Relato depois da Apometria"), print ORIGINAL do WhatsApp inteiro,
// comentário num cartão separado do print e símbolo da Apometria Brasil no rodapé. Sem aviso de autorização.
export type ItemAP = {print?: string; etiqueta: string; objecao?: string; comentario?: string; separado?: boolean};
export type PropsAP = {pasta: string; fontes: {titulo: string; texto: string; texto_forte: string}; foto: string; simbolo: string; vinculo?: string; selo?: boolean; faixa?: boolean; itens: ItemAP[]};

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

export const DepoimentoAP: React.FC<PropsAP> = ({pasta, fontes, foto, simbolo, vinculo, selo, faixa, itens}) => {
  useFontes(pasta, fontes);
  const d = itens[useCurrentFrame()];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const H = d.comentario && !d.separado ? 975 : 1040, W = Math.round(H * 0.466);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(175deg, #10414B 0%, #0A2A33 50%, #061820 100%)', color: '#FFFFFF'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 8%, rgba(1,194,193,0.20) 0%, rgba(0,0,0,0) 45%)'}} />

      {/* Faixa de fundo atrás da assinatura */}
      {faixa && (
        <div style={{position: 'absolute', top: 182, left: 120, right: 120, height: 168, borderRadius: 84, overflow: 'hidden',
          background: 'linear-gradient(100deg, rgba(202,233,225,0.16) 0%, rgba(1,194,193,0.14) 55%, rgba(43,107,106,0.30) 100%)',
          border: '1px solid rgba(202,233,225,0.38)', boxShadow: '0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)'}} />
        </div>
      )}
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

      {/* Vínculo com o Instituto */}
      {vinculo && (
        <div style={{position: 'absolute', top: 352, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '9px 22px 9px 12px', borderTop: '1px solid rgba(202,233,225,0.28)', borderBottom: '1px solid rgba(202,233,225,0.28)'}}>
            <Img src={arq(simbolo)} style={{width: 40, height: 40, opacity: 0.95}} />
            <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 19, letterSpacing: '0.26em', color: MENTA}}>{vinculo.toUpperCase()}</div>
          </div>
        </div>
      )}

      {/* Etiqueta */}
      <div style={{position: 'absolute', top: vinculo ? 446 : 372, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
        <div style={{width: 90, height: 1.5, background: `linear-gradient(90deg, rgba(1,194,193,0), ${TURQ})`}} />
        <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 24, letterSpacing: '0.28em', color: TURQ}}>{d.etiqueta.toUpperCase()}</div>
        <div style={{width: 90, height: 1.5, background: `linear-gradient(90deg, ${TURQ}, rgba(1,194,193,0))`}} />
      </div>

      {/* Print original */}
      {d.print && !d.separado && <div style={{position: 'absolute', top: vinculo ? 505 : 440, left: d.comentario && !d.separado ? 52 : (1080 - W) / 2, width: W, height: H, borderRadius: 28, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
        <Img src={arq(d.print)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
      </div>}

      {/* Comentário separado */}
      {d.comentario && !d.separado && <div style={{position: 'absolute', top: vinculo ? 505 : 440, left: 52 + W + 34, right: 52, height: H, display: 'flex', alignItems: 'center'}}>
        <div style={{width: '100%', background: 'rgba(202,233,225,0.06)', border: '1.5px solid rgba(1,194,193,0.45)', borderRadius: 26, padding: '42px 34px'}}>
          <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 19, letterSpacing: '0.22em', color: TURQ}}>MUITA GENTE PERGUNTA</div>
          <div style={{fontFamily: 'AP-titulo', fontWeight: 500, fontSize: 50, lineHeight: 1.06, marginTop: 14}}>{d.objecao}</div>
          <div style={{width: 50, height: 2, background: TURQ, margin: '26px 0'}} />
          <div style={{fontFamily: 'AP-texto', fontWeight: 500, fontSize: 26, lineHeight: 1.5, opacity: 0.95}}>{d.comentario}</div>
        </div>
      </div>}

      {/* Story de comentário (separado do print) */}
      {d.separado && (
        <div style={{position: 'absolute', top: 470, left: 90, right: 90, height: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 24, letterSpacing: '0.26em', color: TURQ}}>MUITA GENTE PERGUNTA</div>
          <div style={{fontFamily: 'AP-titulo', fontWeight: 500, fontSize: 82, lineHeight: 1.04, marginTop: 20}}>“{d.objecao}”</div>
          <div style={{width: 70, height: 2, background: TURQ, margin: '44px 0 36px'}} />
          <div style={{fontFamily: 'AP-texto', fontWeight: 500, fontSize: 38, lineHeight: 1.5, opacity: 0.95, textWrap: 'pretty'} as React.CSSProperties}>{d.comentario}</div>
        </div>
      )}

      {/* Rodapé: só o símbolo da Apometria Brasil, à direita */}
      {!vinculo && !selo && (
        <div style={{position: 'absolute', top: (440 + H) + 34, right: 52, display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 160, height: 1, background: 'linear-gradient(90deg, rgba(202,233,225,0), rgba(202,233,225,0.4))'}} />
          <Img src={arq(simbolo)} style={{width: 64, height: 64, opacity: 0.92}} />
        </div>
      )}

      {/* Selo redondo do Instituto, no canto do print */}
      {selo && (() => {
        const R = 92, top = (vinculo ? 505 : 440) + H - R - 6, left = 52 + W - R + 6;
        return (
          <div style={{position: 'absolute', top: top - R + R, left: left - R + R, width: 2 * R, height: 2 * R, transform: `translate(-${0}px, -${0}px)`}}>
            <svg width={2 * R} height={2 * R} viewBox="0 0 184 184" style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.55))'}}>
              <defs>
                <path id="arco-selo" d="M 92 92 m -66 0 a 66 66 0 1 1 132 0 a 66 66 0 1 1 -132 0" />
                <linearGradient id="anel-selo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CAE9E1" /><stop offset="1" stopColor="#01C2C1" /></linearGradient>
              </defs>
              <circle cx="92" cy="92" r="90" fill="#0B2E37" />
              <circle cx="92" cy="92" r="86" fill="none" stroke="url(#anel-selo)" strokeWidth="2.5" />
              <circle cx="92" cy="92" r="50" fill="none" stroke="rgba(202,233,225,0.55)" strokeWidth="1.2" />
              <text style={{fontFamily: 'AP-texto', fontWeight: 600, fontSize: 16, letterSpacing: '0.1em'}} fill="#CAE9E1">
                <textPath href="#arco-selo" startOffset="0" textLength={410} lengthAdjust="spacing">INSTITUTO APOMETRIA BRASIL  •  </textPath>
              </text>
            </svg>
            <Img src={arq(simbolo)} style={{position: 'absolute', left: R - 36, top: R - 36, width: 72, height: 72}} />
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
