import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../config/constants';
import { FileText, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
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
            <FileText className="w-8 h-8 text-forest" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest leading-tight">
            Terms & Conditions
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
              1. Terms & Conditions
            </h2>
            <p>
              Welcome to <strong>{CONTACT_INFO.brandName}</strong>. By accessing or using our website, purchasing our mehndi materials and accessories, or booking our nail and henna studio services, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          {/* Section 2: Products & Services */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              2. Products & Services
            </h2>
            <p>
              We offer premium natural mehndi/henna cones, triple-filtered henna powder, essential oils, nails design accessories, and offline academy training programs.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li><strong>Images:</strong> Product images are for representation purposes only. Actual colors, packaging, and consistency may vary slightly.</li>
              <li><strong>Updates:</strong> Product descriptions, pricing, and stock levels are subject to update at any time without notice.</li>
              <li><strong>Corrections:</strong> We reserve the right to correct any typographical errors, inaccuracies, or omissions related to product descriptions, prices, shipping rates, and availability.</li>
            </ul>
          </section>

          {/* Section 3: Orders */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              3. Orders
            </h2>
            <p>By placing an order on our store, you agree that:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>You are responsible for providing complete, accurate delivery addresses and contact information.</li>
              <li>An order is considered placed and accepted only after the required confirmation and online payment flow has completed successfully.</li>
              <li>We may contact you to verify details before dispatching or confirming service bookings.</li>
              <li>We reserve the right to refuse or cancel any order due to product unavailability, stock errors, incorrect pricing information, or suspicion of fraudulent activity.</li>
            </ul>
          </section>

          {/* Section 4: Pricing & Payments */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              4. Pricing & Payments
            </h2>
            <p>
              All prices listed on our shop are subject to change. Applicable shipping charges and taxes are calculated and presented during the checkout process. You must provide valid payment credentials. Payment processing is handled by secure, PCI-compliant third-party providers (such as Razorpay).
            </p>
          </section>

          {/* Section 5: Shipping & Delivery */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              5. Shipping & Delivery
            </h2>
            <p>
              Orders are packaged and dispatched according to our standard shipping procedures. Detailed information regarding delivery regions, packaging protocols, and shipping fees is available on our dedicated <Link to="/shipping-delivery-policy" className="text-gold font-semibold hover:text-gold-dark hover:underline transition-colors">Shipping & Delivery Policy</Link> page.
            </p>
          </section>

          {/* Section 6: Cancellation & Refunds */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              6. Cancellation & Refunds
            </h2>
            <p>
              Cancellations of orders and service bookings, along with conditions for returns or refund payments, are governed exclusively by our <Link to="/cancellation-refund-policy" className="text-gold font-semibold hover:text-gold-dark hover:underline transition-colors">Cancellation & Refund Policy</Link>. Please refer to that document to check your eligibility.
            </p>
          </section>

          {/* Section 7: User Responsibilities */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              7. User Responsibilities
            </h2>
            <p>When using this website, you agree not to:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Provide false, inaccurate, or misleading details.</li>
              <li>Use the platform or its services for any unlawful or unauthorized purposes.</li>
              <li>Attempt to hack, inject malicious code, overload, or disrupt the operation, security, or integrity of the website.</li>
              <li>Impersonate any person or business entity.</li>
            </ul>
          </section>

          {/* Section 8: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              8. Intellectual Property
            </h2>
            <p>
              All original content featured on this website—including but not limited to the brand name <strong>{CONTACT_INFO.brandName}</strong>, logo designs, custom graphics, text structure, product descriptions, photography, layout, and styling—is the intellectual property of Browtiful Strokes or respective content licensors. No content may be copied, reproduced, distributed, or commercially exploited without our express prior written permission.
            </p>
          </section>

          {/* Section 9: Website Availability */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              9. Website Availability
            </h2>
            <p>
              While we make every effort to keep our online store operational and accessible, we cannot guarantee that access will be uninterrupted, secure, or completely free of errors, downtime, or temporary server maintenance issues.
            </p>
          </section>

          {/* Section 10: Third-Party Links & Services */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              10. Third-Party Links & Services
            </h2>
            <p>
              Our website may integrate or link to external third-party platforms (such as maps, payment processors, and social media channels). We do not supervise, endorse, or assume liability for the policies, content, transactions, or services of these independent third-party websites.
            </p>
          </section>

          {/* Section 11: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              11. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, <strong>{CONTACT_INFO.brandName}</strong>, its directors, and employees shall not be liable for any indirect, incidental, or consequential damages resulting from your use of, or inability to use, our website, products purchased through the platform, or any delays and errors caused by external events beyond our reasonable control.
            </p>
          </section>

          {/* Section 12: Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right to revise or replace these Terms & Conditions at our discretion. Any updates will be posted directly to this page, and the "Last Updated" date will change accordingly. Your continued use of the website or our services after updates are published constitutes your acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 13: Contact Us */}
          <section className="space-y-3 pt-4 border-t border-beige/40">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              13. Contact Us
            </h2>
            <p>
              For any clarification regarding these Terms & Conditions, please contact us:
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

export default TermsAndConditions;
