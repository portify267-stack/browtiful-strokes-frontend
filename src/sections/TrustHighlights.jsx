import React from 'react';
import { ShieldCheck, MapPin, CreditCard } from 'lucide-react';

const TrustHighlights = () => {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Premium Quality Products',
      description: '100% natural, chemical-free henna formulas made with pure essential oils.',
    },
    {
      icon: MapPin,
      title: 'Offline Mehendi Studio',
      description: 'Custom bridal and event designs crafted by hand at our physical studio.',
    },
    {
      icon: CreditCard,
      title: 'Secure Online Payments',
      description: 'Encrypted, fully verified checkouts powered by Razorpay gateways.',
    },
  ];

  return (
    <section className="bg-white py-6 md:py-8 border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-lg hover:bg-cream/40 transition-colors duration-300"
              >
                <div className="bg-beige/40 p-3 rounded-full text-forest shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-serif font-bold text-lg text-forest mb-1">
                    {h.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed">
                    {h.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustHighlights;
