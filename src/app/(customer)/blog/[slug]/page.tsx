import { GetReadingBySlug } from '@/api/reading/getReadingBySlug';
import Markdown from 'react-markdown';
import { tanggal } from '@/utils/localDate';
import Image from 'next/image';
import { Suspense } from 'react';

export default function BlogPage({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-screen"></div>}>
      <BlogPageContent />
    </Suspense>
  );

  async function BlogPageContent() {
    const { slug } = await params;

    const blog = await GetReadingBySlug(slug);

    return (
      <div className="w-full min-h-screen flex justify-center items-start">
        <article className="w-full max-w-4xl">
          <div className="relative aspect-2/1 w-full overflow-hidden rounded-lg">
            <Image
              src={blog.imageUrl ?? '/download.jpg'}
              alt={blog.title}
              fill
              sizes="(min-width: 896px) 896px, 100vw"
              priority
              className="object-cover"
            />
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight">
            {blog.title}
          </h1>
          <p className="mt-3 font-medium text-gray-500">
            {blog.author} | {tanggal.format(new Date(blog.createdAt))}
          </p>
          <div className="mt-7 space-y-4 leading-7 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_strong]:font-semibold">
            <Markdown>{blog.description}</Markdown>
          </div>
        </article>
      </div>
    );
  }
}
