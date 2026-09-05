import React, { useState } from 'react';
import { CONTACT_INFO } from '../config/constants';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/common/UIStates';

const Instagram = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const WhatsAppIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    className={className}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.1-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

const ContactSection = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    const messageText = `Hello Browtiful Strokes,\n\nName: ${formData.name}\nMessage: ${formData.message}\n\nI would like to know more about your products/services.`;
    const encodedMessage = encodeURIComponent(messageText);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappUrl = isMobile 
      ? `https://api.whatsapp.com/send?phone=${CONTACT_INFO.whatsappNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${CONTACT_INFO.whatsappNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    setFormSubmitted(true);
    setFormData({ name: '', message: '' });
  };

  return (
    <section id="contact" className="py-8 md:py-12 lg:py-14 bg-white border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Connect With Us"
          subtitle="Get in touch for custom bridal bookings, academy inquiries, or product support."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Details & Map */}
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-bold text-forest">Studio &amp; Academy Inquiries</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed max-w-md">
                {CONTACT_INFO.detailedDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2.5 rounded-full text-forest">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold block">Phone / WhatsApp</span>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-sm font-semibold hover:text-gold transition-colors text-charcoal">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2.5 rounded-full text-forest">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold block">Email</span>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-semibold hover:text-gold transition-colors text-charcoal">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2.5 rounded-full text-forest">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold block">Studio &amp; Academy Address</span>
                  <p className="text-sm font-semibold text-charcoal">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2.5 rounded-full text-forest">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold block">Working Hours</span>
                  <p className="text-sm font-semibold text-charcoal">Monday – Saturday: 10:00 AM – 7:00 PM</p>
                  <p className="text-xs text-charcoal/60">Sunday: Closed</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2.5 rounded-full text-forest">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold block">Instagram</span>
                  <a
                    href={CONTACT_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold hover:text-gold transition-colors text-charcoal"
                  >
                    @browtiful_strokes
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps Location */}
            <div className="rounded-lg overflow-hidden border border-beige/40 h-48 bg-beige/10">
              <iframe
                title="Browtiful Strokes Studio Location"
                src="https://maps.google.com/maps?q=Old+No.+19,+New+No.+41,+1st+Floor,+South+Usman+Road,+T.+Nagar,+Chennai+600017&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale opacity-80"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-cream/40 p-6 md:p-8 rounded-lg border border-beige/60">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-successgreen-text mb-4" />
                <h3 className="font-serif text-2xl font-bold text-forest mb-2">Message Sent!</h3>
                <p className="text-charcoal/70 text-sm max-w-sm">
                  Thank you for reaching out. We will read your inquiry and contact you back within 24 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-forest hover:bg-forest-light text-cream rounded-md text-sm font-semibold transition-all duration-300 shadow"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <h3 className="font-serif text-xl font-bold text-forest mb-4">Send a Message</h3>
                <div>
                  <label htmlFor="form-name" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                    Your Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 text-sm rounded-md border border-beige bg-white focus:border-forest focus:ring-1 focus:ring-forest text-charcoal transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="form-msg" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                    Message
                  </label>
                  <textarea
                    id="form-msg"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry..."
                    className="w-full px-4 py-2.5 text-sm rounded-md border border-beige bg-white focus:border-forest focus:ring-1 focus:ring-forest text-charcoal transition-all duration-200 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-forest hover:bg-forest-light text-cream font-semibold rounded-md transition-all duration-300 text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
