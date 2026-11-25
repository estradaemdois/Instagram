import React from 'react';
import {Composition} from 'remotion';
import {Carrossel, PropsCarrossel} from './Carrossel';
import exemplo from './exemplo-carrossel.json';
import {ReelFabrica, PropsReel} from './ReelFabrica';
import {CarrosselCena, PropsCarrosselCena} from './CarrosselCena';
import {CarrosselAB, PropsAB} from './CarrosselAB';
import {StoryAB, PropsStoryAB} from './StoryAB';
import {VideoAB, PropsVideoAB} from './VideoAB';
import {DepoimentoAB, PropsDepo} from './DepoimentoAB';
import {DepoimentoWA, PropsWA} from './DepoimentoWA';
import {DepoimentoAP, PropsAP} from './DepoimentoAP';
import {DepoimentoCeu, PropsCeu} from './DepoimentoCeu';

// Uma lâmina por quadro (frame). Post único = carrossel de 1 lâmina.
export const Root: React.FC = () => (
  <>
  <Composition
    id="Carrossel"
    component={Carrossel}
    fps={30}
    width={1080}
    height={1350}
    durationInFrames={1}
    defaultProps={exemplo as unknown as PropsCarrossel}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.laminas.length)})}
  />
  <Composition
    id="Reel"
    component={ReelFabrica}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={30}
    defaultProps={{pasta: exemplo.pasta, identidade: exemplo.identidade, duracao: 10, falas: [], cenas: [
      {tipo: 'astral', estado: 'peso', inicio: 0, fim: 2, tela: 'Ainda *sinto* a pessoa'},
      {tipo: 'astral', estado: 'ligados', inicio: 2, fim: 4},
      {tipo: 'astral', estado: 'distancia', inicio: 4, fim: 6},
      {tipo: 'astral', estado: 'luz', inicio: 6, fim: 8},
      {tipo: 'astral', estado: 'leve', inicio: 8, fim: 10},
    ]} as unknown as PropsReel}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.duracao * 30)})}
  />
  <Composition
    id="CarrosselCena"
    component={CarrosselCena}
    fps={30}
    width={1080}
    height={1350}
    durationInFrames={1}
    defaultProps={{pasta: exemplo.pasta, identidade: exemplo.identidade, laminas: [{rotulo: 'TESTE', titulo: 'Título', texto: 'Texto', cena: 'parado', posicao: 'topo', tema: 'escuro'}]} as unknown as PropsCarrosselCena}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.laminas.length)})}
  />
  <Composition
    id="CarrosselAB"
    component={CarrosselAB}
    fps={30}
    width={1080}
    height={1350}
    durationInFrames={1}
    defaultProps={{pasta: exemplo.pasta, fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, logo: 'logo.png', laminas: [{imagem: 's1.jpg', titulo: 'Teste'}]} as unknown as PropsAB}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.laminas.length)})}
  />
  <Composition
    id="StoryAB"
    component={StoryAB}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1}
    defaultProps={{pasta: exemplo.pasta, fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, assinatura: {nome: 'x', foto: 'x'}, stories: [{imagem: 's1.jpg', rotulo: 'x', titulo: 'x'}]} as unknown as PropsStoryAB}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.stories.length)})}
  />
  <Composition
    id="VideoAB"
    component={VideoAB}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={300}
    defaultProps={{pasta: 'x', fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, assinatura: {nome: 'x', foto: 'x'}, video: 'v.mp4', formato: 'reel', duracao: 10, titulo: 'x'} as unknown as PropsVideoAB}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(((props.duracao_video ?? props.duracao) + (props.telas?.length ?? 0) * (props.duracao_tela ?? 5)) * 30), height: props.formato === 'feed' ? 1350 : 1920})}
  />
  <Composition
    id="DepoimentoAB"
    component={DepoimentoAB}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1}
    defaultProps={{pasta: 'x', fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, assinatura: {nome: 'x', foto: 'x'}, aviso: '', itens: [{print: 'x', objecao: 'x', comentario: 'x'}]} as unknown as PropsDepo}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.itens.length)})}
  />
  <Composition
    id="DepoimentoWA"
    component={DepoimentoWA}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1}
    defaultProps={{pasta: 'x', fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, assinatura: {nome: 'x', foto: 'x'}, aviso: '', itens: [{print: 'x', modo: 'print', objecao: 'x', comentario: 'x'}]} as unknown as PropsWA}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.itens.length)})}
  />
  <Composition
    id="DepoimentoAP"
    component={DepoimentoAP}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1}
    defaultProps={{pasta: 'x', fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, foto: 'x', simbolo: 'x', itens: [{print: 'x', etiqueta: 'x', objecao: 'x', comentario: 'x'}]} as unknown as PropsAP}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.itens.length)})}
  />
  <Composition
    id="DepoimentoCeu"
    component={DepoimentoCeu}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1}
    defaultProps={{pasta: 'x', fundo: 'x', fontes: {titulo: 'x', texto: 'x', texto_forte: 'x'}, assinatura: {nome: 'x', foto: 'x'}, simbolo: 'x', itens: [{print: 'x', rotulo: 'x'}]} as unknown as PropsCeu}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, props.itens.length)})}
  />
  </>
);
