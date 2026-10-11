import React from 'react';

export interface GaugeSVGProps {
  id: number;
  vote_average: number;
}

const COLOR_MAP: Record<number, string> = {
  0: '#ef4444',
  1: '#f97316',
  2: '#f97316',
  3: '#f59e0b',
  4: '#f59e0b',
  5: '#eab308',
  6: '#84cc16',
  7: '#84cc16',
  8: '#22c55e',
  9: '#10b981',
  10: '#10b981'
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
  const colorVal = COLOR_MAP[Math.floor(safeVote)] || '#22c55e';
  const textVal = roundToDecimalIfNeeded(safeVote);

  return (
    <svg
      id={`gauge${id}`}
      className="gauges"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 230"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      role="img"
      aria-label={`Rating: ${textVal} out of 10`}
      style={{ backgroundColor: 'transparent' }}
    >
      <title>{`User rating: ${textVal} out of 10`}</title>
      <g transform="translate(-30.329734 -227.351097)">
        <circle
          cx="145.329734"
          cy="325.695406"
          r="77.895406"
          fill="#09090b"
          stroke="#27272a"
          strokeWidth="6"
        />
        <ellipse
          rx="77.895406"
          ry="77.895406"
          transform="matrix(0 -1 -1 0 145.329734 325.695406)"
          fill="none"
          stroke="#3f3f46"
          strokeWidth="22"
          strokeMiterlimit="1"
          strokeDasharray="489.43"
        />
        <ellipse
          rx="77.895406"
          ry="77.895406"
          transform="matrix(0 -1 1 0 145.329734 325.695406)"
          fill="none"
          stroke={colorVal}
          strokeWidth="22"
          strokeMiterlimit="1"
          strokeDashoffset={strokeDashoffset}
          strokeDasharray="489.43"
        />
      </g>
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="56"
        fontWeight="800"
        fill="#ffffff"
      >
        {textVal}
      </text>
    </svg>
  );
}

export { GaugeSVG as Gauge };
