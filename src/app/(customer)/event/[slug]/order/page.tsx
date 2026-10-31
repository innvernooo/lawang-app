'use client';

import { rupiah } from '@/utils/idr';
import Image from 'next/image';
import { Suspense } from 'react';
import { GiTicket } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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
import { useGetEventBySlug } from '@/hook/event/useGetEventBySlug';
import { useGetTicketByEventId } from '@/hook/ticket/useGetTicketByEventId';
import { usePostCreateOrder } from '@/hook/transaction/usePostCreateOrder';
import TicketOption from '@/features/order/components/ticketOption';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import { IoLocationOutline } from 'react-icons/io5';
import { TbClockHour3 } from 'react-icons/tb';
import { MdDateRange } from 'react-icons/md';

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

    const router = useRouter();
    const ticketTypeId = watch('ticketTypeId');
    const { data: event = [], isLoading } = useGetEventBySlug(slug);
    const { data: ticket = [] } = useGetTicketByEventId(event.id);
    const handleCreateOrder = usePostCreateOrder();

    const onSubmit = (data: CreateOrderOutput) =>
      handleCreateOrder.mutate(
        { eventId: event.id, data },
        {
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
        },
      );

    if (isLoading) return <IsLoading />;

    return (
      <>
        <div className="w-full min-h-screen lg:px-25">
          <div className="flex flex-col-reverse items-start gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-8 lg:gap-0 lg:px-17 w-full h-fit bg-linear-to-r from-brand-200 to-brand-300 glass rounded-t-2xl">
            <div className="text-base text-white md:text-xl">
              <h1 className="text-xl mb-2 font-semibold md:text-2xl">
                {event.name}
              </h1>
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
              <div className="flex gap-2 items-center">
                <TbClockHour3 />
                <h1>{jam.format(new Date(event.startDate))} WIB</h1>
              </div>
            </div>
            <Image
              src={event.imageUrl}
              alt=""
              width={300}
              height={100}
              className="w-full h-auto rounded-lg ring-2 ring-white md:w-60 lg:w-75"
            />
          </div>
          <div className="flex flex-col p-3 md:p-5 lg:flex-row lg:justify-between w-full h-fit bg-white shadow-lg rounded-b-2xl">
            <TicketOption tickets={ticket} />
            <div className="p-2 md:p-5 lg:p-7">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full lg:w-130 h-fit p-5 bg-brand-100 rounded-xl shadow-xl"
              >
                <div className="flex gap-2 text-xl md:text-[28px] md:leading-normal font-semibold items-center">
                  <GiTicket className="text-3xl  text-blue-700" />
                  <h2>Buat Pesanan Tiket</h2>
                </div>
                <label className="label mt-4 text-red-500">
                  Anda hanya bisa membeli satu tipe tiket
                </label>
                <p className=" line-clamp-1">
                  _____________________________________________________________________________________________________________________________________________________
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-black text-base">
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
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-black text-base">
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-black text-base">
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
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-black text-base">
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
                </div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-black text-base">
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
                  className="btn bg-blue-700 mt-10 w-full h-12 text-base"
                >
                  Pesan Sekarang
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
