interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

export const fallbackQuizzes: Quiz[] = [
  {
    id: 'furia-conhecimentos',
    title: 'Quiz FURIA',
    description: 'Teste seus conhecimentos sobre a FURIA',
    difficulty: 'Médio',
    questions: [
      {
        id: 'q1',
        text: 'Em que ano a FURIA foi fundada?',
        options: [
          { id: 'a', text: '2015' },
          { id: 'b', text: '2016' },
          { id: 'c', text: '2017' },
          { id: 'd', text: '2018' }
        ],
        correctOptionId: 'c'
      },
      {
        id: 'q2',
        text: 'Quem é o fundador da FURIA?',
        options: [
          { id: 'a', text: 'Jaime Pádua' },
          { id: 'b', text: 'André Akkari' },
          { id: 'c', text: 'Ronaldo Fenômeno' },
          { id: 'd', text: 'Gabriel FalleN Toledo' }
        ],
        correctOptionId: 'b'
      },
      {
        id: 'q3',
        text: 'Qual foi o primeiro jogo em que a FURIA competiu profissionalmente?',
        options: [
          { id: 'a', text: 'CS:GO' },
          { id: 'b', text: 'League of Legends' },
          { id: 'c', text: 'VALORANT' },
          { id: 'd', text: 'Rainbow Six Siege' }
        ],
        correctOptionId: 'a'
      }
    ]
  },
  {
    id: 'cs2-tactics',
    title: 'Táticas de CS2',
    description: 'Quanto você sabe sobre táticas competitivas de CS2?',
    difficulty: 'Difícil',
    questions: [
      {
        id: 'q1',
        text: 'Qual é o nome da tática onde todos os jogadores compram apenas pistolas?',
        options: [
          { id: 'a', text: 'Eco' },
          { id: 'b', text: 'Pistol Round' },
          { id: 'c', text: 'Force Buy' },
          { id: 'd', text: 'Full Save' }
        ],
        correctOptionId: 'a'
      },
      {
        id: 'q2',
        text: 'Qual posição é conhecida como "Heaven" no mapa Nuke?',
        options: [
          { id: 'a', text: 'Bombsite A' },
          { id: 'b', text: 'Bombsite B' },
          { id: 'c', text: 'Ramp' },
          { id: 'd', text: 'Outside' }
        ],
        correctOptionId: 'a'
      },
      {
        id: 'q3',
        text: 'O que significa a sigla AWP?',
        options: [
          { id: 'a', text: 'Advanced Warfare Precision' },
          { id: 'b', text: 'Arctic Warfare Police' },
          { id: 'c', text: 'Automatic Weapon Precision' },
          { id: 'd', text: 'Advanced Weapon Protocol' }
        ],
        correctOptionId: 'b'
      }
    ]
  },
  {
    id: 'valorant-agentes',
    title: 'Agentes do VALORANT',
    description: 'Teste seus conhecimentos sobre agentes e habilidades',
    difficulty: 'Fácil',
    questions: [
      {
        id: 'q1',
        text: 'Qual agente de VALORANT tem a habilidade "Curar"?',
        options: [
          { id: 'a', text: 'Phoenix' },
          { id: 'b', text: 'Sage' },
          { id: 'c', text: 'Reyna' },
          { id: 'd', text: 'Skye' }
        ],
        correctOptionId: 'b'
      },
      {
        id: 'q2',
        text: 'Qual é a função do agente Sova?',
        options: [
          { id: 'a', text: 'Duelista' },
          { id: 'b', text: 'Controlador' },
          { id: 'c', text: 'Sentinela' },
          { id: 'd', text: 'Iniciador' }
        ],
        correctOptionId: 'd'
      },
      {
        id: 'q3',
        text: 'Qual agente pode criar paredes de gelo?',
        options: [
          { id: 'a', text: 'Viper' },
          { id: 'b', text: 'Sage' },
          { id: 'c', text: 'Omen' },
          { id: 'd', text: 'Cypher' }
        ],
        correctOptionId: 'b'
      }
    ]
  }
]; 