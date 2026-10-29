'use client';

import { useEffect, useState } from 'react';

// Menyembunyikan children sampai elemen dengan id `targetId` tergulir keluar
// dari layar (melewati `offset` px dari atas, mis. tinggi navbar sticky).
export default function RevealOnScroll({
  targetId,
  offset = 64,
  className = '',
  children,
}: {
  targetId: string;
  offset?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: `-${offset}px 0px 0px 0px` },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId, offset]);

  return (
    <div
      aria-hidden={!visible}
      className={`${className} transition-all duration-300 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
