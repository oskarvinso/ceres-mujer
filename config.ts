
export const CONFIG = {
  API_BASE_URL: 'https://ceres.ameliasoft.net/api',
  USE_MOCK_IF_FAIL: true, // Permite que la UI funcione aunque el backend esté caído
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
