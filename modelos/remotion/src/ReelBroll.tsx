import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender, interpolate} from 'remotion';

// Reels com imagens/vídeos representativos em tela cheia e o Paulo em miniatura redonda (ele lia o teleprompter).
// A voz vem do vídeo do Paulo; legenda palavra a palavra; título e assinatura no alto; símbolo pequeno no canto.
type Palavra = {p: string; i: number; f: number};
export type Cena = {arquivo: string; tipo: 'video' | 'imagem'; ini: number; fim: number; foco?: string; inicio_no_arquivo?: number; zoom?: [number, number]; inteira?: boolean};
export type PropsReelBroll = {
  pasta: string; fala: string; duracao: number; blocos: Palavra[][]; cenas: Cena[];
  fontes: {titulo: string; texto: string; texto_forte: string};
  assinatura: {nome: string; cargo?: string; foto: string};
  titulo: string; simbolo?: string; chamada_final?: string;
  mini: {x: number; y: number; zoom: number; largura: number; altura: number}; // centro do rosto (0–1) e tamanho do vídeo de fala
};

const useFontes = (pasta: string, f: PropsReelBroll['fontes']) => {
  const [h] = useState(() => delayRender('fontes broll'));
  useEffect(() => {
    Promise.all([
      new FontFace('RB-titulo', `url(${staticFile(`${pasta}/${f.titulo}`)})`, {weight: '500'}).load(),
      new FontFace('RB-texto', `url(${staticFile(`${pasta}/${f.texto}`)})`, {weight: '500'}).load(),
      new FontFace('RB-texto', `url(${staticFile(`${pasta}/${f.texto_forte}`)})`, {weight: '600'}).load(),
    ].map((p) => p.then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h, pasta, f]);
};

const X = 8; // quadros de transição
const CenaView: React.FC<{c: Cena; arq: (a: string) => string; dur: number; primeira: boolean}> = ({c, arq, dur, primeira}) => {
  const f = useCurrentFrame();
  const [z0, z1] = c.zoom ?? [1.0, 1.07];
  const z = interpolate(f, [0, dur], [z0, z1]);
  const op = primeira ? 1 : interpolate(f, [0, X], [0, 1], {extrapolateRight: 'clamp'});
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.foco ?? 'center', transform: `scale(${z})`};
  return (
    <AbsoluteFill style={{opacity: op}}>
      {c.tipo === 'video'
        ? <OffthreadVideo src={arq(c.arquivo)} muted startFrom={Math.round((c.inicio_no_arquivo ?? 0) * 30)} style={st} />
        : c.inteira
          ? <>
              <Img src={arq(c.arquivo)} style={{...st, filter: 'blur(28px) brightness(0.7)', transform: 'scale(1.3)'}} />
              <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', top: -120}}>
                <Img src={arq(c.arquivo)} style={{width: '100%', objectFit: 'contain', transform: `scale(${z})`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}} />
              </AbsoluteFill>
            </>
          : <Img src={arq(c.arquivo)} style={st} />}
    </AbsoluteFill>
  );
};

export const ReelBroll: React.FC<PropsReelBroll> = ({pasta, fala, duracao, blocos, cenas, fontes, assinatura, titulo, simbolo, chamada_final, mini}) => {
  useFontes(pasta, fontes);
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = fr / fps;
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  const bloco = blocos.find((b) => t >= b[0].i - 0.05 && t <= b[b.length - 1].f + 0.12);
  const D = 430; // diâmetro da miniatura
  const fimChamada = duracao - 3;
  // vídeo de fala escalado para que a altura do rosto ocupe a miniatura
  const esc = (D * mini.zoom) / mini.largura;
  const W = mini.largura * esc, H = mini.altura * esc;
  return (
    <AbsoluteFill style={{background: '#0C2430'}}>
      {cenas.map((c, k) => {
        const ini = Math.round(c.ini * fps) - (k > 0 ? X : 0);
        const dur = Math.round(c.fim * fps) - ini;
        return (
          <Sequence key={k} from={ini} durationInFrames={dur}>
            <CenaView c={c} arq={arq} dur={dur} primeira={k === 0} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,28,38,0.75) 0%, rgba(8,28,38,0.35) 20%, rgba(8,28,38,0) 34%, rgba(8,28,38,0) 56%, rgba(8,28,38,0.55) 76%, rgba(8,28,38,0.82) 100%)'}} />
      {/* título e assinatura */}
      <div style={{position: 'absolute', top: 230, left: 70, right: 70, color: '#FFFFFF', textShadow: '0 2px 18px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: 'RB-titulo', fontWeight: 500, fontSize: 84, lineHeight: 1.02}}>{titulo.split(' / ').map((x, k) => <div key={k}>{x}</div>)}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 20}}>
          <Img src={arq(assinatura.foto)} style={{width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.9)'}} />
          <div>
            <div style={{fontFamily: 'RB-titulo', fontWeight: 500, fontSize: 32, lineHeight: 1}}>{assinatura.nome}</div>
            {assinatura.cargo && <div style={{fontFamily: 'RB-texto', fontWeight: 600, fontSize: 16, letterSpacing: '0.3em', marginTop: 5, opacity: 0.9}}>{assinatura.cargo.toUpperCase()}</div>}
          </div>
        </div>
      </div>
      {/* miniatura do Paulo falando (a voz vem daqui) */}
      <div style={{position: 'absolute', left: 50, top: 1010, width: D, height: D, borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.92)', boxShadow: '0 16px 40px rgba(0,0,0,0.55)', background: '#000'}}>
        <div style={{position: 'absolute', width: W, height: H, left: D / 2 - mini.x * W, top: D / 2 - mini.y * H}}>
          <OffthreadVideo src={arq(fala)} style={{width: '100%', height: '100%'}} />
        </div>
      </div>
      {/* legenda */}
      {bloco && (
        <div style={{position: 'absolute', left: 70, right: 70, top: 1480, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 14px', fontFamily: 'RB-texto', fontWeight: 600, fontSize: 54, lineHeight: 1.12, textAlign: 'center'}}>
          {bloco.map((w, k) => {
            const ativa = t >= w.i - 0.03 && t <= w.f + 0.05;
            return <span key={k} style={{color: ativa ? '#01C2C1' : '#FFFFFF', opacity: t >= w.i - 0.03 ? 1 : 0.55, textShadow: '0 3px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)'}}>{w.p}</span>;
          })}
        </div>
      )}
      {chamada_final && t > fimChamada && (
        <div style={{position: 'absolute', left: 70, top: 600, opacity: interpolate(t, [fimChamada, fimChamada + 0.4], [0, 1], {extrapolateRight: 'clamp'})}}>
          <div style={{background: 'rgba(1,160,160,0.92)', borderRadius: 40, padding: '16px 34px', fontFamily: 'RB-texto', fontWeight: 600, fontSize: 34, color: '#FFFFFF'}}>{chamada_final}</div>
        </div>
      )}
      {simbolo && <Img src={arq(simbolo)} style={{position: 'absolute', right: 36, bottom: 40, width: 46, height: 46, opacity: 0.85}} />}
    </AbsoluteFill>
  );
};
