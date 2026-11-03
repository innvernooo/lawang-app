'use client';

import { LuTicket } from 'react-icons/lu';
import { useParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import IsLoading from '@/features/general/components/isLoadingImage';
import {
  addTicketTypeSchema,
  TicketTypeInput,
  TicketTypeOutput,
} from '@/features/ticket/validation/createTicketSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import ErrorImage from '@/features/general/components/errorImage';
import PopoverSuccess from '@/features/general/components/popoverSuccess';
import { isAxiosError } from 'axios';
import PopoverFailed from '@/features/general/components/popoverFailed';
import { useGetOrganizerEventDetail } from '@/hook/event/useGetOrganizerEventDetail';
import CreateTicketAndVoucherHeader from '@/features/organizer/components/ticketAndVoucher/createTicketAndVoucherHeader';

export default function CreateTicketPage() {
  return (
    <Suspense fallback={''}>
      <CreateTicketContent />
    </Suspense>
  );

  function CreateTicketContent() {
    const { eventId } = useParams<{ eventId: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const successRef = useRef<HTMLDialogElement>(null);
    const failedRef = useRef<HTMLDialogElement>(null);
    const queryClient = useQueryClient();

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<TicketTypeInput, unknown, TicketTypeOutput>({
      resolver: zodResolver(addTicketTypeSchema),
    });

    const handleCreateTicket = useMutation({
      mutationFn: async (data: TicketTypeOutput) => {
        const res = await axiosInstance.post(
          `/tickets/addTicket/${eventId}`,
          data,
        );

        return res?.data?.data;
      },
      onSuccess: () => {
        successRef?.current?.showModal();
        queryClient.invalidateQueries({
          queryKey: ['event', 'ticket', 'voucher'],
        });
        reset();
      },
      onError: (err) => {
        setErrorMessage(isAxiosError(err) && err?.response?.data?.message);
        failedRef?.current?.showModal();
      },
    });

    const {
      data: event = [],
      isLoading,
      isError,
    } = useGetOrganizerEventDetail(eventId);

    if (isLoading) return <IsLoading />;
    if (isError || !event)
      return (
        <>
          <div className="w-full min-h-screen flex justify-center items-center">
            <ErrorImage
              message="Maaf, event tidak ditemukan"
              next="/organizer/dashboard/create-ticket"
              hook="Kembali ke halaman sebelumnya"
            />
          </div>
        </>
      );

    return (
      <>
        <PopoverSuccess
          ref={successRef}
          title="Berhasil"
          message="Tiketmu sudah dibuat dan siap dijual ke Customer"
        />
        <PopoverFailed ref={failedRef} title="Gagal" message={errorMessage} />
        {event.pricingType !== 'PAID' ? (
          <div className="w-full min-h-screen flex justify-center items-center">
            <ErrorImage
              message="Event gratis tidak boleh memiliki tiket"
              next="/organizer/dashboard/create-ticket"
              hook="Kembali ke halaman sebelumnya"
            />
          </div>
        ) : (
          <>
            <div className="mx-2 md:mx-25 my-10">
              <CreateTicketAndVoucherHeader event={event} />
              <div className="w-full h-fit bg-white p-5 rounded-b-2xl shadow-lg">
                <div className="flex gap-1 items-center justify-center text-xl font-semibold">
                  <LuTicket />
                  <h1>Buat Tiket untuk Eventmu</h1>
                </div>
                <form
                  onSubmit={handleSubmit((data) =>
                    handleCreateTicket.mutate(data),
                  )}
                >
                  <div className="mt-7 lg:flex justify-around">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Nama Tiket
                      </legend>
                      <input
                        type="text"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Ketik di sini"
                        {...register('name')}
                      />
                      <p className="label text-red-600">
                        {errors?.name?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Harga Tiket
                      </legend>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Ketik di sini"
                        {...register('price')}
                      />
                      <p className="label text-red-600">
                        {errors?.price?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Kuota
                      </legend>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Ketik di sini"
                        {...register('quota')}
                      />
                      <p className="label text-red-600">
                        {errors?.quota?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-black text-sm md:text-base">
                        Batas Akhir Penjualan
                      </legend>
                      <input
                        type="datetime-local"
                        className="input w-full lg:w-60 bg-white input-neutral"
                        placeholder="Ketik di sini"
                        {...register('endSale')}
                      />
                      <p className="label">Opsional</p>
                      <p className="label text-red-600">
                        {errors?.endSale?.message}
                      </p>
                    </fieldset>
                  </div>
                  <div className="w-full flex justify-between">
                    <a
                      href="/organizer/dashboard/create-ticket"
                      className="mt-5 btn btn-error text-white"
                    >
                      Kembali
                    </a>
                    <button className="mt-5 btn bg-brand-400 hover:bg-blue-800 text-black hover:text-white">
                      Buat Tiket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
