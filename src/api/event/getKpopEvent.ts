import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetKpopEvent() {
  const res = await axiosInstance.get('/events/kpop');

  return res?.data?.data;
}
