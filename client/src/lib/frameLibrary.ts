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
  frames?: {
    unitType: string;
    frameIds: string[];
    examples?: {
      frameId: string;
      content: string;
    }[];
  }[];
}

export const FRAME_CATEGORIES = {
  HOOK: 'Hook',
  INTRO: 'Intro',
  CONTENT: 'Content',
  OUTRO: 'Outro',
  CTA: 'Call To Action',
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

  // Intro Frames
  {
    id: 'quick-introduction',
    name: 'Quick Introduction',
    description: 'Provides a brief introduction to the topic or yourself.',
    example: "Today I'm going to show you three simple ways to improve your productivity.",
    category: FRAME_CATEGORIES.INTRO,
    popularUse: 'Setting expectations for the video content.'
  },
  {
    id: 'foreshadow-whats-to-come',
    name: 'Foreshadow What\'s To Come',
    description: 'Creates anticipation by hinting at what will be covered later.',
    example: "By the end of this video, you'll know exactly how to create a viral video in under 5 minutes.",
    category: FRAME_CATEGORIES.INTRO,
    popularUse: 'Building anticipation and increasing watch time.'
  },
  {
    id: 'establish-credibility',
    name: 'Establish Credibility',
    description: 'Shows why you\'re qualified to speak on this topic.',
    example: "I've been in the industry for over 10 years and have helped hundreds of creators grow their channels.",
    category: FRAME_CATEGORIES.INTRO,
    popularUse: 'Building trust with new viewers.'
  },
  {
    id: 'topic-overview',
    name: 'Topic Overview',
    description: 'Outlines what will be covered in the video.',
    example: "In this video, I'll cover the basics of SEO, how to find the right keywords, and how to optimize your content.",
    category: FRAME_CATEGORIES.INTRO,
    popularUse: 'Organizing longer content and setting expectations.'
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
  },
  {
    id: 'subscribe-reminder',
    name: 'Subscribe Reminder',
    description: 'Reminds viewers to subscribe, like or follow.',
    example: "If you found this helpful, don't forget to hit that subscribe button and turn on notifications!",
    category: FRAME_CATEGORIES.OUTRO,
    popularUse: 'Growing channel subscribers and engagement.'
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    description: 'Teases upcoming content to maintain audience interest.',
    example: "Next week, I'll be sharing my complete step-by-step process for getting your first 1,000 subscribers.",
    category: FRAME_CATEGORIES.OUTRO,
    popularUse: 'Building anticipation for future content.'
  },
  {
    id: 'personal-note',
    name: 'Personal Note',
    description: 'Ends with a heartfelt message to connect with viewers.',
    example: "Thank you for being part of this journey with me. Your support means the world.",
    category: FRAME_CATEGORIES.OUTRO,
    popularUse: 'Building community and deepening audience connection.'
  },
  
  // Call To Action Frames
  {
    id: 'subscribe-cta',
    name: 'Subscribe CTA',
    description: 'Direct call to subscribe with clear benefits.',
    example: "If you want more content like this, hit that subscribe button and the notification bell so you never miss an upload.",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Growing channel subscriber count and watch time.'
  },
  {
    id: 'comment-prompt',
    name: 'Comment Prompt',
    description: 'Encourages viewers to engage in the comments section.',
    example: "What's your biggest takeaway from this video? Let me know in the comments below!",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Boosting engagement metrics and building community.'
  },
  {
    id: 'like-share-cta',
    name: 'Like & Share CTA',
    description: 'Asks viewers to like and share the content.',
    example: "If you found this helpful, give it a thumbs up and share it with someone who needs to see this.",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Increasing engagement and expanding reach.'
  },
  {
    id: 'link-cta',
    name: 'Link in Bio/Description',
    description: 'Directs viewers to external resources.',
    example: "I've put together a free checklist to help you implement everything we covered today. Grab it through the link in my bio.",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Driving traffic to landing pages or products.'
  },
  {
    id: 'follow-social-cta',
    name: 'Follow on Social',
    description: 'Promotes other social platforms.',
    example: "Want more behind-the-scenes content? Follow me on Instagram @username where I share daily tips and updates.",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Cross-platform audience building.'
  },
  {
    id: 'next-video-cta',
    name: 'Watch Next Video',
    description: 'Suggests another video to watch.',
    example: "If you enjoyed this, you'll definitely want to check out my video on [related topic] which appears right here.",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Increasing session watch time and retention.'
  },
  {
    id: 'exclusive-offer-cta',
    name: 'Exclusive Offer',
    description: 'Presents a limited-time offer or discount.',
    example: "For the next 48 hours, use code VIDEO20 for 20% off my complete course that teaches you everything you need to know about [topic].",
    category: FRAME_CATEGORIES.CTA,
    popularUse: 'Converting viewers to customers.'
  }
];

