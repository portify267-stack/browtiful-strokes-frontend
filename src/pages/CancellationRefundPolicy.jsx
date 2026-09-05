import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../config/constants';
import { RefreshCw, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const CancellationRefundPolicy = () => {
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
            <RefreshCw className="w-8 h-8 text-forest animate-spin-slow" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest leading-tight">
            Cancellation & Refund Policy
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
              1. Cancellation & Refund Policy
            </h2>
            <p>
              At <strong>{CONTACT_INFO.brandName}</strong>, we strive to make your shopping experience as smooth as possible. We understand that circumstances change, and you may occasionally need to cancel an order or request a refund. This Cancellation & Refund Policy outlines our guidelines, conditions, and processing steps.
            </p>
          </section>

          {/* Section 2: Order Cancellation */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              2. Order Cancellation
            </h2>
            <p>
              You may request order cancellation prior to its processing or dispatch. To request a cancellation, please contact us immediately through our official channels.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Cancellation requests must be submitted before we package, customize, or dispatch the items.</li>
              <li>Once an order is prepared, customized to order, or handed over to our courier partners, cancellation is no longer possible.</li>
            </ul>
          </section>

          {/* Section 3: Cancellation by Browtiful Strokes */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              3. Cancellation by Browtiful Strokes
            </h2>
            <p>
              We aim to fulfill all verified transactions, but we reserve the right to cancel orders under specific circumstances, including:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1.5">
              <li>Sudden product/material stock unavailability.</li>
              <li>Incomplete, inaccurate, or unverifiable delivery addresses or contact details.</li>
              <li>Declined payments or failure in the transaction authorization flow.</li>
              <li>Suspicion of unauthorized, fraudulent, or malicious transactions.</li>
              <li>Force majeure events beyond our reasonable operational control.</li>
            </ul>
            <p>
              If we cancel an order after receiving your payment, we will issue a full refund to your original payment method.
            </p>
          </section>

          {/* Section 4: Refund Eligibility */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              4. Refund Eligibility
            </h2>
            <p>Refunds are evaluated on a case-by-case basis and are generally granted in the following scenarios:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Orders cancelled successfully before any packaging, preparation, or dispatch takes place.</li>
              <li>Transactions that were charged but cannot be fulfilled due to inventory shortages.</li>
              <li>Items received in damaged, defective, or incorrect condition, subject to inspection.</li>
            </ul>
          </section>

          {/* Section 5: Damaged or Incorrect Products */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              5. Damaged or Incorrect Products
            </h2>
            <p>
              If your package arrives damaged, tampered with, or contains incorrect items, please contact us within our service hours. To assist us in resolving the issue:
            </p>
            <ol className="list-decimal list-inside pl-2 space-y-1">
              <li>Provide your order details and photos/videos of the package condition.</li>
              <li>Our team will inspect the media and evaluate the details provided.</li>
              <li>Upon verification, we will offer an appropriate resolution, which may include replacing the damaged item or issuing a refund.</li>
            </ol>
          </section>

          {/* Section 6: Non-Refundable Situations */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              6. Non-Refundable Situations
            </h2>
            <p>We are unable to offer refunds or cancellations in the following scenarios:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Change of mind after the order has already been processed, packed, or dispatched.</li>
              <li>Failed delivery attempts caused by incorrect or incomplete shipping addresses provided by the customer.</li>
              <li>Product degradation due to improper use, handling, or storage after delivery.</li>
              <li>Customized studio bookings, nail treatments, or mehendi academy programs that have already been completed or partially utilized.</li>
            </ul>
          </section>

          {/* Section 7: Refund Processing */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              7. Refund Processing
            </h2>
            <p>
              Approved refunds are processed through the original payment method used during checkout. Once initiated, the time required for funds to reflect in your account depends on the policies of your bank or credit card company. <strong>{CONTACT_INFO.brandName}</strong> does not control third-party banking settlement periods.
            </p>
          </section>

          {/* Section 8: Shipping Charges */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              8. Shipping Charges
            </h2>
            <p>
              Shipping and packaging charges are generally non-refundable. If you receive a refund for an order that was already shipped and subsequently returned to us, the cost of original shipping may be deducted from your total refund, unless the cancellation is due to an error on our part.
            </p>
          </section>

          {/* Section 9: How to Request a Cancellation or Refund */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              9. How to Request a Cancellation or Refund
            </h2>
            <p>To initiate a request, please follow these steps:</p>
            <nav className="block bg-cream/40 border border-beige/20 p-5 rounded-xl">
              <ol className="list-decimal list-inside space-y-2.5">
                <li>
                  <span className="font-semibold text-forest">Reach Out:</span> Contact us via our official email or phone number.
                </li>
                <li>
                  <span className="font-semibold text-forest">Provide Details:</span> Share your Order ID and contact name.
                </li>
                <li>
                  <span className="font-semibold text-forest">Explain Reason:</span> Clearly state the reason for your cancellation or refund request.
                </li>
                <li>
                  <span className="font-semibold text-forest">Attach Proof:</span> If items are damaged or incorrect, attach high-resolution photos or videos.
                </li>
                <li>
                  <span className="font-semibold text-forest">Await Confirmation:</span> Our team will review the details and confirm the status of your request within a reasonable period.
                </li>
              </ol>
            </nav>
          </section>

          {/* Section 10: Contact Us */}
          <section className="space-y-3 pt-4 border-t border-beige/40">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              10. Contact Us
            </h2>
            <p>
              If you wish to cancel an order, file a refund request, or ask questions about this policy, please get in touch:
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

export default CancellationRefundPolicy;
