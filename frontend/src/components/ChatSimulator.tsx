import React, { useEffect, useState } from 'react';

// Tipos para as mensagens e usuários
export interface ChatUser {
  _id: string;
  username: string;
  level?: number;
  badges?: string[];
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  user: ChatUser;
  content: string;
  type: 'text' | 'match-update' | 'system' | 'poll' | 'highlight' | 'general';
  timestamp: Date;
  reactions?: Record<string, string[]>;
}

interface ChatSimulatorProps {
  onNewMessage: (message: ChatMessage) => void;
  matchInProgress?: boolean;
  currentRound?: number;
  currentMap?: string;
  score?: { furia: number; opponent: number };
}

// Usuários simulados
const simulatedUsers: ChatUser[] = [
  { _id: 'user1', username: 'CSGOMaster', level: 5, badges: ['Veterano'] },
  { _id: 'user2', username: 'FuriaFanatic', level: 4, badges: ['Membro Premium'] },
  { _id: 'user3', username: 'NaviHater2023', level: 2, badges: [] },
  { _id: 'user4', username: 'BRzao', level: 7, badges: ['Top Torcedor'] },
  { _id: 'user5', username: 'EsportsFan', level: 3, badges: [] },
  { _id: 'user6', username: 'GreenWall', level: 6, badges: ['Membro desde 2020'] },
  { _id: 'user7', username: 'CyberPunk77', level: 4, badges: [] },
  { _id: 'user8', username: 'HEADSHOTonly', level: 8, badges: ['Pro Analyst'] },
  { _id: 'user9', username: 'CS2Lover', level: 3, badges: [] },
  { _id: 'user10', username: 'FuriaFaithful', level: 9, badges: ['OG Fan'] },
  { _id: 'user11', username: 'TorcidaFuria', level: 5, badges: ['Fã Fiel'] },
  { _id: 'user12', username: 'FURIAFanClub', level: 6, badges: ['Fã Dedicado'] },
  { _id: 'user13', username: 'BrasilCS', level: 4, badges: [] },
  { _id: 'user14', username: 'FalleNisTheGOAT', level: 7, badges: ['Veterano'] },
  { _id: 'user15', username: 'YuurihFan', level: 5, badges: [] },
];

// Mensagens aleatórias para jogadas
const playMessages = [
  'Nossa, que jogada do YEKINDAR!',
  'KSCERATO está jogando muito! 🔥',
  'Esse clutch do FalleN foi insano!',
  'yuurih fazendo a diferença mais uma vez',
  'Que AWP do FalleN! 🎯',
  'Jogadaça do molodoy! Ele está se adaptando muito bem',
  'FURIA está dominando o bombsite A',
  'Que retake incrível da FURIA!',
  'YEKINDAR entrando muito bem no bombsite',
  'Essa rotação da FURIA foi perfeita',
  'KSCERATO com um ace! 🔥🔥🔥',
  'Que spray transfer do YEKINDAR! Inacreditável!',
  'Nessa eco a FURIA surpreendeu muito',
  'Grande defesa do B pelo FalleN',
  'A estratégia da FURIA está funcionando perfeitamente',
];

// Mensagens de torcida
const cheerMessages = [
  'VAMOS FURIA!!!',
  'Hoje é dia de vitória! 💪',
  'Brasil representando! 🇧🇷',
  'FURIAAAAA 🔥🔥🔥',
  'Confiança total na FURIA hoje',
  'Dá pra ganhar fácil esse!',
  'VAMOOOOOO',
  'Acredito demais nesse time!',
  '#GoFURIA',
  'Melhor time do Brasil sem dúvidas',
  'HOJE TEM VITÓRIA',
  'FURIA melhor lineup da história!',
  'Vibração positiva pro time! 🙏',
  'Orgulho da FURIA!',
  'Estamos juntos nessa! #FURIAArmy',
];

// Mensagens de comentários sobre o jogo
const commentMessages = [
  'A defesa da FURIA está muito sólida neste mapa',
  'Esse s1mple está dando trabalho, mas a FURIA está sabendo controlar bem',
  'A rotação da FURIA no meio do mapa está fazendo toda a diferença',
  'O time parece mais confiante hoje',
  'O CT da FURIA no Inferno sempre foi forte',
  'Essa linha de granadas da FURIA é muito bem trabalhada',
  'Acho que a FURIA devia focar mais no meio do mapa',
  'O time adversário não está conseguindo entrar nos bombsites',
  'Ótimo anti-strat da FURIA nessa rodada',
  'Nossa economia está boa, vamos ter armas para os próximos rounds',
  'A FURIA está lendo muito bem o jogo dos adversários',
  'Esse mapa é bom para nosso estilo de jogo',
  'Precisamos segurar o AWP do adversário',
  'YEKINDAR está muito agressivo hoje, funcionando bem',
  'A utility usage da FURIA está impecável',
];

