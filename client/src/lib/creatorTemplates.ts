import { CreatorTemplate } from './frameLibrary';
import { nanoid } from 'nanoid';

// Define category types for templates
export type TemplateCategory = 
  'Cooking' | 
  'Gaming' | 
  'Education' | 
  'Finance' | 
  'Business' | 
  'Entertainment' | 
  'Technology' | 
  'Lifestyle' | 
  'Travel' | 
  'Fashion' | 
  'Fitness' | 
  'Sports';

// Extended template interface with category
export interface CategoryCreatorTemplate extends CreatorTemplate {
  category: TemplateCategory;
  contentTypes: ('short' | 'long')[];
}

// Creator templates organized by niche/category
export const CREATOR_TEMPLATES_BY_CATEGORY: CategoryCreatorTemplate[] = [
  // COOKING CATEGORY
  {
    id: 'joshua-weissman',
    name: 'Joshua Weissman Template',
    creator: 'Joshua Weissman',
    category: 'Cooking',
    contentTypes: ['long'],
    description: 'Food content with visual appeal and technical instruction',
    units: ['Hook', 'Intro', 'Content Delivery', 'Escalation', 'Reveal', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'call-out-audience'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "This homemade burger is about to change your life. Fast food could never."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'establish-credibility'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "Today we're making a gourmet version of that fast-food classic, but of course... better."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['step-by-step', 'expert-insight'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, let's break down each component - the bun, the patty, the sauce, and the assembly."
          }
        ]
      },
      {
        unitType: 'Escalation',
        frameIds: ['conflict-setup', 'creative-transition'],
        examples: [
          {
            frameId: 'conflict-setup',
            content: "Now for the ultimate test - how does this stack up against the original?"
          }
        ]
      },
      {
        unitType: 'Reveal',
        frameIds: ['case-study', 'visual-demo'],
        examples: [
          {
            frameId: 'visual-demo', 
            content: "Look at that perfect cross-section! Just listen to that crunch!"
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['testimonial', 'quick-win'],
        examples: [
          {
            frameId: 'quick-win',
            content: "The key to this recipe is taking your time with the fermentation and getting a really good sear on the patty."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['subscribe-reminder', 'coming-soon'],
        examples: [
          {
            frameId: 'subscribe-reminder',
            content: "If you want to see more \"But Better\" recipes, hit that subscribe button and tell me what to make next in the comments!"
          }
        ]
      }
    ]
  },
  
  // GAMING CATEGORY
  {
    id: 'lilsimsie',
    name: 'lilsimsie Template',
    creator: 'lilsimsie',
    category: 'Gaming',
    contentTypes: ['long'],
    description: 'Sims 4 gameplay with creative builds and challenges',
    units: ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Reveal', 'Engagement Trigger', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'intriguing-question'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "I built what might be the craziest tiny house in The Sims 4 yet, and I'm not sure if I love it or hate it."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'topic-overview'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "Today we're going to be taking on the Ultimate Tiny Home Challenge with some impossible requirements."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['behind-the-scenes', 'common-struggle'],
        examples: [
          {
            frameId: 'behind-the-scenes',
            content: "Let me show you exactly how I'm planning this layout to maximize every single tile of space."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['midway-shock', 'teaser-rehook'],
        examples: [
          {
            frameId: 'midway-shock',
            content: "Oh no, I just realized I completely forgot about the bathroom! Now I have to redo the entire floorplan!"
          }
        ]
      },
      {
        unitType: 'Reveal',
        frameIds: ['visual-demo', 'data-story'],
        examples: [
          {
            frameId: 'visual-demo', 
            content: "And here's the final build! Let me give you a full tour of every space-saving feature."
          }
        ]
      },
      {
        unitType: 'Engagement Trigger',
        frameIds: ['audience-question', 'call-to-action'],
        examples: [
          {
            frameId: 'audience-question',
            content: "What other challenges should I try next? Let me know in the comments below!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['subscribe-reminder', 'coming-soon'],
        examples: [
          {
            frameId: 'subscribe-reminder',
            content: "If you enjoyed this build, make sure to subscribe for new Sims 4 content every week!"
          }
        ]
      }
    ]
  },
  {
    id: 'iam-ilb',
    name: 'iaM ILb Template',
    creator: 'iaM ILb',
    category: 'Gaming',
    contentTypes: ['long'],
    description: 'Roblox game tutorials and strategy guides',
    units: ['Hook', 'Intro', 'Content Delivery', 'Rehook', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'bold-statement'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "This Roblox secret gives you unlimited resources in just 5 minutes - and almost no one knows about it."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'topic-overview'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "Today I'm showing you the fastest way to level up in Demon Fall without spending any Robux."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['step-by-step', 'expert-insight'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, you need to go to this exact location on the map. Let me show you the quickest route to get there."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['midway-shock', 'teaser-rehook'],
        examples: [
          {
            frameId: 'midway-shock',
            content: "But here's the trick most players miss - there's a hidden entrance that gives you double XP!"
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['quick-win', 'common-pitfalls'],
        examples: [
          {
            frameId: 'quick-win',
            content: "Using this method, you can reach level 50 in about 3 hours instead of the usual 10-15 hours."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['subscribe-reminder', 'next-steps'],
        examples: [
          {
            frameId: 'subscribe-reminder',
            content: "Don't forget to use code \"ILB\" for free rewards, and subscribe for more Roblox secrets!"
          }
        ]
      }
    ]
  },

  // SPORTS/EDUCATION CATEGORY
  {
    id: 'danny-maude',
    name: 'Danny Maude Template',
    creator: 'Danny Maude',
    category: 'Sports',
    contentTypes: ['long'],
    description: 'Golf instruction with simple, effective techniques',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Proof', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'problem-solution'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "This one simple move will add 30 yards to your drives instantly - and it's the opposite of what most golfers try to do."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['establish-credibility', 'topic-overview'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "After teaching thousands of students, I've discovered that most amateurs struggle with their drives because of this one fundamental mistake."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['expert-insight', 'myth-buster'],
        examples: [
          {
            frameId: 'expert-insight',
            content: "The key isn't trying to hit the ball harder - it's actually about creating the right sequence of motion starting from the ground up."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['step-by-step', 'common-pitfalls'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Here's a simple drill you can practice at home with just a towel to ingrain this feeling."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['case-study', 'testimonial'],
        examples: [
          {
            frameId: 'case-study', 
            content: "Here's John, one of my students who gained 45 yards after just one lesson focusing on this technique."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-takeaway', 'quick-win'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "Remember, it's not about swinging harder, it's about swinging smarter by using your body's natural power sequence."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['subscribe-reminder', 'next-steps'],
        examples: [
          {
            frameId: 'subscribe-reminder',
            content: "If you found this helpful, make sure to subscribe for more simple golf tips that actually work in the real world."
          }
        ]
      }
    ]
  },

  // FINANCE CATEGORY
  {
    id: 'humphrey-yang',
    name: 'Humphrey Yang Template',
    creator: 'Humphrey Yang',
    category: 'Finance',
    contentTypes: ['long', 'short'],
    description: 'Clear, accessible financial education with visual aids',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Proof', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['shocking-statement', 'intriguing-question'],
        examples: [
          {
            frameId: 'shocking-statement',
            content: "If you invested $100 a week starting at age 18, you'd have over $1.5 million by retirement - let me show you exactly how."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'problem-solution'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "Today I'm breaking down compound interest using real numbers that will change how you think about saving."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['teach-concept', 'data-story'],
        examples: [
          {
            frameId: 'teach-concept',
            content: "Compound interest is essentially interest on your interest - here's a simple visual representation of how it works."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['step-by-step', 'quick-win'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Here are three simple steps to set up automatic investing with just $20 a week to start building your wealth."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['case-study', 'data-story'],
        examples: [
          {
            frameId: 'case-study', 
            content: "This is exactly how I started investing at 22, and here's my actual portfolio growth over the past 8 years."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-takeaway', 'audience-question'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "The key isn't how much you invest, it's how early you start and how consistently you contribute."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'next-steps'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you want more actionable financial advice, hit subscribe and check out my free investment guide in the description."
          }
        ]
      }
    ]
  },
  {
    id: 'graham-stephan',
    name: 'Graham Stephan Template',
    creator: 'Graham Stephan',
    category: 'Finance',
    contentTypes: ['long'],
    description: 'Financial insights with transparency about personal results',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Proof', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['shocking-statement', 'problem-solution'],
        examples: [
          {
            frameId: 'shocking-statement',
            content: "I made $145,388 last month in passive income - and today I'm showing you exactly how I did it, line by line."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['establish-credibility', 'foreshadow-whats-to-come'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "I've spent the last 10 years building multiple income streams, and I document everything so you can see what actually works."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['data-story', 'myth-buster'],
        examples: [
          {
            frameId: 'data-story',
            content: "Let me break down each income stream - real estate ($42K), YouTube ($38K), investments ($35K), and course sales ($30K)."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['step-by-step', 'common-pitfalls'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Here's exactly how I would start building passive income today if I was starting from zero, with just $1,000 to invest."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['case-study', 'data-story'],
        examples: [
          {
            frameId: 'case-study', 
            content: "Let me show you my actual Vanguard account - I've averaged 11.2% returns over the last 5 years using this strategy."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-takeaway', 'contrarian-advice'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "The most important factor isn't finding the perfect investment - it's consistency and keeping your expenses low while you build."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'personal-note'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you want to see more transparent breakdowns like this, smash the like button and join the notification squad."
          }
        ]
      }
    ]
  },

  // BUSINESS CATEGORY
  {
    id: 'alex-becker',
    name: 'Alex Becker Template',
    creator: 'Alex Becker',
    category: 'Business',
    contentTypes: ['long'],
    description: 'High-energy business and crypto insights with contrarian views',
    units: ['Hook', 'Intro', 'Content Delivery', 'Proof', 'Action Plan', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'urgency-creator'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "This emerging crypto sector is about to explode 50X in the next 90 days - while everyone else is looking in the wrong direction."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['establish-credibility', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "I've been calling these market movements correctly for the last 3 years, and the signs for this opportunity are even stronger."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['data-story', 'myth-buster'],
        examples: [
          {
            frameId: 'data-story',
            content: "Let me show you the exact on-chain metrics that signal this move - 95% of traders completely miss these indicators."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['case-study', 'data-story'],
        examples: [
          {
            frameId: 'case-study', 
            content: "When we saw this exact pattern in 2021, these five projects gained between 300-1200% in just 60 days."
          }
        ]
      },
      {
        unitType: 'Action Plan',
        frameIds: ['step-by-step', 'risk-management'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Here's the exact allocation strategy I'm using: 40% in these blue chips, 40% in these mid-caps, and 20% in these high-risk moonshots."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['philosophical-principle', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'philosophical-principle',
            content: "The people who win in this market aren't the ones following the crowd - they're the ones who can see what's coming before everyone else."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'urgency-creator'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you want to get my exact buy alerts in real-time, the link to my Discord is in the description - but we're closing membership next week."
          }
        ]
      }
    ]
  },
  {
    id: 'iman-gadzhi',
    name: 'Iman Gadzhi Template',
    creator: 'Iman Gadzhi',
    category: 'Business',
    contentTypes: ['long'],
    description: 'Agency building and entrepreneurship advice for young founders',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Proof', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'pattern-interrupt'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "I built a $10 million agency by age 22 - and the strategy that got me there is the exact opposite of what most \"gurus\" teach."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['establish-credibility', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "I went from charging $200 per client to over $10,000 per month in just 18 months using this exact system."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['conceptual-framework', 'myth-buster'],
        examples: [
          {
            frameId: 'conceptual-framework',
            content: "The \"Gadzhi Triangle\" is how I structure every agency: specialized service, premium positioning, and systematic delivery."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['step-by-step', 'common-pitfalls'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Here's exactly how to land your first $5K/month client - from identifying your ideal prospect to the exact words to use in the pitch."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['case-study', 'client-success'],
        examples: [
          {
            frameId: 'case-study', 
            content: "This is Maria, one of my students who went from $0 to $30K monthly revenue in her web design agency in just 6 months using this framework."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['philosophical-principle', 'future-projection'],
        examples: [
          {
            frameId: 'philosophical-principle',
            content: "Success in business isn't about working harder - it's about deliberate positioning and systems that deliver real results to clients."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'exclusivity-creator'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "I'm opening 20 spots in my Agency Incubator program next week. The link is in the description if you're ready to build a real business."
          }
        ]
      }
    ]
  },

  // ENTERTAINMENT CATEGORY
  {
    id: 'ryan-trahan',
    name: 'Ryan Trahan Template',
    creator: 'Ryan Trahan',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'Challenge and survival content with strong narrative structure',
    units: ['Hook', 'Challenge Setup', 'Journey', 'Obstacles', 'Twist', 'Resolution', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'visual-demo'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "I'm going to survive for 7 days with only $0.01, starting right now - and here's exactly what happened."
          }
        ]
      },
      {
        unitType: 'Challenge Setup',
        frameIds: ['establish-credibility', 'stakes-amplifier'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "The rules are simple: I have to turn this penny into enough money for food, shelter, and transportation across the country in one week."
          }
        ]
      },
      {
        unitType: 'Journey',
        frameIds: ['step-by-step', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Day 1: I managed to trade this penny for a pencil, then the pencil for a bottle of water, and then..."
          }
        ]
      },
      {
        unitType: 'Obstacles',
        frameIds: ['conflict-setup', 'heartfelt-confession'],
        examples: [
          {
            frameId: 'conflict-setup', 
            content: "Everything was going great until I realized I had no place to sleep and a huge storm was coming. Here's what I did..."
          }
        ]
      },
      {
        unitType: 'Twist',
        frameIds: ['midway-shock', 'unexpected-opportunity'],
        examples: [
          {
            frameId: 'midway-shock',
            content: "Then something incredible happened - a viewer recognized me and offered me an opportunity that changed everything."
          }
        ]
      },
      {
        unitType: 'Resolution',
        frameIds: ['triumph-over-adversity', 'key-takeaway'],
        examples: [
          {
            frameId: 'triumph-over-adversity',
            content: "Against all odds, I not only survived the week but managed to turn that penny into $253.42 - here's the final tally."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'coming-soon'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you want to see what impossible challenge I take on next, hit subscribe - the next video is even crazier!"
          }
        ]
      }
    ]
  },

  // Add more templates here...

  // We'll add a shortened version as an example, with more to be added separately
  {
    id: 'mrbeast',
    name: 'MrBeast Template',
    creator: 'MrBeast',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'High-stakes challenges with money, philanthropy, and competition',
    units: ['Hook', 'Challenge Setup', 'Content Journey', 'Stakes Amplification', 'Climactic Moment', 'Resolution', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'visual-demo'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "Last to leave this circle of fire wins $100,000!"
          }
        ]
      },
      {
        unitType: 'Challenge Setup',
        frameIds: ['establish-credibility', 'stakes-amplifier'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "I've gathered 100 people and built the most extreme challenge course ever created."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['behind-the-scenes', 'milestone-marker'],
        examples: [
          {
            frameId: 'behind-the-scenes',
            content: "24 hours in and we're down to just 50 competitors. Let's make things more interesting..."
          }
        ]
      },
      {
        unitType: 'Stakes Amplification',
        frameIds: ['midway-shock', 'conflict-setup'],
        examples: [
          {
            frameId: 'midway-shock', 
            content: "I'm now doubling the prize to $200,000, but adding these impossible obstacles!"
          }
        ]
      },
      {
        unitType: 'Climactic Moment',
        frameIds: ['triumph-over-adversity', 'emotional-peak'],
        examples: [
          {
            frameId: 'triumph-over-adversity',
            content: "After 72 grueling hours, we're down to the final two contestants, and neither one will give up!"
          }
        ]
      },
      {
        unitType: 'Resolution',
        frameIds: ['reveal', 'heartfelt-moment'],
        examples: [
          {
            frameId: 'reveal',
            content: "Congratulations to our winner! But wait - I'm also giving $50,000 to the runner-up for their incredible effort!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'coming-soon'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "Subscribe now because next week I'm giving away an entire island to one lucky subscriber!"
          }
        ]
      }
    ]
  }
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: TemplateCategory): CategoryCreatorTemplate[] {
  return CREATOR_TEMPLATES_BY_CATEGORY.filter(template => template.category === category);
}

// Helper function to get all categories
export function getAllCategories(): TemplateCategory[] {
  return Array.from(new Set(CREATOR_TEMPLATES_BY_CATEGORY.map(template => template.category)));
}

// Helper function to get templates by content type
export function getTemplatesByContentType(contentType: 'short' | 'long'): CategoryCreatorTemplate[] {
  return CREATOR_TEMPLATES_BY_CATEGORY.filter(template => 
    template.contentTypes.includes(contentType)
  );
}