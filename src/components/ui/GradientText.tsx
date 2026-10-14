import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  angle?: string | number;
  disabled?: boolean;
}

export function GradientText({
  children,
  className = '',
  colors = ['#4ade80', '#ffffff', '#22c55e', '#a7f3d0', '#4ade80'],
  animationSpeed = 8,
  angle = '40deg',
  disabled = false,
}: GradientTextProps) {
  if (disabled) {
    return <span className={className}>{children}</span>;
  }

  const angleVal = typeof angle === 'number' ? `${angle}deg` : angle;

  const gradientStyle = {
    backgroundImage: `linear-gradient(${angleVal}, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span
      className={`inline-block bg-cover bg-clip-text text-transparent animate-gradient-text ${className}`}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
