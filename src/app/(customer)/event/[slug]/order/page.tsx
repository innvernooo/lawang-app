'use client';

import { rupiah } from '@/utils/idr';
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
import OrderHeader from '@/features/order/components/orderHeader';
import AuthGuard from '@/hoc/authGuard';

export default function OrderPage() {
  return (
    <AuthGuard allowedRole={['CUSTOMER']}>
      <Suspense fallback={''}>
        <OrderPageContent />
      </Suspense>
    </AuthGuard>
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
              'Terjadi kesalahan, silakan coba lagi';

            const msg = text.toLowerCase();

            const field = msg.includes('kupon')
              ? 'couponCode'
              : msg.includes('voucher')
                ? 'voucherCode'
                : msg.includes('sisa tiket')
                  ? 'quantity'
                  : msg.includes('tiket')
                    ? 'ticketTypeId'
                    : msg.includes('poin')
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
          <OrderHeader pair={slug} />
          <div className="flex flex-col p-3 md:p-5 lg:flex-row lg:justify-between w-full h-fit bg-white shadow-lg rounded-b-2xl">
            <TicketOption tickets={ticket} />
            <div className="p-2 md:p-5 lg:p-7">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full lg:w-130 h-fit p-5 bg-brand-400 rounded-xl shadow-xl"
              >
                <div className="flex gap-2 text-xl md:text-[28px] md:leading-normal font-semibold items-center">
                  <GiTicket className="text-3xl  text-blue-700" />
                  <h2>Buat Pesanan Tiket</h2>
                </div>
                <label className="label text-xs md:text-sm mt-4 text-red-500">
                  Kamu hanya bisa membeli satu jenis tiket per pesanan
                </label>
                <p className=" line-clamp-1">
                  _____________________________________________________________________________________________________________________________________________________
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-black text-base">
                      Pilih jenis tiket
                    </legend>
                    <select
                      defaultValue=""
                      className="select select-primary bg-white w-full"
                      {...register('ticketTypeId')}
                    >
                      <option value="">Pilih tiket</option>
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

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-black text-base">
                    Punya kupon diskon?
                  </legend>
                  <input
                    type="text"
                    disabled={event.pricingType === 'FREE'}
                    className="input input-primary w-full bg-white "
                    placeholder="Masukkan kode kupon"
                    {...register('couponCode')}
                  />
                  <p className="label">Opsional</p>
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
                    placeholder="Masukkan kode voucher"
                    {...register('voucherCode')}
                  />
                  <p className="label">Opsional</p>
                  <p className="label text-red-500">
                    {errors?.voucherCode?.message}
                  </p>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-black text-base">
                    Mau pakai poin?
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
                  <span className="label">Opsional</span>
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
                  className="btn bg-brand-300 mt-10 w-full h-12 text-base"
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
