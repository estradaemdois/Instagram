import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';

// Depoimento suave na paleta da marca: creme/areia/sálvia no fundo, verde-petróleo nos textos.
// Print ORIGINAL do WhatsApp inteiro no centro; assinatura do Paulo à esquerda e símbolo à direita no rodapé.
export type ItemSoft = {print: string; rotulo: string};
export type PropsSoft = {pasta: string; fontes: {titulo: string; texto: string; texto_forte: string}; assinatura: {nome: string; cargo?: string; foto: string}; simbolo: string; itens: ItemSoft[]};

const PET = '#14464A', PET_M = '#1C5F63', CREME = '#FAF7F0', AREIA = '#F4EFE6', LINHO = '#E1D9C7', SALVIA = '#C6D4CF';

const useFontes = (pasta: string, f: PropsSoft['fontes']) => {
  const [h] = useState(() => delayRender('fontes soft'));
  useEffect(() => {
    Promise.all([
      new FontFace('SO-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('SO-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('SO-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

export const DepoimentoSoft: React.FC<PropsSoft> = ({pasta, fontes, assinatura, simbolo, itens}) => {
  useFontes(pasta, fontes);
  const d = itens[useCurrentFrame()];
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const H = 1100, W = Math.round(H * 0.466), topo = 320;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${CREME} 0%, ${AREIA} 55%, #EDEBE3 100%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, rgba(198,212,207,0.55) 0%, rgba(198,212,207,0) 55%)`}} />
      {/* rótulo discreto */}
      <div style={{position: 'absolute', top: 238, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <div style={{width: 70, height: 1, background: SALVIA}} />
        <div style={{fontFamily: 'SO-texto', fontWeight: 600, fontSize: 22, letterSpacing: '0.3em', color: PET_M}}>{d.rotulo.toUpperCase()}</div>
        <div style={{width: 70, height: 1, background: SALVIA}} />
      </div>
      {/* print original */}
      <div style={{position: 'absolute', top: topo, left: (1080 - W) / 2, width: W, height: H, borderRadius: 30, overflow: 'hidden', border: `1px solid ${LINHO}`, boxShadow: '0 24px 60px rgba(20,70,74,0.16), 0 4px 14px rgba(20,70,74,0.08)'}}>
        <Img src={arq(d.print)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
      </div>
      {/* rodapé: assinatura sobre faixa verde-petróleo */}
      <div style={{position: 'absolute', top: topo + H + 36, left: 70, right: 70, height: 124, borderRadius: 62, overflow: 'hidden',
        background: `linear-gradient(100deg, ${PET} 0%, ${PET_M} 60%, #2B6B6A 100%)`, boxShadow: '0 16px 40px rgba(20,70,74,0.25)'}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 0%, rgba(198,212,207,0.28) 0%, rgba(198,212,207,0) 55%)'}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 62, border: '1px solid rgba(198,212,207,0.35)'}} />
        <div style={{position: 'absolute', left: 22, top: 0, bottom: 0, right: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Img src={arq(assinatura.foto)} style={{width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${SALVIA}`}} />
            <div>
              <div style={{fontFamily: 'SO-titulo', fontWeight: 500, fontSize: 44, lineHeight: 1, color: CREME}}>{assinatura.nome}</div>
              {assinatura.cargo && <div style={{fontFamily: 'SO-texto', fontWeight: 600, fontSize: 18, letterSpacing: '0.36em', marginTop: 8, color: SALVIA}}>{assinatura.cargo.toUpperCase()}</div>}
            </div>
          </div>
          <Img src={arq(simbolo)} style={{width: 60, height: 60, opacity: 0.9}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
