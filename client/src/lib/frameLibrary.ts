import { Frame } from '@/types';

export interface FrameTemplate {
  id: string;
  name: string;
  description: string;
  example: string;
  category: string;
  subcategory?: string;
  hookType?: 'initial' | 'rehook';
  popularUse: string;
  isCustom?: boolean;
}

export interface CreatorTemplate {
  id: string;
  name: string;
  creator: string;
  description: string;
  units: string[];
}

export const FRAME_CATEGORIES = {
  HOOK: 'Hook',
  CONTENT: 'Content',
  OUTRO: 'Outro',
  CUSTOM: 'Custom',
} as const;

export const CONTENT_SUBCATEGORIES = {
  INFORMATIONAL: 'Informational',
  STORYTELLING: 'Storytelling',
  ENGAGEMENT: 'Engagement',
  PROOF: 'Proof',
  EMOTIONAL: 'Emotional',
  VALUE: 'Value',
  VISUAL: 'Visual/Creative',
  CHALLENGE: 'Challenge',
  RELATABILITY: 'Relatability',
  EDUCATIONAL: 'Educational',
} as const;

export const FRAME_TEMPLATES: FrameTemplate[] = [
  // Initial Hook Frames
  {
    id: 'bold-statement',
    name: 'Bold Statement',
    description: 'Opens with a powerful or provocative claim to immediately grab attention.',
    example: "Everything you've learned about productivity is wrong.",
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'initial',
    popularUse: 'Hooks for YouTube videos and attention-grabbing posts.'
  },
  {
    id: 'intriguing-question',
    name: 'Intriguing Question',
    description: 'Poses a thought-provoking question to pique curiosity.',
    example: "What's the one thing holding you back from success?",
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'initial',
    popularUse: 'Opening lines in social media or blog posts.'
  },
  {
    id: 'shock-value',
    name: 'Shock Value',
    description: 'Uses surprising or extreme information to captivate the audience.',
    example: 'Did you know your phone is dirtier than a toilet seat?',
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'initial',
    popularUse: 'Viral content and awareness campaigns.'
  },
  {
    id: 'call-out-audience',
    name: 'Call Out the Audience',
    description: 'Directly addresses the target audience to make them feel seen.',
    example: 'Hey content creators, this is for you!',
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'initial',
    popularUse: 'Community-focused and niche content.'
  },
  {
    id: 'what-happens-next',
    name: 'What Happens Next?',
    description: 'Creates suspense by hinting at a surprising or dramatic event.',
    example: "You won't believe what happened when we tried this...",
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'initial',
    popularUse: 'Episodic or cliffhanger-style content.'
  },

  // Rehook Frames (now part of Hook category)
  {
    id: 'midway-shock',
    name: 'Midway Shock',
    description: 'Drops a surprising fact or twist to recapture attention.',
    example: "And here's the part nobody talks about...",
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'rehook',
    popularUse: 'Re-engaging viewers during complex explanations.'
  },
  {
    id: 'personal-connection',
    name: 'Personal Connection',
    description: 'Shares a quick, relatable anecdote to re-engage.',
    example: "This reminds me of the time I almost missed a big deadline...",
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'rehook',
    popularUse: 'Storytelling segments to reignite interest.'
  },
  {
    id: 'teaser-rehook',
    name: 'Teaser Rehook',
    description: 'Hypes what\'s coming next to maintain anticipation.',
    example: "But the best part? That's coming up next.",
    category: FRAME_CATEGORIES.HOOK,
    hookType: 'rehook',
    popularUse: 'Transitioning to the most impactful segment.'
  },

  // Content - Informational
  {
    id: 'teach-concept',
    name: 'Teach a Concept',
    description: 'Explains a clear, actionable idea or strategy.',
    example: 'Here are three ways to increase your productivity today.',
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.INFORMATIONAL,
    popularUse: 'Educational videos, tutorials, and how-to guides.'
  },
  {
    id: 'data-story',
    name: 'Data Story',
    description: 'Uses data or statistics to tell a compelling narrative.',
    example: "Here's how this brand increased sales by 200% in one year.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.INFORMATIONAL,
    popularUse: 'Business and marketing case studies.'
  },
  {
    id: 'myth-buster',
    name: 'Myth-Buster',
    description: 'Challenges common misconceptions or myths.',
    example: "No, you don't need a massive budget to create viral videos!",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.INFORMATIONAL,
    popularUse: 'Thought-leadership and audience engagement.'
  },

  // Content - Storytelling
  {
    id: 'conflict-setup',
    name: 'Conflict Setup',
    description: 'Establishes a problem or challenge that sets the stage for a solution.',
    example: "Most people struggle with staying consistent. Here's why.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.STORYTELLING,
    popularUse: 'Storytelling or transformational content.'
  },
  {
    id: "heroes-journey",
    name: "Hero's Journey",
    description: 'Follows a character overcoming obstacles to achieve a goal.',
    example: "I started with nothing, but here's how I built a 7-figure business.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.STORYTELLING,
    popularUse: 'Inspirational content and personal branding.'
  },

  // Content - Emotional
  {
    id: 'heartfelt-confession',
    name: 'Heartfelt Confession',
    description: 'Shares a vulnerable or deeply personal story to connect with the audience.',
    example: "I used to struggle with anxiety every day—here's what helped me overcome it.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.EMOTIONAL,
    popularUse: 'Building authenticity and emotional connection.'
  },
  {
    id: 'triumph-over-adversity',
    name: 'Triumph Over Adversity',
    description: 'Showcases overcoming challenges or obstacles.',
    example: 'After losing everything, I rebuilt my business from the ground up.',
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.EMOTIONAL,
    popularUse: 'Motivational and inspirational content.'
  },

  // Content - Value
  {
    id: 'quick-win',
    name: 'Quick Win',
    description: 'Provides an immediately actionable tip or result.',
    example: "Here's a 10-second trick to improve your focus instantly.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.VALUE,
    popularUse: 'Educational content and tutorials.'
  },
  {
    id: 'common-pitfalls',
    name: 'Common Pitfalls',
    description: 'Warns against mistakes or bad habits.',
    example: 'Avoid these 3 common mistakes when starting a business.',
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.VALUE,
    popularUse: 'Educational and troubleshooting content.'
  },

  // Content - Engagement
  {
    id: 'call-to-action',
    name: 'Call to Action',
    description: 'Encourages the audience to take a specific action.',
    example: "Don't wait! Sign up now for early access to my new course.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.ENGAGEMENT,
    popularUse: 'Creating momentum and driving conversions.'
  },
  {
    id: 'audience-question',
    name: 'Audience Question',
    description: 'Asks the audience a direct question to increase engagement.',
    example: "What's your biggest struggle with content creation? Let me know in the comments!",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.ENGAGEMENT,
    popularUse: 'Increasing comments and audience interaction.'
  },

  // Content - Proof
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'Shares feedback or results from a previous client or user.',
    example: '"This method helped me grow my channel by 150% in just three months!"',
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.PROOF,
    popularUse: 'Building credibility and trust.'
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Presents a detailed analysis of a specific example.',
    example: "Let's break down exactly how I helped this creator reach 1 million subscribers.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.PROOF,
    popularUse: 'Demonstrating expertise and methodology.'
  },

  // Content - Visual/Creative
  {
    id: 'visual-demo',
    name: 'Visual Demo',
    description: 'Shows a process or product in action.',
    example: "Watch as I transform this basic video into a cinematic masterpiece.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.VISUAL,
    popularUse: 'Tutorials, product showcases, and transformation videos.'
  },
  {
    id: 'creative-transition',
    name: 'Creative Transition',
    description: 'Uses a visually interesting way to move between topics.',
    example: "Now, let's switch gears and look at this from another angle...",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.VISUAL,
    popularUse: 'Maintaining visual interest and flow.'
  },

  // Content - Challenge
  {
    id: 'viewer-challenge',
    name: 'Viewer Challenge',
    description: 'Challenges the audience to try something specific.',
    example: "I challenge you to try this technique every day for a week.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.CHALLENGE,
    popularUse: 'Creating audience participation and accountability.'
  },
  {
    id: 'thought-experiment',
    name: 'Thought Experiment',
    description: 'Poses a hypothetical scenario to challenge thinking.',
    example: "What would happen if you doubled your content output for 30 days?",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.CHALLENGE,
    popularUse: 'Stimulating critical thinking and reflection.'
  },

  // Content - Relatability
  {
    id: 'common-struggle',
    name: 'Common Struggle',
    description: 'Discusses a widely relatable problem or challenge.',
    example: "We've all been there - staring at a blank screen with zero inspiration.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.RELATABILITY,
    popularUse: 'Building connection and empathy.'
  },
  {
    id: 'behind-the-scenes',
    name: 'Behind The Scenes',
    description: 'Shows the "real" side of a process or experience.',
    example: "What you don't see is the 20 takes it took to get that perfect shot.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.RELATABILITY,
    popularUse: 'Humanizing content and building authenticity.'
  },

  // Content - Educational
  {
    id: 'step-by-step',
    name: 'Step-by-Step',
    description: 'Provides clear, sequential instructions.',
    example: "First, outline your key points. Second, script each section. Third, record your audio.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.EDUCATIONAL,
    popularUse: 'Tutorials, how-to content, and educational videos.'
  },
  {
    id: 'expert-insight',
    name: 'Expert Insight',
    description: 'Shares specialized knowledge or perspective.',
    example: "After analyzing thousands of successful videos, I've discovered this pattern.",
    category: FRAME_CATEGORIES.CONTENT,
    subcategory: CONTENT_SUBCATEGORIES.EDUCATIONAL,
    popularUse: 'Establishing authority and providing unique value.'
  },

  // Outro Frames
  {
    id: 'recap-summary',
    name: 'Recap / Summary',
    description: 'Quickly reviews the main points or lessons.',
    example: 'So, to recap: we covered X, Y, and Z.',
    category: FRAME_CATEGORIES.OUTRO,
    popularUse: 'Wrapping up tutorials, webinars, or long-form videos.'
  },
  {
    id: 'key-takeaway',
    name: 'Key Takeaway',
    description: 'Provides a single, memorable insight or lesson.',
    example: "If there's one thing to remember, it's that consistency beats perfection.",
    category: FRAME_CATEGORIES.OUTRO,
    popularUse: 'Motivational or concluding statements.'
  },
  {
    id: 'next-steps',
    name: 'Next Steps',
    description: 'Directs the audience on what to do or watch next.',
    example: 'Ready to dive deeper? Check out my free workshop linked below.',
    category: FRAME_CATEGORIES.OUTRO,
    popularUse: 'Strong calls-to-action at the end of content.'
  }
];

