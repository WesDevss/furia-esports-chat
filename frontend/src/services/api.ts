import axios from 'axios';

/**
 * Cliente axios configurado para as chamadas de API
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Tratamento de erro padrão para APIs
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Erro de servidor (status fora do range 2xx)
    const message = error.response.data?.message || 'Erro de servidor';
    return `Erro ${error.response.status}: ${message}`;
  } else if (error.request) {
    // Erro de rede (sem resposta)
    return 'Erro de rede: Verifique sua conexão';
  } else {
    // Erro desconhecido
    return `Erro inesperado: ${error.message}`;
  }
};

/**
 * Função utilitária para usar dados fallback em caso de falha na API
 */
export function useFallbackData<T>(
  apiCall: Promise<T>, 
  fallbackData: T
): Promise<T> {
  return apiCall.catch(error => {
    console.error('API error, using fallback data:', error);
    return fallbackData;
  });
}

export default api;