const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function req(path, { method = "GET", token = null, body = undefined } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({ success: false, error: "Respons tidak valid." }));
  if (!res.ok || json.success === false) {
    throw new Error(json.error || `Request gagal (${res.status})`);
  }
  return json.data;
}

export const api = {
  jurusan: () => req("/jurusan"),
  catalog: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/catalog${q ? `?${q}` : ""}`);
  },
  catalogById: (id) => req(`/catalog/${id}`),
  checkout: (token, payload) => req("/orders/checkout", { method: "POST", token, body: payload }),
  myOrders: (token) => req("/orders/mine", { token }),
  orderById: (token, id) => req(`/orders/${id}`, { token }),
  tracking: (token, orderId) => req(`/orders/${orderId}/tracking`, { token }),
  addTracking: (token, orderId, payload) =>
    req(`/orders/${orderId}/tracking`, { method: "POST", token, body: payload }),
  finance: (token, jurusan_id) =>
    req(`/finance/summary${jurusan_id ? `?jurusan_id=${jurusan_id}` : ""}`, { token }),
};
