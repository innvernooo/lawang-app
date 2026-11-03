'use client';

import { LuTicketPercent } from 'react-icons/lu';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import IsLoading from '@/features/general/components/isLoadingImage';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import ErrorImage from '@/features/general/components/errorImage';
import PopoverSuccess from '@/features/general/components/popoverSuccess';
import { isAxiosError } from 'axios';
import PopoverFailed from '@/features/general/components/popoverFailed';
import { useGetOrganizerEventDetail } from '@/hook/event/useGetOrganizerEventDetail';
import {
  CreateVoucherInput,
  CreateVoucherOutput,
  createVoucherSchema,
} from '@/features/voucher/validation/createVoucherSchema';
import CreateTicketAndVoucherHeader from '@/features/organizer/components/ticketAndVoucher/createTicketAndVoucherHeader';
import AuthGuard from '@/hoc/authGuard';

export default function CreateVoucherPage() {
  return (
    <AuthGuard allowedRole={['ORGANIZER']}>
      <Suspense fallback={<IsLoading />}>
        <CreateVoucherContent />
      </Suspense>
    </AuthGuard>
  );

  function CreateVoucherContent() {
    const { eventId } = useParams<{ eventId: string }>();
    const [errorMessage, setErrorMessage] = useState('');
    const successRef = useRef<HTMLDialogElement>(null);
    const failedRef = useRef<HTMLDialogElement>(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CreateVoucherInput, unknown, CreateVoucherOutput>({
      resolver: zodResolver(createVoucherSchema),
    });

    const handleCreateVoucher = useMutation({
      mutationFn: async (data: CreateVoucherOutput) => {
        const res = await axiosInstance.post(
          `/vouchers/create/${eventId}`,
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
        setErrorMessage(
          (isAxiosError(err) && err?.response?.data?.message) ||
            'Terjadi kesalahan, silakan coba lagi',
        );
        failedRef?.current?.showModal();
      },
    });

    const { data: event = [], isLoading } = useGetOrganizerEventDetail(eventId);

    if (isLoading) return <IsLoading />;

    return (
      <>
        <PopoverSuccess
          ref={successRef}
          title="Berhasil"
          message="Vouchermu sudah dibuat dan siap dibagikan"
        />
        <PopoverFailed ref={failedRef} title="Gagal" message={errorMessage} />
        {event.pricingType !== 'PAID' ? (
          <div className="w-full min-h-screen flex justify-center items-center">
            <ErrorImage
              message="Event gratis tidak boleh memiliki voucher"
              next="/organizer/dashboard/create-voucher"
              hook="Kembali ke halaman sebelumnya"
            />
          </div>
        ) : (
          <>
            <div className="mx-2 md:mx-25 my-10">
              <CreateTicketAndVoucherHeader event={event} />
              <div className="w-full h-fit bg-white p-5 rounded-b-2xl shadow-lg">
                <div className="flex gap-1 items-center justify-center text-xl font-semibold">
                  <LuTicketPercent />
                  <h1>Buat Voucher untuk Eventmu</h1>
                </div>
                <form
                  onSubmit={handleSubmit((data) =>
                    handleCreateVoucher.mutate(data),
                  )}
                >
                  <div className="mt-7 lg:flex justify-around">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Kode Voucher
                      </legend>
                      <input
                        type="text"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Ketik di sini"
                        {...register('code')}
                      />
                      <p className="label">Buatlah kode voucher yang unik</p>
                      <p className="label text-red-600">
                        {errors?.code?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Nominal Diskon
                      </legend>
                      <input
                        type="text"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Ketik di sini"
                        {...register('discountAmount')}
                      />
                      <p className="label text-red-600">
                        {errors?.discountAmount?.message}
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
                        Tanggal Mulai
                      </legend>
                      <input
                        type="datetime-local"
                        className="input w-full lg:w-60 bg-white input-neutral"
                        placeholder="Ketik di sini"
                        {...register('startDate')}
                      />
                      <p className="label text-red-600">
                        {errors?.startDate?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-black text-sm md:text-base">
                        Tanggal Selesai
                      </legend>
                      <input
                        type="datetime-local"
                        className="input w-full lg:w-60 bg-white input-neutral"
                        placeholder="Ketik di sini"
                        {...register('endDate')}
                      />
                      <p className="label text-red-600">
                        {errors?.endDate?.message}
                      </p>
                    </fieldset>
                  </div>
                  <div className="w-full flex justify-between">
                    <button
                      type="button"
                      disabled={handleCreateVoucher.isPending}
                      onClick={() =>
                        router.push('/organizer/dashboard/create-voucher')
                      }
                      className="mt-5 btn btn-error text-white"
                    >
                      Kembali
                    </button>
                    <button
                      disabled={handleCreateVoucher.isPending}
                      className="mt-5 btn bg-brand-400 hover:bg-blue-800 text-black hover:text-white"
                    >
                      Buat Voucher
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
