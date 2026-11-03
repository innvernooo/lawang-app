import Image from 'next/image';

export default function ErrorImage({
  message,
  next,
  hook,
}: {
  message: string;
  next: string;
  hook: string;
}) {
  return (
    <>
      <div>
        <div className="flex justify-center">
          <Image
            src={'/lost.svg'}
            alt={'Logo Lawang'}
            width={200}
            height={100}
          />
        </div>
        <h1 className="font-semibold md:text-xl">{message}</h1>
        <a href={next} className="mt-2 underline flex justify-end">
          {hook}
        </a>
      </div>
    </>
  );
}
