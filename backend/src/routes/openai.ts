import express from 'express';
import axios from 'axios';
import { config, MODEL_LIMITS, OpenAIModelType } from '../config';

const router = express.Router();

// Cache para respostas
const responseCache = new Map<string, { response: string, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Contador diário de requisições
class DailyRequestCounter {
  private requestCount: number = 0;
  private lastResetDay: number = new Date().getUTCDate();

  incrementAndCheck(model: OpenAIModelType): boolean {
    // Verifica se precisa resetar o contador (novo dia UTC)
    const currentDay = new Date().getUTCDate();
    if (currentDay !== this.lastResetDay) {
      this.requestCount = 0;
      this.lastResetDay = currentDay;
    }

    // Incrementa e verifica se excedeu o limite diário
    this.requestCount++;
    const dailyLimit = MODEL_LIMITS[model].requestsPerDay;
    
    if (this.requestCount > dailyLimit) {
      console.warn(`Limite diário de requisições excedido para o modelo ${model}: ${this.requestCount}/${dailyLimit}`);
      return false;
    }
    
    return true;
  }

  getCount(): number {
    return this.requestCount;
  }
}

const dailyCounter = new DailyRequestCounter();

// Implementação de token bucket para rate limiting
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private maxTokens: number;
  private refillRate: number; // tokens por segundo

  constructor(maxTokens: number, refillRate: number) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  async getToken(): Promise<boolean> {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    
    // Se não há tokens, espera um pouco e tenta novamente
    const timeToWait = (1 / this.refillRate) * 1000;
    console.log(`Sem tokens disponíveis. Aguardando ${timeToWait}ms para refill...`);
    await new Promise(resolve => setTimeout(resolve, timeToWait));
    return this.getToken();
  }

  private refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000; // em segundos
    const tokensToAdd = timePassed * this.refillRate;
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
}

// Cria rate limiters para cada modelo
const rateLimiters: Record<OpenAIModelType, RateLimiter> = {
  'gpt-4.1': new RateLimiter(MODEL_LIMITS['gpt-4.1'].requestsPerMinute, MODEL_LIMITS['gpt-4.1'].requestsPerMinute / 60),
  'gpt-4.1-mini': new RateLimiter(MODEL_LIMITS['gpt-4.1-mini'].requestsPerMinute, MODEL_LIMITS['gpt-4.1-mini'].requestsPerMinute / 60),
  'gpt-4.1-nano': new RateLimiter(MODEL_LIMITS['gpt-4.1-nano'].requestsPerMinute, MODEL_LIMITS['gpt-4.1-nano'].requestsPerMinute / 60),
  'gpt-4o': new RateLimiter(MODEL_LIMITS['gpt-4o'].requestsPerMinute, MODEL_LIMITS['gpt-4o'].requestsPerMinute / 60),
  'gpt-4o-mini': new RateLimiter(MODEL_LIMITS['gpt-4o-mini'].requestsPerMinute, MODEL_LIMITS['gpt-4o-mini'].requestsPerMinute / 60),
  'gpt-3.5-turbo': new RateLimiter(MODEL_LIMITS['gpt-3.5-turbo'].requestsPerMinute, MODEL_LIMITS['gpt-3.5-turbo'].requestsPerMinute / 60)
};

// Sistema de pool de chaves de API
class APIKeyPool {
  private keys: Array<{
    key: string;
    lastUsed: number;
    failureCount: number;
  }>;
  private cooldownPeriod = 60000; // 1 minuto de cooldown
  private maxFailures = 3; // Número máximo de falhas antes de colocar a chave em cooldown

  constructor(apiKeys: string[]) {
    this.keys = apiKeys.map(key => ({
      key,
      lastUsed: 0,
      failureCount: 0
    }));
  }

