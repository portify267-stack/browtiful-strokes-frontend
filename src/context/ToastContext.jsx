import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', action = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, action }
    ]);

    // Automatically remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Toast Notification Container */}
      <div 
        className="fixed z-[9999] flex flex-col gap-2.5 w-[90%] md:w-96 max-w-full top-20 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 pointer-events-none"
        role="log"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          return (
            <div
              key={toast.id}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-lg bg-cream/95 backdrop-blur-md border shadow-md transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg animate-fade-in ${
                isSuccess 
                  ? 'border-l-4 border-l-forest border-beige/60' 
                  : 'border-l-4 border-l-errorred border-beige/60'
              }`}
            >
              {/* Icon and Message */}
              <div className="flex items-center gap-2.5 min-w-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-forest shrink-0" aria-hidden="true" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-errorred shrink-0" aria-hidden="true" />
                )}
                <span className="text-xs md:text-sm font-semibold text-charcoal leading-snug line-clamp-2">
                  {toast.message}
                </span>
              </div>

              {/* Actions (View Cart or Dismiss) */}
              <div className="flex items-center gap-2 shrink-0">
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action.onClick();
                      removeToast(toast.id);
                    }}
                    className="text-xs font-bold text-gold hover:text-gold-dark underline transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold px-1 py-0.5 rounded"
                  >
                    {toast.action.label}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-full text-charcoal/40 hover:text-charcoal hover:bg-beige/20 transition-all focus:outline-none focus:ring-1 focus:ring-forest"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
