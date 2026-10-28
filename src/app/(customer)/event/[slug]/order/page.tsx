'use client';

import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import Image from 'next/image';
import { Suspense } from 'react';
import { BsClockHistory } from 'react-icons/bs';
import { PiNotePencil } from 'react-icons/pi';
import { CiBellOn } from 'react-icons/ci';
import { GiTicket } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { sortedPointsOption } from '@/features/order/components/pointsUsageOption';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateOrderInput,
  CreateOrderOutput,
  createOrderSchema,
} from '@/features/order/validation/createOrderSchema';
import { isAxiosError } from 'axios';
import IsLoading from '@/features/general/components/isLoadingImage';

export default function OrderPage() {
  return (
    <Suspense fallback={''}>
      <OrderPageContent />
    </Suspense>
  );

  function OrderPageContent() {
    const { slug } = useParams<{ slug: string }>();
    const {
      register,
      handleSubmit,
      reset,
      watch,
      setError,
      formState: { errors },
    } = useForm<CreateOrderInput, unknown, CreateOrderOutput>({
      resolver: zodResolver(createOrderSchema),
    });

    const ticketTypeId = watch('ticketTypeId');
    const router = useRouter();

    const { data: event, isLoading } = useQuery({
      queryKey: ['event', slug],
      queryFn: async () => {
        const res = await axiosInstance.get(`/events/eventDetail/${slug}`);

        return res?.data?.data;
      },
    });

    const eventId: string | undefined = event?.id;

    const handleCreateOrder = useMutation({
      mutationFn: async (data: CreateOrderOutput) => {
        const res = await axiosInstance.post(`/transactions/${eventId}`, data);

        return res?.data?.data;
      },
      onSuccess: (res) => {
        const transactionId = res?.id;
        reset();
        router.push(`/event/payment/${transactionId}`);
      },
      onError: (err) => {
        const text =
          (isAxiosError(err) && err.response?.data?.message) ||
          'Something went wrong, please try again';

        const msg = text.toLowerCase();

        const field = msg.includes('coupon')
          ? 'couponCode'
          : msg.includes('voucher')
            ? 'voucherCode'
            : msg.includes('not enough ticket')
              ? 'quantity'
              : msg.includes('ticket')
                ? 'ticketTypeId'
                : msg.includes('point')
                  ? 'pointsUsed'
                  : 'root.server';

        setError(field, { type: 'server', message: text });
      },
    });

    const { data: ticket = [] } = useQuery({
      queryKey: ['tickets', eventId],
      queryFn: async () => {
        const res = await axiosInstance.get(`/tickets/${eventId}`);

        return res?.data?.data;
      },
      enabled: !!eventId,
    });

    if (isLoading) return <IsLoading />;

    return (
      <>
        <div className="-mx-3 -mt-3 p-4 overflow-hidden pb-4 md:-mx-5 md:-mt-5 h-100 bg-white glass">
          <Image
            src={event.imageUrl ?? '/download.jpg'}
            alt={event.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <h1 className="mt-6 flex justify-center text-3xl font-bold tracking-wide">
          {event.name}
        </h1>
        <div className="mx-10 mt-15 grid grid-cols-[60%_40%]">
          <div className="p-5">
            <h1 className="text-2xl font-semibold">General On-sale</h1>
            {ticket.map((t: any, index: any) => (
              <div
                key={index}
                className="mt-8 p-4 w-full h-fit bg-white rounded-xl shadow-lg"
              >
                <h1 className="text-2xl font-semibold">{t.name}</h1>
                <div className="flex mt-2 text-xl gap-2 items-center">
                  <PiNotePencil />
                  <p className="">
                    Harga belum termasuk pajak dan biaya lainnya
                  </p>
                </div>
                <div className="flex mt-2 text-xl gap-2 items-center text-brand-200">
                  <BsClockHistory />
                  <p>
                    {t.endSale === null
                      ? `Tidak ada batas akhir`
                      : `Penjualan berakhir pada ${tanggal.format(new Date(t.endSale))} • Jam ${jam.format(new Date(t.endSale))} WIB`}
                  </p>
                </div>
                <div className="flex mt-2 text-xl gap-2 text-red-500 items-center">
                  <CiBellOn />
                  <p>{`Tiket tersisa ${t.available}`}</p>
                </div>
                <p className="mt-4 line-clamp-1">
                  _____________________________________________________________________________________________________________________________________________________
                </p>
                <div className="mt-7 text-3xl flex items-center justify-between">
                  <h1 className=" font-semibold">{rupiah.format(t.price)}</h1>
                </div>
              </div>
            ))}
          </div>
          <div className="p-7">
            <form
              onSubmit={handleSubmit((data) => handleCreateOrder.mutate(data))}
              className="w-full h-fit p-5 sticky top-20 bg-brand-100 rounded-xl shadow-xl"
            >
              <div className="flex gap-2 text-3xl font-semibold items-center">
                <GiTicket className="text-5xl  text-brand-200" />
                <h2>Buat Pesanan Tiket</h2>
              </div>
              <label className="label mt-4 text-red-500">
                Anda hanya bisa membeli satu tipe tiket
              </label>
              <p className=" line-clamp-1">
                _____________________________________________________________________________________________________________________________________________________
              </p>
              <fieldset className="fieldset mt-3">
                <legend className="fieldset-legend text-black text-lg">
                  Pilih tipe tiket
                </legend>
                <select
                  defaultValue=""
                  className="select select-primary bg-white w-full"
                  {...register('ticketTypeId')}
                >
                  <option value="">Pick a ticket</option>
                  {ticket.map((ticket: any, index: any) => (
                    <option key={index} value={ticket.id}>
                      {ticket.name}
                    </option>
                  ))}
                </select>
                <span className="label text-red-500">
                  {errors?.ticketTypeId?.message}
                </span>
              </fieldset>
              <fieldset className="fieldset mt-3">
                <legend className="fieldset-legend text-black text-lg">
                  Jumlah tiket
                </legend>
                <select
                  defaultValue={1}
                  className="select select-primary bg-white w-full"
                  {...register('quantity')}
                >
                  {[1, 2, 3, 4].map((n: number, index: any) => (
                    <option key={index} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="label text-red-500">
                  {errors?.quantity?.message}
                </span>
              </fieldset>
              <fieldset className="fieldset mt-3">
                <legend className="fieldset-legend text-black text-lg">
                  Punya kupon diskon?
                </legend>
                <input
                  type="text"
                  disabled={event.pricingType === 'FREE'}
                  className="input input-primary w-full bg-white "
                  placeholder="Type here"
                  {...register('couponCode')}
                />
                <p className="label">Optional</p>
                <p className="label text-red-500">
                  {errors?.couponCode?.message}
                </p>
              </fieldset>
              <fieldset className="fieldset mt-3">
                <legend className="fieldset-legend text-black text-lg">
                  Punya voucher diskon?
                </legend>
                <input
                  type="text"
                  disabled={event.pricingType === 'FREE'}
                  className="input input-primary w-full bg-white "
                  placeholder="Type here"
                  {...register('voucherCode')}
                />
                <p className="label">Optional</p>
                <p className="label text-red-500">
                  {errors?.voucherCode?.message}
                </p>
              </fieldset>
              <fieldset className="fieldset mt-3">
                <legend className="fieldset-legend text-black text-lg">
                  Punya point?
                </legend>
                <select
                  defaultValue={0}
                  disabled={event.pricingType === 'FREE'}
                  className="select select-primary bg-white w-full"
                  {...register('pointsUsed')}
                >
                  <option value={0}>Tidak pakai poin</option>
                  {sortedPointsOption.map((point, index) => (
                    <option key={index} value={point}>
                      {rupiah.format(point)}
                    </option>
                  ))}
                </select>
                <span className="label">Optional</span>
                <p className="label text-red-500">
                  {errors?.pointsUsed?.message}
                </p>
              </fieldset>
              {errors?.root?.server && (
                <p className="mt-4 text-red-500">
                  {errors?.root.server.message}
                </p>
              )}
              <button
                type="submit"
                disabled={!ticketTypeId}
                className="btn bg-blue-700 mt-10 w-full h-12 text-lg"
              >
                Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
