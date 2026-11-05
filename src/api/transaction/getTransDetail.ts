import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetTransDetail(transId: string) {
  const res = await axiosInstance.get(`/transactions/${transId}`);

  return res?.data;
}
