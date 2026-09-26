import React from 'react';
import { AnimatedTopDock } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

/**
 * AnimatedAuthBackground
 * Renders the AnimatedTopDock (glass variant) ThreeUI effect as a full-viewport
 * animated background for Login and Register pages.
 *
 * It preserves the exact ThreeUI glass particle shader canvas while completely
 * removing the left-side vertical dock box (.atd-glass__rail), its left scrim (.atd-glass::before),
 * and the caption, so only the animated background shines through.
 */
const AnimatedAuthBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
      }}
    >
      <style>{`
        /* Remove the dock navigation box on the left side and left scrim */
        .atd-glass__rail,
        .atd-glass::before,
        .atd-glass__brand,
        .atd-glass__hairline,
        .atd-glass__dock,
        .atd-glass__item,
        .atd-glass__cta,
        .animated-top-dock-component__caption,
        .atd-retro__bar,
        .atd-retro__readout,
        .atd-modern__bar,
        .atd-modern__stage {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Ensure the animated canvas fills the viewport */
        .animated-top-dock-component,
        .animated-top-dock-component.atd-glass {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          background: transparent !important;
        }

        .atd-glass__field {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        }
      `}</style>

      <AnimatedTopDock
        variant="glass"
        particles={22}
        thickness={0.115}
        dispersion={0.05}
        specular={0.85}
        rim={0.5}
        drift={1.0}
        proximity={44}
        heightGrowth={20}
        drop={11.0}
      />
    </div>
  );
};

export default AnimatedAuthBackground;
