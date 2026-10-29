export async function GetReadingBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/readings/${slug}`,
  );

  return (await res.json()).data;
}
