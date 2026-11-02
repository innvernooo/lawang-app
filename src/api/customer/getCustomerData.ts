import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetCustomerData() {
  const res = await axiosInstance.get('/customers/me');

  return res?.data?.data;
}
