import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Trophy, Activity, AlignCenterHorizontal, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MatchScoreDisplayProps {
  homeTeam: {
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score: number;
  };
  tournament: string;
  stage?: string;
  game?: string;
  currentRound?: number;
  maxRounds?: number;
  currentMap?: string;
  isLive?: boolean;
  startTime?: Date;
  highlights?: number;
}

const LiveMatchScoreDisplay: React.FC<MatchScoreDisplayProps> = ({
  homeTeam,
  awayTeam,
  tournament,
  stage,
  game,
  currentRound,
  maxRounds,
  currentMap,
  isLive = true,
  startTime = new Date(),
  highlights = 0
}) => {
  // Array of maps for display
  const maps = currentMap 
    ? ['Inferno', currentMap, 'Nuke'].filter((m, i, arr) => 
        m === currentMap || arr.indexOf(currentMap) !== i
      )
    : ['Inferno', 'Mirage', 'Nuke'];
    
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  
  // Calculate elapsed match time
  useEffect(() => {
    if (!isLive) return;
    
    const initialElapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setElapsedTime(initialElapsed);
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLive, startTime]);
  
  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simulate highlight notification
  useEffect(() => {
    if (highlights > 0) {
      setShowHighlight(true);
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [highlights]);

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <Link to="/" className="hover:text-furia-purple transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/live-match" className="hover:text-furia-purple transition-colors">Partidas Ao Vivo</Link>
        <span className="mx-2">›</span>
        <span className="text-furia-purple">{homeTeam.name} vs {awayTeam.name}</span>
      </div>
      
      {/* Title with live indicator */}
      <div className="flex items-center mb-1">
        <div className="mr-2 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
        <h1 className="text-2xl font-bold">Partida Ao Vivo: {homeTeam.name} vs {awayTeam.name}</h1>
      </div>
      
      {/* Tournament info with enhanced details */}
      <div className="flex flex-wrap items-center text-gray-400 text-sm mb-4 gap-3">
        <div className="flex items-center">
          <Trophy size={14} className="mr-1" />
          <span>{tournament}</span>
        </div>
        
        {stage && (
          <div className="flex items-center">
            <Activity size={14} className="mr-1" />
            <span>{stage}</span>
          </div>
        )}
        
        {game && (
          <div className="flex items-center">
            <AlignCenterHorizontal size={14} className="mr-1" />
            <span>{game}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{startTime.toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Highlight notification */}
      {showHighlight && (
        <div className="mb-4 p-2 bg-yellow-600/20 border border-yellow-600/40 rounded-lg animate-pulse flex items-center">
          <AlertCircle size={16} className="mr-2 text-yellow-500" />
          <span className="text-yellow-500 font-medium">Nova jogada incrível! Confira o destaque no chat!</span>
        </div>
      )}
      
      {/* Match score card */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
        {/* Match timer */}
        <div className="p-2 text-center text-sm font-medium bg-furia-darker flex items-center justify-center gap-2">
          <Clock size={14} className="text-furia-purple" />
          <span className="text-white">Tempo: </span>
          <span className="text-furia-purple font-medium">{formatTime(elapsedTime)}</span>
          
          {isLive && (
            <>
              <span className="mx-1">•</span>
              <span className="bg-red-600/20 text-red-500 px-2 py-0.5 rounded-full text-xs flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-1"></span>
                AO VIVO
              </span>
            </>
          )}
        </div>
        
        {/* Current map indicator */}
        {currentMap && (
          <div className="p-2 text-center text-sm font-medium bg-furia-purple/20">
            <span className="text-white">Mapa Atual: </span>
            <span className="text-furia-purple font-medium">{currentMap}</span>
          </div>
        )}
        
        {/* Main score display */}
        <div className="p-6 flex items-center justify-between">
          {/* Home team - FURIA */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={homeTeam.logo} 
                alt={homeTeam.name} 
                className="h-16 w-16 object-contain mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/120?text=${homeTeam.name}`;
                }}
              />
              {homeTeam.name === 'FURIA' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-furia-purple rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  BR
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold">{homeTeam.name}</h2>
            <p className="text-furia-purple text-xs">Home Team</p>
            
            {/* Additional team stats */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center bg-gray-800 p-1 rounded">
                <span className="text-gray-400">K/D</span>
                <span className="font-medium">1.2</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-1 rounded">
                <span className="text-gray-400">ADR</span>
                <span className="font-medium">86.5</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-1 rounded">
                <span className="text-gray-400">HS%</span>
                <span className="font-medium">48%</span>
              </div>
            </div>
          </div>
          
          {/* Score */}
          <div className="mx-8 text-center">
            <div className="flex items-center justify-center">
              <span className={`text-5xl font-bold ${homeTeam.score > awayTeam.score ? 'text-green-500' : ''}`}>
                {homeTeam.score}
              </span>
              <span className="mx-3 text-3xl font-bold text-gray-600">:</span>
              <span className={`text-5xl font-bold ${awayTeam.score > homeTeam.score ? 'text-green-500' : ''}`}>
                {awayTeam.score}
              </span>
            </div>
            
            {/* Last 5 rounds indicators */}
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${
                    i % 2 === 0 ? 'bg-furia-purple' : 'bg-red-500'
                  }`}
                  title={`Round ${currentRound && currentRound - (4 - i)}: ${i % 2 === 0 ? homeTeam.name : awayTeam.name} victory`}
                ></div>
              ))}
            </div>
            
            {currentRound && maxRounds && (
              <div className="flex items-center justify-center text-xs text-gray-400 mt-2">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                <span>Round {currentRound}/{maxRounds}</span>
              </div>
            )}
          </div>
          
          {/* Away team */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={awayTeam.logo} 
                alt={awayTeam.name} 
                className="h-16 w-16 object-contain mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/120?text=${awayTeam.name}`;
                }}
              />
              {awayTeam.name === 'NAVI' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  UA
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold">{awayTeam.name}</h2>
            <p className="text-gray-400 text-xs">Away Team</p>
            
            {/* Additional team stats */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center bg-gray-800 p-1 rounded">
                <span className="text-gray-400">K/D</span>
                <span className="font-medium">1.1</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-1 rounded">
                <span className="text-gray-400">ADR</span>
                <span className="font-medium">82.7</span>
              </div>
              <div className="flex flex-col items-center bg-gray-800 p-1 rounded">
                <span className="text-gray-400">HS%</span>
                <span className="font-medium">45%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map progression indicator */}
        <div className="px-4 pb-3">
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-furia-purple to-red-500 h-full rounded-full"
              style={{ width: `${(currentRound || 0) / (maxRounds || 30) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Map tabs */}
        <div className="grid grid-cols-3 text-center">
          {maps.map((map, index) => (
            <div 
              key={map}
              className={`p-3 cursor-pointer transition-colors ${
                map === currentMap
                  ? 'bg-furia-purple text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <span>{map}</span>
                {index === 0 && homeTeam.score > awayTeam.score && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-1 rounded">
                    {homeTeam.name}
                  </span>
                )}
                {index === 2 && awayTeam.score > homeTeam.score && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-1 rounded">
                    {awayTeam.name}
                  </span>
                )}
              </div>
              {map === currentMap && <div className="text-xs">Current</div>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Top Player</div>
          <div className="font-bold">yuurih</div>
          <div className="text-furia-purple text-sm">24 Kills (1.38 Rating)</div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Map Time</div>
          <div className="font-bold">{formatTime(elapsedTime)}</div>
          <div className="text-furia-purple text-sm">Round {currentRound || '?'}</div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Spectators</div>
          <div className="font-bold">{Math.floor(Math.random() * 50000 + 85000).toLocaleString()}</div>
          <div className="text-furia-purple text-sm">Watching now</div>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchScoreDisplay; 