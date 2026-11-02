import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetWeeklyEvent() {
  const res = await axiosInstance.get('/events/weekly');

  return res?.data?.data;
}
