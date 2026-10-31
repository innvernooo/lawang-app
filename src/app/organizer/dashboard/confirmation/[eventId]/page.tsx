'use client';

import ErrorImage from '@/features/general/components/errorImage';
import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetTransactionById } from '@/hook/event/useGetTransactionById';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { rupiah } from '@/utils/idr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<IsLoading />}>
      <ConfirmationPageContent />
    </Suspense>
  );

  function ConfirmationPageContent() {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [proofUrl, setProofUrl] = useState<string | null>(null);
    const { eventId } = useParams<{ eventId: string }>();
    const queryClient = useQueryClient();

    const handleAccept = useMutation({
      mutationFn: async (transactionId: any) => {
        const res = await axiosInstance.patch(
          `/confirmations/accept/${transactionId}`,
        );

        return res?.data?.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['transaction', 'confirmation'],
        });
      },
    });

    const handleReject = useMutation({
      mutationFn: async (transactionId: any) => {
        const res = await axiosInstance.patch(
          `/confirmations/reject/${transactionId}`,
        );

        return res?.data?.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['transaction', 'confirmation'],
        });
      },
    });

    const { data: transaction, isLoading } = useGetTransactionById(eventId);

    console.log(transaction);
    if (isLoading) return <IsLoading />;

    return (
      <>
        <div className="w-full min-h-screen p-5">
          {transaction?.length ? (
            <div className="overflow-x-auto rounded-xl">
              <table className="table">
                {/* head */}
                <thead className="bg-brand-100 text-black">
                  <tr>
                    <th></th>
                    <th>Customer</th>
                    <th>Ticket Type</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Payment Proof</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.map((t: any, i: number) => (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td>{t.customer.email}</td>
                      <td>{t.ticketType.name}</td>
                      <td>{t.quantity}</td>
                      <td>{rupiah.format(t.totalPrice)}</td>
                      <td>
                        <a
                          className="font-semibold underline cursor-pointer"
                          onClick={() => {
                            setProofUrl(t.paymentProofUrl);
                            modalRef.current?.showModal();
                          }}
                        >
                          View Payment Proof
                        </a>
                      </td>
                      <td className="flex gap-8">
                        <a
                          className="px-2 py-1 bg-green-400 glass text-xs font-medium rounded-full cursor-pointer"
                          onClick={() => handleAccept.mutate(t.id)}
                        >
                          Accept
                        </a>
                        <a
                          className="px-2 py-1 bg-red-400 glass text-xs font-medium rounded-full cursor-pointer"
                          onClick={() => handleReject.mutate(t.id)}
                        >
                          Reject
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <dialog ref={modalRef} className="modal">
                <div className="modal-box max-w-md bg-white p-3">
                  {proofUrl && (
                    <img
                      src={proofUrl}
                      alt="Payment Proof"
                      className="mx-auto max-h-[70vh] w-auto rounded-lg object-contain"
                    />
                  )}
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          ) : (
            <div className="w-full min-h-screen flex justify-center items-center">
              <ErrorImage
                message="Tidak ada transaksi yang harus dikonfirmasi"
                next="/organizer/dashboard"
                hook="Kembali ke halaman dashboard"
              />
            </div>
          )}
        </div>
      </>
    );
  }
}
