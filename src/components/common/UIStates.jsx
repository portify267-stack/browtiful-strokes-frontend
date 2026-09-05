import React from 'react';
import { AlertTriangle, RefreshCw, Box } from 'lucide-react';

export const LoadingSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 border border-beige/60 animate-pulse">
          <div className="bg-beige/40 h-48 w-full rounded-md mb-4" />
          <div className="h-4 bg-beige/40 rounded w-2/3 mb-2" />
          <div className="h-3 bg-beige/40 rounded w-1/2 mb-4" />
          <div className="h-8 bg-beige/40 rounded w-full" />
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({ message = 'No products found.', icon: Icon = Box }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-beige/30 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gold" />
      </div>
      <p className="text-charcoal/80 font-medium text-lg">{message}</p>
    </div>
  );
};

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-errorred p-4 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8 text-errorred-text" />
      </div>
      <p className="text-charcoal/85 font-semibold text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-forest hover:bg-forest-light text-cream rounded-md transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      )}
    </div>
  );
};

export const SectionHeading = ({ title, subtitle, className = "mb-4 md:mb-6 lg:mb-7" }) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-1.5 md:mb-2">{title}</h2>
      {subtitle && <p className="text-charcoal/70 text-sm md:text-base max-w-xl mx-auto">{subtitle}</p>}
      <div className="w-16 h-0.5 bg-gold mx-auto mt-2.5 md:mt-3 animate-fade" />
    </div>
  );
};
