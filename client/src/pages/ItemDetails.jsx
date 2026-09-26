import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lostItemService from '../services/lostItemService';
import foundItemService from '../services/foundItemService';
import Loader from '../components/common/Loader';
import ClaimModal from '../components/common/ClaimModal';
import ReportModal from '../components/common/ReportModal';
import ScannerBackground from '../components/backgrounds/ScannerBackground';
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  Flag,
  ArrowLeft,
  UserCheck,
  Building,
  AlertCircle,
} from 'lucide-react';

const ItemDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Support both /items/:type/:id and /lost-items/:id or /found-items/:id patterns
  const resolvedType = type || (location.pathname.includes('/lost-items/') ? 'lost' : 'found');
  const isLost = resolvedType === 'lost';
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = isLost
        ? await lostItemService.getLostItemById(id)
        : await foundItemService.getFoundItemById(id);

      if (res.success && res.data) {
        setItem(res.data);
      } else {
        setError(res.message || 'Item not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to retrieve item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id, resolvedType]);

  const isOwner =
    user && item && (item.userId?._id?.toString() === user._id?.toString() || item.userId?.toString() === user._id?.toString());
  const isAdmin = user?.role === 'admin';

  const handleMarkResolved = async () => {
    if (!window.confirm(`Mark this item as ${isLost ? 'Recovered' : 'Returned'}?`)) return;

    setActionLoading(true);
    try {
      if (isLost) {
        await lostItemService.markRecovered(id);
        setSuccessBanner('Item marked as Recovered!');
      } else {
        await foundItemService.markReturned(id);
        setSuccessBanner('Item marked as Returned to owner!');
      }
      fetchItemDetails();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;

    setActionLoading(true);
    try {
      if (isLost) {
        await lostItemService.deleteLostItem(id);
      } else {
        await foundItemService.deleteFoundItem(id);
      }
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Deletion failed');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="large" text="Retrieving item details..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Item Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This item listing might have been removed or does not exist.'}</p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>
    );
  }

  const itemDate = isLost ? item.dateLost : item.dateFound;
  const itemTime = isLost ? item.timeLost : item.timeFound;

  return (
    <div className="relative min-h-screen" style={{ background: '#030712' }}>
      <ScannerBackground />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ zIndex: 2 }}>
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {isAuthenticated && !isOwner && (
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-xs font-medium text-slate-400 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Listing</span>
            </button>
          )}
        </div>
      </div>

      {successBanner && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Main Item Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative bg-slate-900 min-h-[320px] md:min-h-[440px] flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover max-h-[500px]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 p-8 text-center">
                <Tag className="w-16 h-16 opacity-40" />
                <span className="text-sm font-medium">No photograph attached to this report</span>
              </div>
            )}

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md backdrop-blur-md ${
                  isLost ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isLost ? 'Lost Item' : 'Found Item'}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900/90 text-white backdrop-blur-md shadow-md border border-slate-700">
                {item.status}
              </span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-cyan-400 mb-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{item.category}</span>
                  {item.subcategory && (
                    <>
                      <span>•</span>
                      <span>{item.subcategory}</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h1>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

              {/* Distinguishing Features */}
              {item.identifyingDetails && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Identifying Features
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    {item.identifyingDetails}
                  </p>
                </div>
              )}

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900 dark:text-white">Location</span>
                    <span>{item.location}{item.city ? `, ${item.city}` : ''}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900 dark:text-white">
                      {isLost ? 'Date Lost' : 'Date Found'}
                    </span>
                    <span>{new Date(itemDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {itemTime && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Time</span>
                      <span>{itemTime}</span>
                    </div>
                  </div>
                )}

                {!isLost && item.currentStorageLocation && (
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Storage Custody</span>
                      <span>{item.currentStorageLocation}</span>
                    </div>
                  </div>
                )}

                {item.userId?.name && (
                  <div className="flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Reported By</span>
                      <span>{item.userId.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700/80 space-y-3">
              {/* Intelligent Matches Button */}
              <Link
                to={`/matches/${resolvedType}/${item._id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/20 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Run Intelligent Matching</span>
              </Link>

              {/* Claim Action for Found Item */}
              {!isLost && !isOwner && item.status === 'Available' && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setClaimModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>This is Mine — Submit Claim</span>
                </button>
              )}

              {/* Owner Controls */}
              {(isOwner || isAdmin) && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Link
                    to={`/edit-item/${resolvedType}/${item._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {((isLost && item.status !== 'Recovered') || (!isLost && item.status !== 'Returned')) && (
                    <button
                      onClick={handleMarkResolved}
                      disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isLost ? 'Mark Recovered' : 'Mark Returned'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {!isLost && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          foundItem={item}
          onSuccess={() => {
            setSuccessBanner('Claim submitted successfully! The finder has been notified.');
            fetchItemDetails();
          }}
        />
      )}

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        itemId={item._id}
        itemType={resolvedType}
        itemTitle={item.title}
        onSuccess={() => {
          setSuccessBanner('Thank you for flagging this report. Our moderators will review it.');
        }}
      />
      </div>
    </div>
  );
};

export default ItemDetails;
