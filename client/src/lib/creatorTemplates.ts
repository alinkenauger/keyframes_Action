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
  'Sports' |
  'Beauty';

// Extended template interface with category
export interface CategoryCreatorTemplate extends CreatorTemplate {
  category: TemplateCategory;
  contentTypes: ('short' | 'long')[];
}

// Creator templates organized by niche/category
export const creatorTemplates: CategoryCreatorTemplate[] = [
  // LIFESTYLE CATEGORY
  {
    id: 'emma-chamberlain',
    name: 'Emma Chamberlain Style',
    creator: 'Emma Chamberlain', 
    category: 'Lifestyle',
    contentTypes: ['long'],
    description: 'Relatable lifestyle content with humor and authenticity',
    units: ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Anecdote', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['intriguing-question', 'bold-statement'],
        examples: [
          {
            frameId: 'intriguing-question',
            content: "Have you ever thought about what our obsession with iced coffee says about us as a generation?"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['topic-introduction', 'quick-introduction'],
        examples: [
          {
            frameId: 'topic-introduction',
            content: "Today I'm taking you with me to try the worst-rated coffee shops in LA, which, honestly, is probably a terrible idea."
          }
        ]
      },
      {
        unitType: 'Content Journey',
        frameIds: ['day-in-life', 'casual-conversation'],
        examples: [
          {
            frameId: 'day-in-life',
            content: "So, first I woke up at literally 6am which was painful, and then I realized I had no clean clothes because I've been putting off laundry for two weeks..."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['unexpected-twist', 'personal-confession'],
        examples: [
          {
            frameId: 'unexpected-twist',
            content: "But wait - it actually gets worse. The barista recognized me and then proceeded to tell me how much she hated making their specialty drink that I just ordered."
          }
        ]
      },
      {
        unitType: 'Anecdote',
        frameIds: ['funny-story', 'embarrassing-moment'],
        examples: [
          {
            frameId: 'funny-story',
            content: "This reminds me of the time I accidentally wore my shirt inside out to a meeting and literally no one told me until I got home and saw myself in the mirror."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['genuine-thoughts', 'lesson-learned'],
        examples: [
          {
            frameId: 'genuine-thoughts',
            content: "I think what I'm really learning here is that sometimes the experiences that seem the worst in the moment make for the best stories later, you know?"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['casual-goodbye', 'next-time'],
        examples: [
          {
            frameId: 'casual-goodbye',
            content: "Anyway, that's all for today. I'm going to go take a nap because this whole adventure has exhausted me. Talk to you guys later!"
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
    description: 'High-energy, story-driven lifestyle vlogs',
    units: ['Hook', 'Intro', 'Story Setup', 'Adventure', 'Challenge', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'bold-statement'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "I rode my boosted board through Times Square at 3AM during a snowstorm, and something unexpected happened."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'daily-begin'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "So the idea was simple: see if I could cross Manhattan faster on my electric skateboard than my buddy could in a taxi during rush hour."
          }
        ]
      },
      {
        unitType: 'Story Setup',
        frameIds: ['set-the-scene', 'establish-problem'],
        examples: [
          {
            frameId: 'set-the-scene',
            content: "It's 8:30 AM in New York City. The streets are packed, taxis everywhere, and we need to get from downtown to midtown for a meeting in 30 minutes."
          }
        ]
      },
      {
        unitType: 'Adventure',
        frameIds: ['action-sequence', 'overcoming-obstacle'],
        examples: [
          {
            frameId: 'action-sequence',
            content: "I'm weaving through traffic, dodging pedestrians, nearly getting doored by a parked car, while my GoPro captures everything from this crazy angle."
          }
        ]
      },
      {
        unitType: 'Challenge',
        frameIds: ['unexpected-obstacle', 'moment-of-truth'],
        examples: [
          {
            frameId: 'unexpected-obstacle',
            content: "Then it started raining. The streets got slick, the board started slipping, and I had to make a split-second decision."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['lesson-learned', 'life-philosophy'],
        examples: [
          {
            frameId: 'lesson-learned',
            content: "Sometimes the biggest risk is not taking one. Life isn't about waiting for perfect conditions - it's about making the most of the conditions you're given."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['visual-closure', 'next-steps'],
        examples: [
          {
            frameId: 'visual-closure',
            content: "So, did I beat the taxi? Well... [reveals result with dramatic time comparison] ... and that's why I'll never take a cab during rush hour again."
          }
        ]
      }
    ]
  },
  
  // SPORTS/ENTERTAINMENT CATEGORY
  {
    id: 'dude_perfect',
    name: 'Dude Perfect Style',
    creator: 'Dude Perfect',
    category: 'Sports',
    contentTypes: ['long'],
    description: 'High-energy sports challenges and trick shots',
    units: ['Hook', 'Intro', 'Challenge Setup', 'Attempts', 'Victory Moment', 'Celebration', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'challenge-preview'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "We're attempting the world's longest basketball shot from the top of a 500-foot dam into a hoop floating on the water below!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['welcome-intro', 'energy-build'],
        examples: [
          {
            frameId: 'welcome-intro',
            content: "What's up guys! Welcome to Dam Shot Battle, where we're taking basketball shots to a whole new LEVEL - literally!"
          }
        ]
      },
      {
        unitType: 'Challenge Setup',
        frameIds: ['rules-explanation', 'stakes-reveal'],
        examples: [
          {
            frameId: 'rules-explanation',
            content: "Each of us gets 10 attempts. Closest to the hoop gets 1 point, making it on the rim is 5 points, and sinking it is a massive 20 points. Loser has to jump in the freezing water while wearing a chicken suit!"
          }
        ]
      },
      {
        unitType: 'Attempts',
        frameIds: ['attempt-sequence', 'close-call'],
        examples: [
          {
            frameId: 'attempt-sequence',
            content: "Cory with the first attempt... not even close! Tyler stepping up, looking confident. That one had good direction but short. Garrett with a massive heave... OH! That hit the backboard!"
          }
        ]
      },
      {
        unitType: 'Victory Moment',
        frameIds: ['winning-shot', 'dramatic-reveal'],
        examples: [
          {
            frameId: 'winning-shot',
            content: "Down to the final shot. Cody needs this to win. Deep breath, wind check, and... OHHHHHH! IT WENT IN! NO WAY! THAT'S ABSOLUTELY INSANE! [slow-motion replay from multiple angles]"
          }
        ]
      },
      {
        unitType: 'Celebration',
        frameIds: ['team-celebration', 'winner-reaction'],
        examples: [
          {
            frameId: 'team-celebration',
            content: "[Entire team running around, chest bumps, falling on the ground in disbelief] I CAN'T BELIEVE THAT JUST HAPPENED! WE'VE BEEN TRYING TRICK SHOTS FOR 10 YEARS AND THAT MIGHT BE THE MOST INCREDIBLE ONE YET!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['challenge-result', 'whats-next'],
        examples: [
          {
            frameId: 'challenge-result',
            content: "So Cody takes the win, and... [shows Ty in chicken suit jumping into the water with dramatic scream]. Thanks for watching Dam Shot Battle! What impossible shot should we try next? Let us know in the comments!"
          }
        ]
      }
    ]
  },
  
  // BUSINESS/MOTIVATION CATEGORY
  {
    id: 'gary_v',
    name: 'Gary Vaynerchuk Style',
    creator: 'Gary Vaynerchuk',
    category: 'Business',
    contentTypes: ['short', 'long'],
    description: 'High-energy, direct business and motivational advice',
    units: ['Hook', 'Real Talk', 'Core Message', 'Practical Advice', 'Motivation', 'Call To Action', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['attention-grabber', 'provocative-question'],
        examples: [
          {
            frameId: 'attention-grabber',
            content: "The reason you're not successful yet is because you're more worried about looking like you're winning than actually putting in the work to win!"
          }
        ]
      },
      {
        unitType: 'Real Talk',
        frameIds: ['truth-bomb', 'market-reality'],
        examples: [
          {
            frameId: 'truth-bomb',
            content: "Listen, I get so many DMs from 22-year-olds upset they're not millionaires yet. But you know what? You haven't done sh*t! You've been an adult for like 15 minutes!"
          }
        ]
      },
      {
        unitType: 'Core Message',
        frameIds: ['central-idea', 'contrarian-view'],
        examples: [
          {
            frameId: 'central-idea',
            content: "Patience and hustle - that's the formula. You need to work your face off for the next decade while everyone else is complaining. That's how you win in the long game."
          }
        ]
      },
      {
        unitType: 'Practical Advice',
        frameIds: ['actionable-tactic', 'step-by-step'],
        examples: [
          {
            frameId: 'actionable-tactic',
            content: "Here's what you do: Start documenting your journey on social, build an email list from day one, provide so much value people feel guilty not buying from you, then convert that attention into business."
          }
        ]
      },
      {
        unitType: 'Motivation',
        frameIds: ['inspirational-push', 'personal-story'],
        examples: [
          {
            frameId: 'inspirational-push',
            content: "Listen, I was a D and F student who built a $60 million wine business because I outworked everyone. You think you can't do it? That's BS! Your past doesn't dictate your future!"
          }
        ]
      },
      {
        unitType: 'Call To Action',
        frameIds: ['direct-command', 'challenge'],
        examples: [
          {
            frameId: 'direct-command',
            content: "Stop watching motivational videos all day and go DO SOMETHING! One outreach email, one cold call, one piece of content. Right now, today. No more excuses!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['signature-close', 'gratitude'],
        examples: [
          {
            frameId: 'signature-close',
            content: "And hey, if this helped you, smash that like button, share it with somebody who needs to hear this, and remember - I genuinely appreciate your attention. Don't take it for granted."
          }
        ]
      }
    ]
  },
  
  // TECH REVIEW CATEGORY
  {
    id: 'marques_brownlee',
    name: 'MKBHD Style',
    creator: 'Marques Brownlee',
    category: 'Technology',
    contentTypes: ['long'],
    description: 'In-depth, cinematic tech product reviews',
    units: ['Hook', 'Intro', 'Product Overview', 'Deep Dive', 'Comparison', 'Final Thoughts', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'key-question'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "This is the new iPhone 15 Pro Max, and after using it for two weeks, I've discovered some things Apple didn't tell you about."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['greeting-intro', 'topic-introduction'],
        examples: [
          {
            frameId: 'greeting-intro',
            content: "What's up guys, MKBHD here. This year's iPhone is all about that new titanium design and the A17 Pro chip, but the real question is - how does it actually perform in day-to-day use?"
          }
        ]
      },
      {
        unitType: 'Product Overview',
        frameIds: ['specs-breakdown', 'design-analysis'],
        examples: [
          {
            frameId: 'design-analysis',
            content: "The new titanium frame is noticeably lighter than last year's stainless steel, but it also picks up fingerprints in a different way. The matte back glass feels familiar, and the new action button replaces the classic mute switch with customizable functions."
          }
        ]
      },
      {
        unitType: 'Deep Dive',
        frameIds: ['feature-highlight', 'hands-on-experience'],
        examples: [
          {
            frameId: 'feature-highlight',
            content: "Let's talk about this new camera system. The 48MP main sensor now captures more detail in optimized lighting, and I've noticed significantly better dynamic range. Here are some side-by-side comparisons so you can see the difference yourself."
          }
        ]
      },
      {
        unitType: 'Comparison',
        frameIds: ['versus-competitors', 'versus-predecessor'],
        examples: [
          {
            frameId: 'versus-competitors',
            content: "Compared to the Pixel 8 Pro, the iPhone's photos have that signature Apple look - slightly warmer tones and more contrast. The Pixel still edges it out in extreme low light, but for most situations, it's really about your personal preference."
          }
        ]
      },
      {
        unitType: 'Final Thoughts',
        frameIds: ['overall-assessment', 'value-analysis'],
        examples: [
          {
            frameId: 'overall-assessment',
            content: "So, is the iPhone 15 Pro Max worth the upgrade? If you're coming from an iPhone 12 or older, absolutely. The camera improvements, better battery life, and overall performance boost are significant. From a 13 or 14? It's a tougher call that depends on how much you value the titanium design and that customizable action button."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['signature-close', 'viewer-question'],
        examples: [
          {
            frameId: 'signature-close',
            content: "So that's been my experience with the iPhone 15 Pro Max. I'm curious - what feature are you most excited about? Let me know in the comments below. This has been MKBHD, and I'll catch you in the next one!"
          }
        ]
      }
    ]
  },
  
  // EDUCATIONAL/DOCUMENTARY CATEGORY
  {
    id: 'nas_daily',
    name: 'Nas Daily Style',
    creator: 'Nas Daily',
    category: 'Education',
    contentTypes: ['short'],
    description: 'Concise, high-energy educational mini-documentaries',
    units: ['Hook', 'Problem', 'Investigation', 'Discovery', 'Learning', 'Impact', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['attention-grabber', 'unusual-fact'],
        examples: [
          {
            frameId: 'attention-grabber',
            content: "This man lives in a Boeing 727 airplane in the middle of the forest. And his story will change how you think about housing forever!"
          }
        ]
      },
      {
        unitType: 'Problem',
        frameIds: ['societal-issue', 'unexpected-challenge'],
        examples: [
          {
            frameId: 'societal-issue',
            content: "In the United States, housing prices have increased 70% in just ten years, making traditional homes unaffordable for millions. But some people are finding INCREDIBLE alternatives!"
          }
        ]
      },
      {
        unitType: 'Investigation',
        frameIds: ['meet-the-subject', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'meet-the-subject',
            content: "Meet Bruce. 15 years ago, he bought a retired commercial airplane for $220,000 - less than the price of a small apartment. Then he spent 6 months and $40,000 transforming it into a home with running water, electricity, and even internet!"
          }
        ]
      },
      {
        unitType: 'Discovery',
        frameIds: ['surprising-insight', 'insider-perspective'],
        examples: [
          {
            frameId: 'surprising-insight',
            content: "His airplane home isn't just cheaper - it's actually MORE sustainable! The aluminum body will last for centuries without rotting, it's earthquake-proof, and the entire structure was saved from being scrapped and wasted!"
          }
        ]
      },
      {
        unitType: 'Learning',
        frameIds: ['data-reveal', 'unexpected-connection'],
        examples: [
          {
            frameId: 'data-reveal',
            content: "And Bruce isn't alone. Around the world, there are over 1,000 people living in converted vehicles - from airplanes to buses to shipping containers. What looks like desperation is actually INNOVATION!"
          }
        ]
      },
      {
        unitType: 'Impact',
        frameIds: ['societal-takeaway', 'call-to-action'],
        examples: [
          {
            frameId: 'societal-takeaway',
            content: "This story matters because it shows how thinking differently can solve seemingly impossible problems. Housing doesn't have to look like it has for the past 100 years. The future might be in repurposing what we already have!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['signature-close', 'viewer-question'],
        examples: [
          {
            frameId: 'signature-close',
            content: "Would YOU live in an airplane? I think I would! That's one minute, see you tomorrow!"
          }
        ]
      }
    ]
  },
  
  // BEAUTY/LIFESTYLE CATEGORY
  {
    id: 'nikkietutorials',
    name: 'NikkieTutorials Style',
    creator: 'Nikkie de Jager',
    category: 'Beauty',
    contentTypes: ['long'],
    description: 'Transformative makeup tutorials with personality',
    units: ['Hook', 'Intro', 'Tutorial Steps', 'Tips & Tricks', 'Transformation', 'Final Look', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['attention-grabber', 'before-after-preview'],
        examples: [
          {
            frameId: 'attention-grabber',
            content: "I challenged myself to create a full glam look using ONLY drugstore products under $10, and honey, the results shocked even ME!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['greeting-intro', 'video-context'],
        examples: [
          {
            frameId: 'greeting-intro',
            content: "Hey guys! It's me, Nikkie, and welcome back to my channel! Today we're doing something really exciting - we're testing the viral TikTok beauty hacks that supposedly give you airbrushed skin without filters. Let's see if they actually work!"
          }
        ]
      },
      {
        unitType: 'Tutorial Steps',
        frameIds: ['step-by-step', 'product-introduction'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, we're going to prime with this hyped-up primer that everyone's been losing their minds over. Now watch closely - instead of rubbing it in, you need to press it into the skin like THIS. See how it creates this subtle tacky base? That's what we want!"
          }
        ]
      },
      {
        unitType: 'Tips & Tricks',
        frameIds: ['pro-secret', 'common-mistake'],
        examples: [
          {
            frameId: 'pro-secret',
            content: "Here's a little trick I've learned over 15 years of doing makeup: When you're blending eyeshadow in the crease, keep your eye OPEN to see exactly where the color will appear. Most people close their eye and then wonder why their blend disappeared!"
          }
        ]
      },
      {
        unitType: 'Transformation',
        frameIds: ['dramatic-change', 'reaction'],
        examples: [
          {
            frameId: 'dramatic-change',
            content: "Alright, it's time for lashes, and BOOM! Do you see that difference? It's like we just added an instant face lift! This is why I always say lashes are worth the extra two minutes, they completely transform the look."
          }
        ]
      },
      {
        unitType: 'Final Look',
        frameIds: ['showcase', 'review'],
        examples: [
          {
            frameId: 'showcase',
            content: "And here is the finished look! Let me zoom you in so you can see all the details. That highlight is poppin', the blend is seamless, and remember - all of this with products that cost less than a lunch. I am genuinely GAGGED at how gorgeous this turned out!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['signature-close', 'next-video'],
        examples: [
          {
            frameId: 'signature-close',
            content: "If you enjoyed this video, don't forget to subscribe to my channel and turn on notifications so you never miss an upload! Let me know in the comments what other challenges or tutorials you'd like to see next. Thank you so much for watching, and I'll see you in the next one!"
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
    description: 'High-energy cooking with humor and detailed technique',
    units: ['Hook', 'Intro', 'Content Delivery', 'Escalation', 'Reveal', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'challenge-setup'],
        examples: [
          {
            frameId: 'visual-hook',
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
        frameIds: ['step-by-step-demo', 'educational', 'behind-the-scenes'],
        examples: [
          {
            frameId: 'step-by-step-demo',
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
            content: "What makes this burger superior comes down to three things: quality ingredients, proper technique, and attention to detail. We didn't take shortcuts. We respected each component. And the result speaks for itself. This costs $4.99 and leaves you feeling empty inside. This costs about $3.50 per burger to make and will change your life."
          },
          {
            frameId: 'one-liner-wisdom',
            content: "Remember, people - cooking is about transformation. Taking something ordinary and making it extraordinary. That's the power you have in your kitchen every single day."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'whats-next'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this culinary glow-up, smash that subscribe button like I smashed that burger patty. Hit the notification bell so you never miss a video. And let me know in the comments what fast food item you want me to make 'But Better' next."
          },
          {
            frameId: 'whats-next',
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

  // GAMING CATEGORY
  {
    id: 'iam-ilb',
    name: 'IamILB Style',
    creator: 'IamILB',
    category: 'Gaming',
    contentTypes: ['short'],
    description: 'Roblox tips and strategies with high energy',
    units: ['Hook', 'Intro', 'Tutorial', 'Rehook', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['attention-grabber', 'secret-reveal'],
        examples: [
          {
            frameId: 'attention-grabber',
            content: "I found a BROKEN XP glitch in Blade Ball that will make you level up 50 times faster than normal!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['quick-introduction', 'credibility-builder'],
        examples: [
          {
            frameId: 'quick-introduction',
            content: "What's up guys, it's ILB and today I'm showing you the most OP leveling method that the pros don't want you to know about!"
          }
        ]
      },
      {
        unitType: 'Tutorial',
        frameIds: ['step-by-step', 'strategy-overview'],
        examples: [
          {
            frameId: 'step-by-step',
            content: "First, you need to join a private server with at least one friend. Then both of you need to equip the Dark Matter ability - trust me, this is key!"
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['hidden-tip', 'midway-shock'],
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
  
  // CUSTOM BUILDER
  {
    id: 'custom-builder',
    name: 'Custom Builder Option',
    creator: 'Custom',
    category: 'Sports',
    contentTypes: ['short', 'long'],
    description: 'Build your own custom content structure',
    units: ['Hook', 'Intro', 'Content', 'Call To Action', 'Outro']
  },
  
  // ENTERTAINMENT CATEGORY
  {
    id: 'mrbeast',
    name: 'MrBeast Style',
    creator: 'MrBeast',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'High-stakes challenges with prize money and philanthropy',
    units: ['Hook', 'Challenge Setup', 'Stakes Escalation', 'Contestant Struggles', 'Turning Point', 'Emotional Reveal', 'Outro']
  }
];

// Export for use in CreateSkeletonDialog component
export const CREATOR_TEMPLATES_BY_CATEGORY = creatorTemplates;

// Export filtered lists for UI
export const filterTemplatesByContentType = (contentType: 'short' | 'long') => {
  return creatorTemplates.filter(template => 
    template.contentTypes.includes(contentType)
  );
};

export const getTemplateById = (id: string) => {
  return creatorTemplates.find(template => template.id === id);
};

export const getTemplateCategories = () => {
  const categories = new Set<TemplateCategory>();
  creatorTemplates.forEach(template => {
    if (template.id !== 'custom-builder') {
      categories.add(template.category);
    }
  });
  return Array.from(categories).sort();
};

export const filterTemplatesByCategory = (category: TemplateCategory | 'All Categories') => {
  if (category === 'All Categories') {
    return creatorTemplates;
  }
  return creatorTemplates.filter(template => template.category === category);
};