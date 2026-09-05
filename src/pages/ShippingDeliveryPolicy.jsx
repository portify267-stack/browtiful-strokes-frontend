import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../config/constants';
import { Truck, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const ShippingDeliveryPolicy = () => {
  // Reset window scroll position to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-cream min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-beige/60 shadow-sm p-6 sm:p-10 md:p-14">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal/60 hover:text-forest transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-beige/40 pb-6 mb-8 text-center sm:text-left">
          <div className="inline-flex items-center justify-center p-3.5 bg-forest/5 text-forest rounded-full mb-4 border border-forest/10">
            <Truck className="w-8 h-8 text-forest" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest leading-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-charcoal/50 text-xs sm:text-sm mt-2">
            Last Updated: August 21, 2026
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-charcoal/80 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1: Intro */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              1. Shipping & Delivery Policy
            </h2>
            <p>
              At <strong>{CONTACT_INFO.brandName}</strong>, we are committed to processing and delivering your orders as smoothly and efficiently as possible. This policy details our shipping rules, handling times, delivery protocols, and what to do in case of shipping issues.
            </p>
          </section>

          {/* Section 2: Order Processing */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              2. Order Processing
            </h2>
            <p>
              All orders are processed only after receiving successful order confirmation and online payment. Please note that:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1.5">
              <li>Processing time may vary depending on the product classification, order volumes, customizing details, weekends, and regional public holidays.</li>
              <li>We make every effort to package and hand over items to our shipping partners as promptly as possible.</li>
              <li>If additional details or verifications are required to fulfill your order, we will reach out to you immediately to avoid delays.</li>
            </ul>
          </section>

          {/* Section 3: Shipping Availability */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              3. Shipping Availability
            </h2>
            <p>
              We ship products locally and regionally. Shipping availability depends on your location and the coverage grid of our logistics partners. If a specific address is outside the operational delivery grid of our partners, we will reach out to organize alternative delivery options or cancel/refund the order.
            </p>
          </section>

          {/* Section 4: Delivery Time */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              4. Delivery Time
            </h2>
            <p>
              Estimated delivery times are calculated upon checkout and handover to the shipping service. While we aim to fulfill orders promptly, delivery dates are estimates and can vary due to:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Distance and remote status of the destination address.</li>
              <li>Specific operations of the designated shipping partner.</li>
              <li>Severe weather conditions, natural hazards, or transit disruptions.</li>
              <li>Local public holidays and peak holiday logistics seasons.</li>
              <li>Other unforeseen logistics occurrences beyond our reasonable control.</li>
            </ul>
          </section>

          {/* Section 5: Shipping Charges */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              5. Shipping Charges
            </h2>
            <p>
              Applicable shipping fees are determined based on your delivery address pin code and the weight of your items. The final shipping cost will be clearly displayed during the online checkout process before you submit your payment.
            </p>
          </section>

          {/* Section 6: Order Tracking */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              6. Order Tracking
            </h2>
            <p>
              Once your package has been handed over to the courier partner, we will share the shipment details and reference information with you via email or SMS (based on your contact selection) so you can monitor the status of your delivery.
            </p>
          </section>

          {/* Section 7: Delivery Address */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              7. Delivery Address
            </h2>
            <p>
              You are responsible for providing complete and accurate shipping information, including landmark cues, contact numbers, and pin codes. Incorrect, outdated, or incomplete addresses may lead to courier routing errors, delivery delays, or returned shipments.
            </p>
          </section>

          {/* Section 8: Delayed or Failed Delivery */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              8. Delayed or Failed Delivery
            </h2>
            <p>
              If our courier partner cannot deliver a package due to an incorrect address, unavailable recipient, or repeated unsuccessful delivery attempts, the package will typically be returned to our studio. Under these circumstances, we will contact you to request updated delivery instructions. Additional shipping charges may apply to re-deliver the package.
            </p>
          </section>

          {/* Section 9: Damaged Package / Delivery Issues */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              9. Damaged Package / Delivery Issues
            </h2>
            <p>
              If your package arrives visibly damaged, tampered with, or if items are missing, please contact us immediately. To help us investigate the issue and process claims with our shipping partners, we kindly ask that you keep the original packaging and share photographs of the package condition along with your order ID.
            </p>
          </section>

          {/* Section 10: International Shipping */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              10. International Shipping
            </h2>
            <p>
              Currently, we focus on local and domestic shipments. Shipping availability is limited to the areas supported during the checkout flow on our website.
            </p>
          </section>

          {/* Section 11: Contact Us */}
          <section className="space-y-3 pt-4 border-t border-beige/40">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              11. Contact Us
            </h2>
            <p>
              If you have any questions regarding your shipment, delivery delays, or this policy, please reach out to us:
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 bg-cream/40 p-4 rounded-xl border border-beige/20">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-forest">Email</h4>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-xs sm:text-sm text-charcoal/80 hover:text-gold transition-colors break-all">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-cream/40 p-4 rounded-xl border border-beige/20">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-forest">Phone</h4>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="text-xs sm:text-sm text-charcoal/80 hover:text-gold transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-cream/40 p-4 rounded-xl border border-beige/20">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-forest">Address</h4>
                  <p className="text-xs text-charcoal/70 leading-relaxed">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ShippingDeliveryPolicy;
