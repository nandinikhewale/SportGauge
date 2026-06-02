import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcoHero from '../components/ecosystem/EcoHero';
import { FAQ_ITEMS } from '../constants/content/faq';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="page-shell">
      <Navbar />
      <EcoHero label="Help Centre" title={<>Frequently Asked <span className="gradient-text">Questions</span></>}
        subtitle="Registration, assessments, AI analysis, privacy, coaches, events, and rankings — answered for athletes, parents, and coaches." video="about" />

      <section className="py-16 max-w-3xl mx-auto px-4">
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className="glass-card overflow-hidden">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left p-5 flex justify-between gap-4 font-display font-semibold text-theme">
                {item.q}
                <span className="text-ki-saffron">{open === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
                    <p className="text-sm text-theme-secondary leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
