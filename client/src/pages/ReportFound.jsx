import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foundItemService from '../services/foundItemService';
import ImageUpload from '../components/common/ImageUpload';
import PixelBlastBackground from '../components/backgrounds/PixelBlastBackground';
import ILFNButton from '../components/effects/ILFNButton';
import DepthText from '../components/effects/DepthText';
import { PlusCircle, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
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

const ReportFound = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Wallets & Bags',
    subcategory: '',
    location: '',
    city: '',
    dateFound: new Date().toISOString().split('T')[0],
    timeFound: '',
    image: '',
    identifyingDetails: '',
    currentStorageLocation: 'With Finder',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.dateFound) {
      setError('Please fill in all mandatory fields: title, description, category, location, and date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await foundItemService.createFoundItem(formData);
      if (res.success && res.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/items/found/${res.data._id}`);
        }, 1200);
      } else {
        setError(res.message || 'Failed to submit report');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error occurred while reporting found item'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-10">
      {/* PixelBlast Interactive Background Effect */}
      <PixelBlastBackground color="#B497CF" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="dark bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden text-white">
        {/* Banner Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl text-emerald-300">
              <PlusCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Good Samaritan Report
              </span>
            </div>
          </div>
          <div className="flex justify-start mb-2" style={{ minHeight: '70px' }}>
            <DepthText
              text="Report Found Item"
              layers={28}
              depth={2.0}
              faceColor="#facc15"
              depthColor="#059669"
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
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Help an item find its rightful owner. When you list a found item, ILFN automatically
            notifies registered users with matching lost reports.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-700 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700 text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Found item logged! Redirecting to details and match suggestions...</span>
            </div>
          )}

          {/* Section: Basic Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Item Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Set of Keys with Blue Lanyard, Black Leather Wallet"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-800 text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  placeholder="e.g. Student ID, Wireless Earbuds, Watch"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item, where and how it was discovered..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Public Identifying Features
              </label>
              <textarea
                name="identifyingDetails"
                rows={2}
                value={formData.identifyingDetails}
                onChange={handleChange}
                placeholder="General observable features (color, brand, visible tags). Do NOT reveal secret contents or serial numbers, so real owners can prove ownership!"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section: Location & Date */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Time &amp; Location Found
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Location Found *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Science Block 1st floor staircase, Bus Stop #4"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  City / Campus (Optional)
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Vijayawada, West Campus"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Date Found *
                </label>
                <input
                  type="date"
                  name="dateFound"
                  value={formData.dateFound}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Approximate Time (Optional)
                </label>
                <input
                  type="text"
                  name="timeFound"
                  value={formData.timeFound}
                  onChange={handleChange}
                  placeholder="e.g. 10:15 AM or Morning"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Custody / Storage Location */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Item Custody
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Storage Location
              </label>
              <input
                type="text"
                name="currentStorageLocation"
                value={formData.currentStorageLocation}
                onChange={handleChange}
                placeholder="e.g. Handed over to Campus Security Desk, or With Finder"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section: Photo */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Photo
            </h2>
            <ImageUpload
              label="Item Photo (Optional)"
              value={formData.image}
              onChange={handleImageChange}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-700/80 flex items-center justify-end gap-4">
            <ILFNButton
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate(-1)}
            >
              Cancel
            </ILFNButton>
            <ILFNButton
              type="submit"
              variant="emerald"
              size="md"
              loading={loading}
              disabled={loading || success}
            >
              {loading ? 'Submitting Report...' : 'Publish Found Report'}
            </ILFNButton>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default ReportFound;
