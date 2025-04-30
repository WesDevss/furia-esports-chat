import axios from 'axios';

// Definindo a URL da API do backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const getFuriaInformation = async (query: string): Promise<string> => {
  try {
    console.log('Enviando requisição para:', `${API_URL}/api/openai/chat`);
    // Usar o proxy no backend em vez de chamar diretamente a API do OpenAI
    const response = await axios.post(`${API_URL}/api/openai/chat`, {
      query
    });

    if (response.data.error) {
      console.error('Erro retornado pela API:', response.data.error);
      throw new Error(response.data.message || 'Erro ao processar a requisição');
    }

    return response.data.content;
  } catch (error) {
    console.error('Erro ao consultar OpenAI:', error);
    throw error;
  }
};

export default {
  getFuriaInformation
}; 