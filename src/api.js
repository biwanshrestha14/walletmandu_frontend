const base = import.meta.env.VITE_API_URL;
export async function api(path, { token, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(12000),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Unable to reach the store. Please try again shortly.');
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      Array.isArray(data?.message)
        ? data.message.join(' ')
        : data?.message || 'Something went wrong. Please try again.',
    );
    error.status = response.status;
    throw error;
  }
  if (data === null)
    throw new Error(
      'The store returned an unexpected response. Please try again.',
    );
  return data;
}
export const money = (value) =>
  `Rs. ${Number(value).toLocaleString('en-NP', { maximumFractionDigits: 2 })}`;
