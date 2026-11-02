import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetCustomerTrans({ page }: { page: number }) {
  const res = await axiosInstance.get('/transactions/me', { params: { page } });

  const customer = res?.data?.customer;
  const transaction = res?.data?.data;
  const meta = res?.data?.meta;

  return { customer, transaction, meta };
}
