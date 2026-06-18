const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, options);
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : {};

    if (!res.ok) {
      return {
        error: data.error || `Request failed with status ${res.status}`
      };
    }

    return data;
  } catch (err) {
    return {
      error: "Could not reach the Payflow API. Please check your connection and try again."
    };
  }
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
}

export async function register(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });
}

export async function getProfile() {
  return request("/auth/me", {
    headers: authHeaders()
  });
}

export async function getBalance() {
  return request("/wallet/balance", {
    headers: authHeaders()
  });
}

export async function transferMoney(recipientEmail, amount) {
  return request("/wallet/transfer", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ recipientEmail, amount: Number(amount) })
  });
}

export async function getTransactions() {
  return request("/transactions", {
    headers: authHeaders()
  });
}
