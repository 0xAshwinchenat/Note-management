import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  step?: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  title, 
  description, 
  confirmLabel, 
  onConfirm, 
  onCancel,
  step = 1
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          {step === 2 ? '⚠️ Final Confirmation' : title}
        </h3>
        <p className="modal-description">
          {step === 2 
            ? 'This action is irreversible. Are you absolutely certain you want to permanently delete this note?' 
            : description}
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger-full" onClick={onConfirm}>
            {step === 2 ? 'Yes, Delete Forever' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
