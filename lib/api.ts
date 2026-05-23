export const ACCESS_TOKEN_KEY = "ecotrack.access-token";

const API_TARGET = process.env.NEXT_PUBLIC_API_TARGET ?? "docker";

const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, "");

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (API_TARGET === "railway") {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL_RAILWAY ??
      "https://ecotrack-backend-production-2db4.up.railway.app"
    );
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL_DOCKER ?? "http://localhost:3001";
}

export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    firstNames: string;
    lastNames: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
  };
  wallet: WalletSummary;
};

export type UserProfileResponse = {
  user: {
    id: string;
    firstNames: string;
    lastNames: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  wallet: {
    walletId: string;
    availablePoints: number;
    totalPoints: number;
  } | null;
};

export type WalletSummary = {
  walletId?: string;
  availablePoints?: number;
  totalPoints?: number;
  balance: number;
  redeemedCount: number;
  updatedAt?: string;
};

export type Coupon = {
  id: string;
  title: string;
  description?: string | null;
  requiredPoints: number;
  stock: number;
  validityDays: number;
  isActive: boolean;
};

export type Redemption = {
  id: string;
  couponId: string;
  title: string;
  description?: string | null;
  usedPoints: number;
  redemptionCode: string;
  status: string;
  redeemedAt: string;
  expiresAt: string;
};

export type WalletResponse = {
  wallet: WalletSummary;
  coupons: Coupon[];
  recentRedemptions: Redemption[];
};

export type Material = {
  id: string;
  name: string;
  co2PerKg: number;
  pointsPerKg: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RecyclingCenter = {
  id: string;
  name: string;
  address: string;
  district: string | null;
  isActive: boolean;
  schedules: Array<{
    id: string;
    weekday: string;
    attends: boolean;
    openingTime: string | null;
    closingTime: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type RecyclingRecord = {
  id: string;
  userId: string;
  materialId: string;
  recyclingCenterId: string;
  weightKg: number;
  savedCo2: number;
  earnedPoints: number;
  qrCode: string;
  status: string;
  createdAt: string;
  material: {
    id: string;
    name: string;
  } | null;
  recyclingCenter: {
    id: string;
    name: string;
  } | null;
  validation: {
    id: string;
    validatorUserId: string;
    validatedAt: string;
  } | null;
};

export type RedeemCouponResponse = {
  message: string;
  wallet: WalletSummary;
  redemption: Redemption;
};

export type CreateRecyclingRecordResponse = RecyclingRecord;

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
  firstNames: string;
  lastNames: string;
  email: string;
  phone: string;
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

export function getProfile(token: string) {
  return request<UserProfileResponse>("/users/me", {
    method: "GET",
    token,
  });
}

export function getMaterials() {
  return request<Material[]>("/materials", {
    method: "GET",
  });
}

export function getRecyclingCenters() {
  return request<RecyclingCenter[]>("/recycling-centers", {
    method: "GET",
  });
}

export function createRecyclingRecord(
  token: string,
  payload: {
    materialId: string;
    recyclingCenterId: string;
    weightKg: number;
    qrCode: string;
  }
) {
  return request<CreateRecyclingRecordResponse>("/recycling-records", {
    method: "POST",
    token,
    body: payload,
  });
}

export function getMyRecyclingRecords(token: string) {
  return request<RecyclingRecord[]>("/recycling-records/me", {
    method: "GET",
    token,
  });
}

export function getWallet(token: string) {
  return request<WalletResponse>("/wallet", {
    method: "GET",
    token,
  });
}

export function redeemCoupon(token: string, couponId: string) {
  return request<RedeemCouponResponse>("/wallet/redeem", {
    method: "POST",
    token,
    body: { couponId },
  });
}
