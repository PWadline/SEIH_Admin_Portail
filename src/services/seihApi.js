const BASE = (
  import.meta.env.VITE_BASE_API_URL || "https://localhost:5258"
).replace(/\/$/, "");

export async function seihFetch(
  path,
  { method = "GET", headers = {}, body, retry = true } = {},
) {
  const url = BASE + path;

  const isFormData = body instanceof FormData;

  const finalHeaders = new Headers({
    Accept: "application/json",
    ...headers,
  });

  if (isFormData) {
    finalHeaders.delete("Content-Type");
  }

  if (body && !isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  let res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body
      ? isFormData
        ? body
        : typeof body === "string"
          ? body
          : JSON.stringify(body)
      : undefined,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const r = await fetch(BASE + "/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (r.ok) {
      return seihFetch(path, { method, headers, body, retry: false });
    }
  }

  return res;
}
