import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Flag, AlertCircle } from 'lucide-react';
import reportService from '../../services/reportService';
import ILFNButton from '../effects/ILFNButton';

const ReportModal = ({ isOpen, onClose, itemId, itemType, itemTitle, onSuccess }) => {
  const [reason, setReason] = useState('Spam or misleading');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a short description of the issue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await reportService.submitReport({
        reportedItemId: itemId,
        reportedItemType: itemType === 'lost' ? 'LostItem' : 'FoundItem',
        reason,
        description,
      });

      if (res.success) {
        onSuccess && onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to submit report');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error occurred while reporting item'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { color: '#ffffff', backgroundColor: '#020617' };

  const modal = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(2, 6, 23, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f172a',
          borderRadius: '24px',
          border: '1px solid rgba(51,65,85,0.8)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '18px 24px',
            borderBottom: '1px solid rgba(51,65,85,0.6)',
            background: 'linear-gradient(135deg, rgba(136,19,55,0.25) 0%, rgba(15,23,42,0.4) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div
              style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
              }}
            >
              <Flag size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                Report Listing
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {itemTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(136,19,55,0.25)',
                  border: '1px solid rgba(190,18,60,0.5)',
                  color: '#fca5a5',
                  fontSize: '12px',
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px', color: '#f87171' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Reason select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Reason <span style={{ color: '#f87171' }}>*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  background: '#020617',
                  color: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Spam or misleading" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Spam or misleading</option>
                <option value="Inappropriate content" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Inappropriate content</option>
                <option value="Fraudulent claim" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Fraudulent claim / Fake report</option>
                <option value="Duplicate item" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Duplicate item</option>
                <option value="Personal information leak" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Personal information leak</option>
                <option value="Other" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Other</option>
              </select>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Explanation <span style={{ color: '#f87171' }}>*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about why this listing should be flagged..."
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  background: '#020617',
                  color: '#ffffff',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '14px 24px',
              borderTop: '1px solid rgba(51,65,85,0.6)',
              background: '#0f172a',
            }}
          >
            <ILFNButton type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </ILFNButton>
            <ILFNButton
              type="submit"
              variant="rose"
              size="sm"
              loading={loading}
              disabled={loading}
              icon={Flag}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </ILFNButton>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ReportModal;
