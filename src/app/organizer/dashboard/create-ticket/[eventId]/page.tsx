'use client';

import { TfiAgenda } from 'react-icons/tfi';
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosTime, IoMdPricetags } from 'react-icons/io';
import { MdDateRange, MdOutlineCategory } from 'react-icons/md';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
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

export default function CreateTicketPage() {
  return (
    <Suspense fallback={''}>
      <CreateTicketContent />
    </Suspense>
  );

  function CreateTicketContent() {
    const { eventId } = useParams<{ eventId: string }>();

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
        reset();
      },
    });

    const { data: event = [], isLoading } = useQuery({
      queryKey: ['event', eventId],
      queryFn: async () => {
        const res = await axiosInstance.get(
          `/events/organizerEvents/${eventId}`,
        );

        return res?.data?.data;
      },
    });

    if (isLoading) return <IsLoading />;

    return (
      <>
        <div className="flex w-full flex-col-reverse items-center justify-between gap-6 overflow-hidden glass bg-brand-100 px-4 py-8 text-lg sm:px-8 md:min-h-100 md:flex-row md:px-20 md:text-2xl">
          <div className="w-full md:w-auto">
            <div className="flex gap-2 items-center">
              <TfiAgenda />
              <h1>{event.name}</h1>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <MdOutlineCategory />
              <h1>{event.category}</h1>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <FaLocationDot />
              <h1>
                {event.city} | {event.venue}
              </h1>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <MdDateRange />
              <h1>{tanggal.format(new Date(event.startDate))}</h1>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <IoIosTime />
              <h1>{jam.format(new Date(event.startDate))}</h1>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <IoMdPricetags />
              <h1>{event.pricingType}</h1>
            </div>
          </div>
          <div className="w-full max-w-125">
            <Image
              src={event.imageUrl ?? '/download.jpg'}
              alt="Event picture"
              width={500}
              height={100}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
        {event.pricingType !== 'PAID' ? (
          <h1 className="mt-7 text-red-600 text-2xl w-full flex justify-center tracking-wide font-semibold">
            Anda tidak bisa membuat tiket karena Event bertipe "FREE"
          </h1>
        ) : (
          <>
            <h1 className="mt-7 text-black text-2xl w-full flex justify-center tracking-wide font-semibold">
              Create Your Event Ticket
            </h1>
            <form
              onSubmit={handleSubmit((data) => handleCreateTicket.mutate(data))}
            >
              <div className="mt-7 flex justify-around">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-lg text-black">
                    Ticket Name
                  </legend>
                  <input
                    type="text"
                    className="input input-neutral w-60 bg-white"
                    placeholder="Type here"
                    {...register('name')}
                  />
                  <p className="label text-red-600">{errors?.name?.message}</p>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-lg text-black">
                    Ticket Price
                  </legend>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="input input-neutral w-60 bg-white"
                    placeholder="Type here"
                    {...register('price')}
                  />
                  <p className="label text-red-600">{errors?.price?.message}</p>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-lg text-black">
                    Quota
                  </legend>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="input input-neutral w-60 bg-white"
                    placeholder="Type here"
                    {...register('quota')}
                  />
                  <p className="label text-red-600">{errors?.quota?.message}</p>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-black text-sm md:text-base">
                    End Sale
                  </legend>
                  <input
                    type="datetime-local"
                    className="input w-60 bg-white input-neutral"
                    placeholder="Type here"
                    {...register('endSale')}
                  />
                  <p className="label">Optional</p>
                  <p className="label text-red-600">
                    {errors?.endSale?.message}
                  </p>
                </fieldset>
              </div>
              <div className="w-full flex justify-center">
                <button className="my-7 w-80 btn btn-success">
                  Create Ticket
                </button>
              </div>
            </form>
          </>
        )}
      </>
    );
  }
}
