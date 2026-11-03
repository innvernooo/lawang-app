import { GetReadingByFetch } from '@/api/reading/getReadingByFetch';
import IsLoading from '@/features/general/components/isLoadingImage';
import { tanggal } from '@/utils/localDate';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: { absolute: 'Lawang Blog | Baca Artikel Terbitan Lawang' },
  description:
    'Baca berita, tips, dan cerita seru seputar konser, festival, sport event, dan dunia hiburan terbaru di Lawang Blog.',
};

export default function BlogListPage() {
  return (
    <Suspense fallback={<IsLoading />}>
      <BlogListContent />
    </Suspense>
  );

  async function BlogListContent() {
    const reading = await GetReadingByFetch();

    return (
      <>
        <div className="flex justify-center -mx-3 -mt-3 md:-mx-15 md:-mt-15">
          <Image
            src={'/artikel.svg'}
            alt="Tentang Kami"
            height={100}
            width={100}
            className="w-full h-auto"
          />
        </div>
        <div className="mt-10 md:mt-15 w-full h-fit grid lg:grid-cols-2 gap-8 md:px-15 lg:px-30">
          {reading.map((r: any, i: number) => (
            <Link
              href={`/blog/${r.slug}`}
              key={i}
              className="group flex gap-2 hover:text-brand-200"
            >
              <img
                src={r.imageUrl}
                alt={r.title}
                className="w-40 md:w-60 h-auto self-start shrink-0 rounded-lg duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-brand-200/30"
              />
              <div className="min-w-0">
                <h1 className="md:text-xl font-semibold transition-colors duration-300 group-hover:text-blue-700">
                  {r.title}
                </h1>
                <p className="label text-sm">
                  {r.author} • {tanggal.format(new Date(r.createdAt))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  }
}
