import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function PostPaymentProof({
  transId,
  file,
}: {
  transId: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append('paymentProof', file);

  const res = await axiosInstance.patch(
    `/transactions/payment/${transId}`,
    formData,
  );

  return res?.data?.data;
}
