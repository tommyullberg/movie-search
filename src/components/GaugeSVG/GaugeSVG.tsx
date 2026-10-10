import React from 'react';

export interface GaugeSVGProps {
  id: number;
  vote_average: number;
}

const COLOR_MAP: Record<number, string> = {
  0: '#db2400',
  1: '#dc4300',
  2: '#da5b00',
  3: '#d57100',
  4: '#cd8600',
  5: '#c19900',
  6: '#b2ac00',
  7: '#9fbe00',
  8: '#86ce00',
  9: '#62df00',
  10: '#00ee00'
};

const roundToDecimalIfNeeded = (val: number) => {
  if (Number.isInteger(val)) {
    return val.toString();
  }
  return val.toFixed(1);
};

export function GaugeSVG({ id, vote_average }: GaugeSVGProps) {
  const maxGaugeValue = 490.0;
  
  const safeVote = vote_average || 0;
  // Calculate value and color
  const decimalPercent = (safeVote * 10.0) / 100.0;
  const strokeDashoffset = maxGaugeValue - (decimalPercent * maxGaugeValue);
  const colorVal = COLOR_MAP[Math.floor(safeVote)] || '#00ee00';
  const textVal = roundToDecimalIfNeeded(safeVote);

  return (
    <svg
      id={`gauge${id}`}
      className='gauges'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 230 230'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      style={{ backgroundColor: 'transparent' }}>
      <g transform='translate(-30.329734 -227.351097)'>
        <circle
          cx='145.329734'
          cy='325.695406'
          r='77.895406'
          fill='#000000'
        />
        <ellipse
          rx='77.895406'
          ry='77.895406'
          transform='matrix(0 -1 -1 0 145.329734 325.695406)'
          fill='none'
          stroke='#333333'
          strokeWidth='20'
          strokeMiterlimit='1'
          strokeDasharray='489.43'
        />
        <ellipse
          rx='77.895406'
          ry='77.895406'
          transform='matrix(0 -1 1 0 145.329734 325.695406)'
          fill='none'
          stroke={colorVal}
          strokeWidth='20'
          strokeMiterlimit='1'
          strokeDashoffset={strokeDashoffset}
          strokeDasharray='489.43'
        />
      </g>
      <text
        x='50%'
        y='47%'
        textAnchor='middle'
        alignmentBaseline='middle'
        fontFamily="'Orbitron', Arial, sans-serif"
        fontSize='50'
        fontWeight='900'
        fill={colorVal}>
        {textVal}
      </text>
    </svg>
  );
}
