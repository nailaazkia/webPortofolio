import { useEffect, useState } from 'react';

export default function Spotlight() {
  const [coords, setCoords] = useState({ x: '0px', y: '0px' });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for high-performance visual updates
      requestAnimationFrame(() => {
        setCoords({
          x: `${e.clientX}px`,
          y: `${e.clientY}px`,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="custom-spotlight hidden md:block"
      style={{
        // Define coordinates locally
        '--x': coords.x,
        '--y': coords.y,
      } as React.CSSProperties}
    />
  );
}
