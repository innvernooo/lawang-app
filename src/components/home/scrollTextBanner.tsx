'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Banner teks horizontal yang bergeser mengikuti scroll (pinned + scrub),
 * dengan huruf yang "muncul" satu per satu dan label berwarna yang berputar masuk.
 *
 * Pakai di page:  <ScrollTextBanner />
 * (beri konten di atas/bawahnya supaya ada ruang untuk scroll)
 */

// ---------- Potongan kecil (hanya dipakai di file ini) ----------

/** Teks yang dipecah per huruf. Huruf dianimasikan oleh GSAP lewat atribut data-char. */
function Word({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex whitespace-pre ${className}`}>
      {/* versi untuk screen reader */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-word className="inline-flex">
        {[...text].map((ch, i) => (
          <span
            key={i}
            data-char
            className="inline-block will-change-transform"
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Label berwarna. data-rot = sudut akhir (derajat), data-pop = ikut animasi masuk. */
function Tag({
  children,
  rot = 0,
  className = '',
}: {
  children: ReactNode;
  rot?: number;
  className?: string;
}) {
  return (
    <span
      data-pop
      data-rot={rot}
      className={`inline-block rounded-lg px-[0.45em] py-[0.15em] font-semibold text-[#0e100f] shadow-[0_6px_0_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </span>
  );
}

// ---------- Komponen utama ----------

export default function ScrollTextBanner() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Hanya animasi kalau pengguna tidak mematikan animasi di perangkatnya.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trackEl = track.current!;
        const distance = () =>
          Math.max(0, trackEl.scrollWidth - window.innerWidth);

        // 1) Geser track ke kiri sejauh lebarnya, dikendalikan oleh scroll.
        const scrollTween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: 'none', // WAJIB "none" supaya gerakan mengikuti scroll 1:1
          scrollTrigger: {
            trigger: root.current,
            start: 'top top+=200',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 1, // 1 = sedikit "ngikut" (smooth); true = persis
            invalidateOnRefresh: true, // hitung ulang saat resize
          },
        });

        // 2) Huruf muncul satu per satu saat kata masuk dari sisi kanan layar.
        gsap.utils
          .toArray<HTMLElement>('[data-word]', root.current!)
          .forEach((word) => {
            gsap.from(word.querySelectorAll('[data-char]'), {
              yPercent: 120,
              opacity: 0,
              rotate: () => gsap.utils.random(-30, 30),
              duration: 0.5,
              ease: 'back.out(2)',
              stagger: { each: 0.03, from: 'random' },
              scrollTrigger: {
                trigger: word,
                containerAnimation: scrollTween, // acuan: gerakan horizontal di atas
                start: 'left 92%', // saat sisi kiri kata menyentuh 92% lebar layar
                toggleActions: 'play none none reverse',
              },
            });
          });

        // 3) Label berwarna: berputar + naik, lalu berhenti di sudut aslinya.
        gsap.utils
          .toArray<HTMLElement>('[data-pop]', root.current!)
          .forEach((el) => {
            const rot = Number(el.dataset.rot ?? 0);
            gsap.fromTo(
              el,
              {
                opacity: 0,
                y: 60,
                scale: 0.8,
                rotate: rot + gsap.utils.random(-25, 25),
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: rot,
                duration: 0.7,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                  trigger: el,
                  containerAnimation: scrollTween,
                  start: 'left 92%',
                  toggleActions: 'play none none reverse',
                },
              },
            );
          });

        // 4) Hiasan: melayang dan berputar terus (tidak terkait scroll).
        gsap.to('[data-float]', {
          y: -14,
          duration: 1.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 0.3,
        });
        gsap.to('[data-spin]', {
          rotate: 360,
          duration: 10,
          ease: 'none',
          repeat: -1,
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Tentang platform event"
      className="relative mt-5 h-40 md:h-50 lg:h-70 overflow-hidden text-[#fffce1] motion-reduce:h-auto"
    >
      <div
        ref={track}
        className="absolute left-0 top-0 flex h-full w-max items-center gap-[4vw] pl-[8vw] pr-[25vw] text-[clamp(2.5rem,7vw,7rem)] font-medium leading-none tracking-tight motion-reduce:static motion-reduce:h-auto motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-y-8 motion-reduce:py-20 motion-reduce:pr-[8vw]"
      >
        {/* --- Intro: dua label bertumpuk + paragraf kecil --- */}
        <div className="flex shrink-0 flex-col items-start gap-3 text-[clamp(1.1rem,2.2vw,2rem)]">
          <Tag rot={-3} className="bg-[#fec5fb]">
            Temukan Event
          </Tag>
          <Tag rot={2} className="ml-[2em] bg-[#ff8709]">
            Apa saja, di mana saja
          </Tag>
          <p className="mt-6 max-w-[22ch] text-[0.8em] font-normal leading-snug text-brand-200">
            Dari konser, seminar, hingga turnamen — semuanya ada di satu tempat.
          </p>
        </div>

        {/* hiasan: bulatan melayang */}
        <span
          data-float
          aria-hidden="true"
          className="block size-[0.9em] shrink-0 rounded-full border-[0.18em] border-[#9d95ff]"
        />

        {/* --- Kalimat besar --- */}
        <Word text="Pesan tiket" className="text-black shrink-0" />
        <Tag rot={-2} className="shrink-0 bg-[#0ae448]">
          Mudah
        </Tag>
        <Word text="dan" className="shrink-0 text-black" />
        <Word text="cepat," className="shrink-0 italic text-black" />

        {/* hiasan: belah ketupat berputar */}
        <span
          data-spin
          aria-hidden="true"
          className="block size-[0.6em] shrink-0 rounded-md bg-linear-to-br from-[#ff8709] to-[#fec5fb]"
        />

        <Word text="tanpa ribet" className="shrink-0 text-black" />
        <Tag rot={4} className="shrink-0 bg-[#abff84] text-[0.55em]">
          Aman
        </Tag>
        <Word text="dengan" className="shrink-0 text-black" />
        <Word text="banyak pilihan" className="shrink-0 text-brand-300" />

        {/* hiasan: bintang melayang */}
        <span
          data-float
          aria-hidden="true"
          className="shrink-0 text-[0.9em] text-[#ff8f70]"
        >
          ✺
        </span>

        {/* --- Voucher / kupon / poin --- */}
        <Word text="hemat dengan" className="shrink-0 text-black" />
        <div className="flex shrink-0 flex-col items-start gap-2 text-[0.5em]">
          <Tag rot={-5} className="bg-[#0ae448]">
            Voucher
          </Tag>
          <Tag rot={3} className="ml-[1.5em] bg-[#fec5fb]">
            Kupon
          </Tag>
          <Tag rot={-2} className="bg-[#9d95ff]">
            Poin referral
          </Tag>
        </div>

        {/* --- Untuk organizer --- */}
        <Word text="atau" className="shrink-0 text-black" />
        <Word text="kelola eventmu" className="shrink-0 text-brand-300" />
        <Tag rot={-2} className="shrink-0 bg-[#ff8709]">
          sendiri
        </Tag>

        {/* --- Penutup --- */}
        <Word text="Mulai sekarang" className="shrink-0 text-black" />
        <span data-spin aria-hidden="true" className="shrink-0 text-[#0ae448]">
          ✦
        </span>
      </div>
    </section>
  );
}
