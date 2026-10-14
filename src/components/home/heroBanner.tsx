'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={'/hero-banner.svg'}
          alt="Find Your Taste"
          width={1440}
          height={600}
          className="w-full rounded-lg shadow-xl/25"
        />
      </motion.div>
    </>
  );
}
