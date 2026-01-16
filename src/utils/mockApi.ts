import { AnalyzedMessage, Department, MessageSource } from '../types/bias';
import { detectBias, calculateBiasScore } from './biasDetection';

// Mock message data that simulates API response
const generateMockMessages = (): AnalyzedMessage[] => {
  const departments: Department[] = ['engineering', 'sales', 'marketing', 'hr', 'finance', 'operations', 'executive'];
  const sources: MessageSource[] = ['slack', 'teams', 'email'];
  
  const sampleMessages = [
    // High bias messages (older)
    { text: "Hey guys, we need to hire some young blood for our digital native team. Looking for a dynamic salesman who can bring fresh energy.", dept: 'sales', days: 90 },
    { text: "The chairman announced that our Christmas party will be held next month. This is a crusade to boost team morale!", dept: 'executive', days: 85 },
    { text: "She was being hysterical about the deadline again. We need someone more level-headed, preferably a digital native.", dept: 'engineering', days: 80 },
    { text: "Looking for articulate candidates from urban areas. Need a rockstar developer who isn't wheelchair-bound and can handle our crazy work schedule.", dept: 'engineering', days: 75 },
    { text: "The girls in marketing did a great job on the campaign. Very emotional and creative work from the ladies!", dept: 'marketing', days: 70 },
    { text: "Our salesman of the year award goes to the most aggressive closer. We need guys who can push through.", dept: 'sales', days: 65 },
    { text: "We're updating our Christmas party policy. The chairman wants everyone to attend this cultural event.", dept: 'hr', days: 60 },
    { text: "She gets too emotional about budget overruns. We need a digital native who understands modern systems.", dept: 'finance', days: 55 },
    { text: "Looking for young talent from urban areas. No over-qualified applicants please, we want fresh blood.", dept: 'operations', days: 50 },
    { text: "The board needs young energy. We want digital natives, not old-fashioned thinkers who are behind the times.", dept: 'executive', days: 45 },
    
    // Medium bias messages (recent past)
    { text: "Looking for talented individuals to join our team. Prefer candidates with modern tech skills and innovative thinking.", dept: 'engineering', days: 40 },
    { text: "Our top performer award recognizes outstanding achievements. We value dedication and results-driven professionals.", dept: 'sales', days: 35 },
    { text: "The marketing team delivered excellent results. Great creative work on the latest campaign!", dept: 'marketing', days: 30 },
    { text: "Annual holiday celebration scheduled for next month. All team members encouraged to attend.", dept: 'hr', days: 25 },
    { text: "Budget review shows some concerns. We need team members who can adapt to changing financial landscapes.", dept: 'finance', days: 20 },
    { text: "Seeking qualified candidates with strong operational experience. Modern workplace skills are valued.", dept: 'operations', days: 15 },
    
    // Low/no bias messages (recent)
    { text: "Seeking talented developers to join our engineering team. Looking for candidates with strong problem-solving skills and collaboration experience.", dept: 'engineering', days: 10 },
    { text: "Our top performer award celebrates outstanding sales achievements across all team members. Recognition based on results and dedication.", dept: 'sales', days: 8 },
    { text: "The marketing team delivered exceptional results on our latest campaign. Congratulations to everyone involved!", dept: 'marketing', days: 6 },
    { text: "Annual end-of-year celebration scheduled for next month. All staff members are welcome to join the festivities.", dept: 'hr', days: 5 },
    { text: "Budget review completed. The finance team has done excellent work managing our resources efficiently this quarter.", dept: 'finance', days: 3 },
    { text: "We're hiring for multiple operations roles. Seeking candidates with relevant experience and strong organizational skills.", dept: 'operations', days: 2 },
    { text: "Board meeting summary: focus on innovation and inclusive growth strategies for the upcoming year.", dept: 'executive', days: 1 },
  ];

  return sampleMessages.map((msg, index) => {
    const biasIndicators = detectBias(msg.text);
    const overallBiasScore = calculateBiasScore(biasIndicators);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - msg.days);

    return {
      id: `msg-${index}`,
      source: sources[index % sources.length],
      sender: `${msg.dept.charAt(0).toUpperCase() + msg.dept.slice(1)} Team Member`,
      department: msg.dept as Department,
      content: msg.text,
      timestamp,
      biasIndicators,
      overallBiasScore,
    };
  });
};

// Simulate API call
export const fetchMessagesFromAPI = async (): Promise<AnalyzedMessage[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return generateMockMessages();
};
