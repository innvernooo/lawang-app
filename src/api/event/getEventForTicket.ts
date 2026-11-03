import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetEventForTicket({ page }: { page: number }) {
  const res = await axiosInstance.get('/tickets/event', {
    params: { page },
  });

  return res?.data;
}
