import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-cream border border-beige rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal transition-colors p-1 rounded-lg hover:bg-beige/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDanger ? 'bg-errorred text-errorred-text' : 'bg-gold/20 text-gold-dark'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-charcoal leading-snug">{title}</h3>
            <p className="text-sm text-charcoal/70 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-beige/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-charcoal/80 bg-beige/40 hover:bg-beige rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-forest hover:bg-forest-dark'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