  async getAvailableKey(): Promise<string | null> {
    const now = Date.now();
    
    // Encontra uma chave disponível
    const availableKey = this.keys.find(k => 
      now - k.lastUsed >= this.cooldownPeriod && k.failureCount < this.maxFailures
    );

    if (availableKey) {
      availableKey.lastUsed = now;
      return availableKey.key;
    }

    // Se não houver chave disponível, espera e tenta novamente
    await new Promise(resolve => setTimeout(resolve, 5000));
    return this.getAvailableKey();
  }

  markFailure(key: string) {
    const keyEntry = this.keys.find(k => k.key === key);
    if (keyEntry) {
      keyEntry.failureCount++;
      keyEntry.lastUsed = Date.now();
    }
  }

  markSuccess(key: string) {
    const keyEntry = this.keys.find(k => k.key === key);
    if (keyEntry) {
      keyEntry.failureCount = 0;
    }
  }
}

// Verifica se a chave da API existe
let apiKeyPool: APIKeyPool | null;
if (!config.openaiApiKey) {
  console.warn('OpenAI API key não configurada. Usando apenas respostas alternativas.');
  apiKeyPool = null;
} else {
  // Inicializa o pool de chaves
  apiKeyPool = new APIKeyPool([config.openaiApiKey]);
}

// Configurações da API
const API_CONFIG = {
  MODEL: config.defaultModel, // Modelo padrão configurado
  MAX_TOKENS: MODEL_LIMITS[config.defaultModel].maxTokensPerRequest / 2, // Metade do máximo disponível para o modelo
  TEMPERATURE: 0.1, // Quase determinístico
  TIMEOUT: 10000, // 10 segundos
  REQUEST_INTERVAL: 60000 / MODEL_LIMITS[config.defaultModel].requestsPerMinute // Intervalo baseado no limite de RPM
};

// Respostas alternativas
const respostasAlternativas = {
  saudacao: "Olá! Sou o FURIBOT, assistente oficial da FURIA. Como posso ajudar você hoje?",
  sobreTime: "A FURIA é uma das principais organizações de esports do Brasil, conhecida por sua dedicação e sucesso no cenário competitivo.",
  sobreJogadores: "O time atual da FURIA conta com grandes nomes do CS2, incluindo KSCERATO, yuurih, arT, drop e VINI.",
  sobreTorneios: "A FURIA participa dos principais torneios de CS2, incluindo Majors, ESL Pro League e BLAST Premier.",
  sobreHistoria: "A FURIA foi fundada em 2017 e rapidamente se tornou uma das principais forças do CS2 brasileiro.",
  sobreTreino: "A FURIA mantém um rigoroso regime de treinamento, com bootcamps e preparação física e mental.",
  sobreConquistas: "A FURIA já conquistou diversos títulos importantes, incluindo vitórias em torneios internacionais.",
  sobreFuria: "FURIA acima de tudo! Somos uma organização apaixonada por esports e comprometida com a excelência.",
  sobreFans: "Os fãs da FURIA são conhecidos como a FURIA Nation, uma comunidade apaixonada e dedicada.",
  sobreFuturo: "A FURIA continua investindo em talentos e expandindo sua presença no cenário internacional de esports."
};

// Funções auxiliares
function getRespostaAlternativa(query: string): string {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('olá') || queryLower.includes('oi') || queryLower.includes('hey')) {
    return respostasAlternativas.saudacao;
  }
  if (queryLower.includes('time') || queryLower.includes('equipe')) {
    return respostasAlternativas.sobreTime;
  }
  if (queryLower.includes('jogador') || queryLower.includes('player')) {
    return respostasAlternativas.sobreJogadores;
  }
  if (queryLower.includes('torneio') || queryLower.includes('campeonato')) {
    return respostasAlternativas.sobreTorneios;
  }
  if (queryLower.includes('história') || queryLower.includes('começo')) {
    return respostasAlternativas.sobreHistoria;
  }
  if (queryLower.includes('treino') || queryLower.includes('preparação')) {
    return respostasAlternativas.sobreTreino;
  }
  if (queryLower.includes('conquista') || queryLower.includes('título')) {
    return respostasAlternativas.sobreConquistas;
  }
  if (queryLower.includes('furia') || queryLower.includes('furiosos')) {
    return respostasAlternativas.sobreFuria;
  }
  if (queryLower.includes('fã') || queryLower.includes('torcedor')) {
    return respostasAlternativas.sobreFans;
  }
  
  return respostasAlternativas.sobreFuturo;
}