export const CREATOR_TEMPLATES: CreatorTemplate[] = [
  {
    id: 'mr-beast',
    name: 'MrBeast Style',
    creator: 'MrBeast',
    description: 'High-stakes challenge and entertainment content',
    units: ['Hook', 'Setup', 'Journey', 'Climactic Moment', 'Outro/Resolution', 'Call to Action']
  },
  {
    id: 'hormozi',
    name: 'Alex Hormozi Style',
    creator: 'Alex Hormozi',
    description: 'Business and entrepreneurship wisdom delivery',
    units: ['Hook', 'Problem Setup', 'Solution', 'Implementation', 'Results', 'Outro']
  },
  {
    id: 'emma-chamberlain',
    name: 'Emma Chamberlain Style',
    creator: 'Emma Chamberlain',
    description: 'Lifestyle and comedy content structure',
    units: ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Outro']
  },
  {
    id: 'charli-damelio',
    name: 'Charli D\'Amelio Style',
    creator: 'Charli D\'Amelio',
    description: 'Short-form dance and lifestyle content',
    units: ['Visual Hook', 'Content Delivery', 'Outro']
  },
  {
    id: 'nas-daily',
    name: 'Nas Daily Style',
    creator: 'Nas Daily',
    description: 'Educational storytelling with clear progression',
    units: ['Hook', 'Story Setup', 'Content Delivery', 'Rehook', 'Outro']
  },
  {
    id: 'casey-neistat',
    name: 'Casey Neistat Style',
    creator: 'Casey Neistat',
    description: 'Cinematic storytelling with strong narrative arc',
    units: ['Hook', 'Story Setup', 'Content Journey', 'Climax', 'Reflection', 'Outro']
  },
  {
    id: 'mkbhd',
    name: 'MKBHD Style',
    creator: 'Marques Brownlee',
    description: 'Tech review and explanation format',
    units: ['Hook', 'Intro', 'Content Segment 1', 'Rehook', 'Content Segment 2', 'Outro']
  },
  {
    id: 'nikkietutorials',
    name: 'NikkieTutorials Style',
    creator: 'NikkieTutorials',
    description: 'Beauty and transformation content structure',
    units: ['Hook', 'Intro', 'Content Delivery', 'Rehook', 'Outro']
  },
  {
    id: 'garyv',
    name: 'GaryVee Style',
    creator: 'Gary Vaynerchuk',
    description: 'Motivational business content structure',
    units: ['Hook', 'Problem Setup', 'Teach a Concept', 'Rehook', 'Outro']
  },
  {
    id: 'dude-perfect',
    name: 'Dude Perfect Style',
    creator: 'Dude Perfect',
    description: 'Challenge and entertainment content structure',
    units: ['Hook', 'Challenge Setup', 'Content Journey', 'Climax', 'Outro']
  }
];

