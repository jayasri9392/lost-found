import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const VantaBackground = ({
  color = 0x06b6d4, // Cyan/Teal accent for ILFN brand
  backgroundColor = 0x070b14, // Deep futuristic dark navy
  points = 10.0,
  maxDistance = 22.0,
  spacing = 16.0,
  showDots = true,
  className = '',
  style = {}
}) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    // Ensure THREE is globally available for Vanta if needed
    if (typeof window !== 'undefined' && !window.THREE) {
      window.THREE = THREE;
    }

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let effect = null;
    if (vantaRef.current && !vantaEffect && !prefersReducedMotion) {
      try {
        const netInitializer = typeof NET === 'function' ? NET : NET.default;
        effect = netInitializer({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 0.75, // Optimize scaling on mobile screens
          color,
          backgroundColor,
          points,
          maxDistance,
          spacing,
          showDots
        });
        setVantaEffect(effect);
      } catch (err) {
        console.warn('Vanta.NET initialization deferred or unsupported:', err);
      }
    }

    return () => {
      if (effect) {
        try {
          effect.destroy();
        } catch (_) {}
      }
      setVantaEffect(null);
    };
  }, [color, backgroundColor, points, maxDistance, spacing, showDots]);

  return (
    <div
      ref={vantaRef}
      className={`vanta-background absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
      aria-hidden="true"
    />
  );
};

export default VantaBackground;