function getFromCache(query: string): string | null {
  const cached = responseCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }
  return null;
}

function saveToCache(query: string, response: string) {
  responseCache.set(query, {
    response,
    timestamp: Date.now()
  });
}

let lastRequestTime = 0;

// Função para fazer requisição à API
async function makeOpenAIRequest(query: string): Promise<string> {
  const model = config.defaultModel;

  // Verifica o limite diário de requisições
  if (!dailyCounter.incrementAndCheck(model)) {
    throw new Error(`Limite diário de requisições excedido para o modelo ${model}`);
  }

  // Garante o intervalo mínimo entre requisições
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < API_CONFIG.REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, API_CONFIG.REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  // Obtém uma chave disponível do pool
  if (!apiKeyPool) {
    throw new Error('API Key Pool não inicializado');
  }
  
  const apiKey = await apiKeyPool.getAvailableKey();
  if (!apiKey) {
    throw new Error('Nenhuma chave de API disponível');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: `Você é o FURIBOT. Responda em uma frase muito curta.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: API_CONFIG.MAX_TOKENS,
        temperature: API_CONFIG.TEMPERATURE,
        top_p: 0.1,
        frequency_penalty: 0.5,
        presence_penalty: 0.0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    lastRequestTime = Date.now();
    if (apiKeyPool) {
      apiKeyPool.markSuccess(apiKey);
    }
    return response.data.choices[0].message.content;
  } catch (error: any) {
    if (apiKeyPool) {
      apiKeyPool.markFailure(apiKey);
    }
    console.error('Erro na requisição:', error.message);
    throw error;
  }
}

// Função para fazer requisição à API com rate limiting e retry
async function makeOpenAIRequestWithRetry(query: string, maxRetries = config.apiRateLimit.maxRetries): Promise<string> {
  let lastError;
  const model = config.defaultModel;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Obtém um token do rate limiter antes de fazer a requisição
      await rateLimiters[model].getToken();
      
      return await makeOpenAIRequest(query);
    } catch (error: any) {
      lastError = error;
      
      // Se for um erro 429 (Too Many Requests), tenta novamente com backoff exponencial
      if (error.response && error.response.status === 429) {
        const waitTime = Math.pow(2, attempt) * config.apiRateLimit.retryDelay;
        console.log(`Erro 429 (Too Many Requests). Tentativa ${attempt + 1}/${maxRetries}. Aguardando ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      } else {
        // Para outros tipos de erro, não tenta novamente
        throw error;
      }
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  throw lastError;
}

// Rota principal
router.post('/chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Consulta não fornecida' });
    }

    // Verificar cache primeiro
    const cachedResponse = getFromCache(query);
    if (cachedResponse) {
      console.log('Resposta retornada do cache');
      return res.json({ content: cachedResponse });
    }

    // Se não há API key configurada, usar diretamente resposta alternativa
    if (!apiKeyPool) {
      const respostaAlternativa = getRespostaAlternativa(query);
      return res.json({ 
        content: respostaAlternativa,
        isFallback: true
      });
    }

    try {
      // Usar a nova função com retry
      const response = await makeOpenAIRequestWithRetry(query);
      saveToCache(query, response);
      return res.json({ content: response });
    } catch (error: any) {
      console.error('Erro na API OpenAI:', error.message);
      
      // Se houver erro, usar resposta alternativa
      const respostaAlternativa = getRespostaAlternativa(query);
      return res.json({ 
        content: respostaAlternativa,
        isFallback: true
      });
    }
  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ 
      error: 'Erro interno',
      message: 'Ocorreu um erro ao processar sua pergunta.'
    });
  }
});

export default router; 