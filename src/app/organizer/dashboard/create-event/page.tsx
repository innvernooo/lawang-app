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
import { CreateEventFormData } from '@/features/organizer/create-event/createEventFormData';
import PopoverFailed from '@/features/general/components/popoverFailed';
import { isAxiosError } from 'axios';
import PopoverSuccessLink from '@/features/general/components/popoverSuccessLink';
import WithAuthGuard from '@/hoc/withAuthGuard';

const sansita = Sansita({
  weight: '700',
  subsets: ['latin'],
});

function CreateEventPage() {
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
  }, [previewPicture]);

  const handleCreateEvent = useMutation({
    mutationFn: CreateEventFormData,
    onSuccess: () => {
      reset();
      successRef?.current?.showModal();
    },
    onError: (err) => {
      setErrorMessage(
        (isAxiosError(err) && err?.response?.data?.message) ||
          'Terjadi kesalahan, silakan coba lagi',
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
        title="Event Berhasil Dibuat"
        next={
          pricingType === 'PAID'
            ? `/organizer/dashboard/create-ticket/${eventId}`
            : '/organizer/dashboard'
        }
        message={
          pricingType === 'PAID'
            ? 'Silakan buat tiket untuk eventmu'
            : 'Event gratismu siap dipromosikan'
        }
        hook={pricingType === 'PAID' ? 'Buat tiket' : 'Kembali'}
      />
      <div className="flex justify-center items-center">
        <div className="bg-brand-400 h-fit w-88 my-5 md:w-155 lg:w-170 p-3 rounded-xl shadow-xl">
          <div className="flex justify-center">
            <Image
              src={'/lawang.svg'}
              alt={'Logo Lawang'}
              width={200}
              height={100}
            />
          </div>
          <h1
            className={`flex mt-5 justify-center text-lg md:text-2xl text-brand-200 font-semibold ${sansita.className}`}
          >
            PROMOSIKAN EVENTMU DI LAWANG
          </h1>
          <p className="flex mt-1 justify-center text-brand-200 italic text-sm md:text-lg">
            Isi formulir di bawah ini untuk mulai promosi
          </p>
          <form
            onSubmit={handleSubmit((data) => handleCreateEvent.mutate(data))}
            className="mt-5"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-brand-200 text-sm md:text-base">
                Foto Event
              </legend>
              <div className="flex w-full h-60 shrink overflow-hidden text-2xl font-bold bg-gray-300 rounded-lg justify-center items-center">
                {previewPicture ? (
                  <img
                    src={previewPicture}
                    alt="Pratinjau foto event"
                    className="aspect-2/1 h-auto w-full object-cover"
                  />
                ) : (
                  '?'
                )}
              </div>
              <label className="lebel">
                Disarankan berukuran 1200 x 600 pixel
              </label>
              <label className="cursor-pointer w-fit rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-blue-400">
                Pilih foto
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  {...register('imageUrl')}
                />
              </label>
              <p className="label text-red-600">{errors?.imageUrl?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-brand-200 text-sm md:text-base">
                Nama Event
              </legend>
              <input
                type="text"
                className="input w-full bg-white input-neutral"
                placeholder="Ketik di sini"
                {...register('name')}
              />
              <p className="label text-red-600">{errors?.name?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-brand-200">
                Deskripsi Event
              </legend>
              <textarea
                className="textarea h-24 w-full bg-white textarea-neutral"
                placeholder="Ketik di sini"
                {...register('description')}
              ></textarea>
              <p className="label text-red-600">
                {errors?.description?.message}
              </p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-brand-200">
                Kategori
              </legend>
              <select
                defaultValue="Pilih kategori"
                className="select w-full bg-white select-neutral"
                {...register('category')}
              >
                <option disabled={true}>Pilih kategori</option>
                {categories.map(({ cat }) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <p className="lebel text-red-600">{errors?.category?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-brand-200">
                Kota
              </legend>
              <select
                defaultValue="Pilih kota"
                className="select w-full bg-white select-neutral"
                {...register('city')}
              >
                <option disabled={true}>Pilih kota</option>
                {sortedCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <p className="label text-red-600">{errors?.city?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm md:text-base text-brand-200">
                Lokasi Event
              </legend>
              <textarea
                className="textarea h-24 w-full bg-white textarea-neutral"
                placeholder="Ketik di sini"
                {...register('venue')}
              ></textarea>
              <p className="label text-red-600">{errors?.venue?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-brand-200 text-sm md:text-base">
                Jenis Harga
              </legend>
              <select
                defaultValue="Pilih jenis harga"
                className="select w-full bg-white select-neutral"
                {...register('pricingType')}
              >
                <option disabled={true}>Pilih jenis harga</option>
                {['PAID', 'FREE'].map((p, index) => (
                  <option key={index} value={p}>
                    {p === 'PAID' ? 'Berbayar' : 'Gratis'}
                  </option>
                ))}
              </select>
              <p className="label">
                Event gratis otomatis mendapat tiket bernama "Free Ticket"
              </p>
              <p className="label text-red-600">
                {errors?.pricingType?.message}
              </p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-brand-200 text-sm md:text-base">
                Tanggal Mulai
              </legend>
              <input
                type="datetime-local"
                className="input w-full bg-white input-neutral"
                placeholder="Ketik di sini"
                {...register('startDate')}
              />
              <p className="label text-red-600">{errors?.startDate?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-brand-200 text-sm md:text-base">
                Tanggal Selesai
              </legend>
              <input
                type="datetime-local"
                className="input w-full bg-white input-neutral"
                placeholder="Ketik di sini"
                {...register('endDate')}
              />
              <p className="label text-red-600">{errors?.endDate?.message}</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-brand-200 text-sm md:text-base">
                Jumlah Kursi
              </legend>
              <input
                type="number"
                className="input w-full bg-white input-neutral"
                placeholder="Ketik di sini"
                {...register('totalSeats')}
              />
              <p className="label text-red-600">
                {errors?.totalSeats?.message}
              </p>
              <p className="label">
                Kursi tersedia akan mengikuti jumlah kursi yang kamu isi
              </p>
            </fieldset>
            <button
              type="submit"
              disabled={handleCreateEvent.isPending}
              className="mt-8 w-full btn bg-brand-300 hover:bg-yellow-500 text-white hover:text-brand-200"
            >
              Buat Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default WithAuthGuard(CreateEventPage, ['ORGANIZER']);
