import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Shield, Target, Zap, Users, Trophy } from 'lucide-react';
import { Terminal } from './Terminal';
import { LogAnalyzer } from './LogAnalyzer';
import { EvidenceBoard } from './EvidenceBoard';
import { CaseSelector } from './CaseSelector';
import { ScoreBoard } from './ScoreBoard';

interface Case {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  timeLimit: number;
  description: string;
  evidence: any[];
  logs: any[];
}

interface User {
  id: string;
  name: string;
  score: number;
  rank: string;
  badges: string[];
}

export const Dashboard = () => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Agent Shadow',
    score: 1250,
    rank: 'Cyber Detective',
    badges: ['Log Sniper', 'Encryption Breaker', 'Speed Demon']
  });

  // Sample cases
  const sampleCases: Case[] = [
    {
      id: '1',
      title: 'Phishing Attack Investigation',
      difficulty: 'Easy',
      timeLimit: 300,
      description: 'A corporate email system has been compromised. Trace the phishing email and identify the attacker.',
      evidence: [],
      logs: [
        { timestamp: '2024-01-15 09:23:15', source: 'email-server', message: 'Suspicious email from finance-team@suspicious-domain.com' },
        { timestamp: '2024-01-15 09:24:32', source: 'firewall', message: 'Blocked connection to 192.168.100.45' },
        { timestamp: '2024-01-15 09:25:01', source: 'user-activity', message: 'User clicked malicious link' }
      ]
    },
    {
      id: '2',
      title: 'Ransomware Incident Response',
      difficulty: 'Hard',
      timeLimit: 600,
      description: 'Multiple systems have been encrypted. Find the entry point and trace the ransomware deployment.',
      evidence: [],
      logs: [
        { timestamp: '2024-01-15 14:15:22', source: 'endpoint-security', message: 'File encryption detected on WORKSTATION-01' },
        { timestamp: '2024-01-15 14:16:45', source: 'network-monitor', message: 'Unusual outbound traffic to tor-exit-node.onion' },
        { timestamp: '2024-01-15 14:17:12', source: 'system-logs', message: 'Scheduled task created: "SystemUpdate.exe"' }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        if (currentCase) {
          const elapsed = currentCase.timeLimit - timeLeft;
          setProgress((elapsed / currentCase.timeLimit) * 100);
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Handle time up logic
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentCase]);

  const startCase = (caseData: Case) => {
    setCurrentCase(caseData);
    setTimeLeft(caseData.timeLimit);
    setProgress(0);
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-terminal-green';
      case 'Medium': return 'bg-cyber-amber';
      case 'Hard': return 'bg-accent';
      case 'Expert': return 'bg-destructive';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8 text-primary cyber-glow" />
          <h1 className="text-3xl font-bold matrix-text">ShadowTrace</h1>
          <Badge variant="outline" className="terminal-font">
            Real-Time Cyber Investigation
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Agent</p>
            <p className="font-semibold text-primary">{user.name}</p>
          </div>
          <Badge className={getDifficultyColor(user.rank)}>
            {user.rank}
          </Badge>
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="font-mono font-semibold text-accent">{user.score}</span>
          </div>
        </div>
      </div>

      {/* Timer and Progress */}
      {currentCase && (
        <Card className="mb-6 cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Timer className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Case</p>
                  <p className="font-semibold">{currentCase.title}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Time Remaining</p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <Badge className={getDifficultyColor(currentCase.difficulty)}>
                  {currentCase.difficulty}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Investigation Tools */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="terminal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="terminal" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Terminal</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Log Analyzer</span>
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Evidence Board</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Cases</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terminal">
              <Terminal currentCase={currentCase} />
            </TabsContent>

            <TabsContent value="logs">
              <LogAnalyzer logs={currentCase?.logs || []} />
            </TabsContent>

            <TabsContent value="evidence">
              <EvidenceBoard evidence={currentCase?.evidence || []} />
            </TabsContent>

            <TabsContent value="cases">
              <CaseSelector cases={sampleCases} onCaseSelect={startCase} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ScoreBoard user={user} />
          
          {/* Quick Stats */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cases Solved</span>
                  <span className="font-semibold text-terminal-green">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Time</span>
                  <span className="font-semibold text-primary">04:32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-semibold text-accent">89%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="w-full justify-center">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};