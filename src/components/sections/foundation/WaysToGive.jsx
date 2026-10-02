import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Smartphone, MessageCircle, Copy, Check } from 'lucide-react';
import { Button } from '../../ui';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

function CopyableValue({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently, value is still visible to copy manually.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-navy-100 bg-cream px-4 py-3 text-left transition-colors duration-200 hover:border-gold-500/50"
    >
      <span className="font-mono text-sm font-semibold text-navy-900">{value}</span>
      <span className="flex items-center gap-1 font-body text-xs font-semibold text-gold-700">
        {copied ? (
          <>
            <Check size={14} aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy size={14} aria-hidden="true" />
            Copy
          </>
        )}
      </span>
    </button>
  );
}

export default function WaysToGive() {
  return (
    <section id="ways-to-give" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Ways to Give"
            title="Support the Mission"
            subtitle="Choose whichever option works best for you — every contribution, big or small, helps transform a learner's future."
          />

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* PayPal */}
            <motion.div
              variants={fadeUpItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-8 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                <Wallet size={26} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-navy-900">Give via PayPal</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">
                Send your contribution directly to our PayPal account. Ideal for one-time or
                international gifts.
              </p>
              <CopyableValue value="ogayafredrick3@gmail.com" />
            </motion.div>

            {/* M-Pesa */}
            <motion.div
              variants={fadeUpItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-8 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                <Smartphone size={26} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-navy-900">Give via M-Pesa</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">
                Send directly via M-Pesa — the fastest way to give for supporters in Kenya.
              </p>
              <CopyableValue value="+254 716 921 700" />
            </motion.div>

            {/* Contact / Partnership */}
            <motion.div
              variants={fadeUpItem}
              className="flex h-full flex-col rounded-2xl border border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-white p-8 shadow-premium"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-navy-900">Talk to Our Team</h3>
              <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-600">
                Prefer bank transfer, corporate sponsorship, in-kind support or a custom
                partnership? Reach out and we'll arrange the option that works for you.
              </p>
              <Button to="/contact" variant="gold" size="md" className="mt-6 w-full">
                Fill Out a Form
              </Button>
            </motion.div>
          </div>

          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-10 max-w-2xl text-center font-body text-xs text-navy-400"
          >
            InnoSpeak Global Foundation is an initiative of InnoSpeak Global. For receipts or
            questions about a specific contribution, please get in touch through the contact form.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}