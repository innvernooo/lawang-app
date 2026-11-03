import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Lawang | Tentang Kami' },
  description: 'Artikel sekilas tentang Lawang sebagai Event Ticketing Platfom',
};

export default function AboutUsPage() {
  return (
    <>
      <div className="flex justify-center -mx-15 -mt-15">
        <Image
          src={'/tentang.svg'}
          alt="Tentang Kami"
          height={100}
          width={100}
          className="w-full h-auto"
        />
      </div>
      <div className="mt-6 w-full lg:px-25">
        <h1 className="flex justify-center text-2xl font-semibold">
          Lawang, Pintu Menuju Pengalaman Seru
        </h1>
        <p className="mt-5">
          Lawang adalah platform ticketing event yang mempertemukan
          penyelenggara dan penikmat acara dalam satu tempat. Dari konser,
          festival, dan sport event hingga pertunjukan seni, acara komunitas,
          dan seminar, kami hadir agar setiap orang bisa menemukan dan
          mendapatkan tiket event idamannya dengan mudah. #PASTIBISA
          <br />
          <br />
          Nama Lawang berasal dari kata yang berarti “pintu” dalam bahasa Jawa
          dan Sunda. Dari situlah semangat kami bermula: membuka pintu bagi
          siapa saja untuk menikmati pengalaman yang tak terlupakan, sekaligus
          membuka jalan bagi penyelenggara untuk menjangkau lebih banyak
          penonton.
        </p>
        <br />
        <h2 className="font-semibold">Untuk Penikmat Event</h2>
        <p>
          Kami ingin membeli tiket terasa sederhana dan menyenangkan. Kamu bisa
          menjelajahi beragam event berdasarkan kategori, memilih tiket, dan
          menyelesaikan pembelian hanya dalam beberapa langkah. Tidak perlu
          antre dan tidak perlu ribet.
        </p>
        <br />
        <h2 className="font-semibold">Untuk Event Organizer</h2>
        <p>
          Lawang membantu penyelenggara dari berbagai skala, baik yang baru
          memulai maupun yang sudah berpengalaman, untuk membuat tiket, mengatur
          penjualan, dan mempromosikan event mereka. Dengan begitu,
          penyelenggara bisa lebih fokus menghadirkan acara terbaik.
        </p>
        <br />
        <h2 className="font-semibold">Nilai Kami</h2>
        <p>
          • <span className="font-semibold">Mudah.</span> Setiap langkah
          dirancang agar tidak membingungkan.
        </p>
        <p>
          • <span className="font-semibold">Terpercaya.</span> Pengalaman yang
          aman bagi pembeli dan penyelenggara.
        </p>
        <p>
          • <span className="font-semibold">Inklusif.</span> Ada event untuk
          semua minat dan semua kalangan.
        </p>
        <p>
          • <span className="font-semibold">Bertumbuh Bersama.</span> Kami
          berkembang bersama komunitas dan para penyelenggara event.
        </p>
      </div>
    </>
  );
}