export function getFramesByCategory(category: string, subcategory?: string): FrameTemplate[] {
  if (category === FRAME_CATEGORIES.CONTENT && subcategory) {
    return FRAME_TEMPLATES.filter(frame =>
      frame.category === category &&
      frame.subcategory === subcategory
    );
  }
  return FRAME_TEMPLATES.filter(frame => frame.category === category);
}

export function searchFrames(query: string): (FrameTemplate | CreatorTemplate)[] {
  const lowercaseQuery = query.toLowerCase();

  const standardFrames = FRAME_TEMPLATES.filter(frame =>
    frame.name.toLowerCase().includes(lowercaseQuery) ||
    frame.description.toLowerCase().includes(lowercaseQuery) ||
    frame.example.toLowerCase().includes(lowercaseQuery) ||
    frame.popularUse.toLowerCase().includes(lowercaseQuery)
  );

  const creatorFrames = CREATOR_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.creator.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery)
  );

  return [...standardFrames, ...creatorFrames];
}

export function getHooksByType(type: 'initial' | 'rehook'): FrameTemplate[] {
  return FRAME_TEMPLATES.filter(frame =>
    frame.category === FRAME_CATEGORIES.HOOK &&
    frame.hookType === type
  );
}

export function getCreatorTemplates(): CreatorTemplate[] {
  return CREATOR_TEMPLATES;
}