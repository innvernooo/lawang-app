import { Ref } from 'react';

export default function PopoverFailed({
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
        <h3 className="text-lg font-bold text-red-600">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Tutup</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
