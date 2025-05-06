import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle, Trophy, Star, XCircle, Gift, Users, Calendar, Clock, ChevronDown } from 'lucide-react';
import { FuriBotContext } from '../App';
import FuriBotButton from '../components/FuriBotButton';
import { QuizWidget } from '../components/widgets';
import ChatSimulator, { ChatMessage as SimulatedMessage, ChatUser } from '../components/ChatSimulator';

interface Message {
  id: string;
  user: {
    _id: string;
    username: string;
    level?: number;
    badges?: string[];
  };
  content: string;
  type: 'text' | 'match-update' | 'poll' | 'mission-complete' | 'highlight' | 'system' | 'general';
  timestamp: Date;
  pollOptions?: string[];
  pollVotes?: Record<string, number>;
  reactions?: Record<string, string[]>;
  replyTo?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  icon: React.ReactNode;
  expiry?: Date;
}

// Match info
interface MatchInfo {
  id: string;
  opponent: string;
  tournament: string;
  map: string;
  score: {
    furia: number;
    opponent: number;
  };
  round: number;
  status: 'upcoming' | 'live' | 'finished';
  startTime?: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState({
    _id: '1',  // This would come from authentication in a real app
    username: 'FuriaFan123',
    level: 3,
    badges: ['Novo Torcedor', 'CS Expert']
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showMissions, setShowMissions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Obter horário atual para simular jogos programados
  const now = new Date();
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({
    id: '1',
    opponent: 'NAVI',
    tournament: 'Major Rio 2024',
    map: 'Inferno',
    score: {
      furia: 0,
      opponent: 0
    },
    round: 1,
    status: 'upcoming',
    // Configurar para começar em um tempo específico (3 minutos a partir de agora para a demo)
    startTime: new Date(now.getTime() + 3 * 60 * 1000)
  });
  
  // Criar horários reais para os jogos
  const [upcomingMatches, setUpcomingMatches] = useState([
    {
      id: '1',
      opponent: 'NAVI',
      tournament: 'Major Rio 2024',
      // Configurar para começar em um tempo específico (3 minutos a partir de agora para a demo)
      startTime: new Date(now.getTime() + 3 * 60 * 1000),
      status: 'upcoming'
    },
    {
      id: '2', 
      opponent: 'Liquid',
      tournament: 'Major Rio 2024',
      // Próximo jogo um pouco depois (5 minutos para a demo)
      startTime: new Date(now.getTime() + 5 * 60 * 1000),
      status: 'upcoming'
    }
  ]);
  
  const [chatMode, setChatMode] = useState<'live' | 'general'>('general');
  const [onlineUsers, setOnlineUsers] = useState(1237);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{id: string, username: string, message: string, timer: number, replyingTo?: string}[]>([]);
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());
  const [messageInterval, setMessageInterval] = useState<number>(8000); // 8 segundos entre mensagens inicialmente
  const [recentConversationTopics, setRecentConversationTopics] = useState<{id: string, topic: string, lastMessageId: string, active: boolean}[]>([]);
  
  // Referência para o final da conversa (sem auto-scroll)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Usar o contexto global em vez do estado local
  const { openFuriBot } = useContext(FuriBotContext);

  // Monitorar posição de rolagem para mostrar botão "rolar para baixo"
  useEffect(() => {
    const handleScroll = () => {
      const container = chatContainerRef.current;
      if (!container) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Mostrar botão quando não estiver no final do chat
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollToBottom(isNotAtBottom);
    };
    
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Rolagem manual para o final do chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages effect
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // Mock messages showing fans conversing during a match
        const now = Date.now();
        
        // Conjunto de mensagens iniciais garantindo que não há repetições
        const initialMessages: Message[] = [
          {
            id: '1',
            user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
            content: 'Bem-vindo ao chat da FURIA!',
            type: 'system',
            timestamp: new Date(now - 1800000) // 30 minutes ago
          },
          {
            id: '2',
            user: { _id: 'mod', username: 'Moderador', badges: ['Mod', 'Veterano'] },
            content: 'FURIA vs NAVI começa em breve. Fiquem ligados!',
            type: 'match-update',
            timestamp: new Date(now - 600000) // 10 minutes ago
          },
        ];
        
        // Conjunto de mensagens de chat de usuários com conteúdos diversificados
        const userMessages: Message[] = [
          {
            id: '3',
            user: { _id: 'user1', username: 'CSGOMaster', level: 5, badges: ['Veterano'] },
            content: 'Alguém sabe quem vai jogar hoje?',
            type: 'text',
            timestamp: new Date(now - 420000) // 7 minutes ago
          },
          {
            id: '4',
            user: { _id: 'user2', username: 'FuriaFanatic', level: 4, badges: ['Membro Premium'] },
            content: 'Lineup completa atual: FalleN, KSCERATO, yuurih, molodoy e YEKINDAR',
            type: 'text',
            timestamp: new Date(now - 380000) // 6.3 minutes ago
          },
          {
            id: '5',
            user: { _id: 'user3', username: 'NaviHater2023', level: 2, badges: [] },
            content: 'Ansioso para ver o FalleN usando AWP contra o s1mple hoje',
            type: 'text',
            timestamp: new Date(now - 330000) // 5.5 minutes ago
          },
          {
            id: '6',
            user: { _id: 'user4', username: 'BRzao', level: 7, badges: ['Top Torcedor'] },
            content: 'Vocês viram o novo vídeo que a FURIA postou sobre o bootcamp? Muito bom',
            type: 'text',
            timestamp: new Date(now - 300000) // 5 minutes ago
          },
          {
            id: '7',
            user: { _id: 'user5', username: 'GlobalElite', level: 9, badges: ['Fã Fiel'] },
            content: 'YEKINDAR vai fazer muita diferença nesse time, ele é muito agressivo',
            type: 'text',
            timestamp: new Date(now - 270000) // 4.5 minutes ago
          },
          {
            id: '8',
            user: { _id: 'user6', username: 'FazendoAPorra', level: 3, badges: [] },
            content: 'Esse Major vai ser o mais disputado dos últimos anos',
            type: 'text',
            timestamp: new Date(now - 240000) // 4 minutes ago
          },
          {
            id: '9',
            user: { _id: 'user7', username: 'YuurihFan', level: 6, badges: ['Veterano'] },
            content: 'yuurih carregando como sempre, melhor rifler do Brasil!',
            type: 'text',
            timestamp: new Date(now - 210000) // 3.5 minutes ago
          },
          {
            id: '10',
            user: { _id: 'user8', username: 'FURIAFamilia', level: 8, badges: ['Membro Premium'] },
            content: 'Alguém vai assistir presencialmente o próximo campeonato?',
            type: 'text',
            timestamp: new Date(now - 180000) // 3 minutes ago
          },
        ];
        
        // Combinar as mensagens do sistema com algumas mensagens de usuários (sem duplicação)
        const allMessages = [...initialMessages, ...userMessages];
        setMessages(allMessages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };

    fetchMessages();

    // Inicializar missões
    setMissions([
      {
        id: '1',
        title: 'Primeira mensagem',
        description: 'Envie sua primeira mensagem no chat',
        reward: 50,
        completed: false,
        icon: <MessageCircle className="h-5 w-5 text-blue-400" />
      },
      {
        id: '2',
        title: 'Fã do dia',
        description: 'Poste 5 mensagens durante uma partida ao vivo',
        reward: 100,
        completed: false,
        icon: <Star className="h-5 w-5 text-yellow-400" />
      },
      {
        id: '3',
        title: 'Interação com FURIBOT',
        description: 'Faça uma pergunta ao FURIBOT sobre estatísticas',
        reward: 75,
        completed: false,
        icon: <Gift className="h-5 w-5 text-purple-400" />,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    ]);
  }, []);

  // Adicionando a mensagem simulada
  const handleSimulatedMessage = (newMessage: SimulatedMessage) => {
    const message: Message = {
      ...newMessage,
      pollOptions: [],
      pollVotes: {},
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Lidar com envio de uma nova mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    try {
      // Verificar se é uma mensagem para o FURIBOT
      if (inputValue.toLowerCase().includes('@furibot')) {
        // Mostrar FURIBOT
        openFuriBot();
        setInputValue('');
        return;
      }
      
      // Criar nova mensagem
      const newMessage: Message = {
        id: Date.now().toString(),
        user: currentUser,
        content: inputValue,
        type: 'text',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputValue('');
      
      // Verificar se "first message" mission está completa
      if (!missions.find(m => m.id === '1')?.completed) {
        completeMission('1');
      }
      
      // Verificar se "fan of the day" mission está completa
      if (matchInfo.status === 'live') {
        const userMessages = messages.filter(m => 
          m.user._id === currentUser._id && 
          m.type === 'text'
        ).length;
        
        if (userMessages >= 4 && !missions.find(m => m.id === '2')?.completed) {
          completeMission('2');
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Completar uma missão
  const completeMission = (missionId: string) => {
    setMissions(prev => 
      prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, completed: true } 
          : mission
      )
    );
    
    // Encontrar a missão para obter a recompensa
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      // Adicionar mensagem de missão completa
      const missionMessage: Message = {
        id: Date.now().toString(),
        user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
        content: `🎉 Você completou a missão "${mission.title}" e ganhou ${mission.reward} pontos de experiência!`,
        type: 'mission-complete',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, missionMessage]);
    }
  };

  // Formatar timestamp para exibição
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Renderizar um único item de mensagem
  const renderMessage = (message: Message) => {
    const isCurrentUser = message.user._id === currentUser._id;
    const isSystemMessage = message.user._id === 'system' || message.type === 'match-update' || message.type === 'highlight';
    const isReply = message.replyTo !== undefined;
    
    // Mensagem a que está respondendo
    const repliedMessage = isReply ? messages.find(m => m.id === message.replyTo) : undefined;
    
    // Classes CSS para diferentes tipos de mensagens
    let messageClasses = "mb-3 break-words text-sm";
    
    if (isSystemMessage) {
      messageClasses += " mr-auto bg-gray-700 rounded-lg py-1.5 px-3 max-w-[85%] text-left";
    } else if (isCurrentUser) {
      messageClasses += " ml-auto bg-purple-600 rounded-l-lg rounded-tr-lg py-1.5 px-3 max-w-[55%] text-left";
    } else {
      messageClasses += " mr-auto bg-gray-700 rounded-r-lg rounded-tl-lg py-1.5 px-3 max-w-[65%] text-left";
    }
    
    // Renderizar o conteúdo baseado no tipo
    const renderContent = () => {
      switch (message.type) {
        case 'match-update':
          return <div className="text-green-400 font-medium text-sm text-left">{message.content}</div>;
          
        case 'highlight':
          return <div className="text-yellow-400 font-medium text-sm text-left">🔥 {message.content}</div>;
          
        case 'mission-complete':
          return <div className="text-purple-400 font-medium text-sm text-left">{message.content}</div>;
          
        case 'poll':
          // Renderização de enquete (não implementada neste exemplo)
          return <div className="text-sm text-left">{message.content}</div>;
          
        case 'system':
          return <div className="text-blue-300 text-sm text-left">{message.content}</div>;
          
        default:
          return <div className="text-sm text-left">{message.content}</div>;
      }
    };
    
    return (
      <div key={message.id} className="animate-fade-in">
        {isSystemMessage ? (
          <div className="flex items-center gap-1 text-xs justify-start ml-1 mb-0.5">
            <span className="font-semibold">{message.user.username}</span>
            {message.user.badges && message.user.badges.map((badge, idx) => (
              <span key={idx} className="bg-gray-800 text-gray-300 rounded px-1">{badge}</span>
            ))}
          </div>
        ) : (
          <div className={`flex items-center gap-1 text-xs ${isCurrentUser ? 'justify-end mr-1' : 'justify-start ml-1'} mb-0.5`}>
            <span className="font-semibold">{message.user.username}</span>
            {message.user.level && (
              <span className="bg-gray-600 text-gray-300 rounded px-1">Nv {message.user.level}</span>
            )}
            {message.user.badges && message.user.badges.map((badge, idx) => (
              <span key={idx} className="bg-gray-800 text-gray-300 rounded px-1">{badge}</span>
            ))}
          </div>
        )}
        
        <div className={messageClasses}>
          {/* Mostrar resposta */}
          {repliedMessage && (
            <div className="text-xs text-gray-400 border-l-2 border-gray-500 pl-2 mb-1 italic">
              Respondendo a <span className="font-semibold">{repliedMessage.user.username}</span>: {repliedMessage.content.length > 50 ? repliedMessage.content.substring(0, 50) + '...' : repliedMessage.content}
            </div>
          )}
          
          {renderContent()}
          
          <div className="text-left mt-0.5">
            <span className="text-xs text-gray-400">{formatTime(new Date(message.timestamp))}</span>
          </div>
        </div>
      </div>
    );
  };

  // Verificar status das partidas
  useEffect(() => {
    const checkMatchesStatus = () => {
      const currentTime = new Date();
      
      // Verificar se a partida principal deve começar
      if (matchInfo.status === 'upcoming' && matchInfo.startTime && currentTime >= matchInfo.startTime) {
        console.log('Jogo principal começando: FURIA vs ' + matchInfo.opponent);
        
        setMatchInfo(prev => ({
          ...prev,
          status: 'live',
          score: { furia: 0, opponent: 0 }
        }));
        
        // Adicionar mensagem do sistema informando início da partida
        const systemMessage: Message = {
          id: Date.now().toString() + '-matchstart',
          user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
          content: `🔴 AO VIVO: FURIA vs ${matchInfo.opponent} acaba de começar!`,
          type: 'match-update',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, systemMessage]);
        
        // Acelerar ritmo de mensagens quando jogo começa
        setMessageInterval(5000); // 5 segundos entre mensagens durante o jogo
      }
      
      // Verificar e atualizar próximos jogos
      setUpcomingMatches(prev => prev.map(match => {
        if (match.status === 'upcoming' && match.startTime && currentTime >= match.startTime) {
          console.log('Jogo começando: FURIA vs ' + match.opponent);
          
          // Adicionar mensagem do sistema
          const systemMessage: Message = {
            id: Date.now().toString() + '-upcoming-' + match.id,
            user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
            content: `🔴 AO VIVO: FURIA vs ${match.opponent} acaba de começar!`,
            type: 'match-update',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, systemMessage]);
          
          return {
            ...match,
            status: 'live'
          };
        }
        return match;
      }));
    };
    
    // Verificar a cada 10 segundos
    const statusInterval = setInterval(checkMatchesStatus, 10000);
    
    return () => clearInterval(statusInterval);
  }, [matchInfo]);

  // Simular usuários digitando com ritmo mais natural
  useEffect(() => {
    // Lista para armazenar últimas mensagens enviadas
    const recentMessagesContent: string[] = [];
    
    const isDuplicateMessage = (content: string): boolean => {
      return recentMessagesContent.some(message => 
        message === content || 
        (message.length > 0 && content.length > 0 && 
         (message.includes(content) || content.includes(message)))
      );
    };
    
    const simulateTyping = () => {
      // Verificar se passou tempo suficiente desde a última mensagem
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTime;
      
      // Só cria nova digitação se passou tempo suficiente desde a última mensagem
      if (timeSinceLastMessage < messageInterval * 0.7) {
        return; // Esperar mais tempo antes de iniciar nova digitação
      }
      
      // Lista de possíveis usuários que podem estar digitando
      const possibleTypers = [
        { id: 'user4', username: 'BRzao' },
        { id: 'user5', username: 'EsportsFan' },
        { id: 'user6', username: 'GreenWall' },
        { id: 'user7', username: 'CyberPunk77' },
        { id: 'user8', username: 'HEADSHOTonly' },
        { id: 'user9', username: 'CS2Lover' },
        { id: 'user10', username: 'FuriaFaithful' },
        { id: 'user11', username: 'TorcidaFuria' },
        { id: 'user12', username: 'FURIAFanClub' },
        { id: 'user13', username: 'BrasilCS' },
        { id: 'user14', username: 'FalleNisTheGOAT' },
        { id: 'user15', username: 'YuurihFan' },
        { id: 'user16', username: 'EsportsFan' },
        { id: 'user17', username: 'NaviHater2023' },
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
      
      // Função para gerar uma mensagem aleatória com base no contexto do jogo
      const generateRandomMessage = (replyingTo?: { messageId: string, content: string, username: string }) => {
        // 50% de chance de responder a uma mensagem existente se houver tópicos ativos
        const activeTopics = recentConversationTopics.filter(topic => topic.active);
        const shouldReply = replyingTo || (activeTopics.length > 0 && Math.random() > 0.5);
        
        if (shouldReply && (replyingTo || activeTopics.length > 0)) {
          // Respostas a mensagens existentes
          const topic = replyingTo ? null : activeTopics[Math.floor(Math.random() * activeTopics.length)];
          const messageToReplyTo = replyingTo || (topic ? { 
            messageId: topic.lastMessageId,
            content: messages.find(m => m.id === topic.lastMessageId)?.content || '',
            username: messages.find(m => m.id === topic.lastMessageId)?.user.username || ''
          } : null);
          
          if (!messageToReplyTo) {
            // Fallback para mensagem normal se não encontrarmos para responder
            return generateNewMessage();
          }
          
          // Tipos de respostas possíveis
          const agreements = [
            `Concordo totalmente! ${messageToReplyTo.content.includes('?') ? 'Também quero saber.' : ''}`,
            `Isso mesmo, ${messageToReplyTo.username}!`,
            `Exatamente o que eu estava pensando!`,
            `Você tem toda razão!`,
            `Sem dúvida nenhuma!`,
          ];
          
          const disagreements = [
            `Não concordo... ${messageToReplyTo.content.includes('?') ? 'Não acho que seja assim.' : ''}`,
            `Acho que não é bem assim...`,
            `Discordo um pouco, na verdade...`,
            `Tenho outra visão sobre isso`,
            `Não é exatamente o que eu penso`,
          ];
          
          const questions = [
            `${messageToReplyTo.username}, por que você acha isso?`,
            `Mas isso não é meio contraditório?`,
            `Você tem certeza disso?`,
            `Baseado em quê você diz isso?`,
            `De onde você tirou essa informação?`,
          ];
          
          const followUps = [
            `E além disso, eu acho que ${matchInfo.status === 'live' ? 'a FURIA vai ganhar esse jogo hoje' : 'os treinos estão indo muito bem'}`,
            `Isso me lembra quando ${['FalleN', 'KSCERATO', 'yuurih', 'YEKINDAR'][Math.floor(Math.random() * 4)]} fez aquela jogada incrível no último campeonato`,
            `Vocês viram a entrevista do ${['FalleN', 'guerri', 'KSCERATO'][Math.floor(Math.random() * 3)]} sobre isso?`,
            `Falando nisso, o que vocês acharam do novo uniforme?`,
            `Por falar nisso, quem vocês acham que é o melhor jogador da FURIA atualmente?`,
          ];
          
          // Decidir aleatoriamente qual tipo de resposta
          const responseTypes = [
            { type: 'agreement', messages: agreements, weight: 3 },
            { type: 'disagreement', messages: disagreements, weight: 2 },
            { type: 'question', messages: questions, weight: 2 },
            { type: 'followUp', messages: followUps, weight: 3 }
          ];
          
          const totalWeight = responseTypes.reduce((sum, type) => sum + type.weight, 0);
          let random = Math.random() * totalWeight;
          let selectedType;
          
          for (const option of responseTypes) {
            if (random < option.weight) {
              selectedType = option;
              break;
            }
            random -= option.weight;
          }
          
          if (!selectedType) selectedType = responseTypes[0];
          
          // Marcar tópico como ainda ativo se estiver respondendo
          if (topic) {
            setRecentConversationTopics(prev => 
              prev.map(t => t.id === topic.id ? {...t, active: Math.random() > 0.3} : t)
            );
          }
          
          return {
            content: selectedType.messages[Math.floor(Math.random() * selectedType.messages.length)],
            messageType: 'text' as const,
            replyingTo: messageToReplyTo.messageId,
            createTopic: false
          };
        }
        
        // Nova mensagem não relacionada a conversas anteriores
        return generateNewMessage();
      };
      
      // Gerar uma mensagem completamente nova
      const generateNewMessage = () => {
        const messageTypes = matchInfo.status === 'live' ? 
          ['play', 'cheer', 'comment', 'question', 'highlight'] : 
          ['general', 'question', 'cheer'];
        
        const selectedType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
        
        const playMessages = [
          'Nossa, que jogada do YEKINDAR!',
          'KSCERATO está jogando muito! 🔥',
          'Esse clutch do FalleN foi insano!',
          'yuurih fazendo a diferença mais uma vez',
          'Que AWP do FalleN! 🎯',
          'YEKINDAR entrando muito bem no bombsite',
          'FURIA está dominando o bombsite A',
          'Que retake incrível da FURIA!',
          'molodoy entrando muito bem no bombsite',
          'Essa rotação da FURIA foi perfeita',
          'KSCERATO com um ace! 🔥🔥🔥',
          'Que spray transfer do YEKINDAR! Inacreditável!',
          'Nessa eco a FURIA surpreendeu muito',
          'Grande defesa do B pelo FalleN',
        ];
        
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
        ];
        
        const commentMessages = [
          'A defesa da FURIA está muito sólida neste mapa',
          'A rotação da FURIA no meio do mapa está fazendo toda a diferença',
          'O time parece mais confiante hoje',
          'O CT da FURIA no Inferno sempre foi forte',
          'Acho que a FURIA devia focar mais no meio do mapa',
          'Ótimo anti-strat da FURIA nessa rodada',
          'Nossa economia está boa, vamos ter armas para os próximos rounds',
          'A FURIA está lendo muito bem o jogo dos adversários',
          'Esse mapa é bom para nosso estilo de jogo',
          'Precisamos segurar o AWP do adversário',
          'YEKINDAR está muito agressivo hoje, funcionando bem',
        ];
        
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
        ];
        
        const generalMessages = [
          'Alguém ansioso para o jogo de hoje?',
          'O treino da FURIA tá indo bem pelo que vi nas redes sociais',
          'Quais jogos vocês mais gostam de acompanhar da FURIA?',
          'Acho que a FURIA tem potencial para ganhar esse Major',
          'O que vocês acham do novo uniforme da FURIA?',
          'Estou planejando ir ao próximo evento, alguém mais vai?',
          'Tem alguém aqui que já conheceu algum jogador da FURIA pessoalmente?',
          'Qual foi o melhor jogo da FURIA que vocês já viram?',
          'Comecei a torcer para a FURIA ano passado, melhor decisão!',
          'Acompanho os treinos do FalleN na Twitch, ele é incrível!',
          'Já compraram os novos produtos da loja da FURIA?',
          'Vocês viram a última entrevista do guerri? Ele tem uma visão muito boa do jogo',
          'Quem vocês acham que é o jogador mais consistente da FURIA?',
        ];
        
        // Handle highlight type separately
        if (selectedType === 'highlight' && matchInfo.status === 'live') {
          return {
            content: generateHighlight(matchInfo.map, matchInfo.round),
            messageType: 'highlight' as const,
            replyingTo: undefined,
            createTopic: false
          };
        }
        
        // Handle regular messages
        let messageArray;
        switch (selectedType) {
          case 'play':
            messageArray = playMessages;
            break;
          case 'cheer':
            messageArray = cheerMessages;
            break;
          case 'comment':
            messageArray = commentMessages;
            break;
          case 'question':
            messageArray = questionMessages;
            break;
          case 'general':
          default:
            messageArray = generalMessages;
            break;
        }
        
        // Criar novo tópico de conversa para perguntas (80% de chance)
        const isNewTopic = selectedType === 'question' || messageArray === generalMessages;
        if (isNewTopic) {
          // Limitar a 5 tópicos ativos
          if (recentConversationTopics.filter(t => t.active).length >= 5) {
            // Desativar o tópico mais antigo
            setRecentConversationTopics(prev => {
              const sorted = [...prev].sort((a, b) => 
                parseInt(a.lastMessageId) - parseInt(b.lastMessageId)
              );
              if (sorted.length > 0) {
                return prev.map(t => 
                  t.id === sorted[0].id ? {...t, active: false} : t
                );
              }
              return prev;
            });
          }
        }
        
        const content = messageArray[Math.floor(Math.random() * messageArray.length)];
        
        return {
          content,
          messageType: 'text' as const,
          replyingTo: undefined,
          createTopic: isNewTopic
        };
      };
      
      // Gerar uma nova mensagem
      const newMessage = generateRandomMessage();
      
      // Adicionar mensagem ao chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: {
          _id: 'system',
          username: 'Sistema',
          badges: ['Oficial']
        },
        content: newMessage.content,
        type: newMessage.messageType,
        timestamp: new Date()
      }]);
      
