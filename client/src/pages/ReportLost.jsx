import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lostItemService from '../services/lostItemService';
import ImageUpload from '../components/common/ImageUpload';
import PixelBlastBackground from '../components/backgrounds/PixelBlastBackground';
import ILFNButton from '../components/effects/ILFNButton';
import DepthText from '../components/effects/DepthText';
import { FileQuestion, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

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

const ReportLost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    subcategory: '',
    location: '',
    city: '',
    dateLost: new Date().toISOString().split('T')[0],
    timeLost: '',
    image: '',
    identifyingDetails: '',
    contactPreference: 'in_app',
    contactInfo: '',
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
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.dateLost) {
      setError('Please fill in all mandatory fields: title, description, category, location, and date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await lostItemService.createLostItem(formData);
      if (res.success && res.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/items/lost/${res.data._id}`);
        }, 1200);
      } else {
        setError(res.message || 'Failed to submit report');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error occurred while reporting lost item'
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
        <div className="px-6 py-8 bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-rose-500/20 rounded-2xl text-rose-300">
              <FileQuestion className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Item Recovery
              </span>
            </div>
          </div>
          <div className="flex justify-start mb-2" style={{ minHeight: '70px' }}>
            <DepthText
              text="Report Lost Item"
              layers={28}
              depth={2.0}
              faceColor="#facc15"
              depthColor="#e11d48"
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
            Provide detailed information about the item you lost. Our intelligent matching engine
            will automatically search for candidate found items.
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
              <span>Report created! Redirecting to item details and potential matches...</span>
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
                placeholder="e.g. Space Gray MacBook Pro 14-inch, Black Leather Fossil Wallet"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                  placeholder="e.g. Smartphone, Student ID, Ring"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                placeholder="Provide a general description of the item including brand, color, size, and circumstances of losing it..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Distinguishing / Identifying Details
              </label>
              <textarea
                name="identifyingDetails"
                rows={2}
                value={formData.identifyingDetails}
                onChange={handleChange}
                placeholder="Specific scratches, stickers, serial numbers, unique keychain, wallpaper description..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                These details assist our intelligent matching algorithm to rank potential matches.
              </p>
            </div>
          </div>

          {/* Section: Location & Date */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Time &amp; Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Location Lost *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Central Library 2nd Floor, Campus Cafeteria"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                  placeholder="e.g. Vijayawada, Main Campus"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Date Lost *
                </label>
                <input
                  type="date"
                  name="dateLost"
                  value={formData.dateLost}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Approximate Time (Optional)
                </label>
                <input
                  type="text"
                  name="timeLost"
                  value={formData.timeLost}
                  onChange={handleChange}
                  placeholder="e.g. 14:30 or Around 2 PM"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Photo */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Photo Reference
            </h2>
            <ImageUpload
              label="Item Photo (Optional)"
              value={formData.image}
              onChange={handleImageChange}
            />
          </div>

          {/* Section: Contact Preference */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-2">
              Contact Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Preferred Contact Method
                </label>
                <select
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="in_app" className="bg-slate-800 text-slate-100">In-App Claims &amp; Notifications</option>
                  <option value="email" className="bg-slate-800 text-slate-100">Direct Email</option>
                  <option value="phone" className="bg-slate-800 text-slate-100">Phone / WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Info / Phone (Optional)
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210 or leave blank"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
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
              variant="rose"
              size="md"
              loading={loading}
              disabled={loading || success}
            >
              {loading ? 'Submitting Report...' : 'Publish Lost Report'}
            </ILFNButton>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default ReportLost;
