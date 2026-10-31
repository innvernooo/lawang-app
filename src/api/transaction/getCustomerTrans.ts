import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetCustomerTrans() {
  const res = await axiosInstance.get('/transactions/me');

  const customer = res?.data?.customer;
  const transaction = res?.data?.data;

  return { customer, transaction };
}
