export async function fetchClient(input: RequestInfo, init?: RequestInit) {
  const csrf = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf_token="))
    ?.split("=")[1]

  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "x-csrf-token": csrf || "",
      "Content-Type": "application/json",
    },
  })
}
