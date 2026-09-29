'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, ChevronRight } from 'lucide-react';
import { CONTACT, telLink, whatsappLink, mailtoLink } from '@/lib/data/contact';

export interface LegalSection {
  id?: string;
  h: string;
  p?: string;
  list?: ReactNode[];
  numbered?: boolean;
  table?: {
    caption: string;
    columns: string[];
    rows: string[][];
  };
}

interface LegalPageProps {
  title: string;
  category: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  lastUpdated: string;
  sections: LegalSection[];
}

function PolicyTable({ table }: { table: NonNullable<LegalPageProps['sections'][number]['table']> }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card/40">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="bg-gold/10">
            {table.columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`px-4 py-3 font-semibold text-foreground ${i === table.columns.length - 1 ? 'text-right' : ''}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r} className="border-t border-border even:bg-background/40">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`px-4 py-3 align-top text-muted-foreground ${c === table.columns.length - 1 ? 'text-right font-semibold text-foreground tabular-nums' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalPage({ title, category, intro, heroImage, heroAlt, lastUpdated, sections }: LegalPageProps) {
  return (
    <div className="pb-20">
      {/* Cinematic hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={heroImage} alt={heroAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,8%)]/92 via-[hsl(222,47%,8%)]/72 to-[hsl(222,47%,8%)]" />
        </div>
        <div className="relative container-lux px-4 sm:px-6 lg:px-8 pb-20 pt-36 text-center md:pb-28 md:pt-44">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">{category}</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight leading-[1.1] text-white md:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{intro}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="container-lux mx-auto max-w-3xl">
          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={section.id ?? i}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-28"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm font-semibold text-gold tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display font-semibold tracking-tight text-foreground">{section.h}</h2>
                </div>

                {section.p && (
                  <p className="mt-3 leading-relaxed text-muted-foreground">{section.p}</p>
                )}

                {section.list && section.list.length > 0 && (
                  <ul
                    className={`mt-4 space-y-2.5 leading-relaxed text-muted-foreground ${
                      section.numbered ? 'list-decimal pl-5' : 'list-disc pl-5'
                    }`}
                  >
                    {section.list.map((item, j) => (
                      <li key={j} className="pl-1 marker:text-gold">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.table && <PolicyTable table={section.table} />}
              </motion.div>
            ))}
          </div>

          {/* Contact / trust element */}
          <div className="mt-16 luxury-card p-8 text-center md:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Questions about this policy?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
              Our team is happy to help you understand any part of the {title.toLowerCase()}. Reach out through any of the
              channels below and we will get back to you.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={telLink()}
                className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <Phone className="h-4 w-4" /> Call {CONTACT.phoneDisplay}
              </a>
              <a
                href={whatsappLink(`Hello Rentora Mobility — question about the ${title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={mailtoLink(`Question about the ${title}`)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" /> Email us
              </a>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Rentora Mobility &middot; {CONTACT.address}
            </p>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" /> Back to home
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
