import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function PostCancelTrans({ transId }: { transId: string }) {
  const res = await axiosInstance.patch(`/confirmations/cancel/${transId}`);

  return res?.data?.data;
}
