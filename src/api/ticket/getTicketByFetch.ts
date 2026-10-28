export async function GetTicketByFetch(eventId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tickets/${eventId}`,
  );

  return (await res.json()).data;
}
