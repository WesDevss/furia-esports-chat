# Guia de Contribuição

Obrigado pelo interesse em contribuir com o projeto FURIA Chat! Este documento fornece diretrizes para contribuir com o desenvolvimento.

## Código de Conduta

- Seja respeitoso e inclusivo em suas interações
- Forneça feedback construtivo
- Foque nas necessidades da comunidade FURIA
- Mantenha discussões técnicas profissionais

## Como Contribuir

### 1. Configuração do Ambiente

Antes de começar a contribuir, configure seu ambiente de desenvolvimento:

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/furia-chat.git
cd furia-chat
```

2. Instale as dependências:
```bash
npm run install:all
```

3. Configure as variáveis de ambiente (se necessário).

4. Inicie o projeto em modo de desenvolvimento:
```bash
npm start
```

### 2. Fluxo de Trabalho com Git

1. Crie uma branch para sua feature ou correção:
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

2. Faça commits com mensagens claras:
```bash
git commit -m "feat: adiciona sistema de enquetes"
# ou
git commit -m "fix: corrige problema de conexão no chat"
```

Seguimos o padrão de [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit.

3. Envie sua branch para o repositório:
```bash
git push origin feature/nome-da-feature
```

4. Crie um Pull Request para a branch principal.

### 3. Diretrizes de Código

#### Estilo de Código

- Use TypeScript para todo o código novo
- Siga o estilo de código existente no projeto
- Utilize interfaces para definir tipos de dados
- Mantenha componentes React funcionais e com Hooks
- Documente funções e componentes complexos

#### Testes

Ao adicionar novas funcionalidades, inclua testes adequados:

- Testes unitários para funções e componentes
- Testes de integração para fluxos de trabalho
- Testes de ponta a ponta para funcionalidades críticas

### 4. Processo de Pull Request

1. Verifique se seu código passa em todos os testes
2. Atualize a documentação, se necessário
3. Descreva claramente o que sua alteração faz e por que
4. Vincule quaisquer issues relacionados
5. Aguarde a revisão e feedback

## Diretrizes para Issues

### Relatando Bugs

Ao relatar um bug, inclua:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. comportamento atual
- Screenshots ou logs, se aplicável
- Ambiente (navegador, sistema operacional, etc.)

### Sugerindo Melhorias

Para sugerir melhorias:

- Descreva claramente a funcionalidade
- Explique por que ela seria útil para os usuários
- Forneça exemplos de como poderia funcionar
- Inclua mockups ou wireframes, se possível

## Revisão de Código

Nosso processo de revisão de código busca garantir:

- Qualidade e consistência do código
- Aderência às melhores práticas
- Legibilidade e manutenção
- Desempenho e segurança

## Recursos Adicionais

- [Documentação da API](./api.md)
- [Documentação de Componentes](./components.md)
- [Arquitetura do Projeto](./architecture.md) 