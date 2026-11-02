import { useGetCustomerTrans } from '@/hook/transaction/useGetCustomerTrans';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineMail } from 'react-icons/md';
import { LiaMaskSolid } from 'react-icons/lia';

export default function TransactionHeader() {
  const { data } = useGetCustomerTrans();

  return (
    <>
      <div className="w-full h-fit p-4 bg-linear-to-r from-brand-100 to-brand-300 glass text-white shadow-lg rounded-t-xl">
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">
          Transaksi Saya
        </h1>
        <div className="mt-3 flex gap-2 items-center text-sm md:text-base lg:text-lg">
          <CgProfile />
          <h2>{data?.customer.name}</h2>
        </div>
        <div className="flex gap-2 items-center text-sm md:text-base lg:text-lg">
          <MdOutlineMail />
          <h2>{data?.customer.email}</h2>
        </div>
        <div className="flex gap-2 items-center text-sm md:text-base lg:text-lg">
          <LiaMaskSolid />
          <h2>{data?.customer.username}</h2>
        </div>
        <label className="label md:flex md:justify-end text-[10px] md:text-[11px] lg:text-sm text-yellow-400 italic">
          Klik pada <span className="underline">Waiting payment</span> untuk
          meyelesaikan pembayaran
        </label>
      </div>
    </>
  );
}
