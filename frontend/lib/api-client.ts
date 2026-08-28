// Token storage keys
const ACCESS_TOKEN_KEY = 'cf_access_token';
const REFRESH_TOKEN_KEY = 'cf_refresh_token';

export const tokenStorage = {
  getAccess: () => typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
  getRefresh: () => typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = tokenStorage.getAccess();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Id': crypto.randomUUID(),
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    tokenStorage.clear();
    window.location.href = '/login';
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An unexpected error occurred', code: 'UNKNOWN_ERROR' };
    }
    throw new ApiError(
      errorData.code || 'UNKNOWN_ERROR',
      errorData.message || 'An unexpected error occurred',
      response.status
    );
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
