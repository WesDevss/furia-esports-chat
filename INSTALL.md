# Instruções de Instalação e Execução

Este documento fornece instruções detalhadas para configurar e executar o projeto FURIA Chat.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Git

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/furia-chat.git
cd furia-chat
```

2. Instale todas as dependências:
```bash
npm run install:all
```
Este comando instalará as dependências do projeto raiz, do frontend e do backend.

3. Configure as variáveis de ambiente (opcional para desenvolvimento local):

Para o frontend, crie um arquivo `.env` na pasta `frontend` com o seguinte conteúdo:
```
VITE_API_URL=http://localhost:5002
VITE_SOCKET_URL=http://localhost:5002
VITE_APP_NAME=FURIA Chat
```

Para o backend, crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:
```
PORT=5002
NODE_ENV=development
OPENAI_API_KEY=sua-chave-api-aqui
```

**Nota sobre a API do ChatGPT**: O FURIBOT utiliza a API do ChatGPT para fornecer respostas inteligentes sobre o time FURIA. Para utilizar essa funcionalidade, você precisará:

1. Obter uma chave da API do OpenAI em https://platform.openai.com
2. Adicionar a chave no arquivo `.env` do backend conforme mostrado acima
3. Se não desejar usar a API do ChatGPT, o FURIBOT funcionará com respostas predefinidas

## Executando o Projeto

1. Inicie o projeto completo:
```bash
npm start
```
Este comando iniciará tanto o backend quanto o frontend.

2. Ou inicie os serviços separadamente:

Para o backend:
```bash
cd backend
npm run dev
```

Para o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse a aplicação:
- Frontend: http://localhost:3000 (ou a porta indicada pelo Vite)
- Backend API: http://localhost:5002

## Modo de Desenvolvimento com Dados Mockados

Este projeto utiliza dados mockados para desenvolvimento, eliminando a necessidade de configurar um banco de dados MongoDB. Todas as informações são armazenadas em memória durante a execução da aplicação, o que simplifica significativamente o processo de configuração.

Os dados mockados incluem:
- Usuários
- Mensagens
- Partidas

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
│   │   ├── routes/
│   │   └── types/
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
npm run dev       # Inicia o servidor em modo desenvolvimento
npm run build    # Compila o TypeScript
npm run start    # Inicia o servidor em produção
```

### Frontend
```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build    # Cria a versão de produção
npm run serve    # Visualiza a versão de produção localmente
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