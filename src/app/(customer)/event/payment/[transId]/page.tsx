'use client';
import Image from 'next/image';
import { Sansita } from 'next/font/google';
import { Suspense, useRef } from 'react';
import { useParams } from 'next/navigation';
import { rupiah } from '@/utils/idr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PaymentOutput,
  paymentSchema,
} from '@/features/payment/validation/paymentSchema';
import IsLoading from '@/features/general/components/isLoadingImage';
import { useTransDetail } from '@/hook/transaction/useGetTransDetail';
import ErrorImage from '@/features/general/components/errorImage';
import AuthGuard from '@/hoc/authGuard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostCancelTrans } from '@/api/transaction/postCancelTrans';
import { PostPaymentProof } from '@/api/transaction/postPaymentProof';
import PopoverSuccessLink from '@/features/general/components/popoverSuccessLink';

const sansita = Sansita({
  weight: '700',
  subsets: ['latin'],
});

export default function PaymentPage() {
  return (
    <AuthGuard allowedRole={['CUSTOMER']}>
      <Suspense fallback={''}>
        <PaymentPageContent />
      </Suspense>
    </AuthGuard>
  );

  function PaymentPageContent() {
    const { transId } = useParams<{ transId: string }>();
    const successRef = useRef<HTMLDialogElement>(null);
    const queryClient = useQueryClient();

    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm<PaymentOutput>({
      resolver: zodResolver(paymentSchema),
    });

    const handlePayment = useMutation({
      mutationFn: (data: PaymentOutput) =>
        PostPaymentProof({ transId, file: data.paymentProof?.[0] }),
      onSuccess: () => {
        reset();
        successRef?.current?.showModal();
        queryClient.invalidateQueries({
          queryKey: ['transaction', transId],
        });
      },
    });

    const handleCancelPayment = useMutation({
      mutationFn: () => PostCancelTrans({ transId }),
      onSuccess: () => {
        successRef?.current?.showModal();
        queryClient.invalidateQueries({
          queryKey: ['transaction', transId],
        });
      },
    });

    const proof = watch('paymentProof');

    const { data, isLoading, isError } = useTransDetail(transId);
    const transaction = data?.data;
    const transfer = data?.meta;


    if (isLoading) return <IsLoading />;
    if (isError || !transaction)
      return (
        <div className="w-full min-h-screen flex justify-center items-center">
          <ErrorImage
            message="Maaf, transaksi tidak ditemukan"
            next="/"
            hook="Kembali ke halaman utama"
          />
        </div>
      );
    return (
      <>
        <PopoverSuccessLink
          ref={successRef}
          title={
            handlePayment.isSuccess
              ? 'Bukti Pembayaran Berhasil Dikirim'
              : 'Pembatalan Transaksi Berhasil'
          }
          next="/"
          hook="Kembali ke halaman utama"
          message={
            handlePayment.isSuccess
              ? 'Tunggu konfirmasi dari Event Organizer ya, terima kasih!'
              : 'Poin atau kupon yang kamu pakai sudah dikembalikan ke akunmu'
          }
        />
        <div className="flex items-center justify-center w-full min-h-screen">
          {transaction.status === 'CANCELED' ? (
            <>
              <ErrorImage
                message="Transaksi ini sudah dibatalkan"
                next="/"
                hook="Kembali ke halaman utama"
              />
            </>
          ) : transaction.status === 'REJECTED' ? (
            <>
              <ErrorImage
                message="Transaksi ini ditolak oleh Event Organizer"
                next="/"
                hook="Kembali ke halaman utama"
              />
            </>
          ) : transaction.status === 'WAITING_CONFIRMATION' ? (
            <>
              <ErrorImage
                message="Transaksi ini sedang menunggu konfirmasi Event Organizer"
                next="/"
                hook="Kembali ke halaman utama"
              />
            </>
          ) : transaction.status === 'DONE' ? (
            <>
              <ErrorImage
                message="Transaksi ini sudah selesai"
                next="/"
                hook="Kembali ke halaman utama"
              />
            </>
          ) : new Date(transaction.paymentExpiresAt) <= new Date() ||
            transaction.status === 'EXPIRED' ? (
            <>
              <ErrorImage
                message="Transaksi ini sudah kedaluwarsa"
                next="/"
                hook="Kembali ke halaman utama"
              />
            </>
          ) : (
            <form
              onSubmit={handleSubmit((data) => handlePayment.mutate(data))}
              className="p-4 w-full lg:w-150 md:-mt-50 lg:mt-0 h-fit bg-brand-400 glass shadow-xl rounded-xl"
            >
              <div className="flex justify-center">
                <Image
                  src={'/lawang.svg'}
                  alt={'Logo Lawang'}
                  width={130}
                  height={100}
                  className="lg:w-40"
                />
              </div>
              <h1
                className={`flex mt-5 justify-center text-2xl lg:text-3xl font-semibold ${sansita.className}`}
              >
                PEMBAYARAN
              </h1>
              <p className="flex mt-1 justify-center italic text-xs lg:text-base">
                Yuk, segera selesaikan pembayaran untuk tiket yang kamu pesan
              </p>
              <div className="mt-7">
                <h1 className="text-base">Total harga tiket</h1>
                <h2 className="mt-1 text-lg lg:text-xl font-medium">
                  {rupiah.format(transaction.subtotal)}
                </h2>
              </div>
              <div className="mt-5  flex justify-between">
                <div>
                  <h1 className="text-base">Kode kupon</h1>
                  <h2 className="mt-1 text-lg lg:text-xl font-medium">
                    {transaction.coupon?.code ?? 'Tidak ada'}
                  </h2>
                </div>
                <div>
                  <h1 className="text-base">Nominal kupon</h1>
                  <h2 className="mt-1 text-lg lg:text-xl font-medium">
                    {transaction.couponDiscount ?? 0}
                  </h2>
                </div>
              </div>
              <div className="mt-5  flex justify-between">
                <div>
                  <h1 className="text-base">Kode voucher</h1>
                  <h2 className="mt-1 text-lg lg:text-xl font-medium">
                    {transaction.voucher?.code ?? 'Tidak ada'}
                  </h2>
                </div>
                <div>
                  <h1 className="text-base">Nominal voucher</h1>
                  <h2 className="mt-1 text-lg lg:text-xl font-medium">
                    {transaction.voucherDiscount ?? 0}
                  </h2>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-base">Poin digunakan</h1>
                <h2 className="mt-1 text-lg lg:text-xl font-medium">
                  {transaction.pointsUsed ?? 0}
                </h2>
              </div>
              <p className="line-clamp-1">
                _____________________________________________________________________________________________________________________________________________________
              </p>
              <div className="mt-4 ">
                <h1 className="text-base">Nominal yang harus dibayar</h1>
                <h2 className="mt-1 text-xl lg:text-2xl text-blue-700 font-semibold">
                  {rupiah.format(transaction.totalPrice)}
                </h2>
              </div>
              <div
                className={
                  transaction.event.pricingType == 'FREE' ? 'hidden' : ''
                }
              >
                <h1 className="mt-4 mb-2 font-semibold">
                  Transfer ke nomor rekening berikut
                </h1>
                <div className="w-full h-fit bg-brand-300 text-white rounded-xl p-2.5">
                  <h2>Nama Bank: {transfer.bankName}</h2>
                  <h2>Nomor Rekening: {transfer.bankAccountNumber}</h2>
                  <h2>Pemilik Akun Rekening: {transfer.bankAccountHolder}</h2>
                </div>
              </div>
              <fieldset
                className={
                  transaction.event.pricingType === 'FREE'
                    ? 'hidden'
                    : 'fieldset'
                }
              >
                <legend className="fieldset-legend text-black text-base">
                  Unggah bukti pembayaran
                </legend>
                <input
                  type="file"
                  disabled={transaction.event.pricingType === 'FREE'}
                  className="file-input w-full input-neutral bg-white"
                  {...register('paymentProof')}
                />
                <label className="label text-red-500">
                  {errors?.paymentProof?.message}
                </label>
              </fieldset>
              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  disabled={handlePayment.isPending}
                  onClick={() => handleCancelPayment.mutate()}
                  className="btn btn-error lg:text-base"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={
                    transaction.event.pricingType === 'PAID' &&
                    (!proof?.length || handlePayment.isPending)
                  }
                  className="btn bg-brand-300 lg:text-base text-white"
                >
                  {handlePayment.isPending ? 'Mengirim...' : 'Kirim Pembayaran'}
                </button>
              </div>
            </form>
          )}
        </div>
      </>
    );
  }
}
