import { BiasIndicator, BiasType } from '../types/bias';

interface BiasPattern {
  pattern: RegExp;
  type: BiasType;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

const biasPatterns: BiasPattern[] = [
  // Gender bias
  {
    pattern: /\b(girls?|gals?)\b(?!\s+(night|scout|guide))/gi,
    type: 'gender',
    severity: 'medium',
    explanation: 'Using "girl" or "gal" to refer to adult women can be diminutive'
  },
  {
    pattern: /\b(guys?)\b(?=\s+(?:and|,|$))/gi,
    type: 'gender',
    severity: 'low',
    explanation: 'Using "guys" as a gender-neutral term excludes non-male individuals'
  },
  {
    pattern: /\bhe\/she\b/gi,
    type: 'gender',
    severity: 'low',
    explanation: 'Binary gendered language excludes non-binary individuals'
  },
  {
    pattern: /\bsalesman\b/gi,
    type: 'gender',
    severity: 'medium',
    explanation: 'Gender-specific job title; use "salesperson" instead'
  },
  {
    pattern: /\bchairman\b/gi,
    type: 'gender',
    severity: 'medium',
    explanation: 'Gender-specific title; use "chairperson" or "chair" instead'
  },
  {
    pattern: /\bmanpower\b/gi,
    type: 'gender',
    severity: 'medium',
    explanation: 'Gender-specific term; use "workforce" or "personnel" instead'
  },
  {
    pattern: /\b(hysterical|emotional)\b(?=.*\b(woman|women|she|her)\b)/gi,
    type: 'gender',
    severity: 'high',
    explanation: 'Stereotyping women as overly emotional'
  },

  // Age bias
  {
    pattern: /\b(young|fresh)\s+(blood|talent|energy)\b/gi,
    type: 'age',
    severity: 'high',
    explanation: 'Preference for younger workers discriminates against older candidates'
  },
  {
    pattern: /\bdigital\s+native\b/gi,
    type: 'age',
    severity: 'medium',
    explanation: 'Implies younger people are more tech-savvy, age-biased'
  },
  {
    pattern: /\b(old[- ]fashioned|outdated|behind the times)\b/gi,
    type: 'age',
    severity: 'high',
    explanation: 'Dismissive language often directed at older individuals'
  },
  {
    pattern: /\bover-?qualified\b/gi,
    type: 'age',
    severity: 'high',
    explanation: 'Often code for "too old" or "too experienced"'
  },

  // Racial bias
  {
    pattern: /\b(articulate|well-spoken)\b(?=.*\b(black|african|asian|latino|latina|hispanic)\b)/gi,
    type: 'racial',
    severity: 'high',
    explanation: 'Implies surprise at eloquence based on race'
  },
  {
    pattern: /\binner[- ]city\b/gi,
    type: 'racial',
    severity: 'medium',
    explanation: 'Often used as coded language for racial demographics'
  },
  {
    pattern: /\burban\b(?!\s+(planning|development|design))/gi,
    type: 'racial',
    severity: 'low',
    explanation: 'Can be coded language for racial demographics'
  },
  {
    pattern: /\bthug\b/gi,
    type: 'racial',
    severity: 'high',
    explanation: 'Often racially coded term with negative connotations'
  },

  // Disability bias
  {
    pattern: /\b(crazy|insane|psycho|nuts)\b/gi,
    type: 'disability',
    severity: 'medium',
    explanation: 'Ableist language that stigmatizes mental health conditions'
  },
  {
    pattern: /\b(lame|dumb|blind to|deaf to)\b/gi,
    type: 'disability',
    severity: 'medium',
    explanation: 'Using disability-related terms as negative descriptors'
  },
  {
    pattern: /\bwheelchair[- ]bound\b/gi,
    type: 'disability',
    severity: 'high',
    explanation: 'Use "wheelchair user" instead; wheelchairs provide freedom, not confinement'
  },
  {
    pattern: /\bsuffers? from\b(?=.*\b(disability|condition)\b)/gi,
    type: 'disability',
    severity: 'medium',
    explanation: 'Implies victimhood; use "has" or "lives with" instead'
  },

  // Religious bias
  {
    pattern: /\bChristmas party\b/gi,
    type: 'religious',
    severity: 'low',
    explanation: 'Assumes Christian defaults; consider "holiday party" for inclusivity'
  },
  {
    pattern: /\bcrusade\b/gi,
    type: 'religious',
    severity: 'medium',
    explanation: 'Religious/historical connotations that may alienate some groups'
  },
];

export function detectBias(text: string): BiasIndicator[] {
  const indicators: BiasIndicator[] = [];

  biasPatterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.pattern);
    
    while ((match = regex.exec(text)) !== null) {
      indicators.push({
        type: pattern.type,
        phrase: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        severity: pattern.severity,
        explanation: pattern.explanation,
      });
    }
  });

  return indicators;
}

export function calculateBiasScore(indicators: BiasIndicator[]): number {
  if (indicators.length === 0) return 0;

  const severityScores = {
    low: 20,
    medium: 50,
    high: 100,
  };

  const totalScore = indicators.reduce(
    (sum, indicator) => sum + severityScores[indicator.severity],
    0
  );

  // Normalize to 0-100 scale (cap at 100)
  return Math.min(100, Math.round(totalScore / indicators.length));
}
