import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import ScannerBackground from '../components/backgrounds/ScannerBackground';

const NotFound = () => {
  return (
    <div
      className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden"
      style={{ background: '#030712' }}
    >
      {/* Scanner WebGL Background */}
      <ScannerBackground />

      {/* Dark overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative max-w-md w-full text-center space-y-6 px-4 py-16"
        style={{ zIndex: 10 }}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-slate-200">
          <Compass className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you are looking for doesn&apos;t exist or may have been moved.
            Even in a Lost &amp; Found network, some links cannot be found!
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white text-sm
              bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600
              shadow-lg shadow-cyan-900/40 transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