// Mensagens de perguntas
const questionMessages = [
  'Quando é o próximo jogo da FURIA?',
  'Alguém sabe se o molodoy está bem? Parecia machucado',
  'Quem é o IGL atual da FURIA?',
  'Contra quem jogamos na próxima fase se ganharmos?',
  'Quando começa o próximo mapa?',
  'Qual é o mapa depois desse?',
  'Alguém tem o link da stream?',
  'Em qual campeonato é esse jogo?',
  'Os ingressos para o próximo Major já estão à venda?',
  'O bootcamp da FURIA ainda é na Europa?',
  'Quanto está o placar do campeonato?',
  'A FURIA já está classificada se ganhar?',
  'Que horas é o próximo jogo?',
  'Alguém sabe o recorde do YEKINDAR nesse mapa?',
  'Quem é o jogador com mais kills até agora?',
];

// Adicionando mensagens gerais para conversas fora de jogos
const generalMessages = [
  'Alguém ansioso para o próximo torneio da FURIA?',
  'O treino da FURIA tá indo bem pelo que vi nas redes sociais',
  'Quais jogos vocês mais gostam de acompanhar da FURIA?',
  'Acho que a FURIA tem potencial para ganhar o próximo Major',
  'O que vocês acham do novo uniforme da FURIA?',
  'Estou planejando ir ao próximo evento, alguém mais vai?',
  'Tem alguém aqui que já conheceu algum jogador da FURIA pessoalmente?',
  'Qual foi o melhor jogo da FURIA que vocês já viram?',
  'Comecei a torcer para a FURIA ano passado, melhor decisão!',
  'Acompanho os treinos do FalleN na Twitch, ele é incrível!',
  'Já compraram os novos produtos da loja da FURIA?',
  'Vocês viram a última entrevista do guerri? Ele tem uma visão muito boa do jogo',
  'Quem vocês acham que é o jogador mais consistente da FURIA?',
  'O último vlog da FURIA estava muito bom',
  'O ambiente no bootcamp da FURIA parece incrível',
];

