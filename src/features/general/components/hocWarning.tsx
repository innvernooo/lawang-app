import ErrorImage from './errorImage';

export default function HocWarning() {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <ErrorImage
          message="STOP! Role-mu tidak diizinkan mengakses halaman ini"
          next="/"
          hook="Kembali ke halaman utama"
        />
      </div>
    </>
  );
}
