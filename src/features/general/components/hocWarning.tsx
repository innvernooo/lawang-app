import ErrorImage from './errorImage';

export default function HocWarning() {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <ErrorImage
          message="Maaf, akunmu tidak punya akses ke halaman ini"
          next="/"
          hook="Kembali ke halaman utama"
        />
      </div>
    </>
  );
}