export const CREATOR_TEMPLATES: CreatorTemplate[] = [
  // Added custom template with Hook → Intro → Content → Rehook → Content → CTA → Outro structure
  {
    id: 'standard-structure',
    name: 'GMV Foundation Template',
    creator: 'Custom',
    description: 'Versatile format with strategic rehook to maintain viewer retention',
    units: ['Hook', 'Intro', 'Content Delivery', 'Rehook', 'Content Delivery', 'Call To Action', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['curiosity-gap', 'intriguing-question'],
        examples: [
          {
            frameId: 'curiosity-gap',
            content: 'The one thing most creators miss that would double their views...'
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'establish-credibility'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: 'In this video, I\'ll show you exactly how to structure your content for maximum engagement.'
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['step-by-step', 'expert-insight'],
        examples: [
          {
            frameId: 'step-by-step',
            content: 'First, let\'s break down the three key elements of high-performing content...'
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['midway-shock', 'teaser-rehook'],
        examples: [
          {
            frameId: 'midway-shock',
            content: 'But here\'s where things get interesting - what worked last year won\'t work anymore, and here\'s why...'
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['common-pitfalls', 'quick-win'],
        examples: [
          {
            frameId: 'common-pitfalls',
            content: 'Now I\'ll show you the exact formula I use that consistently gets my videos over 100,000 views...'
          }
        ]
      },
      {
        unitType: 'Call To Action',
        frameIds: ['comment-prompt', 'subscribe-cta'],
        examples: [
          {
            frameId: 'comment-prompt',
            content: 'Let me know in the comments which of these strategies you\'re going to try first!'
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['key-takeaway', 'coming-soon'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: 'Remember, consistency and structure are key to building a loyal audience. Thanks for watching!'
          }
        ]
      }
    ]
  },
  // Removed duplicate MrBeast template - keeping only the one in Entertainment category that matches the structure in the screenshot
  
  {
    id: 'hormozi',
    name: 'Alex Hormozi Style',
    creator: 'Alex Hormozi',
    description: 'Business and entrepreneurship wisdom delivery',
    units: ['Hook', 'Problem Setup', 'Solution', 'Implementation', 'Results', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'myth-buster', 'intriguing-question'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "The number one reason most businesses fail isn't what you think. And fixing it doesn't require more work—it requires the opposite."
          },
          {
            frameId: 'myth-buster',
            content: "Everyone tells you to focus on social media marketing, but they're dead wrong. Here's what actually drives business growth."
          },
          {
            frameId: 'intriguing-question',
            content: "What if I told you that the top 1% of entrepreneurs do the exact opposite of what business gurus teach?"
          }
        ]
      },
      {
        unitType: 'Problem Setup',
        frameIds: ['myth-buster', 'common-struggle', 'common-pitfalls'],
        examples: [
          {
            frameId: 'myth-buster',
            content: "You've been taught that more clients equals more revenue. This fallacy is killing your profit margins and here's why."
          },
          {
            frameId: 'common-struggle',
            content: "Most business owners work 80-hour weeks thinking hustle equals success. The reality? You're working yourself into mediocrity."
          },
          {
            frameId: 'common-pitfalls',
            content: "The three critical mistakes almost every service business makes that guarantee they'll stay small forever."
          }
        ]
      },
      {
        unitType: 'Solution',
        frameIds: ['expert-insight', 'case-study', 'step-by-step'],
        examples: [
          {
            frameId: 'expert-insight',
            content: "After working with over 4,000 businesses, I discovered this counterintuitive truth: Raising your prices actually increases demand when done correctly."
          },
          {
            frameId: 'case-study',
            content: "My client Sarah was charging $50 per hour and working nonstop. Within 60 days, she restructured to $5,000 packages and now works half as much while making triple the revenue."
          },
          {
            frameId: 'step-by-step',
            content: "Here's the exact three-step process we use with our clients to engineer irresistible high-ticket offers that convert at 40%."
          }
        ]
      },
      {
        unitType: 'Implementation',
        frameIds: ['step-by-step', 'common-pitfalls', 'expert-insight'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Step 1: Identify your highest-value deliverable. Step 2: Create a proprietary framework around it. Step 3: Restructure your pricing to reflect the outcome, not the hours worked."
          },
          {
            frameId: 'common-pitfalls',
            content: "When implementing this strategy, avoid these three deadly mistakes that cause even the best offers to fail."
          },
          {
            frameId: 'expert-insight',
            content: "The key to implementation is speed. I've found that businesses who execute this framework within 7 days see conversion rates 3X higher than those who wait."
          }
        ]
      },
      {
        unitType: 'Results',
        frameIds: ['testimonial', 'data-story', 'case-study'],
        examples: [
          {
            frameId: 'testimonial',
            content: "\"I was skeptical at first, but after implementing Alex's framework, we went from $30K to $300K per month in less than 90 days with the exact same team size.\" - Mark R., Agency Owner"
          },
          {
            frameId: 'data-story',
            content: "Across our portfolio of 4,327 businesses, the average increase in profit margin is 62% within the first quarter of implementation, while decreasing fulfillment time by 47%."
          },
          {
            frameId: 'case-study',
            content: "Let me walk you through exactly how Jennifer transformed her struggling fitness business from earning $7K per month to consistently bringing in $92K monthly with better clients and fewer headaches."
          }
        ]
      }
    ]
  },
  {
    id: 'emma-chamberlain',
    name: 'Emma Chamberlain Style',
    creator: 'Emma Chamberlain',
    description: 'Lifestyle and comedy content structure',
    units: ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['shock-value', 'intriguing-question', 'personal-connection'],
        examples: [
          {
            frameId: 'shock-value',
            content: "I literally haven't washed my hair in two weeks and you guys... it actually looks better than ever? I'm so confused."
          },
          {
            frameId: 'intriguing-question',
            content: "Have you ever wondered what actually happens when you drink three espressos and then try to meditate for the first time? Because I did that yesterday."
          },
          {
            frameId: 'personal-connection',
            content: "So I moved to a new apartment and I've been having the weirdest interactions with my neighbors that I just need to talk about."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['common-struggle', 'heartfelt-confession', 'visual-demo'],
        examples: [
          {
            frameId: 'common-struggle',
            content: "Does anyone else feel completely overwhelmed by their email inbox? Like, I open it and immediately want to throw my laptop out the window."
          },
          {
            frameId: 'heartfelt-confession',
            content: "I've been feeling really anxious about social situations lately, which is weird because I used to think I was somewhat of an extrovert? I don't know, maybe I'm changing."
          },
          {
            frameId: 'visual-demo',
            content: "Okay so I'm going to show you my morning routine, but like, the REAL one. Not the aesthetic TikTok version where I'm drinking lemon water at 5am."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['behind-the-scenes', 'common-struggle', 'visual-demo'],
        examples: [
          {
            frameId: 'behind-the-scenes',
            content: "So when I was at this coffee shop, off camera, the barista told me something that completely changed how I think about my daily routine..."
          },
          {
            frameId: 'common-struggle',
            content: "Trying to film this part was actually a disaster. My camera kept dying, I spilled coffee TWICE, and then it started raining out of nowhere."
          },
          {
            frameId: 'visual-demo',
            content: "Watch what happens when I try this weird face mask that's apparently made from snail mucus. I'm kind of terrified but also intrigued?"
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['teaser-rehook', 'what-happens-next', 'midway-shock'],
        examples: [
          {
            frameId: 'teaser-rehook',
            content: "But wait until you see what happened after I left the store... I was NOT expecting that reaction from everyone."
          },
          {
            frameId: 'what-happens-next',
            content: "So now I'm standing in my kitchen at 3am about to try this recipe that supposedly changes your life? I don't know if this is a good idea."
          },
          {
            frameId: 'midway-shock',
            content: "Guys. I just checked the price of this thing I've been using for MONTHS and it's actually insanely expensive. I had no idea!"
          }
        ]
      }
    ]
  },
  {
    id: 'charli-damelio',
    name: 'Charli D\'Amelio Style',
    creator: 'Charli D\'Amelio',
    description: 'Short-form dance and lifestyle content',
    units: ['Visual Hook', 'Content Delivery', 'Outro'],
    frames: [
      {
        unitType: 'Visual Hook',
        frameIds: ['visual-demo', 'shock-value', 'intriguing-question'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "Watch how I create this trending transition in just three simple movements. #transition #dancetutorial"
          },
          {
            frameId: 'shock-value',
            content: "I learned this dance in 10 minutes... wait for the ending! 😱 #fastlearner"
          },
          {
            frameId: 'intriguing-question',
            content: "Ever wonder how dancers hit those perfect moves every time? Let me show you the secret..."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['visual-demo', 'step-by-step', 'creative-transition'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "Break it down like this: arm, hip, step, turn. Watch me demonstrate at half-speed first. #dancetutorial"
          },
          {
            frameId: 'step-by-step',
            content: "Step 1: Start with feet together. Step 2: Shift weight to your right foot. Step 3: Now for the tricky part..."
          },
          {
            frameId: 'creative-transition',
            content: "Now watch as I blend this move into the next sequence for a seamless flow that looks professional. #dancetips"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'next-steps', 'viewer-challenge'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "Follow for a new dance tutorial every day this week! Tag me in your attempts! #learntodance"
          },
          {
            frameId: 'next-steps',
            content: "If you mastered this move, check out my advanced tutorial dropping tomorrow for the full choreography!"
          },
          {
            frameId: 'viewer-challenge',
            content: "I challenge you to try this dance and post it with #CharlisChallenge - I'll be featuring my favorites!"
          }
        ]
      }
    ]
  },
  {
    id: 'nas-daily',
    name: 'Nas Daily Style',
    creator: 'Nas Daily',
    description: 'Educational storytelling with clear progression',
    units: ['Hook', 'Story Setup', 'Content Delivery', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'myth-buster', 'bold-statement'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "This is Singapore, and this is why it's the most expensive city in the world. Let me show you what makes it unique in just 1 minute!"
          },
          {
            frameId: 'myth-buster',
            content: "Everything you think you know about renewable energy is wrong. These three countries prove it - and the results will surprise you."
          },
          {
            frameId: 'bold-statement',
            content: "This small country invented a system that completely eliminated poverty in just one generation. And the world needs to know about it."
          }
        ]
      },
      {
        unitType: 'Story Setup',
        frameIds: ['personal-connection', 'thought-experiment', 'common-struggle'],
        examples: [
          {
            frameId: 'personal-connection',
            content: "When I arrived in Japan last year, I couldn't understand why their streets were so clean until I discovered this incredible cultural practice."
          },
          {
            frameId: 'thought-experiment',
            content: "Imagine a world where electricity is free for everyone. Crazy, right? But this company in Denmark is making it possible with this innovation."
          },
          {
            frameId: 'common-struggle',
            content: "We all struggle to stay productive in our busy lives. But this ancient technique practiced in Bali is changing how people work forever."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['teach-concept', 'expert-insight', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'teach-concept',
            content: "Here's how this incredible system works: First, they collect rainwater from every building. Second, they filter it through these special membranes. Third, they redistribute it throughout the entire city."
          },
          {
            frameId: 'expert-insight',
            content: "I interviewed the woman who invented this technology, and she told me something that changed my perspective completely: \"Innovation doesn't require new resources, just new thinking.\""
          },
          {
            frameId: 'behind-the-scenes',
            content: "What you don't see on social media is how this community spends 3 hours every morning preparing for just 5 minutes of this incredible ritual."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['teaser-rehook', 'midway-shock', 'viewer-challenge'],
        examples: [
          {
            frameId: 'teaser-rehook',
            content: "But that's not even the most amazing part. Wait until you see what happens when they apply this technique to schools!"
          },
          {
            frameId: 'midway-shock',
            content: "This is where things get mind-blowing. The system was actually created by a 14-year-old student who was failing in school!"
          },
          {
            frameId: 'viewer-challenge',
            content: "I challenge you to try this practice for just one week. Message me your results - I guarantee you'll see a difference."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['key-takeaway', 'call-to-action', 'next-steps'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "The big lesson here? Innovation often comes from the places we least expect it. This is why we need to keep exploring and sharing these stories."
          },
          {
            frameId: 'call-to-action',
            content: "If you want to learn more about incredible innovations around the world, follow me! One-minute videos, every day."
          },
          {
            frameId: 'next-steps',
            content: "Tomorrow, I'll show you how a small village in Africa completely transformed their economy with one simple change. Don't miss it!"
          }
        ]
      }
    ]
  },
  {
    id: 'casey-neistat',
    name: 'Casey Neistat Style',
    creator: 'Casey Neistat',
    description: 'Cinematic storytelling with strong narrative arc',
    units: ['Hook', 'Story Setup', 'Content Journey', 'Climax', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'shock-value', 'intriguing-question'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "[Fast-paced aerial shots of New York City] The city looks calm from up here, but what happens when you try to deliver a package across Manhattan during rush hour?"
          },
          {
            frameId: 'shock-value',
            content: "My flight was canceled, so I'm attempting to travel 300 miles in 24 hours using nothing but electric scooters. Is it even possible?"
          },
          {
            frameId: 'intriguing-question',
            content: "What would happen if you gave a filmmaker a brand new camera and just 3 hours to create something meaningful?"
          }
        ]
      },
      {
        unitType: 'Story Setup',
        frameIds: ['personal-connection', 'conflict-setup', 'common-struggle'],
        examples: [
          {
            frameId: 'personal-connection',
            content: "I've been fascinated with drones since I first saw one five years ago. Today, I'm going to attempt something that's never been done with consumer drones before."
          },
          {
            frameId: 'conflict-setup',
            content: "Here's the challenge: I need to get from downtown to the airport during the biggest parade of the year. All roads are closed, and I have exactly 90 minutes before my flight."
          },
          {
            frameId: 'common-struggle',
            content: "We've all experienced that moment when technology fails at the worst possible time. Today it happened to me in the middle of nowhere, and here's how it unfolded."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['behind-the-scenes', 'visual-demo', 'creative-transition'],
        examples: [
          {
            frameId: 'behind-the-scenes',
            content: "What you don't see is that it took us 15 attempts to get this shot right. The drone crashed twice, and we had to navigate through some seriously questionable legal territory."
          },
          {
            frameId: 'visual-demo',
            content: "[Time-lapse of city streets with narrator running through crowds] This is what happens when you try to cross Times Square during New Year's Eve preparations."
          },
          {
            frameId: 'creative-transition',
            content: "[Fast cut from subway to rooftop with continuous narration] Sometimes you have to go underground before you can rise above the chaos and see things clearly."
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['shock-value', 'midway-shock', 'what-happens-next'],
        examples: [
          {
            frameId: 'shock-value',
            content: "After six hours of trying, we finally made it to the top... only to discover that the entire event had been canceled due to weather conditions they never announced."
          },
          {
            frameId: 'midway-shock',
            content: "Just when I thought we had figured it all out, the battery died completely. No warning, no backup plan, stranded 15 miles from civilization."
          },
          {
            frameId: 'what-happens-next',
            content: "So what do you do when you're standing on the edge of a building with $10,000 worth of equipment and suddenly security shows up? Here's what happened next..."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['personal-connection', 'key-takeaway', 'heartfelt-confession'],
        examples: [
          {
            frameId: 'personal-connection',
            content: "Days like these remind me why I started making videos in the first place. It's not about the destination; it's about documenting the journey, regardless of how it turns out."
          },
          {
            frameId: 'key-takeaway',
            content: "The lesson I keep relearning: preparation matters, but being able to adapt when everything falls apart matters more. That's not just filmmaking; that's life."
          },
          {
            frameId: 'heartfelt-confession',
            content: "If I'm being completely honest, there were moments today when I wanted to give up entirely. Sometimes persisting through that feeling is what separates a good story from no story at all."
          }
        ]
      }
    ]
  },
  {
    id: 'mkbhd',
    name: 'MKBHD Style',
    creator: 'Marques Brownlee',
    description: 'Tech review and explanation format',
    units: ['Hook', 'Intro', 'Content Segment 1', 'Rehook', 'Content Segment 2', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'intriguing-question', 'bold-statement'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "[Clean product shot of smartphone] This is the new Pixel 8 Pro, and after using it for two weeks, it's changing how I think about smartphone cameras entirely."
          },
          {
            frameId: 'intriguing-question',
            content: "What if I told you the most important feature of this $1,200 smartphone isn't even mentioned in the marketing materials?"
          },
          {
            frameId: 'bold-statement',
            content: "This is the most important tech purchase decision you'll make in 2025, and almost everyone gets it wrong for one simple reason."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['teach-concept', 'myth-buster', 'expert-insight'],
        examples: [
          {
            frameId: 'teach-concept',
            content: "Let's talk about processing power versus optimization. In smartphones, it's not about how much power you have, but how efficiently the software uses it."
          },
          {
            frameId: 'myth-buster',
            content: "People think more megapixels always means better photos. That's completely wrong, and here's why computational photography changes everything."
          },
          {
            frameId: 'expert-insight',
            content: "After testing over 50 smartphones this year, I've noticed that battery technology hasn't fundamentally changed - what's changed is how we manage power consumption."
          }
        ]
      },
      {
        unitType: 'Content Segment 1',
        frameIds: ['step-by-step', 'visual-demo', 'data-story'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, let's look at the display. Then, we'll test the camera in various lighting conditions. Finally, we'll stress-test the battery under typical daily usage."
          },
          {
            frameId: 'visual-demo',
            content: "[Side-by-side comparison footage] Watch how this phone handles 4K video recording compared to last year's model. Notice the difference in stabilization and color accuracy."
          },
          {
            frameId: 'data-story',
            content: "Our benchmark tests show this processor performing 22% better than last generation while consuming 15% less power. That's the power efficiency curve we've been waiting for."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['teaser-rehook', 'midway-shock', 'viewer-challenge'],
        examples: [
          {
            frameId: 'teaser-rehook',
            content: "But the real test comes when we push this camera to its limits in extreme low light - and the results might surprise you."
          },
          {
            frameId: 'midway-shock',
            content: "Here's where things get interesting: we discovered a hidden setting that completely transforms the performance, something not mentioned in any review guide."
          },
          {
            frameId: 'viewer-challenge',
            content: "I challenge you to try this simple test on your current phone - I guarantee it will reveal whether you actually need to upgrade this year."
          }
        ]
      },
      {
        unitType: 'Content Segment 2',
        frameIds: ['case-study', 'step-by-step', 'visual-demo'],
        examples: [
          {
            frameId: 'case-study',
            content: "Last month we took this exact phone on a trip through the Grand Canyon, using it as our only camera. Let me show you the actual unedited footage we captured."
          },
          {
            frameId: 'step-by-step',
            content: "If you do purchase this device, here are the three settings you should immediately change for optimal performance and battery life."
          },
          {
            frameId: 'visual-demo',
            content: "[Slow motion detailed footage] Look at the precision of these animations and transitions. That's the advantage of having dedicated GPU resources for UI rendering."
          }
        ]
      }
    ]
  },
  {
    id: 'nikkietutorials',
    name: 'NikkieTutorials Style',
    creator: 'NikkieTutorials',
    description: 'Beauty and transformation content structure',
    units: ['Hook', 'Intro', 'Content Delivery', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['shock-value', 'personal-connection', 'bold-statement'],
        examples: [
          {
            frameId: 'shock-value',
            content: "I tried the viral foundation that's all over TikTok... and I was SHOCKED at what it did to my skin after 8 hours!"
          },
          {
            frameId: 'personal-connection',
            content: "You guys have been asking for months about my skincare routine, so today I'm finally spilling ALL my secrets!"
          },
          {
            frameId: 'bold-statement',
            content: "This is the ONE product that completely transformed my makeup routine, and it's not what you think."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['personal-connection', 'common-struggle', 'teach-concept'],
        examples: [
          {
            frameId: 'personal-connection',
            content: "When I was younger, I struggled so much with acne that I wouldn't leave the house without a full face of makeup. That's why today's video means so much to me."
          },
          {
            frameId: 'common-struggle',
            content: "We've all been there - spending hundreds on products that promise miracles but deliver disappointment. Let's talk about what actually works."
          },
          {
            frameId: 'teach-concept',
            content: "Before we dive in, let's understand the difference between dewy, matte, and satin finishes, because this will change how you approach your entire makeup routine."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['step-by-step', 'visual-demo', 'expert-insight'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Start by prepping your skin with this hydrating primer, focusing on your T-zone. Then take a pea-sized amount of foundation and apply it in thin layers using a damp beauty blender."
          },
          {
            frameId: 'visual-demo',
            content: "Look at the difference between applying with a brush versus a sponge - do you see how the sponge gives a much more natural, skin-like finish?"
          },
          {
            frameId: 'expert-insight',
            content: "Having worked with celebrity makeup artists for years, I've learned that the secret to flawless foundation isn't the product itself - it's how you layer different formulas for your specific skin type."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['teaser-rehook', 'midway-shock', 'viewer-challenge'],
        examples: [
          {
            frameId: 'teaser-rehook',
            content: "But wait until you see the final result after setting spray... this is where the magic really happens!"
          },
          {
            frameId: 'midway-shock',
            content: "I was NOT expecting this color to work for me at all, but look at how it completely transformed the entire look!"
          },
          {
            frameId: 'viewer-challenge',
            content: "I challenge you to try this technique with products you already own before buying anything new - tag me if you do!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'heartfelt-confession', 'next-steps'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this tutorial, please give it a thumbs up and subscribe for new videos every week! All products are linked in the description."
          },
          {
            frameId: 'heartfelt-confession',
            content: "Being completely honest with you, it took me years to feel confident enough to show my bare skin on camera. Your support means everything to me."
          },
          {
            frameId: 'next-steps',
            content: "Next week I'll be reviewing the most requested drugstore dupes for luxury makeup, so leave your suggestions in the comments!"
          }
        ]
      }
    ]
  },
  {
    id: 'garyv',
    name: 'GaryVee Style',
    creator: 'Gary Vaynerchuk',
    description: 'Motivational business content structure',
    units: ['Hook', 'Problem Setup', 'Teach a Concept', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'shock-value', 'intriguing-question'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "I'm about to save 99% of you YEARS of wasted time and money by telling you what nobody in the business world wants you to hear."
          },
          {
            frameId: 'shock-value',
            content: "You're working 80 hours a week building someone else's dream while your own business idea collects dust. WAKE UP."
          },
          {
            frameId: 'intriguing-question',
            content: "What if I told you the number one thing stopping you from making real money has nothing to do with the economy, your background, or your skills?"
          }
        ]
      },
      {
        unitType: 'Problem Setup',
        frameIds: ['common-struggle', 'myth-buster', 'viewer-challenge'],
        examples: [
          {
            frameId: 'common-struggle',
            content: "So many of you are paralyzed by fear of failure. You're waiting for the 'perfect time' to start your business, which is absolute nonsense because that time will NEVER come."
          },
          {
            frameId: 'myth-buster',
            content: "Everybody's telling you that you need fancy degrees and connections to succeed. WRONG. What you need is to stop making excuses and start executing TODAY."
          },
          {
            frameId: 'viewer-challenge',
            content: "I challenge you right now to write down why you haven't started. Be honest with yourself. Is it fear? Laziness? What's the real reason?"
          }
        ]
      },
      {
        unitType: 'Teach a Concept',
        frameIds: ['expert-insight', 'teach-concept', 'step-by-step'],
        examples: [
          {
            frameId: 'expert-insight',
            content: "After building multiple 9-figure businesses, I can tell you with absolute certainty that patience and micro-speed is the unbeatable combination. Patient strategy, aggressive execution."
          },
          {
            frameId: 'teach-concept',
            content: "Your personal brand is the greatest leverage point in today's economy. It's not just some Instagram photos. It's building trust at scale that converts to real business opportunities."
          },
          {
            frameId: 'step-by-step',
            content: "Step one: Pick the platform where your customers actually are. Step two: Create daily content for 12 months without expecting results. Step three: Double down on what's working and cut everything else."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['midway-shock', 'teaser-rehook', 'bold-statement'],
        examples: [
          {
            frameId: 'midway-shock',
            content: "Here's what's crazy - 95% of you watching will nod your heads, agree with everything I'm saying, and then do ABSOLUTELY NOTHING with this information."
          },
          {
            frameId: 'teaser-rehook',
            content: "But I haven't even told you the most important part yet - the one strategy that completely changed the game for me when I was dead broke and just starting out."
          },
          {
            frameId: 'bold-statement',
            content: "Stop overthinking and start doing. Your excuses are costing you millions while others are out there building empires with less talent and resources than you have."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'key-takeaway', 'next-steps'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If this resonated with you, smash that subscribe button right now and turn on notifications. We're dropping tactical business advice every single day."
          },
          {
            frameId: 'key-takeaway',
            content: "Remember this: the market doesn't care about your feelings, your background, or your excuses. It only rewards value and execution. That's it."
          },
          {
            frameId: 'next-steps',
            content: "Your homework: spend the next hour mapping out your content strategy for the next 90 days. No excuses. DM me your plan if you're serious."
          }
        ]
      }
    ]
  },
  {
    id: 'dude-perfect',
    name: 'Dude Perfect Style',
    creator: 'Dude Perfect',
    description: 'Challenge and entertainment content structure',
    units: ['Hook', 'Challenge Setup', 'Content Journey', 'Climax', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['viewer-challenge', 'visual-demo', 'shock-value'],
        examples: [
          {
            frameId: 'viewer-challenge',
            content: "Today we're going to attempt the world's longest basketball shot from the top of this 400-foot tower. Can we do it?"
          },
          {
            frameId: 'visual-demo',
            content: "Check out this crazy new obstacle course we built! Last person to complete it wins $10,000."
          },
          {
            frameId: 'shock-value',
            content: "We filled our entire office with 1 million ping pong balls overnight. Wait until you see our coworkers' reactions!"
          }
        ]
      },
      {
        unitType: 'Challenge Setup',
        frameIds: ['conflict-setup', 'viewer-challenge', 'common-struggle'],
        examples: [
          {
            frameId: 'conflict-setup',
            content: "The rules are simple: each person gets 5 attempts. Closest to the bullseye advances to the next round. Last person standing wins the championship belt."
          },
          {
            frameId: 'viewer-challenge',
            content: "Think you can do better? Try this at home and tag us with #DudePerfectChallenge - we'll feature the best attempts in our next video!"
          },
          {
            frameId: 'common-struggle',
            content: "Let's be honest, we've all tried trick shots at home and failed miserably. It took us 347 attempts to make this shot!"
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['behind-the-scenes', 'step-by-step', 'creative-transition'],
        examples: [
          {
            frameId: 'behind-the-scenes',
            content: "What you don't see is how we spent two full days setting up these dominoes. Ty knocked them over twice and we had to restart!"
          },
          {
            frameId: 'step-by-step',
            content: "First, we'll attempt the basketball shot. Then, we'll move to the frisbee challenge. Finally, the winner gets to attempt the impossible water bottle flip."
          },
          {
            frameId: 'creative-transition',
            content: "Now let's head outside where Cody has prepared something absolutely insane for the next part of this challenge."
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['shock-value', 'visual-demo', 'midway-shock'],
        examples: [
          {
            frameId: 'shock-value',
            content: "NO WAY HE JUST MADE THAT! First try! That's never happened in Dude Perfect history!"
          },
          {
            frameId: 'visual-demo',
            content: "Watch this in slow motion - the ball travels over 200 feet, bounces three times, and somehow goes perfectly into the target."
          },
          {
            frameId: 'midway-shock',
            content: "We did NOT expect the wind to be this strong up here. This just got 10 times harder!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['recap-summary', 'call-to-action', 'next-steps'],
        examples: [
          {
            frameId: 'recap-summary',
            content: "What an incredible battle today! Garrett took home the trophy with that unbelievable final shot. Let's see that one more time in super slow motion."
          },
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this video, hit that subscribe button and notification bell so you don't miss our next crazy challenge!"
          },
          {
            frameId: 'next-steps',
            content: "Next week, we're attempting to break a world record with the help of a special guest. You won't want to miss it!"
          }
        ]
      }
    ]
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