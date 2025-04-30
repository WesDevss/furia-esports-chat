# Arquitetura do FURIA Chat

## Visão Geral

O FURIA Chat é uma aplicação web de chat em tempo real que permite aos fãs da FURIA CS:GO interagir entre si e acompanhar partidas ao vivo. A arquitetura do sistema é dividida em frontend e backend, usando uma abordagem de comunicação baseada em eventos para garantir a experiência em tempo real.

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│   Cliente   │◄────►│  Servidor   │◄────►│   Dados     │
│  (React)    │      │  (Node.js)  │      │  (Memória)  │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
       ▲                    ▲
       │                    │
       │                    │
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│             │      │             │
│  Socket.IO  │◄────►│  Socket.IO  │
│   Cliente   │      │   Servidor  │
│             │      │             │
└─────────────┘      └─────────────┘
```

## Frontend

O frontend é construído com React e TypeScript, utilizando bibliotecas modernas para criar uma interface de usuário responsiva e interativa.

### Tecnologias Principais:

- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Socket.IO Client**: Biblioteca para comunicação em tempo real
- **Tailwind CSS**: Framework de CSS utilitário
- **Framer Motion**: Biblioteca de animações para React

### Estrutura de Diretórios:

```
frontend/
├── public/             # Arquivos estáticos
├── src/
│   ├── assets/         # Imagens e outros recursos
│   ├── components/     # Componentes reutilizáveis
│   │   └── ui/         # Componentes de UI básicos
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços e APIs
│   └── utils/          # Funções utilitárias
├── package.json        # Dependências
└── tsconfig.json       # Configuração do TypeScript
```

## Backend

O backend é construído com Node.js e Express, usando Socket.IO para comunicação em tempo real.

### Tecnologias Principais:

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **Socket.IO**: Biblioteca para comunicação em tempo real
- **TypeScript**: Superset tipado de JavaScript

### Estrutura de Diretórios:

```
backend/
├── src/
│   ├── models/        # Definições de tipos de dados
│   ├── routes/        # Rotas da API REST
│   └── index.ts       # Ponto de entrada da aplicação
├── package.json       # Dependências
└── tsconfig.json      # Configuração do TypeScript
```

## Fluxo de Dados

1. **Autenticação**: O usuário se autentica no frontend, que envia as credenciais para o backend.
2. **Conexão WebSocket**: Após autenticação, o frontend estabelece uma conexão WebSocket com o backend usando Socket.IO.
3. **Mensagens em Tempo Real**: As mensagens e atualizações são enviadas e recebidas através do Socket.IO.
4. **Atualizações de Partidas**: O backend envia atualizações sobre partidas em andamento para todos os clientes conectados.
5. **Gamificação**: As ações dos usuários são registradas e processadas para o sistema de gamificação.

## Armazenamento de Dados

Para desenvolvimento, o projeto utiliza dados mockados armazenados em memória. Isso elimina a necessidade de configurar um banco de dados e facilita o desenvolvimento local.

Em uma implementação de produção, seria recomendado usar:
- MongoDB para armazenamento de dados persistentes
- Redis para cache e gerenciamento de sessões 