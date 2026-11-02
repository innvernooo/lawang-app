import { axiosInstance } from '@/lib/axiosInstance.lib';

export type EventFilter = {
  category?: string | null;
  search?: string;
  page: number;
};

export async function GetEventByCatgory({
  category,
  search,
  page,
}: EventFilter) {
  const res = await axiosInstance.get('/events', {
    params: {
      ...(category && { category }),
      ...(search && { search }),
      page,
    },
  });

  return res?.data;
}
