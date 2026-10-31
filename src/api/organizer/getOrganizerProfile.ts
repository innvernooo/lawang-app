import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetOrganizerProfile() {
  const res = await axiosInstance.get('/organizers/me');

  return res?.data?.data;
}
