'use client';

import Image from 'next/image';
import { Sansita } from 'next/font/google';
import { categories } from '@/features/organizer/components/categories';
import { sortedCities } from '@/utils/cities';
import { useMutation } from '@tanstack/react-query';
import {
  CreateEventInput,
  CreateEventOutput,
  createEventSchema,
} from '@/features/organizer/validation/createEventSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useMemo } from 'react';

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

  const profilePicture = useWatch({ control, name: 'profilePicture' });
  const previewPicture = useMemo(
    () =>
      profilePicture?.length ? URL.createObjectURL(profilePicture[0]) : null,
    [profilePicture],
  );

  useEffect(() => {
    return () => {
      if (previewPicture) URL.revokeObjectURL(previewPicture);
    };
  });

  const handleCreateEvent = useMutation({
    mutationFn: async (data: CreateEventOutput) => {
      const res = await axiosInstance.post('/events/create/me', data);

      return res?.data;
    },
    onSuccess: () => {
      reset();
    },
    onError: () => {},
  });

  return (
    <>
      <div className="flex justify-center items-center bg-brand-100">
        <div className="bg-white h-fit w-88 md:w-155 lg:w-170 p-3 rounded-xl shadow-xl">
          <div className="flex justify-center">
            <Image
              src={'/lawang.svg'}
              alt={'Lawang logo'}
              width={200}
              height={100}
            />
          </div>
          <h1
            className={`flex mt-5 justify-center text-2xl font-semibold ${sansita.className}`}
          >
            PROMOTE YOUR EVENT ON LAWANG
          </h1>
          <p className="flex mt-1 justify-center italic text-lg">
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
                    className="h-full w-full object-cover"
                  />
                ) : (
                  '?'
                )}
              </div>
              <label className="cursor-pointer w-30 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-blue-400">
                Pilih foto Event
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  {...register('profilePicture')}
                />
              </label>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Event Name
              </legend>
              <input
                type="text"
                className="input w-full bg-brand-100 input-neutral"
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
                className="textarea h-24 w-full bg-brand-100 textarea-neutral"
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
                className="select w-full bg-brand-100 select-neutral"
                {...register('category')}
              >
                <option disabled={true}>Pick one category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
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
                className="select w-full bg-brand-100 select-neutral"
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
                className="textarea h-24 w-full bg-brand-100 textarea-neutral"
                placeholder="Type here"
                {...register('venue')}
              ></textarea>
              <p className="label text-red-600">{errors?.venue?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Price
              </legend>
              <input
                type="number"
                className="input w-full bg-brand-100 input-neutral"
                placeholder="Type here"
                {...register('price')}
              />
              <p className="label text-red-600">{errors?.price?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-sm md:text-base">
                Start Date
              </legend>
              <input
                type="datetime-local"
                className="input w-full bg-brand-100 input-neutral"
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
                className="input w-full bg-brand-100 input-neutral"
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
                className="input w-full bg-brand-100 input-neutral"
                placeholder="Type here"
                {...register('totalSeats')}
              />
              <p className="label text-red-600">
                {errors?.totalSeats?.message}
              </p>
              <p className="label text-red-600">
                Available seats will follow the total seats input
              </p>
            </fieldset>
            <button className="mt-8 w-full btn btn-success">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
