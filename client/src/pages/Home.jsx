import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Database, 
  Lock,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800">
        {/* Subtle background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>&ldquo;Find what was lost. Return what was found.&rdquo;</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Lost &amp; Found{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Network
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              A high-precision, community-focused ecosystem built to bridge the gap between misplaced possessions and their rightful owners using modern full-stack web architecture.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-cyan-900/30 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>View User Profile ({user?.name})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 bg-slate-800/90 border border-slate-700 cursor-not-allowed">
                    <PlusCircle className="w-4 h-4 text-cyan-400" />
                    <span>Report Item (Phase 2)</span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-cyan-900/30 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>Get Started - Register</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-800 hover:text-white border border-slate-700 transition-colors"
                  >
                    <span>Existing User? Log In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>JWT Protected Sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>MongoDB Atlas Cloud DB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Bcrypt Password Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights & Live Status */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-2">
              System Architecture &amp; Foundations
            </h2>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              Built for Scale, Security, and Reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-shadow-hover">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Secure JWT Authentication
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Token-based stateless authentication with bcrypt salted password hashing, HTTP interceptors, and strict protected route authorization.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-shadow-hover">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                MongoDB Atlas Integration
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Live cloud database connection with Mongoose ODM, resilient DNS resolution, strict schema validation, and indexed queries.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-shadow-hover">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Modular Extensible Design
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decoupled client-server structure ready for future Lost/Found items reporting, intelligent matching algorithms, and claim verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-2">
              Workflow Overview
            </h2>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              How the Intelligent Lost &amp; Found Network Operates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-cyan-400 font-bold flex items-center justify-center text-lg mb-4 shadow">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Account Registration</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Join the network with verified email credentials. Each account is assigned an identity for transparent reporting and tracking.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-cyan-400 font-bold flex items-center justify-center text-lg mb-4 shadow">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Item Cataloging (Phase 2)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Report lost items or register found items with precise descriptions, dates, categories, and geographical tags.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-cyan-400 font-bold flex items-center justify-center text-lg mb-4 shadow">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Intelligent Matching (Phase 3)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our matching pipeline correlates lost item entries with newly registered found items to prompt verified claims and safe handoffs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
