export async function postJson<T = Record<string, unknown>>(
  url: string,
  body: Record<string, unknown>
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Error inesperado del servidor.");
  }
  return data as T;
}
