import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import searchService from '../services/searchService';
import ItemCard from '../components/common/ItemCard';
import Loader from '../components/common/Loader';
import ILFNButton from '../components/effects/ILFNButton';
import MoltenMetal from '../components/effects/MoltenMetal';
import DepthText from '../components/effects/DepthText';
import FerrofluidBackground from '../components/backgrounds/FerrofluidBackground';
import { Search as SearchIcon, Filter, RefreshCw, AlertCircle, Inbox } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Wallets & Bags',
  'Keys & IDs',
  'Jewelry & Watches',
  'Clothing & Accessories',
  'Documents & Cards',
  'Pets & Animals',
  'Sports & Fitness',
  'Other',
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const executeSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await searchService.search({
        keyword,
        type,
        category,
        status,
        location,
        sort,
        page,
        limit: 12,
      });

      if (res.success) {
        setItems(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to search items');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while executing search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [type, category, status, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    executeSearch();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setType('all');
    setCategory('All');
    setStatus('All');
    setLocation('');
    setSort('newest');
    setPage(1);
  };

  /* ───── glass panel helper styles ───── */
  const glassPanel = {
    background: 'rgba(10, 18, 40, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(148,163,184,0.14)',
    borderRadius: '1.25rem',
  };

  const selectStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(148,163,184,0.2)',
    background: 'rgba(30, 41, 59, 0.8)',
    color: '#e2e8f0',
    outline: 'none',
    cursor: 'pointer',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#94a3b8',
    marginBottom: '0.3rem',
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '4rem' }}>
      {/* Ferrofluid full-page fixed background */}
      <FerrofluidBackground />

      {/* Dark tint layer so content is readable */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'rgba(4, 8, 20, 0.65)',
        }}
      />

      {/* Scrollable content above background */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-8">

          {/* Search Header Banner */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(14,20,45,0.92) 0%, rgba(30,40,80,0.88) 50%, rgba(10,18,50,0.94) 100%)', border: '1px solid rgba(99,179,237,0.18)' }}>
            {/* MoltenMetal inside the banner only */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
              <MoltenMetal
                color1="#5227FF"
                color2="#FF9FFC"
                color3="#FFFFFF"
                speed={0.35}
                scale={4}
                detail={3}
                glow={1.6}
                coreSize={0.1}
                swirl={1}
                fold={-0.2}
                blackPoint={0.05}
                brightness={1.3}
                colorMode="molten"
                grain
                grainIntensity={0.05}
                mouseInteraction={false}
                opacity={1}
              />
            </div>
            {/* Overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,15,35,0.72)', zIndex: 1, pointerEvents: 'none', borderRadius: 'inherit' }} />

            <div className="max-w-3xl space-y-4 relative" style={{ zIndex: 2 }}>
              <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                Global Database Search
              </span>
              {/* DepthText heading */}
              <div style={{ minHeight: '70px' }}>
                <DepthText
                  text="Search Lost & Found"
                  layers={28}
                  depth={2.0}
                  faceColor="#facc15"
                  depthColor="#7c3aed"
                  tilt={6}
                  pointerTracking
                  smoothing={0.14}
                  perspective={900}
                  autoOrbit
                  orbitSpeed={0.3}
                  fontSize="clamp(1.8rem, 5vw, 3rem)"
                  fontWeight={900}
                  shadow
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Search our nationwide lost &amp; found network by keyword, category, location, and status.
              </p>

              {/* Keyword Search Input Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search by item name, brand, color (e.g. 'black wallet', 'iPhone')..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                  />
                </div>
                <ILFNButton
                  type="submit"
                  variant="cyan"
                  size="md"
                  icon={SearchIcon}
                  className="shrink-0"
                >
                  Search Database
                </ILFNButton>
              </form>
            </div>
          </div>

          {/* Filter and Tab Controls — glass panel */}
          <div style={{ ...glassPanel, padding: '1.25rem 1.5rem' }}>
            {/* Type Selector Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              <div style={{ display: 'flex', padding: '0.25rem', background: 'rgba(15,23,42,0.8)', borderRadius: '0.75rem', border: '1px solid rgba(148,163,184,0.12)' }}>
                <button
                  onClick={() => { setType('all'); setPage(1); }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: type === 'all' ? 'rgba(30,58,138,0.8)' : 'transparent',
                    color: type === 'all' ? '#67e8f9' : '#94a3b8',
                    boxShadow: type === 'all' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  }}
                >
                  All Items
                </button>
                <button
                  onClick={() => { setType('lost'); setPage(1); }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: type === 'lost' ? '#be123c' : 'transparent',
                    color: type === 'lost' ? '#fff' : '#94a3b8',
                    boxShadow: type === 'lost' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  }}
                >
                  Lost Items
                </button>
                <button
                  onClick={() => { setType('found'); setPage(1); }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: type === 'found' ? '#065f46' : 'transparent',
                    color: type === 'found' ? '#fff' : '#94a3b8',
                    boxShadow: type === 'found' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  }}
                >
                  Found Items
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Showing <strong style={{ color: '#e2e8f0', fontWeight: 600 }}>{total}</strong> total listings
                </span>
                <button
                  onClick={handleResetFilters}
                  style={{ padding: '0.5rem', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}
                  title="Reset Filters"
                >
                  <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  style={selectStyle}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  style={selectStyle}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active / Available</option>
                  <option value="Claimed">Claimed / Matched</option>
                  <option value="Recovered">Recovered / Returned</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Location Filter</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={() => { setPage(1); executeSearch(); }}
                  placeholder="Filter by city or campus..."
                  style={{ ...selectStyle, background: 'rgba(30, 41, 59, 0.8)' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  style={selectStyle}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results View */}
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader size="large" text="Searching network database..." />
            </div>
          ) : error ? (
            <div style={{ ...glassPanel, padding: '1.5rem', textAlign: 'center' }}>
              <AlertCircle style={{ width: '2rem', height: '2rem', color: '#f87171', margin: '0 auto 0.5rem' }} />
              <p style={{ color: '#f87171', fontWeight: 600, fontSize: '0.875rem' }}>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ ...glassPanel, padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(30,41,59,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Inbox style={{ width: '2rem', height: '2rem', color: '#64748b' }} />
              </div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                No matching listings found
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '24rem', margin: '0 auto 1rem' }}>
                Try adjusting your search keywords, broadening your category filter, or resetting search filters.
              </p>
              <button
                onClick={handleResetFilters}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <ItemCard
                    key={`${item.itemType || (item.dateLost ? 'lost' : 'found')}-${item._id}`}
                    item={item}
                    type={item.itemType || (item.dateLost ? 'lost' : 'found')}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '0.75rem', border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(30,41,59,0.8)', color: '#cbd5e1', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', padding: '0 0.75rem' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '0.75rem', border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(30,41,59,0.8)', color: '#cbd5e1', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
