import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
                <Compass className="w-4 h-4 text-cyan-100" />
              </div>
              <span className="text-white font-bold text-lg">ILFN</span>
              <span className="text-xs text-slate-400">Intelligent Lost &amp; Found Network</span>
            </div>
            <p className="text-sm text-cyan-300 font-semibold tracking-wide">
              &ldquo;Find what was lost. Return what was found.&rdquo;
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              A high-precision, community-driven platform powered by the MERN stack designed to intelligently index, match, and return misplaced belongings to their rightful owners.
            </p>
          </div>

          {/* Platform Modules — all live */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <Link to="/login" className="hover:text-white transition-colors">JWT Authentication &amp; RBAC</Link>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <Link to="/report-lost" className="hover:text-white transition-colors">Lost Item Reporting</Link>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <Link to="/report-found" className="hover:text-white transition-colors">Found Item Registry</Link>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <Link to="/search" className="hover:text-white transition-colors">Intelligent AI Matching &amp; Search</Link>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <Link to="/claims" className="hover:text-white transition-colors">Claims &amp; Verification</Link>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <Link to="/notifications" className="hover:text-white transition-colors">Real-time Notifications</Link>
              </li>
            </ul>
          </div>

          {/* Technology & Stack */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">React.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Node.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Express.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">MongoDB Atlas</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Tailwind CSS</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">JWT &amp; Bcrypt</span>
            </div>

            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3 mt-6">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Database</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">Report an Item</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Intelligent Lost &amp; Found Network (ILFN). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for real-world operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
