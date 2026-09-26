import React from 'react';
import PixelBlast from '../effects/PixelBlast';

const PixelBlastBackground = ({
  color = '#B497CF',
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`pixel-blast-bg-wrapper fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
        ...style
      }}
      aria-hidden="true"
    >
      {/* Background base tone */}
      <div className="absolute inset-0 bg-slate-950/60" />

      {/* Interactive PixelBlast Canvas */}
      <div className="absolute inset-0 w-full h-full opacity-85">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color={color}
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
          className="w-full h-full"
        />
      </div>

      {/* Subtle vignette overlay ensuring high contrast readability for forms */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90 pointer-events-none" />
    </div>
  );
};

export default PixelBlastBackground;
