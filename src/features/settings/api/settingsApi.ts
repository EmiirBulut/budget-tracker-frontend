import axiosInstance from '../../../services/axiosInstance'
import type { ChangePasswordRequest, UpdateProfileRequest } from '../types/SettingsTypes'

export async function updateProfile(data: UpdateProfileRequest): Promise<void> {
  await axiosInstance.put('/api/settings/profile', data)
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await axiosInstance.put('/api/settings/password', data)
}
