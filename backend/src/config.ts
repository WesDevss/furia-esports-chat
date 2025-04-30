import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis do arquivo .env
const envPath = path.resolve(__dirname, '../.env');
console.log('Tentando carregar .env de:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Erro ao carregar .env:', result.error);
} else {
  console.log('Arquivo .env carregado com sucesso');
}

// Log das variáveis de ambiente para debug
console.log('Variáveis de ambiente carregadas:', {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  hasOpenaiKey: !!process.env.OPENAI_API_KEY
});

// Configurações da aplicação
export const config = {
  port: process.env.PORT || 5002,
  openaiApiKey: process.env.OPENAI_API_KEY,
  environment: process.env.NODE_ENV || 'development',
};

// Função para verificar configurações críticas
export const validateConfig = () => {
  const missingVars = [];
  
  if (!config.openaiApiKey) {
    missingVars.push('OPENAI_API_KEY');
  }
  
  if (missingVars.length > 0) {
    console.error(`ERRO: As seguintes variáveis de ambiente não estão configuradas: ${missingVars.join(', ')}`);
    console.error('Caminho do .env:', envPath);
    console.error('Conteúdo atual das configurações:', config);
  } else {
    console.log('Todas as variáveis de ambiente estão configuradas corretamente');
  }
}; 