'use client';
import Image from 'next/image';
import { Sansita } from 'next/font/google';
import { paymentMethods } from '@/utils/paymentMethod';
import { Suspense, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { rupiah } from '@/utils/idr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PaymentOutput,
  paymentSchema,
} from '@/features/payment/validation/paymentSchema';
import IsLoading from '@/features/general/components/isLoadingImage';
import PopoverSuccess from '@/features/general/components/popoverSuccess';
import { useTransDetail } from '@/hook/transaction/useGetTransDetail';
import { usePostPaymentProof } from '@/hook/transaction/usePostPaymentProof';

const sansita = Sansita({
  weight: '700',
  subsets: ['latin'],
});

export default function PaymentPage() {
  return (
    <Suspense fallback={''}>
      <PaymentPageContent />
    </Suspense>
  );

  function PaymentPageContent() {
    const { transId } = useParams<{ transId: string }>();
    const [method, setMethod] = useState('');
    const router = useRouter();
    const successRef = useRef<HTMLDialogElement>(null);
    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm<PaymentOutput>({
      resolver: zodResolver(paymentSchema),
    });

    const handlePayment = usePostPaymentProof();

    const proof = watch('paymentProof');

    const { data: transaction, isLoading, isError } = useTransDetail(transId);

    if (isLoading) return <IsLoading />;
    if (isError || !transaction) return <p>Transaksi tidak ditemnukan...</p>;
    console.log(transaction);
    return (
      <>
        <PopoverSuccess
          ref={successRef}
          title="Your payment proof uploded successfully"
          message="Harap menunggu konfirmasi dari admin Event, terima kasih"
        />
        <div className="flex items-center justify-center w-full min-h-screen">
          <form
            onSubmit={handleSubmit((data) =>
              handlePayment.mutate(
                { transId, file: data.paymentProof[0] },
                {
                  onSuccess: () => {
                    reset();
                    router.push('/');
                  },
                },
              ),
            )}
            className="p-4 w-150 h-fit bg-brand-100 glass shadow-xl rounded-xl"
          >
            <div className="flex justify-center">
              <Image
                src={'/lawang.svg'}
                alt={'Lawang logo'}
                width={200}
                height={100}
              />
            </div>
            <h1
              className={`flex mt-5 justify-center text-4xl font-semibold ${sansita.className}`}
            >
              PAYMENT GATEAWAY
            </h1>
            <p className="flex mt-1 justify-center italic text-lg">
              Segera lakukan pembayaran untuk tiket yang anda pesan
            </p>
            <div className="mt-7">
              <h1 className="text-xl">Total harga tiket</h1>
              <h2 className="mt-1 text-3xl font-medium">
                {rupiah.format(transaction.subtotal)}
              </h2>
            </div>
            <div className="mt-5  flex justify-between">
              <div>
                <h1 className="text-xl">Kode kupon</h1>
                <h2 className="mt-1 text-3xl font-medium">
                  {transaction.coupon?.code ?? 'Tidak ada'}
                </h2>
              </div>
              <div>
                <h1 className="text-xl">Nominal kupon</h1>
                <h2 className="mt-1 text-3xl font-medium">
                  {transaction.couponDiscount ?? 0}
                </h2>
              </div>
            </div>
            <div className="mt-5  flex justify-between">
              <div>
                <h1 className="text-xl">Kode voucher</h1>
                <h2 className="mt-1 text-3xl font-medium">
                  {transaction.voucher?.code ?? 'Tidak ada'}
                </h2>
              </div>
              <div>
                <h1 className="text-xl">Nominal voucher</h1>
                <h2 className="mt-1 text-3xl font-medium">
                  {transaction.voucherDiscount ?? 0}
                </h2>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="text-xl">Poin digunakan</h1>
              <h2 className="mt-1 text-3xl font-medium">
                {transaction.pointsUsed ?? 0}
              </h2>
            </div>
            <p className="line-clamp-1">
              _____________________________________________________________________________________________________________________________________________________
            </p>
            <div className="mt-4 ">
              <h1 className="text-xl">Nominal yang harus dibayar</h1>
              <h2 className="mt-1 text-3xl text-brand-200 font-semibold">
                {rupiah.format(transaction.totalPrice)}
              </h2>
            </div>
            <fieldset className="fieldset  mt-5">
              <legend className="fieldset-legend text-black text-xl">
                Metode Pembayaran
              </legend>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="select select-neutral w-full bg-white"
              >
                <option value="" disabled className="text-black">
                  Pick a payment method
                </option>
                {paymentMethods.map((m, index) => (
                  <option key={index} value={m} className="text-black">
                    {m}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black text-xl">
                Upload bukti pembayaran
              </legend>
              <input
                type="file"
                className="file-input w-full input-neutral bg-white"
                {...register('paymentProof')}
              />
              <label className="label text-red-500">
                {errors?.paymentProof?.message}
              </label>
            </fieldset>
            <button
              type="submit"
              disabled={
                transaction.event.pricingType === 'PAID' &&
                (!method || !proof?.length || handlePayment.isPending)
              }
              className="btn btn-success mt-10 w-full h-12 text-lg"
            >
              Selesai
            </button>
          </form>
        </div>
      </>
    );
  }
}
