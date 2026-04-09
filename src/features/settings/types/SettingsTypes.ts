export interface UpdateProfileRequest {
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UserPreferences {
  defaultCurrency: string  // backend returns enum name e.g. "TRY"
  language: string         // backend returns enum name e.g. "Turkish"
  notificationsEnabled: boolean
}

export type UpdatePreferencesRequest = UserPreferences
