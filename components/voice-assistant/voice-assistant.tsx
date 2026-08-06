'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Sparkles, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT, whatsappLink } from '@/lib/data/contact';
import { CARS } from '@/lib/data/cars';
import { FAQS } from '@/lib/data/site';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [
  'Compare Innova Crysta vs Hycross',
  'Best car for 7 people?',
  'Airport transfer pricing',
  'How to book a luxury car?',
];

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('innova') && (q.includes('crysta') || q.includes('hycross'))) {
    return `Great question! Here's the comparison:

**Innova Crysta** — Diesel, proven reliability, legendary ride comfort, ₹4,500/day. Best for long highway journeys.

**Innova Hycross** — Hybrid, SUV styling, ADAS safety, panoramic sunroof, ventilated seats, ₹5,500/day. Best for city use and corporate travel.

Both seat 7 passengers and come with professional chauffeurs. Would you like to book one? I can transfer you to WhatsApp for instant booking.`;
  }

  if (q.includes('7') || q.includes('seven') || q.includes('family') || q.includes('group') || q.includes('people')) {
    const suvs = CARS.filter((c) => c.specs.passengers >= 7).slice(0, 4);
    return `For 7+ passengers, I recommend:
${suvs.map((c) => `• ${c.name} — ₹${c.pricePerDay.toLocaleString('en-IN')}/day`).join('\n')}

The Toyota Innova Crysta is our most popular choice for families. Would you like more details?`;
  }

  if (q.includes('airport')) {
    return `Our airport transfer service starts at ₹1,499. Your chauffeur tracks your flight, meets you at arrivals with a placard, and assists with luggage. Available 24/7 at all major Indian airports. Book at /services/airport-transfers or message us on WhatsApp for instant booking.`;
  }

  if (q.includes('luxury') || q.includes('bmw') || q.includes('mercedes') || q.includes('audi')) {
    const luxury = CARS.filter((c) => c.category === 'Luxury');
    return `Our luxury fleet includes:
${luxury.map((c) => `• ${c.name} — ₹${c.pricePerDay.toLocaleString('en-IN')}/day`).join('\n')}

All luxury cars come with professional chauffeurs. Available on request. Would you like to book?`;
  }

  if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('rate')) {
    return `Our rentals start from ₹2,200/day for economy cars. Pricing depends on the car category, duration and whether you need a chauffeur. GST is included and there are no hidden charges. Check our fleet page for detailed pricing or use the booking widget to get an instant quote.`;
  }

  if (q.includes('book') || q.includes('how to')) {
    return `Booking is easy! Use the booking widget on the homepage or visit our Fleet page. Select your city, dates and preferred car, then complete the booking. You can also book instantly via WhatsApp — I can transfer you there now.`;
  }

  if (q.includes('self drive') || q.includes('self-drive')) {
    return `Yes! We offer self-drive rentals on select cars including the Honda City, Innova Crysta, Fortuner and more. You need a valid driving licence and ID. Prices start at ₹2,200/day. Visit /services/self-drive for details.`;
  }

  if (q.includes('corporate')) {
    return `We offer dedicated corporate rentals with monthly subscriptions, invoice billing, GST invoices and a dedicated account manager. Starting at ₹49,999/month. Email us at rentoramobility@gmail.com for a custom corporate package.`;
  }

  if (q.includes('wedding')) {
    return `Make your wedding special with our luxury wedding cars — Mercedes, BMW, decorated Fortuner and more. Floral decoration and formal-attire chauffeurs included. Starting at ₹15,000. Visit /services/wedding-cars for details.`;
  }

  if (q.includes('cancel') || q.includes('refund')) {
    return `Free cancellation up to 24 hours before pickup. Within 24 hours, a 25% fee applies. No-shows are charged at 50%. Refunds are processed within 5-7 business days. See /cancellation-policy for full details.`;
  }

  if (q.includes('document') || q.includes('licence') || q.includes('license') || q.includes('id')) {
    return `For self-drive: valid driving licence + Aadhaar/Passport + card for deposit. For chauffeur-driven: just a government ID. Minimum age 21 (25 for luxury cars).`;
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('email')) {
    return `You can reach us at:
• Phone/WhatsApp: ${CONTACT.phoneDisplay}
• Email: ${CONTACT.email}
• We're available 24/7!`;
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
    return `Namaste! Welcome to Rentora Mobility. I'm your AI assistant. I can help you choose the right car, compare options, explain pricing and guide you through booking. How can I help you today?`;
  }

  const faq = FAQS.find((f) => q.includes(f.q.toLowerCase().split(' ').slice(0, 3).join(' ')));
  if (faq) return faq.a;

  return `I'd be happy to help with that! I can assist with car recommendations, pricing, bookings, airport transfers, corporate rentals, luxury cars and more. For specific queries, I recommend connecting with our team on WhatsApp at ${CONTACT.phoneDisplay} — shall I transfer you?`;
}

export function VoiceAssistant() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', text: 'Namaste! I\'m Rentora AI — your mobility assistant. I can help you choose the perfect car, compare options and guide you through booking. How can I help you today?' },
  ]);
  const [input, setInput] = React.useState('');
  const [listening, setListening] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (muted || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[*•\n]/g, ' '));
    utter.lang = 'en-IN';
    utter.rate = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
      speak(response);
    }, 600);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Voice input is not supported in your browser. Please type your question instead, or message us on WhatsApp.' }]);
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const transferWhatsApp = () => {
    window.open(whatsappLink('Hello Rentora Mobility, I was chatting with your AI assistant and would like to book a car.'), '_blank');
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full btn-gold shadow-gold-lg"
        aria-label="Open AI assistant"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-gold animate-pulse-ring" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[520px] max-h-[calc(100vh-8rem)] glass rounded-3xl shadow-luxury flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border/40 bg-gradient-to-r from-gold/10 to-transparent">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark shrink-0">
                <Sparkles className="h-5 w-5 text-[hsl(var(--gold-foreground))]" />
                {speaking && <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Rentora AI Assistant</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Online · English & Hindi
                </div>
              </div>
              <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-gold transition-colors" aria-label="Toggle sound">
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'btn-gold rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Suggestions */}
              {messages.length <= 2 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-muted-foreground px-1">Try asking:</div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="block w-full text-left rounded-xl border border-border px-3 py-2 text-sm hover:border-gold/40 hover:bg-gold/5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp transfer */}
            <div className="px-4 pb-2">
              <button
                onClick={transferWhatsApp}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366]/10 text-[#25D366] py-2 text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Transfer to WhatsApp
              </button>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-border/40">
              <button
                onClick={startListening}
                className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 transition-all ${
                  listening ? 'bg-red-500 text-white animate-pulse' : 'bg-muted hover:bg-gold/20'
                }`}
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder={listening ? 'Listening...' : 'Type your question...'}
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                className="flex h-10 w-10 items-center justify-center rounded-full btn-gold shrink-0"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
