import Image from 'next/image';
import Link from 'next/link';
import { Ref } from 'react';

export default function PopoverSuccessLink({
  ref,
  title,
  next,
  message,
  hook,
}: {
  ref: Ref<HTMLDialogElement>;
  title: string;
  next: string;
  message: string;
  hook: string;
}) {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box bg-white">
        <div className="flex justify-center">
          <Image
            src={'/success.svg'}
            alt="Ilustrasi berhasil"
            width={100}
            height={100}
            className="w-70"
          />
        </div>
        <h3 className="flex justify-center text-lg md:text-2xl font-bold text-green-600">
          {title}
        </h3>
        <p className="flex justify-center py-2 md:text-xl text-black">
          {message}
        </p>
        <div className="modal-action">
          <form method="dialog">
            <Link href={next} className="btn btn-success">
              {hook}
            </Link>
          </form>
        </div>
      </div>
    </dialog>
  );
}
