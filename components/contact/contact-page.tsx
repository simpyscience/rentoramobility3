'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { cn } from '@/lib/utils';

type FormState = 'idle' | 'submitting' | 'sent';

export function ContactPage() {
  const [formState, setFormState] = React.useState<FormState>('idle');
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email address';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[\d\s+-]{10,15}$/.test(form.phone.trim())) errs.phone = 'Enter a valid phone number';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === 'submitting') return;
    if (!validate()) return;

    setFormState('submitting');
    const msg = `New enquiry from ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim()}\nMessage: ${form.message.trim()}`;
    window.open(whatsappLink(msg), '_blank');
    setFormState('sent');
  };

  const reset = () => {
    setForm({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setFormState('idle');
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
          subtitle="We are available around the clock for bookings, queries and support."
        />

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
              <div className={cn('flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-muted/50 mb-3 group-hover:scale-110 transition-transform', card.color)}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{card.label}</div>
              <div className="font-semibold text-sm">{card.value}</div>
            </motion.a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="luxury-card p-8">
            {formState === 'sent' ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold mb-2">Message Ready</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  We have prepared your message in WhatsApp. Complete the send there and our team will respond shortly.
                </p>
                <Button onClick={reset} variant="outline" className="rounded-full">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Name</label>
                  <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.name ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="Your full name" />
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                    <input id="email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="you@email.com" />
                    {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone</label>
                    <input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="+91 XXXXXXXXXX" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Message</label>
                  <textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors resize-none', errors.message ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="Tell us about your travel needs..." />
                  {errors.message && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.message}</p>}
                </div>
                <Button type="submit" disabled={formState === 'submitting'} className="btn-gold w-full rounded-xl h-12">
                  <Send className="h-4 w-4 mr-2" /> {formState === 'submitting' ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Submitting opens WhatsApp with your message pre-filled. No data is stored on our servers.
                </p>
              </form>
            )}
          </motion.div>

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
                <p className="text-sm text-muted-foreground">Available across India with airport transfers, outstation travel, city rentals and corporate solutions.</p>
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
