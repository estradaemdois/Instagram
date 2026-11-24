import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';

// ---------- Tipos (o contrato que a Lente escreve em 07-storyboard.json) ----------
export type Fonte = {arquivo: string; peso: string; estilo?: 'normal' | 'italic'};
export type Identidade = {
  nome: string;                 // assinatura, ex.: "APOMETRIA BRASIL"
  logo: string;                 // arquivo dentro da pasta da produção (ex.: "logo.png")
  cores: {escuro: string; marca: string; texto: string; destaque: string}; // escuro/marca em "R,G,B"
  fontes: {titulo: Fonte; titulo_italico: Fonte; texto: Fonte; rotulo: Fonte};
  // Opcional: assinatura pessoal (ex.: terapeuta) no lugar do logo + nome da marca
  assinatura?: {nome: string; cargo?: string; foto: string};
};
export type Lamina = {
  rotulo: string;               // linha pequena acima do título (caixa alta)
  titulo: string;               // "*trecho*" = itálico na cor de destaque; " / " = quebra de linha
  texto: string;                // texto de apoio
  imagem: string;               // arquivo dentro da pasta da produção
  tom: 'escuro' | 'marca' | 'claro'; // força do degradê por cima da foto
  topo?: number;                // opcional: fixa o topo do bloco (px). Sem ele, o bloco fica ancorado embaixo, logo acima da assinatura
  chamada?: string;             // linha extra em destaque (ex.: "Arraste para o lado →")
};
export type PropsCarrossel = {pasta: string; identidade: Identidade; laminas: Lamina[]};

// ---------- Fontes carregadas a partir do kit da marca ----------
const familia = (papel: string) => `Fabrica-${papel}`;
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

// "*trecho*" vira itálico em destaque; pontuação colada ao trecho fica na cor do texto
const Titulo: React.FC<{txt: string; size: number; id: Identidade}> = ({txt, size, id}) => (
  <div style={{fontFamily: familia('titulo'), fontWeight: Number(id.fontes.titulo.peso), fontSize: size, lineHeight: 1.25, color: id.cores.texto, textWrap: 'balance'} as React.CSSProperties}>
    {txt.split(' / ').map((linha, i) => (
      <div key={i}>
        {linha.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, k) => {
          if (!p.startsWith('*')) return <span key={k}>{p}</span>;
          const miolo = p.slice(1, -1);
          const m = miolo.match(/^(.*?)([.,!?;:…]*)$/)!;
          return (
            <span key={k}>
              <span style={{fontStyle: 'italic', color: id.cores.destaque}}>{m[1]}</span>
              {m[2]}
            </span>
          );
        })}
      </div>
    ))}
  </div>
);

const degrade = (tom: Lamina['tom'], id: Identidade) => {
  const c = tom === 'escuro' ? id.cores.escuro : id.cores.marca;
  if (tom === 'claro')
    return `linear-gradient(180deg, rgba(${c},0) 0%, rgba(${c},0) 20%, rgba(${c},0.55) 31%, rgba(${c},0.86) 42%, rgba(${c},0.92) 100%)`;
  return `linear-gradient(180deg, rgba(${c},0.10) 0%, rgba(${c},0) 22%, rgba(${c},0.55) 42%, rgba(${c},0.84) 62%, rgba(${c},0.92) 100%)`;
};

export const Carrossel: React.FC<PropsCarrossel> = ({pasta, identidade: id, laminas}) => {
  useFontes(pasta, id);
  const i = useCurrentFrame();
  const l = laminas[i];
  const total = laminas.length;
  const capa = i === 0 && total > 1;
  const ultima = i === total - 1;
  const arq = (a: string) => staticFile(`${pasta}/${a}`);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={arq(l.imagem)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: degrade(l.tom, id)}} />
      {/* Bloco ancorado embaixo: termina acima do rodapé (ou do logo, na última lâmina) */}
      <div style={{position: 'absolute', left: 80, width: 920, textAlign: 'center', textWrap: 'pretty', ...(l.topo ? {top: l.topo} : {bottom: ultima ? 1350 - 1080 : 1350 - 1210})} as React.CSSProperties}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 34}}>
          <div style={{width: 50, height: 1.5, background: id.cores.destaque}} />
          <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 24, letterSpacing: '0.28em', paddingLeft: '0.28em', color: id.cores.destaque}}>{l.rotulo}</div>
          <div style={{width: 50, height: 1.5, background: id.cores.destaque}} />
        </div>
        <Titulo txt={l.titulo} size={capa ? 80 : 64} id={id} />
        <div style={{fontFamily: familia('texto'), fontWeight: Number(id.fontes.texto.peso), fontSize: capa ? 38 : 35, lineHeight: 1.45, color: id.cores.texto, marginTop: 34, opacity: 0.94}}>{l.texto}</div>
        {l.chamada && <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 28, letterSpacing: '0.08em', color: id.cores.destaque, marginTop: 46}}>{l.chamada}</div>}
      </div>
      {ultima ? (
        id.assinatura ? (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
            <Img src={arq(id.assinatura.foto)} style={{width: 108, height: 108, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${id.cores.destaque}`}} />
            <div style={{textAlign: 'left'}}>
              {id.assinatura.cargo && <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 22, letterSpacing: '0.25em', color: id.cores.destaque}}>{id.assinatura.cargo.toUpperCase()}</div>}
              <div style={{fontFamily: familia('titulo'), fontWeight: 500, fontSize: 46, color: id.cores.texto, lineHeight: 1.1}}>{id.assinatura.nome}</div>
            </div>
          </div>
        ) : (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 1120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <Img src={arq(id.logo)} style={{height: 76, width: 'auto'}} />
          <div style={{fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 32, letterSpacing: '0.3em', paddingLeft: '0.3em', color: id.cores.destaque}}>{id.nome}</div>
        </div>
        )
      ) : (
        <div style={{position: 'absolute', left: 80, right: 80, top: 1250, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: familia('rotulo'), fontWeight: Number(id.fontes.rotulo.peso), fontSize: 22, letterSpacing: '0.25em', color: id.cores.texto, opacity: 0.75}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            {id.assinatura
              ? <><Img src={arq(id.assinatura.foto)} style={{width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${id.cores.destaque}`}} /><span style={{letterSpacing: '0.12em'}}>{[id.assinatura.cargo, id.assinatura.nome].filter(Boolean).join(' ').toUpperCase()}</span></>
              : <><Img src={arq(id.logo)} style={{height: 40, width: 'auto'}} />{id.nome}</>}
          </div>
          <div>{i + 1}/{total}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
