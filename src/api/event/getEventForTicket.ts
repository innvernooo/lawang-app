import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetEventForTicket() {
  const res = await axiosInstance.get('/tickets/event');

  return res?.data?.data;
}
