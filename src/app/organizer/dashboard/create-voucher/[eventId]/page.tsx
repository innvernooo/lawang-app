'use client';

import { IoLocationOutline } from 'react-icons/io5';
import { TbClockHour3 } from 'react-icons/tb';
import { MdOutlineCategory, MdDateRange } from 'react-icons/md';
import { LuTicketPercent } from 'react-icons/lu';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
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
            'Terjadi kesalahan, silahkan coba lagi',
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
                    <h1 className="line-clamp-1">
                      {event.city} | {event.venue}
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MdDateRange />
                    <h1 className="my-1">
                      {tanggal.format(new Date(event.startDate))}
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <TbClockHour3 />
                    <h1>{jam.format(new Date(event.startDate))} WIB</h1>
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
              <div className="w-full h-fit bg-white p-5 rounded-b-2xl shadow-lg">
                <div className="flex gap-1 items-center justify-center text-xl font-semibold">
                  <LuTicketPercent />
                  <h1>Create a Voucher for Your Event</h1>
                </div>
                <form
                  onSubmit={handleSubmit((data) =>
                    handleCreateVoucher.mutate(data),
                  )}
                >
                  <div className="mt-7 lg:flex justify-around">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Voucher Code
                      </legend>
                      <input
                        type="text"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Type here"
                        {...register('code')}
                      />
                      <p className="label">Buatlah kode voucher yang unik</p>
                      <p className="label text-red-600">
                        {errors?.code?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Discount Amount
                      </legend>
                      <input
                        type="text"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Type here"
                        {...register('discountAmount')}
                      />
                      <p className="label text-red-600">
                        {errors?.discountAmount?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Quota
                      </legend>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Type here"
                        {...register('quota')}
                      />
                      <p className="label text-red-600">
                        {errors?.quota?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-black text-sm md:text-base">
                        Start Date
                      </legend>
                      <input
                        type="datetime-local"
                        className="input w-full lg:w-60 bg-white input-neutral"
                        placeholder="Type here"
                        {...register('startDate')}
                      />
                      <p className="label text-red-600">
                        {errors?.startDate?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-black text-sm md:text-base">
                        End Date
                      </legend>
                      <input
                        type="datetime-local"
                        className="input w-full lg:w-60 bg-white input-neutral"
                        placeholder="Type here"
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
                      Create Voucher
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
