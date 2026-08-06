'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';

export function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const msg = `New enquiry from ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`;
    window.open(whatsappLink(msg), '_blank');
  };

  const contactCards = [
    { icon: Phone, label: 'Call Us', value: CONTACT.phoneDisplay, href: telLink(), color: 'text-gold' },
    { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsappDisplay, href: whatsappLink('Hello Rentora Mobility'), color: 'text-[#25D366]' },
    { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, color: 'text-blue-500' },
    { icon: MapPin, label: 'Coverage', value: 'Available Across India', href: '/fleet', color: 'text-red-500' },
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact Rentora Mobility"
          subtitle="We're here 24/7 to help you with bookings, queries and support. Reach us anytime."
        />

        {/* Contact cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-12">
          {contactCards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="luxury-card p-6 text-center group"
            >
              <div className={`flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-muted/50 ${card.color} mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{card.label}</div>
              <div className="font-semibold text-sm">{card.value}</div>
            </motion.a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="luxury-card p-8">
            <h3 className="font-display text-2xl font-bold mb-1">Send Us a Message</h3>
            <p className="text-sm text-muted-foreground mb-6">Fill out the form and we'll get back to you within 1 hour.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold">Message Sent!</h4>
                <p className="text-sm text-muted-foreground mt-2">We've redirected you to WhatsApp for a faster response.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full mt-4">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors" placeholder="Your name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone</label>
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors" placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Message</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none" placeholder="Tell us about your travel needs..." />
                </div>
                <Button type="submit" className="btn-gold w-full rounded-xl h-12"><Send className="h-4 w-4 mr-2" /> Send Message</Button>
              </form>
            )}
          </motion.div>

          {/* Map + info */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="luxury-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d76.81306785!3d28.6448097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sIndia!5e0!3m2!1sen!2sin!4v1690000000000"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  title="Rentora Mobility coverage map"
                />
              </div>
              <div className="p-6">
                <h4 className="font-semibold flex items-center gap-2 mb-2"><MapPin className="h-5 w-5 text-gold" /> Pan India Service</h4>
                <p className="text-sm text-muted-foreground">Available in 120+ cities including Delhi, Mumbai, Bangalore, Jaipur, Udaipur, Goa, Hyderabad, Pune, Chandigarh, Agra and more.</p>
              </div>
            </div>

            <div className="luxury-card p-6">
              <h4 className="font-semibold flex items-center gap-2 mb-4"><Clock className="h-5 w-5 text-gold" /> Business Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer Support</span>
                  <span className="font-semibold text-green-600">24/7 Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bookings</span>
                  <span className="font-semibold">24/7 Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Roadside Assistance</span>
                  <span className="font-semibold text-green-600">24/7 Available</span>
                </div>
              </div>
            </div>

            <a href={whatsappLink('Hello Rentora Mobility')} target="_blank" rel="noopener noreferrer" className="block">
              <div className="luxury-card p-6 flex items-center gap-4 hover:border-[#25D366]/40 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Chat on WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Fastest response · {CONTACT.whatsappDisplay}</div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
