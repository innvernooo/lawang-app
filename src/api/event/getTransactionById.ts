import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetTransactionById(eventId: string) {
  const res = await axiosInstance.get(`/confirmations/${eventId}`);

  return res?.data?.data;
}
