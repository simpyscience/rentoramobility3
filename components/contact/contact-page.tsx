'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2, AlertCircle, Copy, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { CONTACT, whatsappLink, whatsapp2Link, telLink, tel2Link, mailtoLink } from '@/lib/data/contact';
import { cn } from '@/lib/utils';

type FormState = 'idle' | 'submitting' | 'sent' | 'failed';

export function ContactPage() {
  const [formState, setFormState] = React.useState<FormState>('idle');
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState('');
  const [copied, setCopied] = React.useState(false);

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

  const buildMessage = () =>
    `New enquiry from ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim()}\nMessage: ${form.message.trim()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === 'submitting' || formState === 'sent') return;
    setSubmitError('');
    if (!validate()) return;

    setFormState('submitting');
    try {
      await new Promise((r) => setTimeout(r, 450));
      const url = whatsappLink(buildMessage());
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        setFormState('sent');
      } else {
        throw new Error('blocked');
      }
    } catch {
      setFormState('failed');
      setSubmitError(
        'WhatsApp could not be opened in this browser. Please email us at ' +
          CONTACT.email +
          ' or call ' +
          CONTACT.phoneDisplay +
          '. Your message is shown below for easy copying.'
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildMessage()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reset = () => {
    setForm({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setFormState('idle');
    setSubmitError('');
    setCopied(false);
  };

  const contactCards = [
    {
      icon: Phone,
      label: 'Call Us',
      value: CONTACT.phoneDisplay,
      secondary: CONTACT.phone2Display,
      href: telLink(),
      secondaryHref: tel2Link(),
      color: 'text-gold',
      aria: 'Call Rentora Mobility',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: CONTACT.whatsappDisplay,
      secondary: CONTACT.whatsapp2Display,
      href: whatsappLink('Hello Rentora Mobility'),
      secondaryHref: whatsapp2Link('Hello Rentora Mobility'),
      color: 'text-[#25D366]',
      aria: 'WhatsApp Rentora Mobility',
    },
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT.email,
      secondary: '',
      href: mailtoLink('Enquiry from ' + (form.name || 'Customer')),
      secondaryHref: '',
      color: 'text-blue-500',
      aria: 'Email Rentora Mobility',
    },
    {
      icon: Headset,
      label: '24/7 Support',
      value: 'We respond fast',
      secondary: 'Call · WhatsApp · Email',
      href: '',
      secondaryHref: '',
      color: 'text-foreground',
      aria: 'Rentora Mobility support is available 24/7',
    },
    {
      icon: MapPin,
      label: 'Registered Office',
      value: CONTACT.address,
      secondary: '',
      href: '',
      secondaryHref: '',
      color: 'text-foreground',
      aria: 'Rentora Mobility registered office address',
    },
  ];

  const inputCls = (err: boolean) =>
    cn(
      'w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors',
      err ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold'
    );

  return (
    <div className="pt-28 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact Rentora Mobility"
          subtitle="Available 24/7 for bookings, queries and support. Call, WhatsApp, or email us — or send a message below."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-12">
          {contactCards.map((card, i) => {
            const Card = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'luxury-card p-6 text-center group h-full',
                  card.href ? 'focus-within:ring-2 focus-within:ring-gold' : ''
                )}
              >
                <div className={cn('flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-muted/50 mb-3 group-hover:scale-110 transition-transform', card.color)}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{card.label}</div>
                <div className="font-semibold text-sm break-words">{card.value}</div>
                {card.secondary && (
                  <div className="text-xs text-muted-foreground mt-1 break-words">
                    {card.secondaryHref ? (
                      <a href={card.secondaryHref} className="hover:text-gold transition-colors" aria-label={`${card.label} secondary number`}>
                        or {card.secondary}
                      </a>
                    ) : (
                      card.secondary
                    )}
                  </div>
                )}
              </motion.div>
            );
            return card.href ? (
              <a key={card.label} href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={card.aria}>
                {Card}
              </a>
            ) : (
              <div key={card.label} role="note" aria-label={card.aria}>
                {Card}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="luxury-card p-8">
            {formState === 'sent' ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4" aria-hidden="true">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold mb-2">Message Ready in WhatsApp</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  We&apos;ve opened WhatsApp with your message pre-filled. Please press send there and our team will respond shortly. If WhatsApp did not open, use the options below.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => window.open(whatsappLink(buildMessage()), '_blank', 'noopener,noreferrer')}
                    className="btn-gold w-full rounded-xl h-12"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> Open WhatsApp Again
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" className="rounded-full">
                    <Copy className="h-4 w-4 mr-2" /> {copied ? 'Copied!' : 'Copy Message'}
                  </Button>
                  <a href={mailtoLink('Enquiry from ' + (form.name || 'Customer'), buildMessage())} className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors">
                    Or send via Email
                  </a>
                  <Button onClick={reset} variant="link" className="text-sm">Send another message</Button>
                </div>
              </div>
            ) : formState === 'failed' ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-500/10 text-red-600 mb-4" aria-hidden="true">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold mb-2">Could not Open WhatsApp</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">{submitError}</p>
                <div className="flex flex-col gap-3">
                  <Button onClick={copyToClipboard} variant="outline" className="rounded-full">
                    <Copy className="h-4 w-4 mr-2" /> {copied ? 'Copied!' : 'Copy Message'}
                  </Button>
                  <Button asChild>
                    <a href={mailtoLink('Enquiry from ' + (form.name || 'Customer'), buildMessage())}>Send via Email</a>
                  </Button>
                  <a href={telLink()} className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors">Call us at {CONTACT.phoneDisplay}</a>
                  <Button onClick={reset} variant="link" className="text-sm">Back to form</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form" noValidate>
                <div>
                  <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={inputCls(!!errors.name)}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-500 mt-1 flex items-center gap-1" role="alert">
                      <AlertCircle className="h-3 w-3" />{errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={inputCls(!!errors.email)}
                      placeholder="you@email.com"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-500 mt-1 flex items-center gap-1" role="alert">
                        <AlertCircle className="h-3 w-3" />{errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      className={inputCls(!!errors.phone)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-xs text-red-500 mt-1 flex items-center gap-1" role="alert">
                        <AlertCircle className="h-3 w-3" />{errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={inputCls(!!errors.message)}
                    placeholder="Tell us about your travel needs..."
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-red-500 mt-1 flex items-center gap-1" role="alert">
                      <AlertCircle className="h-3 w-3" />{errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={formState === 'submitting'} className="btn-gold w-full rounded-xl h-12" aria-busy={formState === 'submitting'}>
                  {formState === 'submitting' ? (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Opening WhatsApp...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send via WhatsApp
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This opens WhatsApp with your message pre-filled. No data is stored on our servers. You can also email or call us directly.
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
                  title="Rentora Mobility coverage map — Pan India service"
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

            <a href={whatsappLink('Hello Rentora Mobility')} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp with Rentora Mobility" className="block">
              <div className="luxury-card p-6 flex items-center gap-4 hover:border-[#25D366]/40 transition-colors focus-within:ring-2 focus-within:ring-gold">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]" aria-hidden="true">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Chat on WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Fastest response · {CONTACT.whatsappDisplay}</div>
                </div>
                <Send className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
