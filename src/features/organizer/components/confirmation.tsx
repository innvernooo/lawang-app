'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { useQuery } from '@tanstack/react-query';

export default function ViewTransactionsPage() {
  const { data: event, isLoading } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      const res = await axiosInstance.get('/events/organizerEvents');

      return res?.data?.data;
    },
  });

  console.log(event);
  if (isLoading) return <IsLoading />;
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Event</h1>
        <section className="rounded-xl bg-white text-center shadow-sm">
          <div className="overflow-x-auto rounded-xl">
            <table className="table">
              {/* head */}
              <thead className="bg-brand-300 text-white">
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {event.map((e: any, i: number) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{e.name}</td>
                    <td>{e.category}</td>
                    <td>{e.city}</td>
                    <td>
                      <a
                        className="px-2 py-1.5 bg-green-400 glass text-xs font-medium rounded-full"
                        href={`/organizer/dashboard/confirmation/${e.id}`}
                      >
                        View Detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
