# Alternativas de API para o FURIBOT

Este documento apresenta alternativas para integração de APIs de IA no FURIBOT, caso você queira usar respostas geradas dinamicamente em vez das respostas alternativas estáticas.

## Opções Recomendadas

### 1. OpenAI API (Atual)
- **Modelo recomendado**: `gpt-3.5-turbo`
- **Custo**: Pago, baseado em tokens
- **Documentação**: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)
- **Vantagens**: Alta qualidade de respostas, fácil integração
- **Desvantagens**: Custo, dependência de serviço externo

Para configurar, crie um arquivo `.env` na pasta `backend`:
```
PORT=5002
NODE_ENV=development
OPENAI_API_KEY=sua-chave-da-openai-aqui
OPENAI_MODEL=gpt-3.5-turbo
```

### 2. HuggingFace Inference API
- **Modelo recomendado**: `mistralai/Mistral-7B-Instruct-v0.2`
- **Custo**: Versão gratuita disponível
- **Documentação**: [https://huggingface.co/docs/api-inference/index](https://huggingface.co/docs/api-inference/index)
- **Vantagens**: Modelos gratuitos, diversos modelos disponíveis
- **Desvantagens**: Respostas podem ser menos refinadas que GPT

Implementação:
```javascript
// Instalar: npm install @huggingface/inference
import { HfInference } from '@huggingface/inference';

const hf = new HfInference('seu_token_aqui'); // Token gratuito disponível

async function getHuggingFaceResponse(query) {
  try {
    const result = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: `<s>[INST] ${query} [/INST]`,
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7
      }
    });
    return result.generated_text;
  } catch (error) {
    console.error('Erro HuggingFace:', error);
    return null;
  }
}
```

### 3. Google AI (Gemini API)
- **Modelo recomendado**: `gemini-pro`
- **Custo**: Créditos gratuitos para começar
- **Documentação**: [https://ai.google.dev/](https://ai.google.dev/)
- **Vantagens**: Alto desempenho, boa relação custo-benefício
- **Desvantagens**: API mais recente, menos recursos de comunidade

Implementação:
```javascript
// Instalar: npm install @google/generative-ai
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('SUA_API_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function getGeminiResponse(query) {
  try {
    const result = await model.generateContent(query);
    return result.response.text();
  } catch (error) {
    console.error('Erro Gemini:', error);
    return null;
  }
}
```

### 4. Ollama (Local)
- **Modelo recomendado**: `llama3`
- **Custo**: Gratuito (execução local)
- **Documentação**: [https://ollama.ai/](https://ollama.ai/)
- **Vantagens**: Privacidade, sem custos de API, sem conexão internet necessária
- **Desvantagens**: Requer hardware decente, menos performático que serviços em nuvem

Implementação:
```javascript
// Instalar: npm install axios
const axios = require('axios');

async function getOllamaResponse(query) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt: query,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error('Erro Ollama:', error);
    return null;
  }
}
```

## Como Integrar uma Nova API

Para integrar uma das APIs acima:

1. Instale as dependências necessárias
2. Crie um novo arquivo na pasta `backend/src/services/` (ex: `gemini.ts`)
3. Implemente a função de consulta conforme exemplo
4. Modifique `backend/src/routes/openai.ts` para usar sua nova implementação
5. Atualize o arquivo `.env` com as chaves da API necessárias

## Considerações para Produção

- Implemente cache para reduzir chamadas de API
- Configure limites de taxa (rate limiting) para evitar custos inesperados
- Considere usar um sistema de fallback para alternar entre APIs em caso de falhas
- Monitore o uso e os custos regularmente 