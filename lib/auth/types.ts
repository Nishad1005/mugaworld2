export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  country?: string
  city?: string
  address?: string
  account_type: 'business' | 'individual'
  extra?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface RegisterData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  country: string
  city?: string
  address?: string
  accountType: 'business' | 'individual'
  acceptTerms: boolean
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  password: string
  confirmPassword: string
}

export interface UpdateProfileData {
  full_name: string
  phone?: string
  country?: string
  city?: string
  address?: string
  account_type: 'business' | 'individual'
}
