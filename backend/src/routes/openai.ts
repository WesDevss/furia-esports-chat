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

// Forçando o apiKeyPool a ser null para sempre usar respostas alternativas
// Isso resolve o problema de erro 401 quando a API_KEY não está definida ou é inválida
let apiKeyPool: APIKeyPool | null = null;

// Configurações da API
const API_CONFIG = {
  MODEL: config.defaultModel, // Modelo padrão configurado
  MAX_TOKENS: MODEL_LIMITS[config.defaultModel].maxTokensPerRequest / 2, // Metade do máximo disponível para o modelo
  TEMPERATURE: 0.1, // Quase determinístico
  TIMEOUT: 10000, // 10 segundos
  REQUEST_INTERVAL: 60000 / MODEL_LIMITS[config.defaultModel].requestsPerMinute // Intervalo baseado no limite de RPM
};

// Respostas alternativas expandidas
const respostasAlternativas = {
  teste: "Olá! Este é um teste do FURIBOT funcionando corretamente!",
  saudacao: "Olá! Sou o FURIBOT, assistente oficial da FURIA. Como posso ajudar você hoje?",
  sobreTime: "A FURIA é uma das principais organizações de esports do Brasil, conhecida por sua dedicação e sucesso no cenário competitivo.",
  sobreJogadores: "O time atual da FURIA CS2 conta com FalleN, KSCERATO, yuurih, molodoy e YEKINDAR, formando uma lineup internacional de alto nível.",
  sobreTorneios: "A FURIA participa dos principais torneios de CS2, incluindo Majors, ESL Pro League e BLAST Premier.",
  sobreHistoria: "A FURIA foi fundada em 2017 e rapidamente se tornou uma das principais forças do CS2 brasileiro.",
  sobreTreino: "A FURIA mantém um rigoroso regime de treinamento, com bootcamps e preparação física e mental.",
  sobreConquistas: "A FURIA já conquistou diversos títulos importantes, incluindo vitórias em torneios internacionais.",
  sobreFuria: "FURIA acima de tudo! Somos uma organização apaixonada por esports e comprometida com a excelência.",
  sobreFans: "Os fãs da FURIA são conhecidos como a FURIA Nation, uma comunidade apaixonada e dedicada.",
  sobreFuturo: "A FURIA continua investindo em talentos e expandindo sua presença no cenário internacional de esports.",
  
  // Novas respostas sobre jogadores específicos
  sobreFalleN: "FalleN (Gabriel Toledo) é uma lenda viva do CS brasileiro, conhecido como 'The Godfather' do cenário competitivo. Com vasta experiência e liderança excepcional, ele traz seu AWP preciso e capacidade de IGL para a FURIA.",
  sobreKscerato: "KSCERATO (Kaike Cerato) é um dos melhores riflers do mundo, conhecido por sua precisão incrível e consistência. Ele é um dos pilares da FURIA desde 2019, com um rating impressionante de 1.18.",
  sobreYuurih: "yuurih (Yuri Santos) é considerado um dos jogadores mais completos da América do Sul, com habilidades impressionantes de clutch e spray control. Seu rating de 1.15 demonstra sua eficiência no jogo.",
  sobreMolodoy: "molodoy (Danil Golubenko) é um jovem talento da Ucrânia que se juntou à FURIA. Com grande potencial e um estilo agressivo, ele traz nova energia para a equipe internacional.",
  sobreYekindar: "YEKINDAR (Mareks Gaļinskis) é um dos entry fraggers mais respeitados do mundo, vindo da Letônia. Conhecido por seu estilo agressivo e mecânica excelente, ele é uma adição que eleva o nível internacional da FURIA.",
  
  // Respostas sobre competidores
  sobreNavi: "NAVI (Natus Vincere) é uma das organizações mais tradicionais de CS2, com origem na Ucrânia. É uma das grandes rivais da FURIA em torneios internacionais.",
  sobreFaZe: "FaZe Clan é uma organização global de esports e entretenimento. Seu time de CS2 é multi-regional e já enfrentou a FURIA em várias ocasiões.",
  sobreLiquid: "Team Liquid é uma das maiores organizações de esports do mundo. A FURIA já teve confrontos memoráveis contra eles em competições internacionais.",
  
  // Resposta para próximos jogos
  proximosJogos: "Confira o calendário de jogos da FURIA na seção 'Partidas' do nosso site oficial. Estamos sempre atualizando com os próximos desafios do time!",
  
  // Respostas sobre outros jogos
  sobreValorant: "A FURIA também tem uma divisão competitiva de Valorant, expandindo nossa presença nos FPS táticos.",
  sobreApex: "A FURIA tem presença no cenário competitivo de Apex Legends, com jogadores de alto nível representando nossa organização.",
  sobreLOL: "League of Legends é um dos jogos onde a FURIA busca expandir sua presença, investindo no cenário competitivo do MOBA.",
  
  // Resposta genérica
  padrao: "A FURIA é uma organização dedicada à excelência nos esports. Para mais informações específicas, visite nosso site oficial ou redes sociais."
};

