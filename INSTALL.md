# Instruções de Instalação e Execução

Este documento fornece instruções detalhadas para configurar e executar o projeto FURIA Chat.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes do Node.js)
- MongoDB (versão 4.4 ou superior)
- Git

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/furia-chat.git
cd furia-chat
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

4. Configure as variáveis de ambiente:

Para o backend, crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/furia-chat
JWT_SECRET=seu-segredo-jwt
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=sua-chave-api-openai
```

Para o frontend, crie um arquivo `.env` na pasta `frontend` com o seguinte conteúdo:
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=FURIA Chat
```

## Executando o Projeto

1. Inicie o MongoDB:
```bash
mongod
```

2. Inicie o servidor backend:
```bash
cd backend
npm run dev
```

3. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

4. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Estrutura do Projeto

```
furia-chat/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── backend/           # Servidor Node.js
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   └── dist/
└── docs/             # Documentação
```

## Funcionalidades Principais

- Chat em tempo real
- Acompanhamento de partidas ao vivo
- Sistema de gamificação
- Enquetes e votações
- Ranking de fãs
- Notificações em tempo real

## Desenvolvimento

Para desenvolvimento, você pode usar os seguintes comandos:

### Backend
```bash
npm run dev        # Inicia o servidor em modo desenvolvimento
npm run build     # Compila o TypeScript
npm run start     # Inicia o servidor em produção
```

### Frontend
```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build    # Cria a versão de produção
npm run preview  # Visualiza a versão de produção localmente
```

## Testes

Para executar os testes:

### Backend
```bash
npm run test
```

### Frontend
```bash
npm run test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma issue no GitHub.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 