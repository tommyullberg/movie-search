import React from 'react';


export interface GaugeSVGProps {
  id: number;
  vote_average: number;
}

export function GaugeSVG({id, vote_average}: GaugeSVGProps) {
  const gaugeSrc = process.env.PUBLIC_URL + '/images/gauge.svg';
  return (
    <object
      id={`gauge${id}`}
      data-value={vote_average}
      className='gauges'
      data={gaugeSrc}
      type='image/svg+xml'>
      Gauge
    </object>
  );
}