// Sistema para gerar highlights de partida
const generateHighlight = (currentMap: string, round: number): string => {
  const players = ['FalleN', 'KSCERATO', 'yuurih', 'molodoy', 'YEKINDAR'];
  const actions = [
    'fez um clutch 1v3',
    'acertou um headshot incrível',
    'fez um ACE',
    'fez uma jogada decisiva',
    'salvou a AWP em uma situação impossível',
    'defendeu o bomb plant sozinho',
    'fez um 4k para garantir o round',
  ];
  
  const player = players[Math.floor(Math.random() * players.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  return `${player} ${action} no round ${round} de ${currentMap}!`;
};

// Simulador de chat
const ChatSimulator: React.FC<ChatSimulatorProps> = ({ 
  onNewMessage, 
  matchInProgress = true,
  currentRound = 1,
  currentMap = 'Inferno',
  score = { furia: 0, opponent: 0 } 
}) => {
  const [round, setRound] = useState(currentRound);
  const [mapScore, setMapScore] = useState(score);
  // Armazenar as últimas mensagens para evitar duplicações
  const [recentMessages, setRecentMessages] = useState<string[]>([]);
  
  // Função para selecionar um usuário aleatório
  const getRandomUser = (): ChatUser => {
    return simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
  };
  
  // Verificar se o conteúdo é semelhante a mensagens recentes
  const isDuplicateMessage = (content: string): boolean => {
    return recentMessages.some(message => 
      // Verifica se é exatamente igual ou muito similar
      message === content || 
      // Verifica se possui mais de 80% de similaridade (mensagens muito parecidas)
      (message.length > 0 && content.length > 0 && 
       (message.includes(content) || content.includes(message)))
    );
  };
  
  // Função para gerar uma mensagem aleatória
  const generateRandomMessage = (): ChatMessage => {
    const messageTypes = [
      { type: 'play', weight: matchInProgress ? 30 : 5 },
      { type: 'cheer', weight: matchInProgress ? 25 : 10 },
      { type: 'comment', weight: matchInProgress ? 20 : 15 },
      { type: 'question', weight: 15 },
      { type: 'highlight', weight: matchInProgress ? 10 : 0 },
      { type: 'general', weight: matchInProgress ? 0 : 55 },
    ];
    
    // Total weight
    const totalWeight = messageTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    // Selecionar tipo de mensagem baseado no peso
    let selectedType = messageTypes[0].type;
    for (const option of messageTypes) {
      if (random < option.weight) {
        selectedType = option.type;
        break;
      }
      random -= option.weight;
    }
    
    // Gerar conteúdo baseado no tipo
    let content = '';
    let type: 'text' | 'match-update' | 'system' | 'poll' | 'highlight' = 'text';
    let user = getRandomUser();
    
    // Tentar até 5 vezes para gerar uma mensagem não duplicada
    let attemptCount = 0;
    let isDuplicate = true;
    
    while (isDuplicate && attemptCount < 5) {
      switch (selectedType) {
        case 'play':
          content = playMessages[Math.floor(Math.random() * playMessages.length)];
          break;
        case 'cheer':
          content = cheerMessages[Math.floor(Math.random() * cheerMessages.length)];
          break;
        case 'comment':
          content = commentMessages[Math.floor(Math.random() * commentMessages.length)];
          break;
        case 'question':
          content = questionMessages[Math.floor(Math.random() * questionMessages.length)];
          break;
        case 'highlight':
          content = generateHighlight(currentMap, round);
          type = 'highlight';
          user = { _id: 'system', username: 'Sistema', badges: ['Oficial'] };
          break;
        case 'general':
          content = generalMessages[Math.floor(Math.random() * generalMessages.length)];
          break;
      }
      
      isDuplicate = isDuplicateMessage(content);
      attemptCount++;
    }
    
    // Atualizar lista de mensagens recentes (manter apenas as últimas 10)
    setRecentMessages(prev => {
      const updated = [content, ...prev];
      return updated.slice(0, 10);
    });
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      user,
      content,
      type,
      timestamp: new Date()
    };
  };
  
  // Simular atualizações de partida
  const generateScoreUpdate = (): ChatMessage => {
    // Atualizar placar
    const roundWinner = Math.random() > 0.4 ? 'furia' : 'opponent';
    const newScore = {...mapScore};
    
    if (roundWinner === 'furia') {
      newScore.furia += 1;
    } else {
      newScore.opponent += 1;
    }
    
    setMapScore(newScore);
    setRound(round + 1);
    
    // Variações de formato para mensagens de atualização
    const updateFormats = [
      `${roundWinner === 'furia' ? 'FURIA' : 'Adversário'} vence o round ${round}! Placar: FURIA ${newScore.furia} x ${newScore.opponent} Adversário`,
      `Round ${round} finalizado! ${roundWinner === 'furia' ? 'FURIA' : 'Adversário'} leva a melhor. (${newScore.furia}-${newScore.opponent})`,
      `${roundWinner === 'furia' ? 'FURIA' : 'Adversário'} fecha o round ${round}. Novo placar: ${newScore.furia}-${newScore.opponent}`,
      `PLACAR ATUALIZADO! ${newScore.furia}:${newScore.opponent} após ${round} rounds`,
      `Round ${round} para ${roundWinner === 'furia' ? 'FURIA' : 'Adversário'}! Situação atual: FURIA ${newScore.furia}, Adversário ${newScore.opponent}`
    ];
    
    // Selecionar aleatoriamente um formato de mensagem
    const selectedFormat = updateFormats[Math.floor(Math.random() * updateFormats.length)];
    
    // Gerar mensagem de atualização
    return {
      id: Date.now().toString() + '-update',
      user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
      content: selectedFormat,
      type: 'match-update',
      timestamp: new Date()
    };
  };

  useEffect(() => {
    if (!matchInProgress) return;
    
    // Armazenar mensagens recentes para evitar duplicação
    const recentMessages: string[] = [];
    
    // Verifica se o conteúdo é similar a mensagens recentes
    const isDuplicateMessage = (content: string): boolean => {
      return recentMessages.some(message => 
        message === content || 
        (message.includes(content) || content.includes(message))
      );
    };
    
    // Simulação de mensagens regulares (a cada 3-10 segundos)
    const messageInterval = setInterval(() => {
      let newMessage = generateRandomMessage();
      
      // Tenta até 3 vezes gerar uma mensagem não duplicada
      let attempts = 0;
      while (isDuplicateMessage(newMessage.content) && attempts < 3) {
        newMessage = generateRandomMessage();
        attempts++;
      }
      
      // Se não é duplicada ou esgotou tentativas, envia a mensagem
      if (!isDuplicateMessage(newMessage.content) || attempts >= 3) {
        // Adiciona à lista de mensagens recentes
        recentMessages.unshift(newMessage.content);
        if (recentMessages.length > 8) {
          recentMessages.pop(); // Mantém apenas as 8 mensagens mais recentes
        }
        
        onNewMessage(newMessage);
      }
    }, 3000 + Math.random() * 7000);
    
    // Simulação de atualizações de placar (a cada 35-60 segundos)
    const updateInterval = setInterval(() => {
      const updateMessage = generateScoreUpdate();
      
      // Adiciona à lista de mensagens recentes
      recentMessages.unshift(updateMessage.content);
      if (recentMessages.length > 8) {
        recentMessages.pop();
      }
      
      onNewMessage(updateMessage);
    }, 35000 + Math.random() * 25000);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(updateInterval);
    };
  }, [matchInProgress, round, mapScore]);

  return null; // Componente sem renderização visual
};

export default ChatSimulator; 