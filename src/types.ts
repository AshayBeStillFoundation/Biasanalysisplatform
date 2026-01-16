export interface Message {
  id: string;
  text: string;
  source: 'slack' | 'teams' | 'email';
  timestamp: Date;
  sender: string;
  channel?: string;
}

export interface BiasDetection {
  messageId: string;
  biasType: BiasType;
  severity: 'low' | 'medium' | 'high';
  snippet: string;
  startIndex: number;
  endIndex: number;
  explanation: string;
}

export type BiasType = 
  | 'gender'
  | 'age'
  | 'racial'
  | 'ability'
  | 'socioeconomic'
  | 'religious'
  | 'cultural';

export interface BiasStats {
  totalMessages: number;
  flaggedMessages: number;
  biasTypeDistribution: Record<BiasType, number>;
  severityDistribution: Record<string, number>;
  sourceDistribution: Record<string, number>;
}
