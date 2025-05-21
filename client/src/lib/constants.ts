import { Skeleton, Frame } from '@/types';

// Add color mappings for frame categories
export const FRAME_CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Hook': { bg: 'bg-red-100', text: 'text-red-800' },
  'Intro': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Challenge Setup': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'Story Setup': { bg: 'bg-green-100', text: 'text-green-800' },
  'Problem Setup': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Content Delivery': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Content Journey': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  'Escalation': { bg: 'bg-pink-100', text: 'text-pink-800' },
  'Rehook': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  'Climax': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'Reveal': { bg: 'bg-violet-100', text: 'text-violet-800' },
  'Reflection': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Engagement Trigger': { bg: 'bg-lime-100', text: 'text-lime-800' },
  'Outro': { bg: 'bg-rose-100', text: 'text-rose-800' },
  'Native Call To Action': { bg: 'bg-teal-100', text: 'text-teal-800' }
};

// Define available skeleton units
export const SKELETON_UNITS = [
  {
    type: 'Hook',
    description: 'Grabs the audience\'s attention within the first few seconds',
    examples: ['Visual Hook', 'Shock Value', 'Intriguing Question'],
    placement: 'Always the first segment in the Skeleton'
  },
  {
    type: 'Intro',
    description: 'Sets expectations and primes the audience for the content',
    examples: ['Relatable Problem', 'Conflict Setup', 'Promise of Value']
  },
  {
    type: 'Challenge Setup',
    description: 'Lays out the stakes, rules, or objectives of a challenge',
    examples: ['Challenge Rules', 'Prize Reveal', 'Competitor Introduction']
  },
  {
    type: 'Story Setup',
    description: 'Introduces context or background for storytelling',
    examples: ['Background Context', 'Character Introduction', 'Scene Setting']
  },
  {
    type: 'Problem Setup',
    description: 'Identifies a challenge or issue the content aims to resolve',
    examples: ['Relatable Problem', 'Myth-Buster', 'Pain Point Identification']
  },
  {
    type: 'Content Delivery',
    description: 'Provides the core content, whether it\'s a tutorial, performance, or demonstration',
    examples: ['Teach a Concept', 'Step-by-Step Demo', 'Performance']
  },
  {
    type: 'Content Journey',
    description: 'Represents a sequential or progressive narrative unfolding in the content',
    examples: ['Relatable Moment', 'Conflict Setup', 'Escalation']
  },
  {
    type: 'Escalation',
    description: 'Gradually raises stakes or tension to keep the audience engaged',
    examples: ['Stakes Amplifier', 'Triumph Over Adversity', 'Challenge Intensification']
  },
  {
    type: 'Rehook',
    description: 'Midway engagement trigger to re-capture attention',
    examples: ['Question Rehook', 'Humor Rehook', 'Midway Shock'],
    placement: 'Between content segments or after dense sections'
  },
  {
    type: 'Climax',
    description: 'Brings the content to its dramatic or emotional peak',
    examples: ['Big Reveal', 'Transformation', 'Success Roadmap']
  },
  {
    type: 'Reveal',
    description: 'Delivers a surprising or satisfying conclusion',
    examples: ['Big Reveal', 'Unexpected Twist', 'Final Result']
  },
  {
    type: 'Reflection',
    description: 'Offers takeaways, lessons, or insights gained from the content',
    examples: ['Empathy Builder', 'One-Liner Wisdom', 'Key Lessons']
  },
  {
    type: 'Engagement Trigger',
    description: 'Direct prompts for audience interaction',
    examples: ['Call-to-Action', 'Ask a Question', 'Poll the Audience'],
    placement: 'Throughout the content or in the Outro'
  },
  {
    type: 'Outro',
    description: 'Wraps up the content, often with a CTA or reflection',
    examples: ['Quick Win', 'Call-to-Action', 'Lighthearted Humor'],
    notes: 'Can be abrupt or elaborate based on content strategy'
  },
  {
    type: 'Native Call To Action',
    description: 'To generate native actions that help the platforms algorithm',
    examples: [
      'Like this video if you want to see more like it!',
      'Comment any questions you have and I\'ll respond asap!',
      'If that helped, mash Subscribe below!'
    ],
    placement: 'Before or after content segments'
  }
];

// Emotional Tones
export const TONES = [
  // Emotional Tones
  'Enthusiastic',
  'Authoritative',
  'Contemplative',
  'Empathetic',
  'Urgent',
  'Nostalgic',
  'Inspirational',
  'Curious',
  'Reassuring',
  'Provocative',
  
  // Stylistic Tones
  'Analytical',
  'Conversational',
  'Instructional',
  'Narrative',
  'Minimalist',
  'Dramatic',
  'Journalistic',
  'Scholarly',
  'Satirical',
  'Poetic',
  
  // Audience-Specific Tones
  'Peer-to-Peer',
  'Mentor',
  'Expert-to-Novice',
  'Insider',
  'Community-Building',
  'Aspirational',
  'Collaborative',
  'Exclusive',
  
  // Original Tones
  'Playful',
  'Heartfelt',
  'Empowering',
  'Professional',
  'Casual',
  'Mysterious',
  'Energetic'
];

// Visual, Pacing, Audio, and Structural Filters
export const FILTERS = [
  // Visual Filters
  'High-Contrast',
  'Soft Focus',
  'Cinematic',
  'Raw/Authentic',
  'Hyper-Stylized',
  'Minimalist',
  'Vintage',
  'Luxury',
  'Gritty',
  'Bright and Airy',
  
  // Pacing Filters
  'Rapid-Fire',
  'Slow Burn',
  'Rhythmic',
  'Jump Cut',
  'Long Take',
  'Variable Pacing',
  'Montage',
  'Real-Time',
  'Punctuated',
  
  // Audio Filters
  'Music-Driven',
  'Voice-Forward',
  'ASMR',
  'Ambient',
  'Sound Effect Enhancement',
  'Dynamic Range',
  'Layered Audio',
  'Minimal Audio',
  'Narrative Voiceover',
  
  // Structural Filters
  'Episodic',
  'Standalone',
  'Tutorial',
  'Vlog',
  'Essay',
  'Review',
  'Reaction',
  'Interview',
  'Documentary',
  'Challenge',
  
  // Original Filters
  'Bold',
  'Natural',
  'Modern',
  'Artistic'
];