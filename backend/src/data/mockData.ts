import { MockData } from '../types';

/**
 * Dados simulados para desenvolvimento e teste
 */
export const mockData: MockData = {
  users: [],
  matches: [],
  messages: []
};

/**
 * Inicializa os dados mock para testes
 */
export const initMockData = (): void => {
  // Users
  mockData.users = [
    { 
      _id: '1', 
      username: 'FuriaFan123', 
      email: 'fan@example.com', 
      password: 'hashed_password', 
      level: 23, 
      points: 12580, 
      region: 'América do Sul', 
      country: 'Brasil' 
    },
    { 
      _id: '2', 
      username: 'CSGOMaster', 
      email: 'csgo@example.com', 
      password: 'hashed_password', 
      level: 21, 
      points: 11840, 
      region: 'América do Sul', 
      country: 'Brasil' 
    },
    { 
      _id: '3', 
      username: 'KSceFã', 
      email: 'ksce@example.com', 
      password: 'hashed_password', 
      level: 20, 
      points: 10950, 
      region: 'América do Sul', 
      country: 'Argentina' 
    }
  ];
  
  // Matches
  mockData.matches = [
    {
      _id: '1',
      opponent: 'NAVI',
      opponentLogo: '/team-logos/navi-logo.png',
      tournament: 'Major Rio 2024',
      status: 'live',
      maps: [
        { name: 'Inferno', furiaScore: 13, opponentScore: 10 },
        { name: 'Nuke', furiaScore: 7, opponentScore: 9 }
      ],
      highlights: [
        { 
          description: 'Art fez um clutch 1v3!', 
          type: 'clutch', 
          player: 'Art', 
          timestamp: new Date() 
        }
      ]
    },
    {
      _id: '2',
      opponent: 'FaZe Clan',
      opponentLogo: '/team-logos/faze-logo.png',
      tournament: 'ESL Pro League',
      status: 'scheduled',
      maps: [],
      startTime: new Date(Date.now() + 86400000) // Tomorrow
    }
  ];
  
  // Messages
  mockData.messages = [
    {
      _id: '1',
      user: '1',
      content: 'Vamos FURIA!!!',
      type: 'text',
      timestamp: new Date(Date.now() - 300000),
      reactions: []
    },
    {
      _id: '2',
      user: '2',
      content: 'Grande jogada do Art!',
      type: 'text',
      timestamp: new Date(Date.now() - 200000),
      reactions: []
    }
  ];
}; 