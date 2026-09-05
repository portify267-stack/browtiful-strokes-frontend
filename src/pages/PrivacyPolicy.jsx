import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../config/constants';
import { Shield, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <Shield className="w-8 h-8 text-forest" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest leading-tight">
            Privacy Policy
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
              1. Privacy Policy
            </h2>
            <p>
              At <strong>{CONTACT_INFO.brandName}</strong>, we respect your privacy and are committed to protecting any personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website, use our mehndi and nail salon services, or purchase our organic henna cones, essential oils, and aftercare products.
            </p>
          </section>

          {/* Section 2: Info We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              2. Information We Collect
            </h2>
            <p>
              To process orders, confirm studio bookings, and handle inquiries, we collect information necessary to provide you with our services. This includes:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1.5">
              <li><strong>Contact Information:</strong> Name, phone number, email address, and billing/shipping address.</li>
              <li><strong>Order Details:</strong> Products purchased, quantities, prices, and shipping selection.</li>
              <li><strong>Communication Records:</strong> Any messages, feedback, or details submitted through our contact forms or customer support channels.</li>
              <li><strong>Technical Data:</strong> Basic website usage details, device operating system, and browser information captured through standard web server logs.</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              3. How We Use Your Information
            </h2>
            <p>We use your information solely to deliver a high-quality experience, including:</p>
            <ul className="list-disc list-inside pl-2 space-y-1.5">
              <li>Processing and completing your order shipments and transactions.</li>
              <li>Contacting you with order updates, confirmation, and tracking details.</li>
              <li>Responding to your service inquiries, studio academy bookings, and support requests.</li>
              <li>Improving our e-commerce catalog, website performance, and physical studio experiences.</li>
              <li>Preventing unauthorized transactions and maintaining site security.</li>
            </ul>
          </section>

          {/* Section 4: Payment Information */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              4. Payment Information
            </h2>
            <p>
              Your payment security is of utmost importance. <strong>{CONTACT_INFO.brandName}</strong> does not store or process your credit card numbers, CVVs, or online banking passwords on our servers. All payments are securely processed through our integrated third-party payment gateway provider (e.g., Razorpay) in compliance with industry PCI-DSS standards.
            </p>
          </section>

          {/* Section 5: Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              5. Cookies
            </h2>
            <p>
              We use cookies and similar browser storage mechanisms to improve your navigation experience, remember the items in your shopping cart, and understand general site traffic. You can choose to disable cookies through your browser settings, though doing so may prevent certain site features (such as checking out or retaining cart items) from functioning properly.
            </p>
          </section>

          {/* Section 6: Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              6. Third-Party Services
            </h2>
            <p>
              We partner with trusted third-party service providers to run our operations. These include secure payment gateways (Razorpay), courier and delivery services, and basic website hosting and analytics tools. These third parties are only granted access to the information required to execute their specific services and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          {/* Section 7: Data Security */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              7. Data Security
            </h2>
            <p>
              We implement reasonable physical, technical, and administrative safeguards to protect your personal data from unauthorized access, loss, or alteration. However, please be aware that no method of transmission over the internet or database storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 8: Data Retention */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              8. Data Retention
            </h2>
            <p>
              We keep your personal information only as long as is necessary to fulfill the purposes outlined in this policy, including completing transactions, responding to bookings, managing customer service accounts, or meeting tax, accounting, and legal requirements.
            </p>
          </section>

          {/* Section 9: Your Rights */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              9. Your Rights
            </h2>
            <p>
              Depending on your location, you may have rights regarding your personal information, including the right to request access to the data we hold, correct inaccurate details, or request that we delete your information. To exercise these rights, please contact us using the details listed below.
            </p>
          </section>

          {/* Section 10: Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              10. Children's Privacy
            </h2>
            <p>
              Our website is designed for general audiences and we do not knowingly or intentionally collect personal information from children without appropriate parental or legal guardian consent. If you believe we have inadvertently collected such data, contact us immediately and we will delete it.
            </p>
          </section>

          {/* Section 11: Changes to This Privacy Policy */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect operational, legislative, or service changes. Any revisions will be published on this page with an updated "Last Updated" date at the top. We encourage you to check this page periodically to remain informed.
            </p>
          </section>

          {/* Section 12: Contact Us */}
          <section className="space-y-3 pt-4 border-t border-beige/40">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest border-b border-beige/25 pb-2">
              12. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, your personal information, or wish to make a request regarding your data rights, please contact us:
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

export default PrivacyPolicy;
