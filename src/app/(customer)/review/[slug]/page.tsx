'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import Image from 'next/image';
import { Suspense, useRef, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { MdDateRange, MdOutlineCategory } from 'react-icons/md';
import { PiMaskHappy } from 'react-icons/pi';
import { tanggal } from '@/utils/localDate';
import { useParams } from 'next/navigation';
import { useGetEventBySlug } from '@/hook/event/useGetEventBySlug';
import { stars } from '@/features/review/components/stars';
import ErrorImage from '@/features/general/components/errorImage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateReviewInput,
  CreateReviewOutput,
  createReviewSchema,
} from '@/features/review/validation/createReviewSchema';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { isAxiosError } from 'axios';
import PopoverSuccess from '@/features/general/components/popoverSuccess';
import PopoverFailed from '@/features/general/components/popoverFailed';
import AuthGuard from '@/features/general/components/authGuard';

export default function PostReviewPage() {
  return (
    <AuthGuard allowedRole={['CUSTOMER']}>
      <Suspense fallback={<IsLoading />}>
        <PostReviewContent />
      </Suspense>
    </AuthGuard>
  );
}

function PostReviewContent() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading } = useGetEventBySlug(slug);
  const [errorMessage, setErrorMessage] = useState('');
  const successRef = useRef<HTMLDialogElement>(null);
  const failedRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReviewInput, unknown, CreateReviewOutput>({
    resolver: zodResolver(createReviewSchema),
  });

  const handleReview = useMutation({
    mutationFn: async (data: CreateReviewOutput) => {
      const res = await axiosInstance.post(`/reviews/create/${slug}`, data);

      return res?.data?.data;
    },
    onSuccess: () => {
      (reset(), successRef?.current?.showModal());
    },
    onError: (err) => {
      setErrorMessage(isAxiosError(err) && err?.response?.data?.message);
      failedRef?.current?.showModal();
    },
  });

  if (isLoading || !event) return <IsLoading />;

  return (
    <>
      <PopoverSuccess
        ref={successRef}
        title="Review Berhasil Terbuat"
        message="Terima kasih sudah memberikan penilaianmu"
      />
      <PopoverFailed
        ref={failedRef}
        title="Review Gagal"
        message={errorMessage}
      />
      {new Date(event.endDate) > new Date() ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <ErrorImage
            message="Maaf, event yang belum selesai tidak boleh dinilai"
            next="/review"
            hook="Kembali ke halaman sebelumnya"
          />
        </div>
      ) : (
        <div className="w-full min-h-screen lg:px-25">
          <div className="flex flex-col-reverse items-start gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-8 lg:gap-0 lg:px-17 w-full h-fit bg-linear-to-r from-brand-100 to-brand-300 glass rounded-t-2xl">
            <div className="text-base text-white md:text-xl">
              <h1 className="text-xl mb-2 font-semibold md:text-2xl">
                {event.name}
              </h1>
              <div className="flex gap-2 items-center">
                <MdOutlineCategory />
                <h1>{event.category.replace('_', ' ')}</h1>
              </div>
              <div className="flex gap-2 items-center">
                <IoLocationOutline />
                <h1>
                  {event.city} | {event.venue}
                </h1>
              </div>
              <div className="flex gap-2 items-center">
                <MdDateRange />
                <h1 className="my-1">
                  {tanggal.format(new Date(event.startDate))}
                </h1>
              </div>
            </div>
            <Image
              src={event.imageUrl ?? '/alternative.png'}
              alt=""
              width={300}
              height={100}
              className="w-full h-auto rounded-lg ring-2 ring-white md:w-60 lg:w-75"
            />
          </div>
          <form
            onSubmit={handleSubmit((data) => handleReview.mutate(data))}
            className="w-full h-fit bg-white rounded-b-2xl py-5 lg:px-17 shadow-lg"
          >
            <div className="flex gap-2 justify-center items-center md:text-xl lg:text-[27px] font-semibold">
              <PiMaskHappy />
              <h1>Kasih penilaianmu buat event ini</h1>
            </div>
            <div className="mt-7 mx-3 lg:mx-0 grid md:grid-cols-2">
              <div>
                <div>
                  <h1 className="lg:mt-3 mb-1 text-sm md:text-xl font-semibold">
                    Beri rating bintang
                  </h1>
                  <div className="rating">
                    {stars.map((s, i) => (
                      <input
                        key={i}
                        type="radio"
                        className="mask mask-star bg-yellow-500 size-9"
                        aria-label={s.aria}
                        value={s.value}
                        {...register('rating')}
                      />
                    ))}
                  </div>
                </div>
                <label className="label text-red-500 text-xs">
                  {errors.rating?.message}
                </label>
              </div>
              <fieldset className="fieldset mt-3 md:mt-0">
                <legend className="fieldset-legend text-black text-sm md:text-xl">
                  Berikan komentarmu
                </legend>
                <textarea
                  className="textarea textarea-neutral h-30 w-full bg-white"
                  placeholder="Type here..."
                  {...register('comment')}
                ></textarea>
                <label className="label text-red-500">
                  {errors?.comment?.message}
                </label>
              </fieldset>
            </div>
            <div className="mt-7 mx-3 lg:-mx-10 flex justify-between">
              <a
                href="/review"
                className="btn bg-error text-white w-20 md:w-25 md:text-base"
              >
                Kembali
              </a>
              <button
                type="submit"
                className="btn bg-brand-400 text-black w-20 md:w-25 md:text-base"
              >
                Nilai
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
