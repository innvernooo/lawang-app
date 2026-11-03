'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import TicketAndVoucherHeader from '@/features/organizer/components/ticketAndVoucher/ticketAndVoucherHeader';
import WithAuthGuard from '@/hoc/withAuthGuard';
import { usegetOrganizerProfile } from '@/hook/organizer/useGetOrganizerProfile';
import { useGetOrganizerEventForReview } from '@/hook/review/useGetOrganizerEventForReview';
import { tanggal } from '@/utils/localDate';

function ReviewPage() {
  const { data: organizer = [] } = usegetOrganizerProfile();
  const { data: event, isLoading } = useGetOrganizerEventForReview();

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div className="m-2 lg:mx-25 lg:my-10">
        <TicketAndVoucherHeader
          title="Lihat Review Peserta"
          organizer={organizer}
        />
        <div className="overflow-x-auto rounded-b-xl border border-gray-400 bg-white shadow-lg">
          <table className="table table-xs md:table-sm lg:table-md table-pin-rows">
            <thead className="text-black border-b border-gray-500 text-xs">
              <tr>
                <th className="border-b border-gray-400 bg-white"></th>
                <th className="border-b border-gray-400 bg-white">Nama</th>
                <th className="border-b border-gray-400 bg-white">Kategori</th>
                <th className="border-b border-gray-400 bg-white">Kota</th>
                <th className="border-b border-gray-400 bg-white">
                  Tanggal Selesai
                </th>
                <th className="border-b border-gray-400 bg-white">Ulasan</th>
                <th className="border-b border-gray-400 bg-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {event.map((e: any, i: number) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{e.name}</td>
                  <td>{e.category.replace('_', ' ')}</td>
                  <td>{e.city}</td>
                  <td>{tanggal.format(new Date(e.endDate))}</td>
                  <td>{e.reviews.length}</td>
                  <td>
                    <a
                      className="px-2 py-1.5 bg-brand-400 text-brand-200 text-xs font-medium rounded-lg"
                      href={`/organizer/dashboard/review/${e.id}`}
                    >
                      Detail
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default WithAuthGuard(ReviewPage, ['ORGANIZER']);
