import { BiasDetection, BiasType, Message } from '../types';

interface BiasPattern {
  pattern: RegExp;
  type: BiasType;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

const biasPatterns: BiasPattern[] = [
  // Gender bias
  {
    pattern: /\b(bossy|emotional|feisty|hysterical|shrill)\b/gi,
    type: 'gender',
    severity: 'medium',
    explanation: 'Gender-coded language often used to describe women negatively'
  },
  {
    pattern: /\b(girls?|ladies)\b(?!\s+(bathroom|room|night))/gi,
    type: 'gender',
    severity: 'low',
    explanation: 'Using "girls" or "ladies" in professional context can be diminishing'
  },
  {
    pattern: /\b(manpower|mankind|chairman|policeman|fireman)\b/gi,
    type: 'gender',
    severity: 'low',
    explanation: 'Gender-specific terms that have neutral alternatives'
  },
  
  // Age bias
  {
    pattern: /\b(too old|young blood|digital native|old[-\s]school|millennials? are)\b/gi,
    type: 'age',
    severity: 'medium',
    explanation: 'Age-based stereotyping or discrimination'
  },
  {
    pattern: /\b(overqualified|long[- ]?time employee|recent graduate)\b/gi,
    type: 'age',
    severity: 'low',
    explanation: 'Potentially age-discriminatory language'
  },
  
  // Racial/ethnic bias
  {
    pattern: /\b(articulate|well-spoken|urban|ethnic|exotic)\b(?=.*\b(person|individual|colleague|team member)\b)/gi,
    type: 'racial',
    severity: 'high',
    explanation: 'Language that can perpetuate racial stereotypes'
  },
  {
    pattern: /\b(cultural fit|traditional values|heritage)\b/gi,
    type: 'cultural',
    severity: 'low',
    explanation: 'May indicate cultural bias or exclusionary practices'
  },
  
  // Ability bias
  {
    pattern: /\b(crazy|insane|lame|dumb|blind to|deaf to)\b/gi,
    type: 'ability',
    severity: 'medium',
    explanation: 'Ableist language that can be offensive'
  },
  {
    pattern: /\b(handicapped|wheelchair[- ]?bound|suffers from|victim of)\b/gi,
    type: 'ability',
    severity: 'high',
    explanation: 'Outdated or negative framing of disability'
  },
  
  // Socioeconomic bias
  {
    pattern: /\b(low[- ]?class|blue[- ]?collar|ghetto|trailer park|inner[- ]?city)\b/gi,
    type: 'socioeconomic',
    severity: 'high',
    explanation: 'Socioeconomic stereotyping or discrimination'
  },
  
  // Religious bias
  {
    pattern: /\b(crusade|jihad|holy war)\b(?!.*\b(historical|history|medieval)\b)/gi,
    type: 'religious',
    severity: 'medium',
    explanation: 'Religious terminology used inappropriately'
  }
];

export function detectBias(message: Message): BiasDetection[] {
  const detections: BiasDetection[] = [];
  const text = message.text;

  for (const pattern of biasPatterns) {
    let match;
    const regex = new RegExp(pattern.pattern);
    
    while ((match = regex.exec(text)) !== null) {
      detections.push({
        messageId: message.id,
        biasType: pattern.type,
        severity: pattern.severity,
        snippet: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        explanation: pattern.explanation
      });
    }
  }

  return detections;
}

export function analyzeAllMessages(messages: Message[]): BiasDetection[] {
  const allDetections: BiasDetection[] = [];
  
  for (const message of messages) {
    const detections = detectBias(message);
    allDetections.push(...detections);
  }
  
  return allDetections;
}
