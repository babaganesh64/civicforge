export enum UserRole {
  CITIZEN = 'CITIZEN',
  UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN',
  UNIVERSITY_PROJECT_MANAGER = 'UNIVERSITY_PROJECT_MANAGER',
  UNIVERSITY_MEMBER = 'UNIVERSITY_MEMBER',
  INDUSTRY_ADMIN = 'INDUSTRY_ADMIN',
  INDUSTRY_MEMBER = 'INDUSTRY_MEMBER',
  GOVERNMENT_REVIEWER = 'GOVERNMENT_REVIEWER',
  GOVERNMENT_MANAGER = 'GOVERNMENT_MANAGER',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN'
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  userType: string;
  status: string;
  emailVerified: boolean;
  identityVerified: boolean;
  createdAt: string;
}

export interface AuthUser extends User {
  roles: UserRole[];
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  displayName?: string;
  userType?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}
