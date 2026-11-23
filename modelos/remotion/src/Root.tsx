import React from 'react';
import {Composition} from 'remotion';
import {Carrossel, PropsCarrossel} from './Carrossel';
import exemplo from './exemplo-carrossel.json';
import {ReelFabrica, PropsReel} from './ReelFabrica';
import {CarrosselCena, PropsCarrosselCena} from './CarrosselCena';

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
  </>
);
