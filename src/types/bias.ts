export type BiasType = 'gender' | 'racial' | 'age' | 'disability' | 'religious' | 'none';

export type MessageSource = 'slack' | 'teams' | 'email';

export type Department = 'engineering' | 'sales' | 'marketing' | 'hr' | 'finance' | 'operations' | 'executive';

export interface BiasIndicator {
  type: BiasType;
  phrase: string;
  startIndex: number;
  endIndex: number;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface AnalyzedMessage {
  id: string;
  source: MessageSource;
  sender: string;
  department: Department;
  content: string;
  timestamp: Date;
  biasIndicators: BiasIndicator[];
  overallBiasScore: number; // 0-100
}