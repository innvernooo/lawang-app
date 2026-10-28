import { notFound } from 'next/navigation';

export async function getEventBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/eventDetail/${slug}`,
  );

  if (!res.ok) notFound();

  return (await res.json()).data;
}
