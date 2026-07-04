export const ACCESS_TOKEN_KEY = "ecotrack.access-token";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");

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
  wallet: WalletSummary | null;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
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
  status?: string;
  expiresAt?: string;
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
  user: {
    id: string;
    firstNames: string;
    lastNames: string;
    name: string;
  } | null;
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

export type ValidatorCenterSummaryResponse = {
  assignment: {
    id: string;
    assignedAt: string;
  };
  center: RecyclingCenter;
  stats: {
    totalRecords: number;
    pendingRecords: number;
    validatedRecords: number;
    rejectedRecords: number;
    todayRecords: number;
  };
};

export type ValidatorRecyclingRecordsResponse = {
  center: {
    id: string;
    name: string;
  };
  records: RecyclingRecord[];
};

export type AdminValidatorOption = {
  id: string;
  firstNames: string;
  lastNames: string;
  name: string;
  email: string;
  phone: string;
  assignedCenter: {
    id: string;
    name: string;
  } | null;
};

export type AdminCenterSchedule = {
  id?: string;
  weekday: string;
  attends: boolean;
  openingTime: string | null;
  closingTime: string | null;
};

export type AdminCenter = {
  id: string;
  name: string;
  address: string;
  district: string | null;
  isActive: boolean;
  operationalStatus: string;
  schedules: AdminCenterSchedule[];
  validators: Array<{
    assignmentId: string;
    userId: string;
    assignedAt: string;
    user: {
      id: string;
      firstNames: string;
      lastNames: string;
      name: string;
      email: string;
      phone: string;
    };
  }>;
  stats: {
    totalRecords: number;
    validatedRecords: number;
    pendingRecords: number;
    rejectedRecords: number;
    totalWeightKg: number;
    totalSavedCo2: number;
    totalPoints: number;
    uniqueUsers: number;
    materials: Array<{
      materialId: string;
      name: string;
      recordsCount: number;
      weightKg: number;
      validatedRecords: number;
      pendingRecords: number;
    }>;
  };
  recentRecords: RecyclingRecord[];
  createdAt: string;
  updatedAt: string;
};

export type AdminCoupon = {
  id: string;
  title: string;
  description: string | null;
  requiredPoints: number;
  stock: number;
  validityDays: number;
  isActive: boolean;
  status: string;
  expiresAt: string;
  conditions: {
    minimumPoints: number;
    stock: number;
    validityDays: number;
  };
  stats: {
    totalRedemptions: number;
    redeemedCount: number;
    usedCount: number;
    expiredCount: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboardResponse = {
  stats: {
    totalCenters: number;
    activeCenters: number;
    inactiveCenters: number;
    totalCoupons: number;
    activeCoupons: number;
    totalUsers: number;
    totalValidators: number;
    totalRecords: number;
    pendingRecords: number;
    validatedRecords: number;
    totalWeightKg: number;
  };
  centers: AdminCenter[];
  coupons: AdminCoupon[];
  recentRecords: RecyclingRecord[];
};

export type WeeklyClientRankingResponse = {
  period: {
    startAt: string;
    endAt: string;
  };
  ranking: Array<{
    rank: number;
    userId: string;
    firstNames: string;
    lastNames: string;
    name: string;
    totalRecords: number;
    validatedRecords: number;
    pendingRecords: number;
    totalWeightKg: number;
    totalPoints: number;
    isCurrentUser?: boolean;
  }>;
};

export type WeeklyCenterRankingResponse = {
  period: {
    startAt: string;
    endAt: string;
  };
  ranking: Array<{
    rank: number;
    centerId: string;
    name: string;
    address: string;
    district: string | null;
    totalRecords: number;
    validatedRecords: number;
    pendingRecords: number;
    totalWeightKg: number;
    totalPoints: number;
  }>;
};

export type ValidatorWeeklyClientRankingResponse = WeeklyClientRankingResponse & {
  center: {
    id: string;
    name: string;
  };
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

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return window.atob(padded);
}

export function getAccessTokenPayload() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload)) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isValidatorRole(role: string | null | undefined) {
  return role === "Validador";
}

export function isAdminRole(role: string | null | undefined) {
  return role === "Administrador";
}

