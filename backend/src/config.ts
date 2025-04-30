import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../.env') });

// Interface para tipagem das configurações
interface Config {
  port: string;
  nodeEnv: string;
  openaiApiKey: string;
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

// Configurações da aplicação
export const config: Config = {
  port: process.env.PORT || '5002',
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || ''
}; 