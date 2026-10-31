import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetEventByCustomer() {
  const res = await axiosInstance.get('/reviews/event/me');

  return res?.data;
}
