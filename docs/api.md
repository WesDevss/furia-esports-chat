# Documentação da API

O FURIA Chat usa uma API REST para comunicação com o servidor, além de WebSockets para funcionalidades em tempo real.

## Endpoints REST

### Usuários

#### GET /api/users
Retorna uma lista de todos os usuários.

**Resposta:**
```json
{
  "users": [
    {
      "_id": "1",
      "username": "FuriaFan123",
      "level": 23,
      "points": 12580,
      "region": "América do Sul",
      "country": "Brasil"
    },
    // ...
  ]
}
```

#### GET /api/users/:id
Retorna informações de um usuário específico.

**Resposta:**
```json
{
  "user": {
    "_id": "1",
    "username": "FuriaFan123",
    "level": 23,
    "points": 12580,
    "region": "América do Sul",
    "country": "Brasil"
  }
}
```

### Mensagens

#### GET /api/messages
Retorna uma lista das mensagens recentes.

**Parâmetros de consulta:**
- `limit`: Limite de mensagens (padrão: 50)
- `matchId`: Filtrar por partida

**Resposta:**
```json
{
  "messages": [
    {
      "_id": "1",
      "user": {
        "_id": "1",
        "username": "FuriaFan123"
      },
      "content": "Vamos FURIA!!!",
      "type": "text",
      "timestamp": "2023-05-01T12:00:00Z",
      "reactions": []
    },
    // ...
  ]
}
```

#### POST /api/messages
Envia uma nova mensagem.

**Corpo da Requisição:**
```json
{
  "user": "1",
  "content": "Grande jogada!",
  "type": "text",
  "matchId": "1"
}
```

**Resposta:**
```json
{
  "message": {
    "_id": "3",
    "user": {
      "_id": "1",
      "username": "FuriaFan123"
    },
    "content": "Grande jogada!",
    "type": "text",
    "timestamp": "2023-05-01T12:05:00Z",
    "reactions": []
  }
}
```

### Partidas

#### GET /api/matches
Retorna uma lista de partidas.

**Parâmetros de consulta:**
- `status`: Filtrar por status (live, scheduled, completed)

**Resposta:**
```json
{
  "matches": [
    {
      "_id": "1",
      "opponent": "NAVI",
      "tournament": "Major Rio 2023",
      "status": "live",
      "maps": [
        {
          "name": "Inferno",
          "furiaScore": 13,
          "opponentScore": 10
        },
        // ...
      ],
      "highlights": [
        {
          "description": "Art fez um clutch 1v3!",
          "type": "clutch",
          "player": "Art",
          "timestamp": "2023-05-01T12:30:00Z"
        },
        // ...
      ]
    },
    // ...
  ]
}
```

#### GET /api/matches/:id
Retorna informações sobre uma partida específica.

**Resposta:**
```json
{
  "match": {
    "_id": "1",
    "opponent": "NAVI",
    "tournament": "Major Rio 2023",
    "status": "live",
    "maps": [
      {
        "name": "Inferno",
        "furiaScore": 13,
        "opponentScore": 10
      },
      // ...
    ],
    "highlights": [
      {
        "description": "Art fez um clutch 1v3!",
        "type": "clutch",
        "player": "Art",
        "timestamp": "2023-05-01T12:30:00Z"
      },
      // ...
    ]
  }
}
```

## Eventos Socket.IO

O FURIA Chat utiliza Socket.IO para comunicação em tempo real entre o cliente e o servidor.

### Eventos do Cliente para o Servidor

#### `join`
Envia quando um usuário entra no chat.
```javascript
socket.emit('join', { username: 'FuriaFan123' });
```

#### `message`
Envia uma nova mensagem para o chat.
```javascript
socket.emit('message', {
  user: '1',
  content: 'Vamos FURIA!!!',
  type: 'text',
  matchId: '1'
});
```

#### `match-update`
Atualiza informações sobre uma partida em andamento (apenas para moderadores).
```javascript
socket.emit('match-update', {
  matchId: '1',
  type: 'score',
  mapIndex: 0,
  furiaScore: 14,
  opponentScore: 10
});
```

### Eventos do Servidor para o Cliente

#### `message`
Recebido quando uma nova mensagem é enviada para o chat.
```javascript
socket.on('message', (message) => {
  console.log('Nova mensagem:', message);
});
```

#### `match-update`
Recebido quando há uma atualização em uma partida em andamento.
```javascript
socket.on('match-update', (update) => {
  console.log('Atualização da partida:', update);
});
``` 