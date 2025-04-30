# Guia de Deployment

Este documento fornece instruções detalhadas para realizar o deployment do FURIA Chat em diferentes ambientes.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Acesso a um servidor ou plataforma de hospedagem

## Opções de Deployment

### 1. Deployment Local

Para testes ou desenvolvimento, você pode executar a aplicação localmente:

```bash
# Instale todas as dependências
npm run install:all

# Construa o frontend e backend
npm run build

# Inicie a aplicação
npm start
```

### 2. Deployment em Servidor VPS

#### Preparação do Servidor

1. Configure um servidor Ubuntu/Debian:

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale o Node.js e npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Verifique a instalação
node -v
npm -v
```

2. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/furia-chat.git
cd furia-chat
```

3. Instale as dependências e construa a aplicação:

```bash
npm run install:all
npm run build
```

#### Usando PM2 para Gerenciamento de Processos

1. Instale o PM2:

```bash
sudo npm install -g pm2
```

2. Inicie a aplicação com PM2:

```bash
pm2 start backend/dist/index.js --name "furia-chat-backend"
```

3. Configure o PM2 para iniciar automaticamente após reinicialização:

```bash
pm2 startup
pm2 save
```

#### Configurando o Nginx como Proxy Reverso

1. Instale o Nginx:

```bash
sudo apt install -y nginx
```

2. Crie uma configuração para o FURIA Chat:

```bash
sudo nano /etc/nginx/sites-available/furia-chat
```

3. Adicione a seguinte configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Ative a configuração e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/furia-chat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Deployment com Docker

#### Criando os Containers Docker

1. Crie um arquivo `Dockerfile` na raiz do projeto:

```Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm run install:all

COPY . .

RUN npm run build

EXPOSE 5002

CMD ["npm", "start"]
```

2. Crie um arquivo `docker-compose.yml`:

```yaml
version: '3'

services:
  furia-chat:
    build: .
    ports:
      - "5002:5002"
    restart: always
```

3. Construa e inicie os containers:

```bash
docker-compose up -d
```

### 4. Deployment em Plataformas de Nuvem

#### Heroku

1. Instale o Heroku CLI:

```bash
npm install -g heroku
```

2. Faça login e crie uma aplicação Heroku:

```bash
heroku login
heroku create furia-chat-app
```

3. Configure o `Procfile` na raiz do projeto:

```
web: npm start
```

4. Faça o deployment:

```bash
git push heroku main
```

#### Vercel

1. Instale o Vercel CLI:

```bash
npm install -g vercel
```

2. Configure o arquivo `vercel.json` na raiz do projeto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "backend/dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

3. Faça o deployment:

```bash
vercel
```

## Configuração de Variáveis de Ambiente

Para produção, configure as seguintes variáveis de ambiente:

### Variáveis de Backend

- `PORT`: Porta em que o servidor será executado (padrão: 5002)
- `NODE_ENV`: Ambiente (production, development)

### Variáveis de Frontend

- `VITE_API_URL`: URL da API do backend
- `VITE_SOCKET_URL`: URL do socket do backend
- `VITE_OPENAI_API_KEY`: Chave da API do OpenAI para o FURIBOT

### Proteção da Chave da API OpenAI

Em ambiente de produção, é fundamental proteger a chave da API do OpenAI. Recomendamos:

1. Nunca armazenar a chave diretamente no código-fonte
2. Utilizar variáveis de ambiente através do arquivo `.env` local durante o desenvolvimento
3. Configurar a chave como variável de ambiente segura na plataforma de hospedagem
4. Implementar um proxy no backend para fazer as requisições à API do OpenAI, evitando exposição da chave no frontend

Exemplo de configuração segura:

```javascript
// No arquivo .env (não comitar este arquivo no Git)
VITE_OPENAI_API_KEY=sk-seu-valor-secreto

// No código do serviço
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
```

## Configuração SSL/TLS

Para habilitar HTTPS, obtenha um certificado usando Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## Monitoramento e Logs

### Monitoramento com PM2

```bash
# Ver logs em tempo real
pm2 logs

# Visualizar status da aplicação
pm2 status

# Ver estatísticas detalhadas
pm2 monit
```

### Logs do Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Backup e Restauração

Para produção com banco de dados real, configure backups regulares:

```bash
# Exemplo para MongoDB
mongodump --uri="mongodb://localhost:27017/furia-chat" --out=/backup/furia-chat-$(date +%F)

# Restaurar backup
mongorestore --uri="mongodb://localhost:27017/furia-chat" /backup/furia-chat-2023-05-01
```

## Troubleshooting

### Problemas Comuns

- **Erro de conexão WebSocket**: Verifique a configuração do Nginx para suporte a WebSockets
- **Erro 502 Bad Gateway**: Verifique se o servidor backend está em execução
- **Problemas de CORS**: Verifique as configurações de CORS no backend

### Problemas com o FURIBOT

Se o FURIBOT não estiver respondendo:

1. **Verifique a chave da API**: Certifique-se de que a chave da API do OpenAI esteja corretamente configurada no arquivo `.env` do backend.

2. **Reinicie os serviços**: Após configurar a chave da API, reinicie tanto o frontend quanto o backend:
   ```bash
   # No terminal do backend
   npm run dev
   
   # Em outro terminal, para o frontend
   cd ../frontend
   npm run dev
   ```

3. **Verifique os logs do servidor**: Os logs do backend podem mostrar erros específicos da API do OpenAI.

4. **Alternativa de proxy**: Se ainda houver problemas, considere usar um serviço proxy como o [Cloudflare Workers](https://developers.cloudflare.com/workers/) para intermediar as chamadas à API do OpenAI. 