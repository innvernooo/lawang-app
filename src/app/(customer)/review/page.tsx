'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { tanggal } from '@/utils/localDate';
import { useGetEventByCustomer } from '@/hook/event/useGetEventByCustomer';
import ReviewHeader from '@/features/review/components/reviewHeader';
import WithAuthGuard from '@/hoc/withAuthGuard';

function ReviewPage() {
  const { data, isLoading } = useGetEventByCustomer();
  const event = data?.data;

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div className="lg:px-20">
        <ReviewHeader />
        <div className="overflow-x-auto rounded-b-xl border border-gray-400 bg-white shadow-lg">
          <table className="table table-xs md:table-sm lg:table-md table-pin-rows">
            <thead className="text-black border-b border-gray-500 text-xs">
              <tr>
                <th className="border-b border-gray-400 bg-white"></th>
                <th className="border-b border-gray-400 bg-white">Event</th>
                <th className="border-b border-gray-400 bg-white">Category</th>
                <th className="border-b border-gray-400 bg-white">
                  Start Date
                </th>
                <th className="border-b border-gray-400 bg-white">End Date</th>
                <th className="border-b border-gray-400 bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {event.map((e: any, i: number) => (
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
                      <p className="text-green-500">Event sudah kamu nilai</p>
                    ) : new Date(e.event.endDate) < new Date() ? (
                      <a
                        href={`/review/${e.event.slug}`}
                        className="underline text-blue-700"
                      >
                        Beri rating
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
