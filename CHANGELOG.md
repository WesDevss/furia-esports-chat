# Changelog - Projeto FURIA Chat

## [1.0.2] - 2023-05-05

### Atualizado
- Lista de jogadores do time de CS2 da FURIA atualizada com o lineup atual:
  - FalleN (Gabriel Toledo)
  - KSCERATO (Kaike Cerato)
  - yuurih (Yuri Santos)
  - molodoy (Danil Golubenko)
  - YEKINDAR (Mareks Gaļinskis)
- Informações detalhadas sobre cada jogador incluindo estatísticas

## [1.0.1] - 2023-05-05

### Adicionado
- Sistema expandido de respostas alternativas no FURIBOT
- Respostas para jogadores individuais (KSCERATO, yuurih, arT, drop, VINI)
- Respostas para times competidores (NAVI, FaZe, Liquid)
- Respostas para outros jogos (Valorant, Apex Legends, League of Legends)
- Resposta padrão para perguntas não cobertas

### Corrigido
- Resolver erros de autenticação com API OpenAI (usando respostas alternativas)
- Detectar falhas de API e cair automaticamente para respostas alternativas
- Corrigir mensagem de erro no FURIBOT quando o usuário digita "teste"

### Alterado
- Lógica de detecção de tópicos melhorada no backend
- Sistema de resposta mais robusto com mais verificações de palavras-chave

## [1.0.0] - Versão Inicial

- Sistema de chat em tempo real com Socket.IO
- Componente FURIBOT para responder perguntas
- Interface de usuário moderna com Tailwind CSS
- Sistema de proxy para API externa 