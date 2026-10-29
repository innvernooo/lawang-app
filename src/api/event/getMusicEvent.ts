import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetMusicEvent() {
  const res = await axiosInstance.get('/events/music');

  return res?.data?.data;
}
