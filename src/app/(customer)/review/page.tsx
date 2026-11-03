'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { tanggal } from '@/utils/localDate';
import { useGetEventByCustomer } from '@/hook/event/useGetEventByCustomer';
import ReviewHeader from '@/features/review/components/reviewHeader';
import WithAuthGuard from '@/hoc/withAuthGuard';
import ErrorImage from '@/features/general/components/errorImage';

function ReviewPage() {
  const { data, isLoading, isError } = useGetEventByCustomer();
  const event = data?.data;

  console.log(data);
  if (isLoading) return <IsLoading />;
  if (isError)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <ErrorImage
          message="Maaf, event tidak ditemukan"
          next="/"
          hook="Kembali ke halaman utama"
        />
      </div>
    );
  return (
    <>
      <div className="lg:px-20">
        <ReviewHeader customer={data?.customer} />
        <div className="overflow-x-auto rounded-b-xl border border-gray-400 bg-white shadow-lg">
          <table className="table table-xs md:table-sm lg:table-md table-pin-rows">
            <thead className="text-black border-b border-gray-500 text-xs">
              <tr>
                <th className="border-b border-gray-400 bg-white"></th>
                <th className="border-b border-gray-400 bg-white">Event</th>
                <th className="border-b border-gray-400 bg-white">Kategori</th>
                <th className="border-b border-gray-400 bg-white">
                  Tanggal Mulai
                </th>
                <th className="border-b border-gray-400 bg-white">
                  Tanggal Selesai
                </th>
                <th className="border-b border-gray-400 bg-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {event?.map((e: any, i: number) => (
                <tr key={i}>
                  <th className="bg-white">{i + 1}</th>
                  <td className="line-clamp-2 md:line-clamp-none">
                    {e.event.name}
                  </td>
                  <td>{e.event.category.replace('_', ' ')}</td>
                  <td>{tanggal.format(new Date(e.event.startDate))}</td>
                  <td>{tanggal.format(new Date(e.event.endDate))}</td>
                  <td>
                    {e.event.reviews.length > 0 ? (
                      <p className="text-green-500">Sudah kamu ulas</p>
                    ) : new Date(e.event.endDate) < new Date() ? (
                      <a
                        href={`/review/${e.event.slug}`}
                        className="underline text-blue-700"
                      >
                        Beri ulasan
                      </a>
                    ) : (
                      'Event belum selesai'
                    )}
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

export default WithAuthGuard(ReviewPage, ['CUSTOMER']);
