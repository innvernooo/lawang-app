import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetUpcomingEvents() {
  const res = await axiosInstance.get('/events/upcomingEvents');

  return res?.data?.data ?? [];
}
