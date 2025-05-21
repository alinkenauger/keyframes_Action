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
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['relatable-problem', 'bold-statement'],
        examples: [
          {
            frameId: 'relatable-problem',
            content: "So I decided that today I was going to be, like, the most productive human on the planet. I made a list. I set alarms. I even bought a planner. Spoiler alert: It's 2 PM and I'm still in bed. Welcome to my life."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['lighthearted-humor', 'goal-statement'],
        examples: [
          {
            frameId: 'lighthearted-humor',
            content: "I swear I've been drinking coffee for like five years now and I still manage to spill it every single morning. Like, how? Is this a skill issue? Am I just permanently clumsy? Don't answer that."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['relatable-moment', 'unfiltered-confession'],
        examples: [
          {
            frameId: 'relatable-moment',
            content: "Does anyone else just stare at their inbox sometimes and feel their soul leaving their body? No? Just me? Cool."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['humor-rehook', 'unexpected-obstacle'],
        examples: [
          {
            frameId: 'humor-rehook',
            content: "Plot twist! I made it to the at-home workout portion of my day. Second plot twist! I've been lying here scrolling through TikTok for 15 minutes instead of actually working out. This is what we call ✨multitasking✨."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['reflection-with-humor', 'casual-call-to-action'],
        examples: [
          {
            frameId: 'reflection-with-humor',
            content: "So today I learned that I'm still terrible at being productive, but I'm really good at convincing myself that scrolling through social media counts as 'research' and that organizing my Spotify playlists is 'essential life admin'."
          }
        ]
      }
    ]
  },

  // ENTERTAINMENT CATEGORY
  {
    id: 'casey-neistat',
    name: 'Casey Neistat Style',
    creator: 'Casey Neistat',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'High-energy vlog/documentary hybrid with cinematic visuals',
    units: ['Hook', 'Story Setup', 'Content Journey', 'Rehook', 'Escalation', 'Climax', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'bold-statement'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "New York City. 8 million stories. Today, I'm looking for just one."
          }
        ]
      },
      {
        unitType: 'Story Setup',
        frameIds: ['personal-connection', 'goal-statement'],
        examples: [
          {
            frameId: 'personal-connection',
            content: "I've been feeling creatively stuck lately. It happens to everyone, but as a creator, it's terrifying. So today, I'm doing what I always do when I need inspiration - I'm hitting the streets."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['conflict-setup', 'relatable-moment', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'conflict-setup',
            content: "Of course, nothing in New York is ever simple. Subway's delayed, it's starting to rain, and I'm already behind schedule."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['question-rehook', 'teaser-rehook'],
        examples: [
          {
            frameId: 'question-rehook',
            content: "What if inspiration isn't something you find? What if it's something that finds you when you're busy looking elsewhere?"
          }
        ]
      },
      {
        unitType: 'Escalation',
        frameIds: ['stakes-amplifier', 'unexpected-discovery'],
        examples: [
          {
            frameId: 'stakes-amplifier',
            content: "With only four hours of daylight left, I'm determined to visit every neighborhood on my list. The clock is ticking."
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['triumph-over-adversity', 'big-reveal'],
        examples: [
          {
            frameId: 'triumph-over-adversity',
            content: "Five neighborhoods. Seven artists. Countless moments of inspiration. Despite the rain, the delays, and the chaos - or maybe because of them - today was exactly what I needed."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['one-liner-wisdom', 'key-takeaway'],
        examples: [
          {
            frameId: 'one-liner-wisdom',
            content: "Creativity isn't found in perfect conditions. It's found in the messy, unpredictable moments when you're open to seeing the world differently."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'subscribe-reminder'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "Where do you find inspiration when you're stuck? Let me know in the comments. See you tomorrow."
          }
        ]
      }
    ]
  },
  
  {
    id: 'dude-perfect',
    name: 'Dude Perfect Style',
    creator: 'Dude Perfect',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'High-energy challenge & trick shot videos with team camaraderie',
    units: ['Hook', 'Intro', 'Content Segment', 'Rehook', 'Challenge Progression', 'Climax', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'shocking-statement'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "[Slow-motion shot of paper airplane flying across office, through small opening in doorway, landing perfectly in trash can] Group cheer: 'OHHHHHHHH!'"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['team-introduction', 'challenge-setup'],
        examples: [
          {
            frameId: 'team-introduction',
            content: "What's up guys! Welcome to Dude Perfect! Today we're turning an ordinary office into the ultimate trick shot playground!"
          }
        ]
      },
      {
        unitType: 'Content Segment',
        frameIds: ['step-by-step-demo', 'escalation'],
        examples: [
          {
            frameId: 'step-by-step-demo',
            content: "Alright, for this first one, we're calling it 'The Copier.' I've got to bounce this stress ball off three walls, onto the copier lid, and have it land in this coffee mug."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['stakes-amplifier', 'teaser-rehook'],
        examples: [
          {
            frameId: 'stakes-amplifier',
            content: "Alright, we're halfway through the challenges, and Garrett is falling behind. If he doesn't make this next shot in under 10 attempts, he's definitely going to be our new intern!"
          }
        ]
      },
      {
        unitType: 'Challenge Progression',
        frameIds: ['competition', 'triumph-over-adversity'],
        examples: [
          {
            frameId: 'competition',
            content: "The Swivel Chair Spinner! You've got to spin three times in the chair while bouncing the ping pong ball, then land it in the pencil holder."
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['final-challenge', 'big-reveal'],
        examples: [
          {
            frameId: 'final-challenge',
            content: "This is it. The Office Domino. One paper airplane that has to trigger a chain reaction across the entire office, ending with that stapler falling into the trash can."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['result-announcement', 'call-to-action'],
        examples: [
          {
            frameId: 'result-announcement',
            content: "Well, after ten impossible office trick shots... Looks like we've got our new intern!"
          }
        ]
      }
    ]
  },

  // BUSINESS CATEGORY
  {
    id: 'garyv',
    name: 'GaryV Style',
    creator: 'Gary Vaynerchuk',
    category: 'Business',
    contentTypes: ['long', 'short'],
    description: 'High-energy, direct motivational business advice with actionable insights',
    units: ['Hook', 'Intro', 'Content Delivery', 'Rehook', 'Practical Application', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['call-out-audience', 'bold-statement'],
        examples: [
          {
            frameId: 'call-out-audience',
            content: "You keep asking why you're not seeing results with your business? I'll tell you exactly why. You're addicted to strategies but allergic to execution. Let's talk about it."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['establish-credibility', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "I've built multiple 8-figure businesses, and I've consulted for Fortune 500 companies. But I've also talked to thousands of entrepreneurs who are struggling. And I keep seeing the same pattern."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['key-insight', 'myth-buster'],
        examples: [
          {
            frameId: 'key-insight',
            content: "Here's the truth: 99% of you are overthinking it. You're consuming content like this instead of DOING THE WORK. It's not about finding the perfect strategy. It's about putting in the reps on the fundamentals."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['attention-grabber', 'personal-challenge'],
        examples: [
          {
            frameId: 'attention-grabber',
            content: "You think Zuckerberg was waiting for the perfect time to launch Facebook? You think I waited until I had the perfect camera setup before starting my content? NO! We just started. That's the difference."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['step-by-step', 'common-pitfalls'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "Here's what you're going to do: 1) Pick ONE platform. 2) Create content EVERY DAY for 90 days. 3) Engage with your community for at least 30 minutes daily. 4) Review what's working weekly. That's it."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-takeaway', 'motivation-booster'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "The market doesn't reward people who know things. It rewards people who DO things. Your execution > your knowledge. Your consistency > your perfection."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'gratitude-expression'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "Stop watching videos after this. Go execute. I mean it. But if you found this valuable, maybe subscribe before you go. And if you have a specific challenge you're facing, drop it in the comments - maybe I'll make my next video about it."
          }
        ]
      }
    ]
  },

  // TECHNOLOGY CATEGORY
  {
    id: 'mkbhd',
    name: 'Marques Brownlee (MKBHD) Style',
    creator: 'Marques Brownlee',
    category: 'Technology',
    contentTypes: ['long'],
    description: 'Sleek, precise tech reviews with cinematic visuals and clear explanations',
    units: ['Hook', 'Intro', 'Content Segment', 'Rehook', 'Content Segment 2', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'intriguing-question'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "What if I told you the most exciting smartphone of the year isn't from Apple or Samsung? [Camera pans over sleek new phone] This is the [Product X], and after two weeks of testing, I've got some thoughts."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'topic-overview'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "So when [Company] announced this phone last month, they made some big claims about the camera, battery life, and performance. Today we're putting those claims to the test."
          }
        ]
      },
      {
        unitType: 'Content Segment',
        frameIds: ['detailed-breakdown', 'common-questions'],
        examples: [
          {
            frameId: 'detailed-breakdown',
            content: "Let's start with build quality. The phone has an aluminum frame with Gorilla Glass on front and back. The buttons are clicky and responsive, and that matte finish on the back does a great job hiding fingerprints."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['unexpected-discovery', 'teaser-rehook'],
        examples: [
          {
            frameId: 'unexpected-discovery',
            content: "But here's where things get interesting. The camera system might look similar to last year's model, but there's something completely different happening inside."
          }
        ]
      },
      {
        unitType: 'Content Segment 2',
        frameIds: ['comparison-contrast', 'data-story'],
        examples: [
          {
            frameId: 'comparison-contrast',
            content: "I've been comparing these photos side-by-side with the iPhone and Pixel, and in good lighting, they're neck-and-neck. But once the sun goes down, you can see how the larger sensor really makes a difference."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-takeaway', 'future-implications'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "So is this the perfect phone? No. The software still has some quirks, and that $999 price tag is definitely premium. But what [Company] has done with the camera and battery life is genuinely impressive."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['audience-question', 'subscribe-reminder'],
        examples: [
          {
            frameId: 'audience-question',
            content: "What do you think about the [Product X]? Would you consider switching from your current phone? Let me know in the comments. And if you want to see more reviews like this, don't forget to subscribe. This is MKBHD, and I'll catch you in the next one."
          }
        ]
      }
    ]
  },
  
  // LIFESTYLE/BEAUTY CATEGORY
  {
    id: 'nikkietutorials',
    name: 'NikkieTutorials Style',
    creator: 'Nikkie de Jager',
    category: 'Lifestyle',
    contentTypes: ['long'],
    description: 'Engaging, detailed makeup tutorials with personality and professional techniques',
    units: ['Hook', 'Intro', 'Content Delivery', 'Demonstration', 'Transformation', 'Final Result', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['promise-of-value', 'visual-hook'],
        examples: [
          {
            frameId: 'promise-of-value',
            content: "Hello everyone! My name is Nikkie, and welcome to my channel! Today we're testing viral makeup hacks that are all over social media. Some of these look absolutely insane, but do they actually work? Let's find out!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['personal-connection', 'structure-preview'],
        examples: [
          {
            frameId: 'personal-connection',
            content: "So many of you have been tagging me in these crazy makeup hack videos, and I've been dying to try them! I've collected the five most viral ones that kept showing up on my feed. Some look genius, others look like disasters waiting to happen."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['teach-concept', 'expert-insight'],
        examples: [
          {
            frameId: 'teach-concept',
            content: "Before we dive in, let's understand why this hack is supposed to work. It claims that using a damp beauty sponge will create a more seamless blend because the water creates a barrier between the product and the sponge, preventing absorption."
          }
        ]
      },
      {
        unitType: 'Demonstration',
        frameIds: ['step-by-step', 'close-up-detail'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "For this hack, we're going to apply setting powder BEFORE foundation. I know, it sounds completely backwards! They claim it creates an ultra-matte, long-lasting base. Let me show you exactly how to do it..."
          }
        ]
      },
      {
        unitType: 'Transformation',
        frameIds: ['before-after', 'common-pitfalls'],
        examples: [
          {
            frameId: 'before-after',
            content: "Let's look at the difference side by side. On this side with the hack, you can see the foundation has a different texture - it's definitely more matte, but is it better? Let's zoom in and look at how it's sitting on the skin."
          }
        ]
      },
      {
        unitType: 'Final Result',
        frameIds: ['honest-review', 'personal-recommendation'],
        examples: [
          {
            frameId: 'honest-review',
            content: "After wearing this for the past three hours under these hot studio lights, I have to say... this hack actually WORKS! But with a caveat - it works best for oily skin types and not so much for dry skin. My T-zone usually gets shiny quickly, but with this technique, it's still perfectly matte!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['audience-question', 'subscribe-reminder'],
        examples: [
          {
            frameId: 'audience-question',
            content: "Have you tried any of these hacks before? Let me know your experiences in the comments! If you enjoyed this video, don't forget to give it a thumbs up and subscribe for new videos every week. Thank you so much for watching, and I'll see you in the next one!"
          }
        ]
      }
    ]
  },

  // EDUCATION CATEGORY
  {
    id: 'nas-daily',
    name: 'Nas Daily Style',
    creator: 'Nuseir Yassin',
    category: 'Education',
    contentTypes: ['short'],
    description: 'Fast-paced, high-energy educational content with global perspective',
    units: ['Hook', 'Problem Setup', 'Solution', 'Implementation', 'Results', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['shocking-statement', 'visual-hook'],
        examples: [
          {
            frameId: 'shocking-statement',
            content: "This tiny island with NO natural resources now produces 70% of its own water! Singapore's water story is mind-blowing, and today, I'm going to show you exactly how they did it in just ONE MINUTE!"
          }
        ]
      },
      {
        unitType: 'Problem Setup',
        frameIds: ['historical-context', 'data-story'],
        examples: [
          {
            frameId: 'historical-context',
            content: "Fifty years ago, Singapore had NO reliable water sources. They imported almost all their water from Malaysia, creating a dangerous dependence on another country. The situation was IMPOSSIBLE!"
          }
        ]
      },
      {
        unitType: 'Solution',
        frameIds: ['teach-concept', 'expert-insight'],
        examples: [
          {
            frameId: 'teach-concept',
            content: "So Singapore created a masterplan with FOUR national taps: 1) Imported water, 2) Rainwater collection, 3) Recycled water, and 4) Desalination. But the most INCREDIBLE part is the recycled water system!"
          }
        ]
      },
      {
        unitType: 'Implementation',
        frameIds: ['behind-the-scenes', 'visual-demo'],
        examples: [
          {
            frameId: 'behind-the-scenes',
            content: "I visited Singapore's NEWater plant, where they take sewage water and transform it into ultra-clean drinking water through a three-step process. The result? Water that's CLEANER than regular tap water!"
          }
        ]
      },
      {
        unitType: 'Results',
        frameIds: ['data-story', 'personal-story'],
        examples: [
          {
            frameId: 'data-story',
            content: "Today, NEWater meets 40% of Singapore's water needs! By 2060, they plan to triple its capacity to meet 55% of future demand. And the technology is so good that most of it is used for industrial purposes because it's PURER than what humans actually need!"
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['global-application', 'one-liner-wisdom'],
        examples: [
          {
            frameId: 'global-application',
            content: "With climate change making water scarcity a global issue, Singapore's solutions aren't just impressive—they're essential. Countries from Israel to Australia are now implementing similar strategies."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'motivation-booster'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "That's one minute! If you want more stories like this, follow me on social media. And remember: we're just one minute away from understanding each other better!"
          }
        ]
      }
    ]
  },

  // COOKING CATEGORY
  {
    id: 'joshua-weissman',
    name: 'Joshua Weissman Style',
    creator: 'Joshua Weissman',
    category: 'Cooking',
    contentTypes: ['long'],
    description: 'Food content with visual appeal and technical instruction',
    units: ['Hook', 'Intro', 'Content Delivery', 'Escalation', 'Reveal', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'challenge-setup'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "That right there is what a real burger should look like. Not that sad, flat thing they serve you at [Fast Food Chain]."
          },
          {
            frameId: 'challenge-setup',
            content: "Today, we're taking this sad excuse for a burger and transforming it into something that will make your taste buds absolutely lose their minds. This is [Fast Food Chain] Burger... But Better!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['relatable-problem', 'promise-of-value'],
        examples: [
          {
            frameId: 'relatable-problem',
            content: "Look at this thing. Dry, overcooked patty. Wilted lettuce. A bun that's been squished into oblivion. And don't even get me started on this sauce that's basically just glorified mayo with food coloring. We deserve better than this, people!"
          },
          {
            frameId: 'promise-of-value',
            content: "So here's what we're going to do. We're making everything from scratch - a perfect smash burger patty with a custom blend of beef, homemade brioche buns that are going to be absolutely luscious, quick-pickled onions for acidity, and a secret sauce that will make you slap your mama. This is going to be the burger of your dreams."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['step-by-step', 'educational', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, we're making our brioche buns. In a stand mixer, we're combining 500 grams of bread flour, 10 grams of salt, 80 grams of sugar, and 7 grams of instant yeast. Now we're adding 200 milliliters of whole milk that I've warmed to exactly 95 degrees Fahrenheit, 2 eggs, and 80 grams of softened butter. We're going to mix this until it's smooth and elastic."
          },
          {
            frameId: 'educational',
            content: "Now for the patties, I'm using a blend of 70% chuck and 30% brisket for the perfect fat content. You want around 20% fat for a juicy smash burger. And here's the key - don't overwork the meat! Just gently form it into balls. We're going for tender, not tough."
          },
          {
            frameId: 'behind-the-scenes',
            content: "While our dough is doing its thing, I've already prepared our quick-pickled onions. These have been sitting for about 2 hours in a mixture of rice vinegar, sugar, and salt. The acidity is going to cut through the richness of our burger perfectly."
          }
        ]
      },
      {
        unitType: 'Escalation',
        frameIds: ['stakes-amplifier', 'comparison'],
        examples: [
          {
            frameId: 'stakes-amplifier',
            content: "Now comes the moment of truth. We need this skillet absolutely ripping hot. I'm talking 500+ degrees. If it's not hot enough, we won't get that beautiful crust that makes a smash burger so incredible. This is where most people fail. They get impatient or scared of the heat. But greatness requires commitment, people!"
          },
          {
            frameId: 'comparison',
            content: "Look at the difference here. Their patty is pre-cooked, frozen, and reheated. Ours is fresh, perfectly seasoned, and getting an incredible sear that's developing hundreds of flavor compounds. It's not even a competition at this point. That crust is what dreams are made of, people. That's what we're after!"
          }
        ]
      },
      {
        unitType: 'Reveal',
        frameIds: ['big-reveal', 'taste-test'],
        examples: [
          {
            frameId: 'big-reveal', 
            content: "And now, the moment we've all been waiting for. Toasted brioche bun, secret sauce on the bottom, perfectly seared patty, melted American cheese, crisp lettuce, tomato, quick-pickled onions, more sauce, and the crown of our beautiful bun. Just look at that. Absolutely magnificent. A true work of art."
          },
          {
            frameId: 'taste-test',
            content: "Oh my... that is... ridiculous. The juiciness of that patty, the butteriness of the bun, the tang from the pickled onions, the richness of the sauce... it all comes together in perfect harmony. This isn't even in the same universe as the fast food version. This is what a burger should be."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['success-formula', 'one-liner-wisdom'],
        examples: [
          {
            frameId: 'success-formula',
            content: "What makes this burger superior comes down to three things: quality ingredients, proper technique, and attention to detail. We didn't take shortcuts. We respected each component. And the result speaks for itself. This costs about $3.50 per burger to make and will change your life."
          },
          {
            frameId: 'one-liner-wisdom',
            content: "Remember, people - cooking is about transformation. Taking something ordinary and making it extraordinary. That's the power you have in your kitchen every single day."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'subscribe-reminder'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this culinary glow-up, smash that subscribe button like I smashed that burger patty. Hit the notification bell so you never miss a video. And let me know in the comments what fast food item you want me to make 'But Better' next."
          },
          {
            frameId: 'subscribe-reminder',
            content: "Now go cook something delicious. I believe in you."
          }
        ]
      }
    ]
  },
  
  // GAMING CATEGORY
  {
    id: 'lilsimsie',
    name: 'Lilsimsie Style',
    creator: 'lilsimsie',
    category: 'Gaming',
    contentTypes: ['long'],
    description: 'Sims 4 gameplay with creative builds and challenges',
    units: ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Reveal', 'Engagement Trigger', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'challenge-setup'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "Okay, so I may have a slight obsession with tiny houses in The Sims. They're just so cute and cozy and perfect and today we're building the ultimate tiny house that's actually functional for gameplay!"
          },
          {
            frameId: 'challenge-setup',
            content: "So here's the challenge - we're going to build a fully functional tiny house on this 20x15 lot in Evergreen Harbor. It needs a kitchen, bathroom, living space, and at least one bedroom, but I also want it to be super cute and have a little garden. And we're going to try to keep it under 32 tiles to get all those tiny home benefits. This is going to be chaotic!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['relatable-problem', 'promise-of-value'],
        examples: [
          {
            frameId: 'relatable-problem',
            content: "I've tried building functional tiny houses before, and they always end up being either too cramped for actual gameplay or they're not actually tiny anymore. Like this one I made last month - it's cute, but my Sim kept getting the uncomfortable moodlet because they couldn't walk anywhere without bumping into things. It was a disaster!"
          },
          {
            frameId: 'promise-of-value',
            content: "But today is going to be different! I've been researching tiny house layouts, and I think I've figured out some tricks to make this work. We're going to use platforms for different levels, Murphy beds to save space, and I found some amazing custom content that's going to make this place super cute while being actually playable. Let's get started!"
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['step-by-step', 'educational', 'humor'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, I'm starting with a 6x5 foundation for the main living area. I know that seems tiny, but trust me, we're going to make it work! I'm adding a little 3x4 bump-out on the side for the bathroom. Now I'm going to add a platform here that's raised by one click - this is going to be our bedroom area, and we'll put the Murphy bed against this wall so it can fold up during the day and give us more space."
          },
          {
            frameId: 'educational',
            content: "Okay, so here's a little Sims 4 tip - if you use these half walls instead of full walls for the bathroom, it makes the space feel more open while still giving your Sim privacy. The game counts it as a room, but visually it doesn't cut off the space. And remember, tiny homes under 32 tiles get a 50% boost to Sim needs, which is actually super helpful for gameplay. Your Sims will be happier in a well-designed tiny home than in a mansion!"
          },
          {
            frameId: 'humor',
            content: "I'm putting the fridge right next to the bed because nothing says 'sweet dreams' like the sound of your refrigerator running all night! I'm kidding, we're not doing that. Even I have standards... barely. Although, midnight snacks would be super convenient. No, Kayla, focus! We're trying to make this functional, not cursed!"
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['question-rehook', 'midway-shock'],
        examples: [
          {
            frameId: 'question-rehook',
            content: "Wait, do you think we should go with the eco-friendly appliances or the more compact ones? The eco ones will fit the Evergreen Harbor vibe, but they take up more counter space... What would you do? I'm kind of leaning toward the compact ones even though they're not as cute. This is the kind of decision that keeps me up at night, folks. The struggles of a Sims builder!"
          },
          {
            frameId: 'midway-shock',
            content: "OH NO! I just deleted the entire bathroom! Why does this always happen to me?! It's fine, it's fine, we can fix this. This is why we have ctrl+z, folks. Crisis averted. Although, maybe the build would be better without a bathroom... No, that's definitely cursed building. We need the bathroom."
          }
        ]
      },
      {
        unitType: 'Reveal',
        frameIds: ['big-reveal', 'reaction'],
        examples: [
          {
            frameId: 'big-reveal', 
            content: "And here it is! Our completed tiny house! We managed to fit everything in just 31 tiles, so we get all those tiny home benefits. We have our Murphy bed that folds up into the wall, a compact kitchen with all the essentials, a cute little bathroom with a shower-tub combo, and even a small living area with a bookshelf and TV. And look at this adorable garden outside! I used the eco footprint-friendly plants so our Sim can help keep Evergreen Harbor green while having fresh produce."
          },
          {
            frameId: 'reaction',
            content: "I think this might be my favorite tiny house I've ever built! It's actually functional, it's super cute, and I didn't have to sacrifice anything important. I'm literally so excited to play with this in my next Let's Play. I think my Rags to Riches Sim would love living here! I'm not even being dramatic right now, I'm genuinely so happy with how this turned out!"
          }
        ]
      },
      {
        unitType: 'Engagement Trigger',
        frameIds: ['audience-question', 'call-to-action'],
        examples: [
          {
            frameId: 'audience-question',
            content: "What do you think of our tiny house? Would you change anything about it? I'm thinking maybe the color scheme could use some work, but I'm kind of obsessed with the layout. Let me know your thoughts in the comments! Also, do you prefer playing in tiny homes or big mansions in The Sims? I go back and forth, but tiny homes are winning me over lately."
          },
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this build, please hit that like button! It really helps the channel. And if you want to see me actually play in this tiny house, make sure you're subscribed and have notifications turned on so you don't miss the Let's Play. Also, I stream on Twitch four times a week if you want to see more chaotic building in real-time!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['subscribe-reminder', 'thank-you'],
        examples: [
          {
            frameId: 'subscribe-reminder',
            content: "If you enjoyed this build, make sure to subscribe for new Sims 4 content every week!"
          },
          {
            frameId: 'thank-you',
            content: "Thanks for watching, and I'll see you in the next one! Bye!"
          }
        ]
      }
    ]
  },
  {
    id: 'iam-ilb',
    name: 'IaM ILb Style',
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
    name: 'Danny Maude Style',
    creator: 'Danny Maude',
    category: 'Sports',
    contentTypes: ['long'],
    description: 'Golf instruction with simple, effective techniques',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Proof', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['problem-statement', 'promise-of-solution'],
        examples: [
          {
            frameId: 'problem-statement',
            content: "If you're struggling with a slice that sends your ball sailing into the trees on the right, you're not alone. This is the number one problem I see with amateur golfers, and it can be incredibly frustrating. But what if I told you there's a simple technique that could fix your slice forever?"
          },
          {
            frameId: 'promise-of-solution',
            content: "In today's video, I'm going to share a breakthrough approach that has helped thousands of my students eliminate their slice and start hitting beautiful draws like this one. And the best part? It doesn't require changing your entire swing or hours of practice. Stay with me, because this could be the most important golf tip you ever receive."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['credibility-establishment', 'relatable-problem'],
        examples: [
          {
            frameId: 'credibility-establishment',
            content: "I've been teaching golf for over 20 years, and in that time, I've helped players of all levels fix their slice. What I've discovered is that most instructors make this far too complicated. They focus on positions and angles that are difficult to replicate. But I've developed a simple, feel-based approach that works for everyone, regardless of age, flexibility, or athletic ability."
          },
          {
            frameId: 'relatable-problem',
            content: "Here's what typically happens. You set up to the ball, feeling confident. You make your backswing, and as you come down, something goes wrong. The clubface stays open, your path moves out-to-in, and suddenly your ball is sailing off to the right, losing distance and accuracy. You've probably been told to strengthen your grip, to 'release' the club more, or to change your swing path. And if you're like most golfers, these tips might work briefly but then the slice returns. It's maddening, isn't it?"
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['conceptual-explanation', 'visual-demonstration', 'comparison'],
        examples: [
          {
            frameId: 'conceptual-explanation',
            content: "To understand why you slice, we need to understand two key factors: clubface and path. A slice happens when your clubface is open relative to your swing path at impact. Most golfers try to fix this by manipulating their hands, but that's actually making things worse. The real solution isn't in your hands - it's in how you use your body. When your body moves correctly, the club naturally falls into the right position. It's about working with physics, not against it."
          },
          {
            frameId: 'visual-demonstration',
            content: "Here's the technique. Instead of focusing on your hands, I want you to feel like your trail shoulder is moving down and through toward the target as you start your downswing. Like this. Notice how when I do this, my arms naturally drop into the right slot, the clubface squares up, and my path naturally shifts more in-to-out. I'm not manipulating anything with my hands - it's all coming from this shoulder movement."
          },
          {
            frameId: 'comparison',
            content: "Let's compare. On the left is the typical slice motion, where the upper body stalls and the arms throw out away from the body. See how that opens the clubface and creates that out-to-in path? Now look at our new technique on the right. The shoulder moves down and through, the arms stay connected to the body, and everything syncs up perfectly at impact. It's a completely different result from one simple change in feel."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['step-by-step-instruction', 'drill-introduction', 'common-mistake-warning'],
        examples: [
          {
            frameId: 'step-by-step-instruction',
            content: "Let's break this down into a simple drill you can practice anywhere. Start without a club, and place your trail hand on your lead shoulder. Now, make a backswing, and as you start down, feel your trail shoulder moving down and toward the target. Once you've got that feeling, grab a club and make some slow-motion swings, focusing only on that shoulder movement. Don't worry about hitting the ball yet - just groove this new movement pattern."
          },
          {
            frameId: 'drill-introduction',
            content: "Here's a fantastic drill to reinforce this movement. Take an alignment stick and place it along your trail shoulder, tucking it under your arm. Now, make swings focusing on pointing that stick toward the target as you come through impact. If you're doing it correctly, the stick will point at the target after impact. If you're reverting to your slice pattern, the stick will point well right of target. This immediate feedback is invaluable."
          },
          {
            frameId: 'common-mistake-warning',
            content: "Now, there are two common mistakes I see when people try this technique. First, they confuse moving the shoulder down and through with simply dipping the shoulder down. That actually makes things worse. The second mistake is trying to force the new movement while still consciously manipulating the hands. You need to trust that the correct hand action will happen naturally when your body moves correctly. Let go of those hand-focused swing thoughts."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['student-success', 'results-validation'],
        examples: [
          {
            frameId: 'student-success', 
            content: "Here's John, who came to me with a severe slice. He'd been struggling with it for years despite taking numerous lessons. After just 30 minutes of working on this shoulder movement, look at the difference. He's not thinking about his hands or the clubface - he's simply focused on that shoulder movement, and everything else falls into place."
          },
          {
            frameId: 'results-validation',
            content: "And John isn't an isolated case. In my Academy, we've helped hundreds of golfers fix their slice using this exact technique. Here are the TrackMan numbers showing the average improvements: 15 yards more distance, 58% reduction in side spin, and 72% more fairways hit. The data doesn't lie - this approach works."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['big-picture-perspective', 'key-takeaway'],
        examples: [
          {
            frameId: 'big-picture-perspective',
            content: "What I love about this approach is that it's not just a band-aid fix - it addresses the root cause of your slice. And because it's based on a natural movement pattern, it's much easier to maintain than trying to consciously control your hands through impact. This is how the best players in the world swing - they use their body to deliver the club, not their hands."
          },
          {
            frameId: 'key-takeaway',
            content: "Remember, golf doesn't have to be complicated. Often the simplest solutions are the most effective. Focus on this shoulder movement, trust the process, and I promise you'll see a dramatic improvement in your ball flight. And the best part? This same movement pattern will help with all your clubs, not just the driver."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['follow-up-invitation', 'call-to-action'],
        examples: [
          {
            frameId: 'follow-up-invitation',
            content: "If you have any questions about this technique, leave them in the comments below. I read every comment and do my best to help you further. You can also visit my website for more in-depth tutorials and lesson opportunities."
          },
          {
            frameId: 'call-to-action',
            content: "If you found this helpful, please give the video a thumbs up and subscribe to my channel for more simple, effective golf tips. And if you know someone who struggles with a slice, share this video with them - you might just save them years of frustration. Happy golfing, and I'll see you in the next video!"
          }
        ]
      }
    ]
  },

  // FINANCE CATEGORY
  {
    id: 'humphrey-yang',
    name: 'Humphrey Yang Style',
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
    name: 'Graham Stephan Style',
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
    name: 'Alex Becker Style',
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
    name: 'Iman Gadzhi Style',
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
    name: 'Ryan Trahan Style',
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

  // LIFESTYLE CATEGORY
  {
    id: 'charli-damelio',
    name: 'Charli D\'Amelio Style',
    creator: 'Charli D\'Amelio',
    category: 'Lifestyle',
    contentTypes: ['short'],
    description: 'TikTok-style quick entertainment with trendy music and transitions',
    units: ['Hook', 'Intro', 'Performance', 'Call To Action'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-demo', 'pattern-interrupt'],
        examples: [
          {
            frameId: 'visual-demo',
            content: "Here's a dance move you've never seen before! #trending"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'topic-overview'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "Today I'm showing you how to do the viral hand dance everyone's talking about."
          }
        ]
      },
      {
        unitType: 'Performance',
        frameIds: ['step-by-step', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First position: hands here. Second: cross over. Third: double tap and flip!"
          }
        ]
      },
      {
        unitType: 'Call To Action',
        frameIds: ['audience-question', 'subscribe-cta'],
        examples: [
          {
            frameId: 'audience-question',
            content: "Tag me if you try this! What song should I dance to next?"
          }
        ]
      }
    ]
  },

  // BUSINESS CATEGORY
  {
    id: 'alex-hormozi',
    name: 'Alex Hormozi Style',
    creator: 'Alex Hormozi',
    category: 'Business',
    contentTypes: ['long', 'short'],
    description: 'Direct, actionable business advice with contrarian principles',
    units: ['Hook', 'Intro', 'Content Delivery', 'Proof', 'Action Plan', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['bold-statement', 'urgency-creator'],
        examples: [
          {
            frameId: 'bold-statement',
            content: "The one mistake costing you 90% of your potential profit - and why almost every entrepreneur makes it."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['establish-credibility', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'establish-credibility',
            content: "I've built and sold multiple 8-figure businesses using this exact framework that no one talks about."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['conceptual-framework', 'myth-buster'],
        examples: [
          {
            frameId: 'conceptual-framework',
            content: "There are four levers that control all business growth: more leads, higher conversion, greater AOV, and increased frequency."
          }
        ]
      },
      {
        unitType: 'Proof',
        frameIds: ['case-study', 'data-story'],
        examples: [
          {
            frameId: 'case-study', 
            content: "When we applied this to a failing gym, their revenue went from $40k to $175k per month in just 90 days."
          }
        ]
      },
      {
        unitType: 'Action Plan',
        frameIds: ['step-by-step', 'risk-management'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, restructure your offer using the value equation: dream outcome divided by perceived likelihood of achievement times perceived time delay and effort and sacrifice."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['philosophical-principle', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'philosophical-principle',
            content: "The irony is that giving too many options actually decreases sales - constraint creates clarity."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'next-steps'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "Implement just one of these principles this week, and let me know what results you get."
          }
        ]
      }
    ]
  },

  // LIFESTYLE/VLOG CATEGORY
  {
    id: 'casey-neistat',
    name: 'Casey Neistat Style',
    creator: 'Casey Neistat',
    category: 'Lifestyle',
    contentTypes: ['long'],
    description: 'High-energy storytelling with cinematic visuals',
    units: ['Hook', 'Intro', 'Story Setup', 'Journey', 'Reflection', 'Life Lesson', 'Outro']
  },

  // ENTERTAINMENT CATEGORY
  {
    id: 'dude-perfect',
    name: 'Dude Perfect Style',
    creator: 'Dude Perfect',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'High-energy stunts and challenges with friendly competition',
    units: ['Hook', 'Challenge Setup', 'Attempts', 'Celebration', 'Behind the Scenes', 'Bloopers', 'Outro']
  },

  // LIFESTYLE CATEGORY
  {
    id: 'emma-chamberlain',
    name: 'Emma Chamberlain Style',
    creator: 'Emma Chamberlain',
    category: 'Lifestyle',
    contentTypes: ['long'],
    description: 'Authentic, relatable lifestyle content with comedic editing',
    units: ['Hook', 'Intro', 'Daily Life', 'Random Thoughts', 'Story Time', 'Reflection', 'Outro']
  },

  // BUSINESS/MOTIVATION CATEGORY
  {
    id: 'garyv',
    name: 'GaryV Style',
    creator: 'Gary Vaynerchuk',
    category: 'Business',
    contentTypes: ['short', 'long'],
    description: 'High-energy motivational business advice',
    units: ['Hook', 'Core Message', 'Real Talk', 'Practical Advice', 'Call To Action', 'Motivation', 'Outro']
  },

  // TECHNOLOGY CATEGORY
  {
    id: 'mkbhd',
    name: 'Marques Brownlee Style',
    creator: 'MKBHD',
    category: 'Technology',
    contentTypes: ['long'],
    description: 'In-depth tech reviews with cinematic quality',
    units: ['Hook', 'Intro', 'Product Overview', 'Deep Dive', 'Comparison', 'Final Thoughts', 'Outro']
  },

  // LIFESTYLE/DOCUMENTARY CATEGORY
  {
    id: 'nas-daily',
    name: 'Nas Daily Style',
    creator: 'Nas Daily',
    category: 'Lifestyle',
    contentTypes: ['short'],
    description: 'Quick, informative stories about people and places',
    units: ['Hook', 'Problem', 'Investigation', 'Discovery', 'Learning', 'Impact', 'Outro']
  },

  // BEAUTY/LIFESTYLE CATEGORY
  {
    id: 'nikkietutorials',
    name: 'NikkieTutorials Style',
    creator: 'Nikkie de Jager',
    category: 'Lifestyle',
    contentTypes: ['long'],
    description: 'Makeup transformations and beauty content',
    units: ['Hook', 'Intro', 'Tutorial Steps', 'Tips & Tricks', 'Transformation', 'Final Look', 'Outro']
  },

  // CUSTOM BUILDER
  {
    id: 'custom-builder',
    name: 'Custom Builder Option',
    creator: 'Custom',
    category: 'Custom',
    contentTypes: ['short', 'long'],
    description: 'Build your own custom content structure',
    units: ['Hook', 'Intro', 'Content', 'Call To Action', 'Outro']
  },

  // ENTERTAINMENT CATEGORY continued
  {
    id: 'mrbeast',
    name: 'MrBeast Style',
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