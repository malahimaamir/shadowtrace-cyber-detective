import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, AlertTriangle, Shield, Zap } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  source: string;
  message: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

interface LogAnalyzerProps {
  logs: LogEntry[];
}

export const LogAnalyzer: React.FC<LogAnalyzerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'error': return 'bg-destructive/80 text-destructive-foreground';
      case 'warning': return 'bg-accent text-accent-foreground';
      case 'info': return 'bg-primary/20 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Zap className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  // Enhanced logs with severity if not provided
  const enhancedLogs = logs.map(log => ({
    ...log,
    severity: log.severity || (
      log.message.toLowerCase().includes('suspicious') || 
      log.message.toLowerCase().includes('blocked') ? 'warning' :
      log.message.toLowerCase().includes('malicious') || 
      log.message.toLowerCase().includes('attack') ? 'error' : 'info'
    )
  }));

  const filteredLogs = enhancedLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const severityCounts = enhancedLogs.reduce((counts, log) => {
    counts[log.severity as string] = (counts[log.severity as string] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  return (
    <Card className="h-[600px] cyber-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Log Analyzer</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="terminal-font">
              {filteredLogs.length} entries
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'critical', 'error', 'warning', 'info'].map(severity => (
              <Button
                key={severity}
                variant={filterSeverity === severity ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSeverity(severity)}
                className="capitalize"
              >
                <Filter className="h-4 w-4 mr-1" />
                {severity}
                {severity !== 'all' && severityCounts[severity] && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {severityCounts[severity]}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No logs match your criteria</p>
              <p className="text-sm">Try adjusting your search or filter settings</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div key={index} className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Badge className={getSeverityColor(log.severity)}>
                      {getSeverityIcon(log.severity)}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs terminal-font">
                        {log.source}
                      </Badge>
                      <span className="text-xs text-muted-foreground terminal-font">
                        {log.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm break-words">
                      {log.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Analysis Summary */}
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-destructive">
                {(severityCounts.critical || 0) + (severityCounts.error || 0)}
              </p>
              <p className="text-xs text-muted-foreground">Critical/Error</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {severityCounts.warning || 0}
              </p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {severityCounts.info || 0}
              </p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-terminal-green">
                {Math.round(((severityCounts.critical || 0) + (severityCounts.error || 0)) / enhancedLogs.length * 100) || 0}%
              </p>
              <p className="text-xs text-muted-foreground">Threat Level</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};