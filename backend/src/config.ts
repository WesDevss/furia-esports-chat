import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define tipos para os modelos disponíveis
export type OpenAIModelType = 
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-3.5-turbo';

// Define os limites para cada modelo
export const MODEL_LIMITS: Record<OpenAIModelType, {
  tokensPerMinute: number;
  requestsPerMinute: number;
  requestsPerDay: number;
  maxTokensPerRequest: number;
}> = {
  'gpt-4.1': {
    tokensPerMinute: 10000,
    requestsPerMinute: 3,
    requestsPerDay: 200,
    maxTokensPerRequest: 4000
  },
  'gpt-4.1-mini': {
    tokensPerMinute: 60000,
    requestsPerMinute: 3,
    requestsPerDay: 200,
    maxTokensPerRequest: 4000
  },
  'gpt-4.1-nano': {
    tokensPerMinute: 60000,
    requestsPerMinute: 3,
    requestsPerDay: 200,
    maxTokensPerRequest: 4000
  },
  'gpt-4o': {
    tokensPerMinute: 10000,
    requestsPerMinute: 3,
    requestsPerDay: 200,
    maxTokensPerRequest: 4000
  },
  'gpt-4o-mini': {
    tokensPerMinute: 60000,
    requestsPerMinute: 3,
    requestsPerDay: 200,
    maxTokensPerRequest: 4000
  },
  'gpt-3.5-turbo': {
    tokensPerMinute: 60000,
    requestsPerMinute: 3,
    requestsPerDay: 200,
    maxTokensPerRequest: 4000
  }
};

// Interface para tipagem das configurações
interface Config {
  port: string;
  nodeEnv: string;
  openaiApiKey: string;
  defaultModel: OpenAIModelType;
  apiRateLimit: {
    requestsPerMinute: number;
    maxRetries: number;
    retryDelay: number;
  };
}

// Função para validar configurações críticas
export function validateConfig() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️ OPENAI_API_KEY não está configurada!');
    console.error('Por favor, crie um arquivo .env na pasta backend com suas configurações.');
    console.error('Você pode usar o arquivo .env.example como base.');
    process.exit(1);
  }
}

// Define o modelo padrão a ser usado
const defaultModel: OpenAIModelType = (process.env.OPENAI_MODEL as OpenAIModelType) || 'gpt-4o-mini';

// Configurações da aplicação
export const config: Config = {
  port: process.env.PORT || '5002',
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  defaultModel,
  apiRateLimit: {
    // Usamos os limites do modelo padrão escolhido
    requestsPerMinute: MODEL_LIMITS[defaultModel].requestsPerMinute,
    maxRetries: 3,
    retryDelay: 1000
  }
}; 