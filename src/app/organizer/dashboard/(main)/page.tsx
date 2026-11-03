'use client';

import { useState } from 'react';
import ViewTransactionsPage from '@/features/organizer/components/main/confirmation';
import RingkasanContent from '@/features/organizer/components/main/ringkasan';
import EventTabContent from '@/features/organizer/components/main/eventTab';
import PesertaContent from '@/features/organizer/components/main/peserta';
import StatistikContent from '@/features/organizer/components/main/statistik';
import WithAuthGuard from '@/hoc/withAuthGuard';

const tabs = [
  { key: 'ringkasan', label: 'Ringkasan' },
  { key: 'event', label: 'Event Saya' },
  { key: 'peserta', label: 'Peserta Event' },
  { key: 'statistik', label: 'Statistik' },
  { key: 'transaksi', label: 'Transaksi' },
];

function DashboardPage() {
  const [tab, setTab] = useState('ringkasan');

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Menu tab */}
      <nav className="flex overflow-x-auto border-b border-gray-200 bg-white px-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap px-5 py-3 text-sm font-semibold ${
              tab === t.key
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'ringkasan' && <RingkasanContent />}
      {tab === 'event' && <EventTabContent />}
      {tab === 'peserta' && <PesertaContent />}
      {tab === 'statistik' && <StatistikContent />}
      {tab === 'transaksi' && <ViewTransactionsPage />}
    </div>
  );
}

export default WithAuthGuard(DashboardPage, ['ORGANIZER']);