      // Adicionar à lista de mensagens recentes
      recentMessagesContent.unshift(newMessage.content);
      if (recentMessagesContent.length > 10) {
        recentMessagesContent.pop();
      }
      
      // Se for mensagem criadora de tópico, adicionar ao registro de tópicos
      if (newMessage.createTopic) {
        const topicId = 'topic-' + Date.now().toString();
        setRecentConversationTopics(prev => [
          ...prev, 
          {
            id: topicId,
            topic: newMessage.content,
            lastMessageId: Date.now().toString(),
            active: true
          }
        ]);
      }
      
      // Se estiver respondendo a um tópico, atualizar o lastMessageId
      if (newMessage.replyingTo) {
        setRecentConversationTopics(prev => 
          prev.map(topic => 
            topic.lastMessageId === newMessage.replyingTo
              ? { ...topic, lastMessageId: Date.now().toString(), active: true }
              : topic
          )
        );
      }
      
      // Atualizar último tempo de mensagem
      setLastMessageTime(Date.now());
    };

    // Simular a digitação a cada 6-12 segundos (bem mais lento)
    const typingInterval = setInterval(() => {
      simulateTyping();
    }, 6000 + Math.random() * 6000);

    return () => {
      clearInterval(typingInterval);
      // Limpar todos os timers pendentes
      typingUsers.forEach(user => window.clearTimeout(user.timer));
    };
  }, [typingUsers, matchInfo.status, lastMessageTime, messageInterval, messages, recentConversationTopics]);

  // Componente para mostrar quem está digitando
  const TypingIndicator = () => {
    if (typingUsers.length === 0) return null;
    
    return (
      <div className="text-xs text-gray-400 flex items-center gap-1 px-3 pb-1">
        <span className="font-medium">
          {typingUsers.map(user => user.username).join(', ')}
        </span>
        <span>{typingUsers.length === 1 ? 'está' : 'estão'} digitando</span>
        <span className="flex">
          <span className="animate-bounce mx-0.5 delay-0">.</span>
          <span className="animate-bounce mx-0.5 delay-100">.</span>
          <span className="animate-bounce mx-0.5 delay-200">.</span>
        </span>
      </div>
    );
  };

  // Formatar tempo de início da partida de forma mais amigável
  const formatMatchTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / 60000);
    
    if (diffMinutes < 60) {
      return `Em ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };

  return (
    <div className="h-screen-minus-navbar flex flex-col">
      {/* Cabeçalho do chat */}
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Chat da FURIA</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users size={14} /> 
            <span>{onlineUsers} online</span>
          </div>
        </div>
        
        {matchInfo.status !== 'finished' && (
          <div className="mt-2 bg-gray-900 rounded-lg p-2 flex items-center justify-between">
            <div>
              <div className="font-medium text-white text-sm">
                {matchInfo.status === 'live' ? (
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    AO VIVO: 
                  </span>
                ) : (
                  'EM BREVE: '
                )}
                FURIA vs {matchInfo.opponent}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {matchInfo.tournament} • {matchInfo.map}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              {matchInfo.status === 'live' ? (
                <div className="font-bold text-lg">
                  <span className="text-yellow-400">{matchInfo.score.furia}</span>
                  <span className="text-gray-500 mx-1">:</span>
                  <span className="text-gray-300">{matchInfo.score.opponent}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs">
                  <Clock size={12} className="text-gray-400" />
                  <span>Começa às {formatMatchTime(matchInfo.startTime!)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Área principal de chat */}
        <div className="flex-1 flex flex-col">
          {/* Mensagens */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 text-left">
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-pulse">Carregando mensagens...</div>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-400">
                {error}
              </div>
            ) : (
              <>
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Botão para rolar para baixo */}
          {showScrollToBottom && (
            <button 
              onClick={scrollToBottom}
              className="absolute bottom-20 right-4 bg-purple-600 p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
              <ChevronDown className="text-white" size={20} />
            </button>
          )}
          
          {/* Indicador de quem está digitando */}
          <TypingIndicator />
          
          {/* Caixa de entrada para mensagens */}
          <div className="px-3 py-2 border-t border-gray-700 bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-md text-white font-medium text-sm transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
        
        {/* Barra lateral com informações do perfil e missões */}
        <div className="hidden md:block w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          {/* Perfil */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                {currentUser.username.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold">{currentUser.username}</h3>
                <div className="flex gap-1 mt-1">
                  {currentUser.badges.map((badge, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 text-gray-300 rounded px-1">{badge}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Nível {currentUser.level}</span>
                <span>Próximo: {currentUser.level + 1}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Próximos jogos */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" /> Próximos Jogos
              </h3>
            </div>
            
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="p-2 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-1">
                      {match.status === 'live' && (
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                      FURIA vs {match.opponent}
                    </span>
                    <span className="text-xs text-gray-400">
                      {match.status === 'live' ? 'AO VIVO' : formatMatchTime(match.startTime)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{match.tournament}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Missões */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" /> Missões
              </h3>
              <button
                onClick={() => {}} 
                className="text-sm text-blue-400 hover:underline"
              >
                Ver todas
              </button>
            </div>
            
            <div className="space-y-4">
              {missions.map((mission) => (
                <div 
                  key={mission.id}
                  className={`p-3 rounded-lg border ${mission.completed 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-gray-800 border-gray-700'}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{mission.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium flex justify-between">
                        {mission.title}
                        <span className={`text-sm ${mission.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                          {mission.completed ? 'Completo' : `+${mission.reward} XP`}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">{mission.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* FURIBOT */}
          <div className="mt-4">
            <button
              onClick={openFuriBot}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg p-3 flex items-center gap-3 transition-colors"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src="/furibot-logo.png" alt="FURIBOT" className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">FURIBOT</div>
                <div className="text-xs text-gray-300">Pergunte sobre estatísticas e jogadores</div>
              </div>
            </button>
          </div>
          
          {/* Quiz widget */}
          <div className="mt-4">
            <div className="bg-gray-900 rounded-lg p-3">
              <h3 className="font-bold mb-2 text-sm">Quiz FURIA</h3>
              <div className="text-xs">Teste seus conhecimentos sobre a FURIA</div>
              <div className="mt-1.5 flex items-center text-xs text-gray-400">
                <span className="mr-3">10 Perguntas</span>
                <span>Dificuldade: <span className="text-yellow-400">Médio</span></span>
              </div>
              <div className="mt-1.5">
                <div className="text-xs mb-1">Concluído por 65% dos fãs</div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <button 
                className="mt-3 w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-1.5 rounded-md text-sm transition-colors"
                onClick={() => alert('Iniciando quiz!')}
              >
                Iniciar Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulador de chat */}
      <ChatSimulator 
        onNewMessage={handleSimulatedMessage}
        matchInProgress={matchInfo.status === 'live'}
        currentRound={matchInfo.round}
        currentMap={matchInfo.map}
        score={matchInfo.score}
      />
    </div>
  );
};

export default ChatPage; 