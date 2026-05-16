export const ACCESS_TOKEN_KEY = "ecotrack.access-token";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://ecotrack-backend-production-2db4.up.railway.app"
).replace(/\/$/, "");

export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  wallet: WalletSummary;
};

export type WalletSummary = {
  balance: number;
  earnedToday: number;
  weeklyChange: number;
  redeemedCount: number;
  level: string;
  updatedAt?: string;
};

export type Reward = {
  id: string;
  title: string;
  cost: number;
  category: string;
  icon: string;
  color: string;
  available: boolean;
};

export type Redemption = {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  category: string;
  icon: string;
  color: string;
  createdAt: string;
};

export type WalletResponse = {
  wallet: WalletSummary;
  rewards: Reward[];
  recentRedemptions: Redemption[];
};

export type RedeemRewardResponse = {
  message: string;
  wallet: WalletSummary;
  redemption: Redemption;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return (await response.json()) as T;
}

async function createApiError(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(data.message) && data.message.length > 0) {
      return new ApiError(data.message.join(", "), response.status);
    }

    if (typeof data.message === "string") {
      return new ApiError(data.message, response.status);
    }

    if (typeof data.error === "string") {
      return new ApiError(data.error, response.status);
    }
  } catch {
    return new ApiError("No se pudo completar la solicitud", response.status);
  }

  return new ApiError("No se pudo completar la solicitud", response.status);
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function getWallet(token: string) {
  return request<WalletResponse>("/wallet", {
    method: "GET",
    token,
  });
}

export function redeemReward(token: string, rewardId: string) {
  return request<RedeemRewardResponse>("/wallet/redeem", {
    method: "POST",
    token,
    body: { rewardId },
  });
}
