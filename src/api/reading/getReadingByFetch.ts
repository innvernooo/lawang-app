export async function GetReadingByFetch() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/readings`);

  return (await res.json()).data;
}