export function isClientRole(role: string | null | undefined) {
  return role === "Cliente";
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

export function getClientWeeklyRanking(token: string) {
  return request<WeeklyClientRankingResponse>("/users/ranking/weekly", {
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

function buildQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
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

export function getValidatorCenter(token: string) {
  return request<ValidatorCenterSummaryResponse>("/recycling-centers/me", {
    method: "GET",
    token,
  });
}

export function getValidatorWeeklyClientRanking(token: string) {
  return request<ValidatorWeeklyClientRankingResponse>(
    "/recycling-centers/me/rankings/weekly/clients",
    {
      method: "GET",
      token,
    },
  );
}

export function getValidatorRecyclingRecords(
  token: string,
  params: {
    status?: string;
    search?: string;
  } = {},
) {
  return request<ValidatorRecyclingRecordsResponse>(
    `/recycling-centers/me/recycling-records${buildQueryString(params)}`,
    {
      method: "GET",
      token,
    },
  );
}

export function getValidatorRecyclingRecord(token: string, recordId: string) {
  return request<RecyclingRecord>(`/recycling-centers/me/recycling-records/${recordId}`, {
    method: "GET",
    token,
  });
}

export function validateValidatorRecyclingRecord(
  token: string,
  recordId: string,
  payload: {
    status: "Validado" | "Rechazado";
  },
) {
  return request<RecyclingRecord>(`/recycling-centers/me/recycling-records/${recordId}/validate`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function validateValidatorRecyclingRecordByQr(
  token: string,
  payload: {
    qrCode: string;
    status: "Validado" | "Rechazado";
  },
) {
  return request<RecyclingRecord>("/recycling-centers/me/recycling-records/validate-qr", {
    method: "POST",
    token,
    body: payload,
  });
}

export function getAdminDashboard(token: string) {
  return request<AdminDashboardResponse>("/admin/dashboard", {
    method: "GET",
    token,
  });
}

export function getAdminWeeklyCenterRanking(token: string) {
  return request<WeeklyCenterRankingResponse>(
    "/admin/rankings/weekly/recycling-centers",
    {
      method: "GET",
      token,
    },
  );
}

export function getAdminValidators(token: string) {
  return request<AdminValidatorOption[]>("/admin/validators", {
    method: "GET",
    token,
  });
}

export function createAdminValidator(
  token: string,
  payload: {
    firstNames: string;
    lastNames: string;
    email: string;
    phone: string;
    password: string;
  },
) {
  return request<AdminValidatorOption>("/admin/validators", {
    method: "POST",
    token,
    body: payload,
  });
}

export function getAdminCenters(token: string) {
  return request<AdminCenter[]>("/admin/recycling-centers", {
    method: "GET",
    token,
  });
}

export function getAdminCenter(token: string, centerId: string) {
  return request<AdminCenter>(`/admin/recycling-centers/${centerId}`, {
    method: "GET",
    token,
  });
}

export function createAdminCenter(
  token: string,
  payload: {
    name: string;
    address: string;
    district?: string;
    isActive?: boolean;
    schedules?: Array<{
      weekday: string;
      attends: boolean;
      openingTime?: string | null;
      closingTime?: string | null;
    }>;
    validatorUserIds?: string[];
  },
) {
  return request<AdminCenter>("/admin/recycling-centers", {
    method: "POST",
    token,
    body: payload,
  });
}

export function updateAdminCenter(
  token: string,
  centerId: string,
  payload: {
    name?: string;
    address?: string;
    district?: string;
    isActive?: boolean;
    schedules?: Array<{
      weekday: string;
      attends: boolean;
      openingTime?: string | null;
      closingTime?: string | null;
    }>;
    validatorUserIds?: string[];
  },
) {
  return request<AdminCenter>(`/admin/recycling-centers/${centerId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deactivateAdminCenter(token: string, centerId: string) {
  return request<AdminCenter>(`/admin/recycling-centers/${centerId}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminCoupons(token: string) {
  return request<AdminCoupon[]>("/admin/coupons", {
    method: "GET",
    token,
  });
}

export function getAdminCoupon(token: string, couponId: string) {
  return request<AdminCoupon>(`/admin/coupons/${couponId}`, {
    method: "GET",
    token,
  });
}

export function createAdminCoupon(
  token: string,
  payload: {
    title: string;
    description?: string;
    requiredPoints: number;
    stock: number;
    validityDays?: number;
    isActive?: boolean;
  },
) {
  return request<AdminCoupon>("/admin/coupons", {
    method: "POST",
    token,
    body: payload,
  });
}

export function updateAdminCoupon(
  token: string,
  couponId: string,
  payload: {
    title?: string;
    description?: string;
    requiredPoints?: number;
    stock?: number;
    validityDays?: number;
    isActive?: boolean;
  },
) {
  return request<AdminCoupon>(`/admin/coupons/${couponId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deactivateAdminCoupon(token: string, couponId: string) {
  return request<AdminCoupon>(`/admin/coupons/${couponId}`, {
    method: "DELETE",
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
