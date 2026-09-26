import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import searchService from '../services/searchService';
import ItemCard from '../components/common/ItemCard';
import VantaBackground from '../components/backgrounds/VantaBackground';
import OrbCard from '../components/effects/OrbCard';
import ILFNButton from '../components/effects/ILFNButton';
import DepthText from '../components/effects/DepthText';
import { 
  Search, 
  FileQuestion, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Database, 
  Lock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      try {
        const res = await searchService.search({ limit: 4, sort: 'newest' });
        if (isMounted && res.success) {
          setRecentItems(res.data || []);
        }
      } catch {
        // Silent catch
      } finally {
        if (isMounted) setLoadingItems(false);
      }
    };
    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Vanta.NET Interactive Background Effect */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800">
        {/* Vanta.NET 3D Network Background */}
        <VantaBackground
          color={0x06b6d4}
          backgroundColor={0x070b14}
          points={11.0}
          maxDistance={22.0}
          spacing={16.0}
        />

        {/* Ambient Radial Gradient Overlays */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-7 sm:space-y-8">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>&ldquo;Find what was lost. Return what was found.&rdquo;</span>
            </div>

            {/* Slim Title Name Card - compact height with crisp visibility */}
            <div className="max-w-2xl mx-auto w-full">
              <OrbCard
                orbHue={190}
                hoverIntensity={1.5}
                showOrb={true}
                className="py-2.5 px-4 sm:py-3.5 sm:px-6 backdrop-blur-xl bg-slate-900/85 border border-cyan-500/30 shadow-xl shadow-cyan-500/5 rounded-2xl sm:rounded-3xl"
              >
                <div className="flex justify-center items-center">
                  <DepthText
                    text="Intelligent Lost & Found Network"
                    layers={32}
                    depth={2.2}
                    faceColor="#facc15"
                    depthColor="#0891b2"
                    tilt={7.5}
                    pointerTracking
                    smoothing={0.14}
                    perspective={900}
                    autoOrbit
                    orbitSpeed={0.35}
                    fontSize="clamp(1.4rem, 3.8vw, 2.75rem)"
                    fontWeight={900}
                    shadow
                  />
                </div>
              </OrbCard>
            </div>

            {/* Quick Hero Search Input */}
            <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-4 sm:pt-6">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Search lost or found items (e.g. 'black wallet', 'keys')..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                />
              </div>
              <ILFNButton
                type="submit"
                variant="cyan"
                size="md"
                icon={Search}
                className="shrink-0"
              >
                Search
              </ILFNButton>
            </form>

            {/* Primary Action Buttons & ThreeUI SignUp CTA */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 sm:pt-6">
              <ILFNButton
                onClick={() => navigate('/report-lost')}
                variant="rose"
                size="md"
                icon={FileQuestion}
              >
                I Lost Something
              </ILFNButton>

              <ILFNButton
                onClick={() => navigate('/report-found')}
                variant="emerald"
                size="md"
                icon={PlusCircle}
              >
                I Found Something
              </ILFNButton>

              <ILFNButton
                onClick={() => navigate('/search')}
                variant="outline"
                size="md"
                icon={Search}
              >
                Browse Listings
              </ILFNButton>
            </div>

            {/* Network Access CTA */}
            <div className="pt-4 sm:pt-6 flex items-center justify-center">
              <ILFNButton
                onClick={() => navigate(isAuthenticated ? '/report' : '/register')}
                variant="cyan"
                size="lg"
                icon={Sparkles}
              >
                {isAuthenticated ? 'Report an Item' : 'Join the Network'}
              </ILFNButton>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Claim Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>AI Similarity Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                <span>MongoDB Atlas Real-Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recent Network Items */}
      {recentItems.length > 0 && (
        <section className="py-14 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  Real-time Database
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Recently Reported Items
                </h2>
              </div>
              <Link
                to="/search"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                <span>View all listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems.map((item) => (
                <ItemCard
                  key={`${item.itemType || (item.dateLost ? 'lost' : 'found')}-${item._id}`}
                  item={item}
                  type={item.itemType || (item.dateLost ? 'lost' : 'found')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Intelligent Matching Spotlight */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Proprietary Matching Algorithm
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Not Just a Database — An Intelligent Matchmaker
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When you post a lost or found report, ILFN's similarity engine computes transparent
                confidence scores by analyzing multiple correlation factors simultaneously:
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Taxonomy &amp; Subcategory (30% Weight)
                    </span>
                    <span className="text-xs text-slate-500">
                      Matches items belonging to exact or overlapping category hierarchies.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Geographical &amp; Location Proximity (25% Weight)
                    </span>
                    <span className="text-xs text-slate-500">
                      Tokenized spatial similarity across campus buildings, rooms, and city identifiers.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Text &amp; Title Keyword Intersection (25% Weight)
                    </span>
                    <span className="text-xs text-slate-500">
                      Jaccard keyword comparison with English stop-word filtering.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Date Proximity &amp; Distinguishing Marks (20% Weight)
                    </span>
                    <span className="text-xs text-slate-500">
                      Considers temporal proximity between loss and discovery dates, plus unique tags.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Match Preview Mockup Card enhanced with Orb Effect */}
            <OrbCard orbHue={190} hoverIntensity={2.5} className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold">Simulated Potential Match</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  92% High Match
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Lost Report</span>
                    <p className="text-sm font-bold text-white">Apple AirPods Pro 2 with Black Case</p>
                    <span className="text-xs text-slate-400">Library 2nd Floor • 2 days ago</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Found Report</span>
                    <p className="text-sm font-bold text-white">AirPods Pro Case Found near Desk #14</p>
                    <span className="text-xs text-slate-400">Main Campus Library • Yesterday</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-200">
                <strong>Factors Matched:</strong> Exact category (Electronics), location tokens ('Library'), and title terms ('AirPods', 'Case').
              </div>
            </OrbCard>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-2">
              Three-Step Lifecycle
            </h2>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              From Report to Reconnection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <OrbCard orbHue={345} hoverIntensity={1.8} className="flex flex-col items-center text-center p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white font-black flex items-center justify-center text-lg mb-4 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                1
              </div>
              <h4 className="text-base font-bold text-white mb-2">Report</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log what you lost or found with photos, categories, exact dates, and location details.
              </p>
            </OrbCard>

            <OrbCard orbHue={190} hoverIntensity={1.8} className="flex flex-col items-center text-center p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-lg mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                2
              </div>
              <h4 className="text-base font-bold text-white mb-2">Match &amp; Alert</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our algorithm calculates similarity percentages and notifies candidate owners immediately.
              </p>
            </OrbCard>

            <OrbCard orbHue={145} hoverIntensity={1.8} className="flex flex-col items-center text-center p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center text-lg mb-4 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                3
              </div>
              <h4 className="text-base font-bold text-white mb-2">Claim &amp; Return</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submit specific proof of ownership. Once approved by the finder, coordinate safe return.
              </p>
            </OrbCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
