'use client';

import Image from 'next/image';
import { Sansita } from 'next/font/google';
import { categories } from '@/utils/categories';
import { sortedCities } from '@/utils/cities';
import { useMutation } from '@tanstack/react-query';
import {
  CreateEventInput,
  CreateEventOutput,
  createEventSchema,
} from '@/features/organizer/validation/createEventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CreateEventFormData } from '@/features/organizer/createEvent/createEventFormData';
import PopoverFailed from '@/features/general/components/popoverFailed';
import { isAxiosError } from 'axios';
import PopoverSuccessLink from '@/features/general/components/popoverSuccessLink';

const sansita = Sansita({
  weight: '700',
  subsets: ['latin'],
});

export default function CreateEventPage() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateEventInput, unknown, CreateEventOutput>({
    resolver: zodResolver(createEventSchema),
  });

  const successRef = useRef<HTMLDialogElement>(null);
  const failedRef = useRef<HTMLDialogElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const coverPicture = useWatch({ control, name: 'imageUrl' });
  const previewPicture = useMemo(
    () => (coverPicture?.length ? URL.createObjectURL(coverPicture[0]) : null),
    [coverPicture],
  );

  useEffect(() => {
    return () => {
      if (previewPicture) URL.revokeObjectURL(previewPicture);
    };
  });

  const handleCreateEvent = useMutation({
    mutationFn: CreateEventFormData,
    onSuccess: () => {
      reset();
      successRef?.current?.showModal();
    },
    onError: (err) => {
      setErrorMessage(
        (isAxiosError(err) && err?.response?.data?.message) ||
          'Terjadi kesalahan, silahkan coba lagi',
      );
      failedRef?.current?.showModal();
    },
  });

  const pricingType = handleCreateEvent.data?.pricingType;
  const eventId = handleCreateEvent.data?.id;
  return (
    <>
      <PopoverFailed
        ref={failedRef}
        title="Event Gagal Dibuat"
        message={errorMessage}
      />
      <PopoverSuccessLink
        ref={successRef}
        title="Event Berhasil Terbuat"
        next={
          pricingType === 'PAID'
            ? `/organizer/dashboard/create-ticket/${eventId}`
            : '/organizer/dashboard'
        }
        message={
          pricingType === 'PAID'
            ? 'Silahkan buat tiket untuk eventmu'
            : 'Event gratismu siap dipromosikan'
        }
        hook={pricingType === 'PAID' ? 'Buat tiket' : 'Kembali'}
      />
      <div className="flex justify-center items-center">
        <div className="bg-brand-400 h-fit w-88 my-5 md:w-155 lg:w-170 p-3 rounded-xl shadow-xl">
          <div className="flex justify-center">
            <Image
              src={'/lawang.svg'}
              alt={'Lawang logo'}
              width={200}
              height={100}
            />
          </div>
          <h1
            className={`flex mt-5 justify-center text-lg md:text-2xl text-black font-semibold ${sansita.className}`}
          >
            PROMOTE YOUR EVENT ON LAWANG
          </h1>
          <p className="flex mt-1 justify-center text-black italic text-sm md:text-lg">
            Fill the form below to start promoting
          </p>
          <form
            onSubmit={handleSubmit((data) => handleCreateEvent.mutate(data))}
            className="mt-5"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Event Image
              </legend>
              <div className="flex w-full h-60 shrink overflow-hidden text-2xl font-bold bg-gray-300 rounded-lg justify-center items-center">
                {previewPicture ? (
                  <img
                    src={previewPicture}
                    alt="Foto Profil"
                    className="aspect-2/1 h-auto w-full object-cover"
                  />
                ) : (
                  '?'
                )}
              </div>
              <label className="lebel">
                Disarankan berukuran 1200 x 600 pixel
              </label>
              <label className="cursor-pointer w-30 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-blue-400">
                Pilih foto Event
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  {...register('imageUrl')}
                />
              </label>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Event Name
              </legend>
              <input
                type="text"
                className="input w-full bg-white input-neutral"
                placeholder="Type here"
                {...register('name')}
              />
              <p className="label text-red-600">{errors?.name?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-black">
                Event Description
              </legend>
              <textarea
                className="textarea h-24 w-full bg-white textarea-neutral"
                placeholder="Type here"
                {...register('description')}
              ></textarea>
              <p className="label text-red-600">
                {errors?.description?.message}
              </p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-black">
                Category
              </legend>
              <select
                defaultValue="Pick one category"
                className="select w-full bg-white select-neutral"
                {...register('category')}
              >
                <option disabled={true}>Pick one category</option>
<<<<<<< HEAD
                {categories.map(({cat}) => (
                  <option key={cat} value={cat}>
                    {cat}
=======
                {categories.map(({ cat }) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
>>>>>>> 39f42c4195d7e04d6b048a1724f52ab1c7d1500e
                  </option>
                ))}
              </select>
              <p className="label text-red-600">{errors?.category?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-black">
                City
              </legend>
              <select
                defaultValue="Pick one city"
                className="select w-full bg-white select-neutral"
                {...register('city')}
              >
                <option disabled={true}>Pick one city</option>
                {sortedCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <p className="label text-red-600">{errors?.city?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-black">
                Event Venue
              </legend>
              <textarea
                className="textarea h-24 w-full bg-white textarea-neutral"
                placeholder="Type here"
                {...register('venue')}
              ></textarea>
              <p className="label text-red-600">{errors?.venue?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Pricing Type
              </legend>
              <select
                defaultValue="Pick one type"
                className="select w-full bg-white select-neutral"
                {...register('pricingType')}
              >
                <option disabled={true}>Pick one type</option>
                {['PAID', 'FREE'].map((p, index) => (
                  <option key={index} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <p className="label">
                Free event will generate a "Free Ticket" automatically
              </p>
              <p className="label text-red-600">
                {errors?.pricingType?.message}
              </p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Start Date
              </legend>
              <input
                type="datetime-local"
                className="input w-full bg-white input-neutral"
                placeholder="Type here"
                {...register('startDate')}
              />
              <p className="label text-red-600">{errors?.startDate?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                End Date
              </legend>
              <input
                type="datetime-local"
                className="input w-full bg-white input-neutral"
                placeholder="Type here"
                {...register('endDate')}
              />
              <p className="label text-red-600">{errors?.endDate?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Total Seats
              </legend>
              <input
                type="number"
                className="input w-full bg-white input-neutral"
                placeholder="Type here"
                {...register('totalSeats')}
              />
              <p className="label text-red-600">
                {errors?.totalSeats?.message}
              </p>
              <p className="label">
                Available seats will follow the total seats input
              </p>
            </fieldset>
            <button
              type="submit"
              disabled={handleCreateEvent.isPending}
              className="mt-8 w-full btn bg-brand-300 text-white"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
