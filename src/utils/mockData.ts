import { Message } from '../types';

const slackMessages = [
  "Hey team, we need some young blood on this project to bring fresh ideas.",
  "Sarah was very emotional in the meeting today, she needs to be more professional.",
  "Our new hire is very articulate for someone from his background.",
  "The chairman will make the final decision on this matter.",
  "We need to find a cultural fit for our team.",
  "Let's schedule a brainstorming session for next week.",
  "Great work on the presentation, very well researched!",
  "The code review process needs improvement.",
  "Can someone help debug this issue? I'm going crazy trying to figure it out.",
  "Linda was being bossy again during the standup.",
  "We should get the girls in marketing to design the campaign.",
  "John is overqualified for this position given his experience.",
  "The new developer is a digital native, they'll handle the tech stack easily.",
  "This idea is insane! Let's implement it right away.",
  "We need more manpower to complete this project on time.",
];

const teamsMessages = [
  "Meeting scheduled for 2pm to discuss Q4 strategy.",
  "The intern is surprisingly well-spoken during client calls.",
  "Karen is being too feisty about the budget constraints.",
  "We need a policeman at the event for security.",
  "Let's leverage our traditional values to guide this decision.",
  "Could you send the updated timeline by EOD?",
  "The migration was successful, no issues reported.",
  "Our old-school approach isn't working anymore, we need innovation.",
  "Great job team, we exceeded our targets!",
  "The ladies from HR will handle the onboarding process.",
  "Anyone available for a quick sync?",
  "This is a critical issue that needs immediate attention.",
  "The wheelchair-bound candidate won't be able to access the office easily.",
  "Let's make this a crusade for better user experience.",
  "Strong collaboration across all departments this quarter.",
];

const emailMessages = [
  "Subject: Project Update - All team members should review the latest documentation.",
  "The new team member suffers from anxiety, so be patient with them.",
  "We're looking for someone who fits our company culture.",
  "Michelle was very shrill in her objection to the proposal.",
  "The client appreciates our attention to detail and professionalism.",
  "Please confirm your attendance for the all-hands meeting.",
  "Our target demographic is the urban market segment.",
  "The quarterly review shows positive growth across all metrics.",
  "We need to hire a fireman for the safety demonstration.",
  "The engineering team delivered exceptional results this sprint.",
  "She's just being hysterical about the deadline changes.",
  "Looking for recent graduates to join our internship program.",
  "This solution is completely lame, we need better options.",
  "The partnership has been very successful so far.",
  "Let's ensure everyone has equal opportunity to contribute.",
];

function createMessage(text: string, source: 'slack' | 'teams' | 'email', index: number): Message {
  const senders = ['Alex Chen', 'Jordan Smith', 'Taylor Johnson', 'Morgan Davis', 'Casey Williams', 'Riley Brown'];
  const channels = ['#general', '#engineering', '#marketing', '#product', '#random'];
  
  return {
    id: `${source}-${index}-${Date.now()}`,
    text,
    source,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
    sender: senders[Math.floor(Math.random() * senders.length)],
    channel: source === 'email' ? undefined : channels[Math.floor(Math.random() * channels.length)]
  };
}

export function generateMockMessages(source?: 'slack' | 'teams' | 'email'): Message[] {
  const messages: Message[] = [];

  if (!source || source === 'slack') {
    slackMessages.forEach((text, index) => {
      messages.push(createMessage(text, 'slack', index));
    });
  }

  if (!source || source === 'teams') {
    teamsMessages.forEach((text, index) => {
      messages.push(createMessage(text, 'teams', index));
    });
  }

  if (!source || source === 'email') {
    emailMessages.forEach((text, index) => {
      messages.push(createMessage(text, 'email', index));
    });
  }

  // Shuffle messages
  return messages.sort(() => Math.random() - 0.5);
}
