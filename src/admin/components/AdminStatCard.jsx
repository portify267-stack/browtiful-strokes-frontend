import React from 'react';

const AdminStatCard = ({ title, value, icon: Icon, color = 'forest', subtitle, onClick }) => {
  const colorStyles = {
    forest: 'bg-forest/10 text-forest border-forest/20',
    gold: 'bg-gold/15 text-gold-dark border-gold/30',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    red: 'bg-red-100 text-red-700 border-red-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-cream border border-beige/80 rounded-xl p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-gold/60 transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">{title}</p>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-charcoal mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-charcoal/60 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.forest}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;
