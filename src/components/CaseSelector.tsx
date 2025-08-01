import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Zap, Shield, Lock, Star } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  timeLimit: number;
  description: string;
  evidence: any[];
  logs: any[];
  completed?: boolean;
  score?: number;
  category?: string;
}

interface CaseSelectorProps {
  cases: Case[];
  onCaseSelect: (case_: Case) => void;
}

export const CaseSelector: React.FC<CaseSelectorProps> = ({ cases, onCaseSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const extendedCases: Case[] = [
    ...cases,
    {
      id: '3',
      title: 'Data Breach Investigation',
      difficulty: 'Medium',
      timeLimit: 450,
      description: 'Customer database compromised. Identify the attack vector and scope of breach.',
      evidence: [],
      logs: [],
      category: 'Data Protection',
      completed: true,
      score: 850
    },
    {
      id: '4',
      title: 'Advanced Persistent Threat',
      difficulty: 'Expert',
      timeLimit: 900,
      description: 'Long-term infiltration detected. Trace the complete attack timeline and identify all compromised systems.',
      evidence: [],
      logs: [],
      category: 'APT Analysis'
    },
    {
      id: '5',
      title: 'Social Engineering Attack',
      difficulty: 'Easy',
      timeLimit: 240,
      description: 'Employee received suspicious phone call requesting credentials. Investigate the social engineering attempt.',
      evidence: [],
      logs: [],
      category: 'Human Factor'
    },
    {
      id: '6',
      title: 'Cryptocurrency Fraud',
      difficulty: 'Hard',
      timeLimit: 720,
      description: 'Blockchain transactions indicate fraudulent activity. Trace the money flow and identify perpetrators.',
      evidence: [],
      logs: [],
      category: 'Financial Crime'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-terminal-green text-background';
      case 'Medium': return 'bg-cyber-amber text-background';
      case 'Hard': return 'bg-accent text-accent-foreground';
      case 'Expert': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return <Shield className="h-4 w-4" />;
      case 'Medium': return <Target className="h-4 w-4" />;
      case 'Hard': return <Zap className="h-4 w-4" />;
      case 'Expert': return <Lock className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const categories = ['all', ...Array.from(new Set(extendedCases.map(c => c.category).filter(Boolean)))];

  const filteredCases = extendedCases.filter(case_ => 
    selectedCategory === 'all' || case_.category === selectedCategory
  );

  const getCompletionRate = () => {
    const completed = extendedCases.filter(c => c.completed).length;
    return Math.round((completed / extendedCases.length) * 100);
  };

  return (
    <Card className="h-[600px] cyber-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Case Files</span>
          </div>
          <Badge variant="outline" className="terminal-font">
            {filteredCases.length} cases
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-full flex flex-col space-y-4">
        {/* Progress Overview */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Investigation Progress</span>
            <span className="text-sm text-muted-foreground">{getCompletionRate()}%</span>
          </div>
          <Progress value={getCompletionRate()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{extendedCases.filter(c => c.completed).length} completed</span>
            <span>{extendedCases.length - extendedCases.filter(c => c.completed).length} remaining</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize text-xs"
            >
              {category === 'all' ? 'All Cases' : category}
            </Button>
          ))}
        </div>

        {/* Case List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{case_.title}</h4>
                    {case_.completed && (
                      <Badge variant="outline" className="text-xs text-terminal-green">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {case_.description}
                  </p>

                  {case_.category && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {case_.category}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getDifficultyColor(case_.difficulty)}>
                    {getDifficultyIcon(case_.difficulty)}
                    <span className="ml-1">{case_.difficulty}</span>
                  </Badge>
                  
                  {case_.score && (
                    <Badge variant="outline" className="text-xs terminal-font">
                      {case_.score} pts
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(case_.timeLimit)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onCaseSelect(case_)}
                  size="sm"
                  disabled={case_.completed}
                  className="flex items-center space-x-1"
                >
                  {case_.completed ? (
                    <>
                      <Star className="h-4 w-4" />
                      <span>Review</span>
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      <span>Start Investigation</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No cases found</p>
            <p className="text-sm">Try adjusting your filter settings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};