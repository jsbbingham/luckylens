interface BallDisplayProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * A lottery ball display component
 * Shows a number inside a colored ball
 */
export function BallDisplay({ 
  number, 
  size = 'md',
  color,
  className = ''
}: BallDisplayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const defaultColor = 'bg-lucky-ball-red';

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center
        font-bold text-white shadow-md
        ${color || defaultColor}
        ${className}
      `}
      style={color ? { backgroundColor: color } : undefined}
    >
      {number}
    </div>
  );
}
