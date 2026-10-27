import Image from 'next/image';

export default function IsLoading() {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="w-fit h-fit">
          <div className="flex justify-center">
            <Image
              src={'/isLoading.svg'}
              alt="Is Loading"
              width={250}
              height={100}
            />
          </div>
          <h1 className="text-black text-lg font-medium">
            Tunggu sebentar, data sedang dimuat...
          </h1>
        </div>
      </div>
    </>
  );
}
