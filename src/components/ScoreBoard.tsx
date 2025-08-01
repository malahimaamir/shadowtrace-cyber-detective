import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, Users, Crown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  score: number;
  rank: string;
  badges: string[];
}

interface ScoreBoardProps {
  user: User;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: string;
  badge: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ user }) => {
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'CyberNinja', score: 2840, rank: 'Elite Investigator', badge: '👑' },
    { id: '2', name: 'Agent Smith', score: 2654, rank: 'Senior Detective', badge: '🔥' },
    { id: '3', name: 'DataHunter', score: 2103, rank: 'Cyber Detective', badge: '⚡' },
    { id: '4', name: user.name, score: user.score, rank: user.rank, badge: '🕵️' },
    { id: '5', name: 'SecurityPro', score: 1089, rank: 'Junior Detective', badge: '🛡️' },
  ];

  const userPosition = leaderboard.findIndex(entry => entry.id === user.id) + 1;
  
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Elite Investigator': return 'text-yellow-400';
      case 'Senior Detective': return 'text-orange-400';
      case 'Cyber Detective': return 'text-purple-400';
      case 'Junior Detective': return 'text-blue-400';
      default: return 'text-primary';
    }
  };

  const getNextRankScore = () => {
    const nextRankScores = {
      'Junior Detective': 1500,
      'Cyber Detective': 2000,
      'Senior Detective': 2500,
      'Elite Investigator': 3000
    };
    
    return nextRankScores[user.rank as keyof typeof nextRankScores] || 3000;
  };

  const getProgressToNextRank = () => {
    const nextScore = getNextRankScore();
    const previousRankScore = user.rank === 'Junior Detective' ? 0 :
                            user.rank === 'Cyber Detective' ? 1500 :
                            user.rank === 'Senior Detective' ? 2000 : 2500;
    
    const progress = ((user.score - previousRankScore) / (nextScore - previousRankScore)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const badgeIcons = {
    'Log Sniper': <Target className="h-4 w-4" />,
    'Encryption Breaker': <Zap className="h-4 w-4" />,
    'Speed Demon': <Crown className="h-4 w-4" />,
    'Team Player': <Users className="h-4 w-4" />,
    'Perfect Score': <Star className="h-4 w-4" />
  };

  return (
    <div className="space-y-4">
      {/* User Score Card */}
      <Card className="cyber-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-accent" />
            <span>Your Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1 terminal-font">
              {user.score.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Score</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Rank Progress</span>
              <span className={getRankColor(user.rank)}>{user.rank}</span>
            </div>
            <Progress value={getProgressToNextRank()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{user.score}</span>
              <span>{getNextRankScore()}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-sm font-medium mb-2">Recent Achievements</p>
            <div className="grid grid-cols-1 gap-2">
              {user.badges.slice(0, 3).map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  {badgeIcons[badge as keyof typeof badgeIcons] || <Star className="h-4 w-4" />}
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="cyber-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span>Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, index) => {
              const isCurrentUser = entry.id === user.id;
              
              return (
                <div
                  key={entry.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {index === 0 ? (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <span className="text-sm font-bold">#{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className={`text-sm font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                        {entry.name}
                      </p>
                      <span className="text-lg">{entry.badge}</span>
                    </div>
                    <p className={`text-xs ${getRankColor(entry.rank)}`}>
                      {entry.rank}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold terminal-font">
                      {entry.score.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              );
            })}
          </div>

          {userPosition > 5 && (
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center space-x-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">#{userPosition}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{user.name} (You)</p>
                  <p className={`text-xs ${getRankColor(user.rank)}`}>{user.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold terminal-font">{user.score.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};