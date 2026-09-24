import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600">
          <Compass className="w-8 h-8 text-cyan-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for doesn't exist or may have been moved. Even in a Lost &amp; Found network, some links cannot be found!
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors text-sm"
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
