import Image from 'next/image';
import Link from 'next/link';
import { Ref } from 'react';

export default function PopoverSuccess({
  ref,
  title,
  message,
}: {
  ref: Ref<HTMLDialogElement>;
  title: string;
  message: string;
}) {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box bg-white">
        <div className="flex justify-center">
          <Image
            src={'/robot-successful.svg'}
            alt="robot-successful"
            width={100}
            height={100}
            className="w-70 md:w-90"
          />
        </div>
        <h3 className="flex justify-center text-lg md:text-2xl font-bold text-green-600">{title}</h3>
        <p className="flex justify-center py-2 md:text-xl text-black">{message}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
