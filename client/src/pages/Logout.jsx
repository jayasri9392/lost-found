import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MoltenMetalBackground from '../components/backgrounds/MoltenMetalBackground';
import DepthText from '../components/effects/DepthText';
import { LogIn, UserPlus, Compass } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Perform logout on mount
  useEffect(() => {
    logout();
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      {/* MoltenMetal WebGL Background */}
      <MoltenMetalBackground />

      {/* Dark translucent overlay for text readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative text-center px-6 py-16 max-w-xl mx-auto"
        style={{ zIndex: 10 }}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl">
            <Compass className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* DepthText Hero Heading */}
        <div className="flex justify-center mb-6" style={{ minHeight: '100px' }}>
          <DepthText
            text="See You Again"
            layers={34}
            depth={2.4}
            faceColor="#facc15"
            depthColor="#7c3aed"
            tilt={7.5}
            pointerTracking
            smoothing={0.14}
            perspective={900}
            autoOrbit
            orbitSpeed={0.35}
            fontSize="clamp(2.5rem, 9vw, 5rem)"
            fontWeight={900}
            shadow
          />
        </div>

        {/* Subtitle */}
        <p
          className="text-slate-300 text-base sm:text-lg leading-relaxed mb-10 font-light"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
        >
          Your lost &amp; found journey is always here when you return.
          <br />
          <span className="text-cyan-400 font-medium text-sm">
            You have been safely signed out of ILFN.
          </span>
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="logout-go-login"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white
              bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
              shadow-lg shadow-cyan-900/40 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign Back In</span>
          </button>

          <button
            id="logout-go-register"
            onClick={() => navigate('/register')}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-200
              bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md
              transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* ILFN Badge */}
        <div className="mt-12 text-xs text-slate-500 font-medium tracking-widest uppercase">
          Intelligent Lost &amp; Found Network
        </div>
      </div>
    </div>
  );
};

export default Logout;
