import React from 'react';
import {Composition} from 'remotion';
import {Carrossel, PropsCarrossel} from './Carrossel';
import exemplo from './exemplo-carrossel.json';

// Uma lâmina por quadro (frame). Post único = carrossel de 1 lâmina.
export const Root: React.FC = () => (
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
);
