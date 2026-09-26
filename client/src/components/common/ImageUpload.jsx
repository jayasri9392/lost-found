import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import uploadService from '../../services/uploadService';

const ImageUpload = ({ value, onChange, label = 'Item Photo', fullWidth = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const res = await uploadService.uploadImage(file);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setError(res.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
      setError('');
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {value ? (
        <div className={`relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 ${fullWidth ? 'w-full' : 'max-w-sm'}`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`space-y-2 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              uploading
                ? 'border-cyan-500 bg-cyan-950/30'
                : 'border-slate-600 hover:border-cyan-400 bg-slate-800/60 hover:bg-slate-800'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-sm font-medium text-cyan-300">Uploading photo...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-300">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-full text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-cyan-400 hover:underline">
                    Click to upload
                  </span>{' '}
                  <span className="text-sm text-slate-300">or drag and drop</span>
                </div>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Prefer an external link?</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-medium"
            >
              <LinkIcon className="w-3 h-3" />
              {showUrlInput ? 'Cancel' : 'Enter Image URL'}
            </button>
          </div>

          {showUrlInput && (
            <form onSubmit={handleApplyUrl} className="flex gap-2">
              <input
                type="url"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-sm"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default ImageUpload;
