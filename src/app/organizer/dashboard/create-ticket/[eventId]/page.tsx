'use client';

import { IoLocationOutline } from 'react-icons/io5';
import { TbClockHour3 } from 'react-icons/tb';
import { MdOutlineCategory, MdDateRange } from 'react-icons/md';
import { LuTicket } from 'react-icons/lu';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import IsLoading from '@/features/general/components/isLoadingImage';
import {
  addTicketTypeSchema,
  TicketTypeInput,
  TicketTypeOutput,
} from '@/features/create-ticket/validation/createTicketSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import ErrorImage from '@/features/general/components/errorImage';
import PopoverSuccess from '@/features/general/components/popoverSuccess';
import { isAxiosError } from 'axios';
import PopoverFailed from '@/features/general/components/popoverFailed';
import { useGetOrganizerEventDetail } from '@/hook/event/useGetOrganizerEventDetail';

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
        reset();
      },
      onError: (err) => {
        setErrorMessage(isAxiosError(err) && err?.response?.data?.message);
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
          message="Tiketmu sudah dibuat dan siap dijual kepada calon pembeli"
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
                  <LuTicket />
                  <h1>Create Your Event Ticket</h1>
                </div>
                <form
                  onSubmit={handleSubmit((data) =>
                    handleCreateTicket.mutate(data),
                  )}
                >
                  <div className="mt-7 lg:flex justify-around">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Ticket Name
                      </legend>
                      <input
                        type="text"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Type here"
                        {...register('name')}
                      />
                      <p className="label text-red-600">
                        {errors?.name?.message}
                      </p>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend text-base text-black">
                        Ticket Price
                      </legend>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="input input-neutral w-full lg:w-60 bg-white"
                        placeholder="Type here"
                        {...register('price')}
                      />
                      <p className="label text-red-600">
                        {errors?.price?.message}
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
                        End Sale
                      </legend>
                      <input
                        type="datetime-local"
                        className="input w-full lg:w-60 bg-white input-neutral"
                        placeholder="Type here"
                        {...register('endSale')}
                      />
                      <p className="label">Optional</p>
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
                    <button className="mt-5 btn bg-brand-400 hover:bg-blue-800 text-black">
                      Create Ticket
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
