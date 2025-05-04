# Backend da Aplicação FURIA Chat

## Configuração do Ambiente

Para configurar o ambiente de desenvolvimento, você precisa criar um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis:

```
PORT=5002
NODE_ENV=development
OPENAI_API_KEY=sua-chave-api-aqui
OPENAI_MODEL=gpt-4o-mini
```

### Considerações de Segurança

**IMPORTANTE**: Nunca faça commit de arquivos `.env` ou qualquer arquivo contendo chaves de API reais para o repositório. Esses arquivos já estão incluídos no `.gitignore`.

#### Obtendo uma Chave da API OpenAI

1. Crie uma conta na [OpenAI](https://platform.openai.com)
2. Navegue até a seção de API Keys
3. Crie uma nova chave de API
4. Substitua `sua-chave-api-aqui` pela chave real no seu arquivo `.env` local

#### Seleção de Modelo

O sistema está configurado para usar o modelo `gpt-4o-mini` por padrão, que oferece um bom equilíbrio entre performance e limites de requisição. Você pode modificar esta configuração alterando a variável `OPENAI_MODEL`.

Modelos suportados:
- `gpt-4.1`
- `gpt-4.1-mini`
- `gpt-4.1-nano`
- `gpt-4o`
- `gpt-4o-mini`
- `gpt-3.5-turbo`

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para construir e iniciar o servidor em modo de produção:

```bash
npm run build
npm start
``` 