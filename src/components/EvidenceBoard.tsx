import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PinIcon, Plus, FileText, Link2, Image, Hash } from 'lucide-react';

interface Evidence {
  id: string;
  type: 'file' | 'link' | 'image' | 'hash' | 'note';
  title: string;
  content: string;
  category: string;
  timestamp: string;
  connections: string[];
}

interface EvidenceBoardProps {
  evidence: Evidence[];
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({ evidence: initialEvidence }) => {
  const [evidence, setEvidence] = useState<Evidence[]>([
    {
      id: '1',
      type: 'file',
      title: 'Suspicious Email',
      content: 'From: finance-team@suspicious-domain.com\nSubject: Urgent Payment Required\nAttachment: invoice.pdf',
      category: 'Communication',
      timestamp: '2024-01-15 09:23:15',
      connections: ['2']
    },
    {
      id: '2',
      type: 'hash',
      title: 'Malicious File Hash',
      content: 'SHA256: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      category: 'Forensics',
      timestamp: '2024-01-15 09:45:32',
      connections: ['1', '3']
    },
    {
      id: '3',
      type: 'link',
      title: 'Command & Control Server',
      content: 'https://malicious-c2.onion/api/checkin\nStatus: Active\nLocation: Unknown',
      category: 'Network',
      timestamp: '2024-01-15 10:12:45',
      connections: ['2']
    }
  ]);

  const [newEvidence, setNewEvidence] = useState({
    type: 'note' as Evidence['type'],
    title: '',
    content: '',
    category: ''
  });

  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'file': return <FileText className="h-4 w-4" />;
      case 'link': return <Link2 className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'hash': return <Hash className="h-4 w-4" />;
      default: return <PinIcon className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'communication': return 'bg-primary/20 text-primary';
      case 'forensics': return 'bg-destructive/20 text-destructive';
      case 'network': return 'bg-accent/20 text-accent';
      case 'timeline': return 'bg-terminal-green/20 text-terminal-green';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const addEvidence = () => {
    if (!newEvidence.title.trim() || !newEvidence.content.trim()) return;

    const evidence_item: Evidence = {
      id: Date.now().toString(),
      ...newEvidence,
      timestamp: new Date().toLocaleString(),
      connections: []
    };

    setEvidence(prev => [...prev, evidence_item]);
    setNewEvidence({
      type: 'note',
      title: '',
      content: '',
      category: ''
    });
  };

  const getConnectedEvidence = (evidenceId: string) => {
    const item = evidence.find(e => e.id === evidenceId);
    if (!item) return [];
    
    return evidence.filter(e => 
      item.connections.includes(e.id) || 
      e.connections.includes(evidenceId)
    );
  };

  return (
    <Card className="h-[600px] cyber-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PinIcon className="h-5 w-5 text-primary" />
            <span>Evidence Board</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Add Evidence</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Evidence</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    value={newEvidence.type}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      type: e.target.value as Evidence['type']
                    }))}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                  >
                    <option value="note">Note</option>
                    <option value="file">File</option>
                    <option value="link">Link</option>
                    <option value="image">Image</option>
                    <option value="hash">Hash</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newEvidence.title}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="Evidence title..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={newEvidence.category}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                    placeholder="e.g., Communication, Forensics, Network..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newEvidence.content}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      content: e.target.value
                    }))}
                    placeholder="Evidence details..."
                    className="mt-1 h-24"
                  />
                </div>

                <Button onClick={addEvidence} className="w-full">
                  Add Evidence
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-full overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidence.map((item) => {
            const connections = getConnectedEvidence(item.id);
            const isSelected = selectedEvidence === item.id;
            
            return (
              <div
                key={item.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'border-primary cyber-glow' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedEvidence(isSelected ? null : item.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getEvidenceIcon(item.type)}
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                  </div>
                  <Badge className={getCategoryColor(item.category)} variant="outline">
                    {item.category}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {item.content}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground terminal-font">
                    {item.timestamp}
                  </span>
                  {connections.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {connections.length} connection{connections.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {isSelected && connections.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Connected Evidence:
                    </p>
                    <div className="space-y-1">
                      {connections.map(conn => (
                        <div key={conn.id} className="text-xs p-2 bg-muted/30 rounded">
                          <div className="flex items-center space-x-1">
                            {getEvidenceIcon(conn.type)}
                            <span className="font-medium">{conn.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {evidence.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <PinIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No evidence collected yet</p>
            <p className="text-sm">Start investigating to gather clues</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};