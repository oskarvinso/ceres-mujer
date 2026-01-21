
import { CONFIG } from '../config.ts';
import { UserProfile, HealthRecord, ExamCategory, PrenatalControlTrack, Product, Lesson } from '../types.ts';

/**
 * Ceres API Service - DTO Definitions & Fetch Logic
 */

export interface AuthResponse {
  token: string;
  has_profile: boolean;
  user_id?: string;
}

const getAuthToken = () => localStorage.getItem('ceres_token');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers({
    ...CONFIG.HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as any),
  });

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    
    // Si el flag de Mock está activo y la petición falla, podemos retornar datos locales o relanzar
    if (CONFIG.USE_MOCK_IF_FAIL && endpoint.includes('login')) {
        // Mock fallback para testing local sin backend
        return { token: 'mock_token_production', has_profile: true } as any;
    }
    
    throw error;
  }
}

export const apiService = {
  // Autenticación
  login: (code: string) => 
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Perfil de Usuario
  getProfile: () => request<UserProfile>('/profile'),
  
  saveProfile: (profile: UserProfile) => 
    request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Seguimiento de Salud
  getHealthRecords: () => request<HealthRecord[]>('/health/records'),
  
  addHealthRecord: (record: Partial<HealthRecord>) => 
    request<HealthRecord>('/health/records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  // Carnet Virtual
  getVirtualCard: () => request<{ exams: ExamCategory[], controls: PrenatalControlTrack[] }>('/clinical/card'),
  
  updateControl: (controlId: string, updates: Partial<PrenatalControlTrack>) => 
    request<void>(`/clinical/controls/${controlId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Catálogos
  getProducts: () => request<Product[]>('/catalog/products'),
  getLessons: () => request<Lesson[]>('/catalog/lessons'),
};
