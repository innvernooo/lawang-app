'use client';

import ErrorImage from '@/features/general/components/errorImage';
import IsLoading from '@/features/general/components/isLoadingImage';
import AuthGuard from '@/hoc/authGuard';
import { useGetReviewByEvent } from '@/hook/review/useGetReviewByEvent';
import { tanggal } from '@/utils/localDate';
import { useParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ReviewListPage() {
  return (
    <AuthGuard allowedRole={['ORGANIZER']}>
      <Suspense fallback={<IsLoading />}>
        <ReviewListContent />
      </Suspense>
    </AuthGuard>
  );

  function ReviewListContent() {
    const { eventId } = useParams<{ eventId: string }>();
    const { data: review, isLoading } = useGetReviewByEvent(eventId);
    const modalRef = useRef<HTMLDialogElement>(null);
    const [commentText, setCommentText] = useState<string | null>(null);

    if (isLoading) return <IsLoading />;

    return (
      <>
        <h1 className="mt-7 font-semibold flex md:text-xl justify-center">
          Apa Kata Mereka Tentang {review[0]?.event?.name}{' '}
        </h1>
        {review.length > 0 ? (
          <>
            <div className="p-5 lg:px-20 lg:py-10 grid md:grid-cols-2 lg:grid-cols-4 gap-7">
              {review.map((r: any, i: number) => (
                <div
                  key={i}
                  className="p-3 w-full h-full bg-brand-100 glass text-white rounded-2xl shadow-lg"
                >
                  <div className="flex gap-2 items-center">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src="/cus.svg" alt="Customer" />
                      </div>
                    </div>
                    <div>
                      <h1>{r.customer?.name}</h1>
                      <p className="label text-sm">
                        {tanggal.format(new Date(r.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 items-center">
                    <FaStar className="text-yellow-300" />
                    <span>{r.rating} / 5</span>
                  </div>
                  <p className="mt-3 line-clamp-2">{r.comment}</p>
                  <div className="mt-3 w-full flex justify-end items-end">
                    <button
                      onClick={() => {
                        setCommentText(r.comment);
                        modalRef?.current?.showModal();
                      }}
                      className="btn btn-xs bg-white text-brand-100"
                    >
                      Selengkapnya
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <dialog ref={modalRef} className="modal">
              <div className="modal-box bg-white text-brand-100">
                <h3 className="font-bold text-lg">Komentar</h3>
                <p className="py-4">{commentText}</p>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>tutup</button>
              </form>
            </dialog>
          </>
        ) : (
          <div className="w-full min-h-screen flex items-center justify-center">
            <ErrorImage
              message="Belum ada ulasan"
              next="/organizer/dashboard/review"
              hook="Kembali ke halaman sebelumnya"
            />
          </div>
        )}
      </>
    );
  }
}
