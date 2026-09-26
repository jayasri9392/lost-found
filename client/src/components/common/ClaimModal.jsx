import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, AlertCircle, FileText, Phone, Lock } from 'lucide-react';
import claimService from '../../services/claimService';
import ImageUpload from './ImageUpload';
import ILFNButton from '../effects/ILFNButton';

const ClaimModal = ({ isOpen, onClose, foundItem, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [proofImage, setProofImage] = useState('');
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

  if (!isOpen || !foundItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim() || !proofDetails.trim()) {
      setError('Please provide both the claim reason and specific proof of ownership.');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long.');
      return;
    }
    if (proofDetails.trim().length < 10) {
      setError('Proof details must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await claimService.submitClaim({
        foundItemId: foundItem._id,
        reason,
        proofDetails,
        contactPhone,
        proofImage,
      });

      if (res.success) {
        onSuccess && onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to submit claim.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error occurred while submitting claim'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-950 ' +
    'text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 ' +
    'focus:ring-2 focus:ring-cyan-500/20 transition-all';

  const modal = (
    /* Full-screen backdrop rendered at body level via Portal */
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
          maxWidth: '520px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f172a',
          borderRadius: '24px',
          border: '1px solid rgba(51,65,85,0.8)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '18px 24px',
            borderBottom: '1px solid rgba(51,65,85,0.6)',
            background: 'linear-gradient(135deg, rgba(30,58,138,0.3) 0%, rgba(30,27,75,0.4) 100%)',
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
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#67e8f9',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                Submit Ownership Claim
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {foundItem.title}
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
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable Form ── */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {/* Fields scroll area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#334155 transparent',
            }}
          >
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
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px', color: '#f87171' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Reason */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                <FileText size={12} style={{ color: '#22d3ee' }} />
                Reason for Claim
                <span style={{ color: '#f87171', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. I lost this wallet in the campus library yesterday afternoon..."
                className={inputClass}
                style={{ resize: 'none', color: '#ffffff', backgroundColor: '#020617' }}
                required
              />
            </div>

            {/* Proof Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                <Lock size={12} style={{ color: '#22d3ee' }} />
                Specific Proof of Ownership
                <span style={{ color: '#f87171', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>*</span>
              </label>
              <textarea
                rows={4}
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                placeholder="Describe unique marks, card names, wallpaper, serial number, or inside contents only the real owner would know..."
                className={inputClass}
                style={{ resize: 'none', color: '#ffffff', backgroundColor: '#020617' }}
                required
              />
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                Prevents fraudulent claims — the finder and admins will review this carefully.
              </p>
            </div>

            {/* Contact Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                <Phone size={12} style={{ color: '#22d3ee' }} />
                Contact Phone
                <span style={{ color: '#64748b', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>(Optional)</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass}
                style={{ color: '#ffffff', backgroundColor: '#020617' }}
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              label="Proof Photo / Receipt (Optional)"
              value={proofImage}
              onChange={setProofImage}
              fullWidth
            />
          </div>

          {/* ── Footer buttons — inside form so submit works ── */}
          <div
            style={{
              flexShrink: 0,
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
              variant="cyan"
              size="sm"
              loading={loading}
              disabled={loading}
              icon={ShieldCheck}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </ILFNButton>
          </div>
        </form>
      </div>
    </div>
  );

  // Render at body level to escape any parent stacking context
  return createPortal(modal, document.body);
};

export default ClaimModal;
