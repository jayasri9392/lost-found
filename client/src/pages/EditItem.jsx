import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lostItemService from '../services/lostItemService';
import foundItemService from '../services/foundItemService';
import ImageUpload from '../components/common/ImageUpload';
import Loader from '../components/common/Loader';
import ScannerBackground from '../components/backgrounds/ScannerBackground';
import { Edit3, AlertCircle, Loader2 } from 'lucide-react';

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

const EditItem = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLost = type === 'lost';
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    subcategory: '',
    location: '',
    city: '',
    date: '',
    time: '',
    image: '',
    identifyingDetails: '',
    contactPreference: 'in_app',
    contactInfo: '',
    currentStorageLocation: '',
    status: '',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      try {
        const res = isLost
          ? await lostItemService.getLostItemById(id)
          : await foundItemService.getFoundItemById(id);

        if (isMounted && res.success && res.data) {
          const item = res.data;

          // Check if owner or admin
          const itemUserId = item.userId?._id || item.userId;
          if (itemUserId?.toString() !== user?._id?.toString() && user?.role !== 'admin') {
            navigate(`/items/${type}/${id}`);
            return;
          }

          setFormData({
            title: item.title || '',
            category: item.category || 'Electronics',
            subcategory: item.subcategory || '',
            location: item.location || '',
            city: item.city || '',
            date: isLost
              ? item.dateLost ? new Date(item.dateLost).toISOString().split('T')[0] : ''
              : item.dateFound ? new Date(item.dateFound).toISOString().split('T')[0] : '',
            time: isLost ? item.timeLost || '' : item.timeFound || '',
            image: item.image || '',
            identifyingDetails: item.identifyingDetails || '',
            contactPreference: item.contactPreference || 'in_app',
            contactInfo: item.contactInfo || '',
            currentStorageLocation: item.currentStorageLocation || '',
            status: item.status || '',
          });
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || err.message || 'Failed to load item');
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [id, isLost, type, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLost) {
        await lostItemService.updateLostItem(id, {
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          location: formData.location,
          city: formData.city,
          dateLost: formData.date,
          timeLost: formData.time,
          image: formData.image,
          identifyingDetails: formData.identifyingDetails,
          contactPreference: formData.contactPreference,
          contactInfo: formData.contactInfo,
          status: formData.status,
        });
      } else {
        await foundItemService.updateFoundItem(id, {
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          location: formData.location,
          city: formData.city,
          dateFound: formData.date,
          timeFound: formData.time,
          image: formData.image,
          identifyingDetails: formData.identifyingDetails,
          currentStorageLocation: formData.currentStorageLocation,
          status: formData.status,
        });
      }

      navigate(`/items/${type}/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="large" text="Loading item details..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: '#030712' }}>
      <ScannerBackground />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ zIndex: 2 }}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="px-6 py-6 bg-slate-900 text-white flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/30 rounded-xl text-cyan-400">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Edit {isLost ? 'Lost' : 'Found'} Item Report</h1>
            <p className="text-xs text-slate-400">Update listing details or modify resolution status</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isLost ? (
                    <>
                      <option value="Active">Active</option>
                      <option value="Matched">Matched</option>
                      <option value="Recovered">Recovered</option>
                      <option value="Closed">Closed</option>
                    </>
                  ) : (
                    <>
                      <option value="Available">Available</option>
                      <option value="Claimed">Claimed</option>
                      <option value="Returned">Returned</option>
                      <option value="Closed">Closed</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Identifying Details
              </label>
              <textarea
                name="identifyingDetails"
                rows={2}
                value={formData.identifyingDetails}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City / Campus
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <ImageUpload
              label="Update Photo"
              value={formData.image}
              onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default EditItem;
