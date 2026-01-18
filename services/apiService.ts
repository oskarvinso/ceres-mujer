
import { CONFIG } from '../config.ts';
import { UserProfile, HealthRecord, ExamCategory, PrenatalControlTrack, Product, Lesson } from '../types.ts';

/**
 * Data Transfer Objects (DTOs) for the Flask Backend
 */

export interface AuthResponse {
  token: string;
  user_id: string;
  has_profile: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const getAuthToken = () => localStorage.getItem('ceres_token');

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...CONFIG.HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición al servidor');
  }

  return response.json();
};

export const apiService = {
  // Auth
  login: (code: string) => 
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Profile
  getProfile: () => request<UserProfile>('/profile'),
  saveProfile: (profile: UserProfile) => 
    request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Health Tracker
  getHealthRecords: () => request<HealthRecord[]>('/health/records'),
  addHealthRecord: (record: Partial<HealthRecord>) => 
    request<HealthRecord>('/health/records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  // Virtual Card
  getVirtualCard: () => request<{ examSchedule: ExamCategory[], prenatalControls: PrenatalControlTrack[] }>('/clinical/card'),
  updateExamStatus: (examId: string, status: string) => 
    request<void>(`/clinical/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  updateControlStatus: (controlId: string, field: string, value: boolean) => 
    request<void>(`/clinical/controls/${controlId}`, {
      method: 'PUT',
      body: JSON.stringify({ field, value }),
    }),
  sendDocument: (controlId: string) => 
    request<{ success: boolean }>('/clinical/send-document', {
      method: 'POST',
      body: JSON.stringify({ controlId }),
    }),

  // Catalogs
  getProducts: () => request<Product[]>('/catalog/products'),
  getLessons: () => request<Lesson[]>('/catalog/lessons'),
};
