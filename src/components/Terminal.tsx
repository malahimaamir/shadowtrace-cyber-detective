import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal as TerminalIcon, Send } from 'lucide-react';

interface TerminalProps {
  currentCase: any;
}

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success';
  content: string;
  timestamp: string;
}

export const Terminal: React.FC<TerminalProps> = ({ currentCase }) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: 'ShadowTrace Investigation Terminal v2.1.0',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    help: () => ({
      type: 'output' as const,
      content: `Available commands:
• trace <ip>        - Trace IP address
• scan <target>     - Scan for vulnerabilities  
• decode <data>     - Decode encrypted data
• analyze <file>    - Analyze suspicious file
• whois <domain>    - Domain information lookup
• netstat          - Show network connections
• clear            - Clear terminal
• status           - Show case status`
    }),
    
    trace: (args: string[]) => {
      const ip = args[0] || '192.168.1.1';
      return {
        type: 'output' as const,
        content: `Tracing route to ${ip}...
1  gateway.local (192.168.1.1)  1.234ms
2  isp-router.net (10.0.0.1)    12.456ms  
3  backbone.net (203.0.113.1)   45.789ms
4  ${ip}  78.123ms
Trace complete. Suspicious routing detected.`
      };
    },

    scan: (args: string[]) => {
      const target = args[0] || 'localhost';
      return {
        type: 'output' as const,
        content: `Scanning ${target}...
Port 22:  OPEN  (SSH)
Port 80:  OPEN  (HTTP)
Port 443: OPEN  (HTTPS)
Port 8080: FILTERED
Vulnerability detected: CVE-2023-1234`
      };
    },

    decode: (args: string[]) => {
      const data = args.join(' ') || 'SGVsbG8gV29ybGQ=';
      return {
        type: 'success' as const,
        content: `Decoding: ${data}
Result: "Meeting at midnight. Location: Warehouse District."
Encryption: Base64`
      };
    },

    analyze: (args: string[]) => {
      const file = args[0] || 'suspicious.exe';
      return {
        type: 'output' as const,
        content: `Analyzing ${file}...
File Type: PE32 executable
Size: 2.1MB
Hash: a1b2c3d4e5f6...
Threat Level: HIGH
Classification: Trojan.GenKryptor`
      };
    },

    whois: (args: string[]) => {
      const domain = args[0] || 'suspicious-domain.com';
      return {
        type: 'output' as const,
        content: `WHOIS information for ${domain}:
Registrar: Anonymous Registrations Inc.
Created: 2024-01-01
Expires: 2024-12-31
Status: SUSPICIOUS
Nameservers: Hidden via proxy`
      };
    },

    netstat: () => ({
      type: 'output' as const,
      content: `Active connections:
TCP  192.168.1.100:445    ESTABLISHED
TCP  192.168.1.100:3389   LISTENING  
UDP  192.168.1.100:53     *:*
Suspicious connection to 203.0.113.45:6667`
    }),

    clear: () => null,

    status: () => ({
      type: 'success' as const,
      content: currentCase ? 
        `Case: ${currentCase.title}
Status: IN PROGRESS
Evidence Collected: 3/7
Clues Found: 2/5
Progress: 45%` :
        'No active case. Use "cases" command to start investigation.'
    })
  };

  const executeCommand = () => {
    if (!command.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const [cmd, ...args] = command.trim().toLowerCase().split(' ');

    // Add command to history
    setHistory(prev => [...prev, {
      type: 'command',
      content: `$ ${command}`,
      timestamp
    }]);

    // Execute command
    if (cmd === 'clear') {
      setHistory([]);
    } else if (commands[cmd as keyof typeof commands]) {
      const result = commands[cmd as keyof typeof commands](args);
      if (result) {
        setHistory(prev => [...prev, { ...result, timestamp }]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Command not found: ${cmd}. Type "help" for available commands.`,
        timestamp
      }]);
    }

    setCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'command': return 'text-primary';
      case 'error': return 'text-destructive';
      case 'success': return 'text-terminal-green';
      default: return 'text-foreground';
    }
  };

  return (
    <Card className="h-[600px] cyber-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <TerminalIcon className="h-5 w-5 text-primary" />
          <span className="terminal-font">Investigation Terminal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="h-full flex flex-col">
          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className="flex-1 p-4 bg-muted/20 overflow-y-auto terminal-font text-sm space-y-1"
          >
            {history.map((line, index) => (
              <div key={index} className={`${getLineColor(line.type)}`}>
                <span className="text-muted-foreground text-xs mr-2">
                  [{line.timestamp}]
                </span>
                <span className="whitespace-pre-wrap">{line.content}</span>
              </div>
            ))}
          </div>

          {/* Command Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-primary terminal-font">$</span>
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter investigation command..."
                  className="terminal-font bg-transparent border-0 focus:ring-0 px-0"
                />
              </div>
              <Button 
                onClick={executeCommand}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};