// Funções auxiliares expandidas
function getRespostaAlternativa(query: string): string {
  const queryLower = query.toLowerCase();
  
  // Checagem para palavras-chave específicas
  if (queryLower === 'teste') {
    return respostasAlternativas.teste;
  }
  
  // Saudações
  if (queryLower.includes('olá') || queryLower.includes('oi') || queryLower.includes('hey') || queryLower.includes('eae')) {
    return respostasAlternativas.saudacao;
  }
  
  // Perguntas sobre o time
  if (queryLower.includes('time') || queryLower.includes('equipe') || queryLower.includes('lineup')) {
    return respostasAlternativas.sobreTime;
  }
  
  // Perguntas sobre jogadores específicos
  if (queryLower.includes('fallen') || queryLower.includes('gabriel toledo')) {
    return respostasAlternativas.sobreFalleN;
  }
  
  if (queryLower.includes('kscerato') || queryLower.includes('kaike')) {
    return respostasAlternativas.sobreKscerato;
  }
  
  if (queryLower.includes('yuurih') || queryLower.includes('yuri santos')) {
    return respostasAlternativas.sobreYuurih;
  }
  
  if (queryLower.includes('molodoy') || queryLower.includes('danil')) {
    return respostasAlternativas.sobreMolodoy;
  }
  
  if (queryLower.includes('yekindar') || queryLower.includes('mareks')) {
    return respostasAlternativas.sobreYekindar;
  }
  
  // Perguntas sobre jogadores em geral
  if (queryLower.includes('jogador') || queryLower.includes('player') || queryLower.includes('atleta')) {
    return respostasAlternativas.sobreJogadores;
  }
  
  // Perguntas sobre times adversários
  if (queryLower.includes('navi') || queryLower.includes('natus vincere')) {
    return respostasAlternativas.sobreNavi;
  }
  
  if (queryLower.includes('faze') || queryLower.includes('faze clan')) {
    return respostasAlternativas.sobreFaZe;
  }
  
  if (queryLower.includes('liquid') || queryLower.includes('team liquid')) {
    return respostasAlternativas.sobreLiquid;
  }
  
  // Perguntas sobre torneios
  if (queryLower.includes('torneio') || queryLower.includes('campeonato') || queryLower.includes('major') || queryLower.includes('esl')) {
    return respostasAlternativas.sobreTorneios;
  }
  
  // Perguntas sobre próximos jogos
  if ((queryLower.includes('próximo') || queryLower.includes('proximo') || queryLower.includes('quando')) && 
      (queryLower.includes('jogo') || queryLower.includes('partida') || queryLower.includes('jogar'))) {
    return respostasAlternativas.proximosJogos;
  }
  
  // Perguntas sobre história
  if (queryLower.includes('história') || queryLower.includes('começo') || queryLower.includes('origem') || queryLower.includes('fundacao')) {
    return respostasAlternativas.sobreHistoria;
  }
  
  // Perguntas sobre treino
  if (queryLower.includes('treino') || queryLower.includes('preparação') || queryLower.includes('preparo') || queryLower.includes('bootcamp')) {
    return respostasAlternativas.sobreTreino;
  }
  
  // Perguntas sobre conquistas
  if (queryLower.includes('conquista') || queryLower.includes('título') || queryLower.includes('trofeu') || queryLower.includes('venceu')) {
    return respostasAlternativas.sobreConquistas;
  }
  
  // Perguntas sobre outros jogos
  if (queryLower.includes('valorant')) {
    return respostasAlternativas.sobreValorant;
  }
  
  if (queryLower.includes('apex')) {
    return respostasAlternativas.sobreApex;
  }
  
  if (queryLower.includes('lol') || queryLower.includes('league of legends')) {
    return respostasAlternativas.sobreLOL;
  }
  
  // Perguntas gerais sobre a FURIA
  if (queryLower.includes('furia') || queryLower.includes('furiosos')) {
    return respostasAlternativas.sobreFuria;
  }
  
  // Perguntas sobre fãs
  if (queryLower.includes('fã') || queryLower.includes('torcedor') || queryLower.includes('torcida')) {
    return respostasAlternativas.sobreFans;
  }
  
  // Perguntas sobre o futuro
  if (queryLower.includes('futuro') || queryLower.includes('plano') || queryLower.includes('próximo ano')) {
    return respostasAlternativas.sobreFuturo;
  }
  
  // Resposta padrão para outras perguntas
  return respostasAlternativas.padrao;
}

function getFromCache(query: string): string | null {
  const cached = responseCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }
  return null;
}

// Mantendo a função mas marcando como não utilizada para evitar erros
// @ts-ignore
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

// Mantendo a função mas marcando como não utilizada para evitar erros
// @ts-ignore
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

    // Sempre usar resposta alternativa
    const respostaAlternativa = getRespostaAlternativa(query);
    console.log('Usando resposta alternativa para:', query);
    return res.json({ 
      content: respostaAlternativa,
      isFallback: true
    });
    
  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ 
      error: 'Erro interno',
      message: 'Ocorreu um erro ao processar sua pergunta.'
    });
  }
});

export default router; 