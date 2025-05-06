# FURIA Chat - Plataforma de Interação para Fãs

Uma plataforma de chat interativa para fãs da FURIA CS2, permitindo acompanhamento em tempo real, interações sociais e gamificação.

## 🚀 Funcionalidades

- Chat em tempo real para interação entre fãs
- Acompanhamento de partidas ao vivo
- Sistema de gamificação para engajamento
- Integração com IA para respostas personalizadas
- FURIBOT alimentado pela API do ChatGPT para responder perguntas sobre o time
- Enquetes e votações durante as partidas
- Rankings de fãs
- Notificações de eventos importantes

## 🛠️ Tecnologias Utilizadas

### Frontend
- React com TypeScript
- Tailwind CSS para estilização
- Socket.IO para comunicação em tempo real
- Framer Motion para animações
- Axios para requisições HTTP

### Backend
- Node.js com Express
- Socket.IO para comunicação em tempo real
- OpenAI API para o assistente inteligente FURIBOT
- Dados mockados (sem necessidade de banco de dados)
- JWT para autenticação

## 📦 Instalação

```bash
# Instalar todas as dependências
npm run install:all

# Iniciar o projeto (frontend e backend)
npm start
```

### Modo de Desenvolvimento com Dados Mockados

Este projeto agora utiliza dados mockados para desenvolvimento, eliminando a necessidade de configurar um banco de dados MongoDB. Todos os dados são armazenados em memória durante a execução da aplicação.

## 🔧 Configuração

1. Clone o repositório
2. Configure as variáveis de ambiente no arquivo `.env` (opcional para desenvolvimento local)
3. Instale as dependências com `npm run install:all`
4. Inicie os serviços com `npm start`

## 📝 Documentação

A documentação completa está disponível na pasta `docs/` do projeto e inclui:

- [Arquitetura](./docs/architecture.md): Visão geral da arquitetura do sistema
- [API](./docs/api.md): Documentação completa da API
- [Componentes](./docs/components.md): Detalhes dos componentes de frontend
- [Fluxos de Usuário](./docs/user-flows.md): Diagramas de fluxo de usuário
- [Contribuição](./docs/contributing.md): Como contribuir para o projeto
- [Deployment](./docs/deployment.md): Instruções para deploy em produção

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o arquivo [docs/contributing.md](./docs/contributing.md) para detalhes sobre nosso código de conduta e processo de submissão de pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Atualizações Recentes

### FURIBOT Aprimorado
O FURIBOT foi melhorado com um sistema expansivo de respostas que não depende de APIs externas. O sistema agora possui:

- Respostas para perguntas sobre jogadores individuais
- Informações sobre times adversários
- Conhecimento sobre múltiplos jogos (CS2, Valorant, Apex, LoL)
- Detecção de tópicos mais precisa
- Sistema de fallback robusto

Para ver detalhes completos, confira o [CHANGELOG.md](./CHANGELOG.md). 