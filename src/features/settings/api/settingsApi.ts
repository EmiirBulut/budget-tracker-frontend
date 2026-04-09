import axiosInstance from '../../../services/axiosInstance'
import type { ChangePasswordRequest, UpdatePreferencesRequest, UpdateProfileRequest, UserPreferences } from '../types/SettingsTypes'

export async function updateProfile(data: UpdateProfileRequest): Promise<void> {
  await axiosInstance.put('/api/settings/profile', data)
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await axiosInstance.put('/api/settings/password', data)
}

export async function getPreferences(): Promise<UserPreferences> {
  const response = await axiosInstance.get<UserPreferences>('/api/settings/preferences')
  return response.data
}

export async function updatePreferences(data: UpdatePreferencesRequest): Promise<void> {
  await axiosInstance.put('/api/settings/preferences', data)
}
