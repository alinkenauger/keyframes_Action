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
  'Beauty' |
  'Sports' |
  'Filmmaking' |
  'Photography' |
  'DIY' |
  'Automotive' |
  'Gardening' |
  'Mental Health' |
  'Animation';

// Extended template interface with category
export interface CategoryCreatorTemplate extends CreatorTemplate {
  category: TemplateCategory;
  contentTypes: ('short' | 'long')[];
}

// Creator templates organized by niche/category
export const creatorTemplates: CategoryCreatorTemplate[] = [
  // LIFESTYLE/VLOGGING/FILMMAKING CATEGORY
  {
    id: 'casey-neistat',
    name: 'Casey Neistat Style',
    creator: 'Casey Neistat',
    category: 'Filmmaking',
    contentTypes: ['long'],
    description: 'High-energy, story-driven vlogs with cinematic quality',
    units: ['Hook', 'Story Setup', 'Content Journey', 'Climax', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'voiceover-intro'],
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
          },
          {
            frameId: 'goal-statement',
            content: "The mission: visit five neighborhoods in one day, talk to local artists, and find something that sparks a new idea."
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
          },
          {
            frameId: 'relatable-moment',
            content: "Sometimes the best moments happen when plans fall apart. This coffee shop wasn't on my list, but look what I found..."
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['triumph-over-adversity', 'action-sequence'],
        examples: [
          {
            frameId: 'triumph-over-adversity',
            content: "Five neighborhoods. Seven artists. Countless moments of inspiration. Despite the rain, the delays, and the chaos - or maybe because of them - today was exactly what I needed."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['one-liner-wisdom', 'life-philosophy'],
        examples: [
          {
            frameId: 'one-liner-wisdom',
            content: "Creativity isn't found in perfect conditions. It's found in the messy, unpredictable moments when you're open to seeing the world differently."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'signature-close'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "Where do you find inspiration when you're stuck? Let me know in the comments. See you tomorrow."
          }
        ]
      }
    ]
  },
  
  // LIFESTYLE/COMEDY CATEGORY
  {
    id: 'emma-chamberlain',
    name: 'Emma Chamberlain Style',
    creator: 'Emma Chamberlain', 
    category: 'Lifestyle',
    contentTypes: ['long'],
    description: 'Relatable lifestyle content with humor and authenticity',
    units: ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Outro'],
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
            content: "So, first I woke up at literally 6am which was painful, and then I realized I had no clean clothes because I've been putting off laundry for two weeks..."
          },
          {
            frameId: 'unfiltered-confession',
            content: "And then I ate three pieces of toast with way too much butter because I was stressed about having nothing to wear, and I simultaneously felt guilty but also like it was the best decision I've ever made."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['humor-rehook', 'unexpected-twist'],
        examples: [
          {
            frameId: 'humor-rehook',
            content: "But wait - it actually gets worse. The barista recognized me and then proceeded to tell me how much she hated making their specialty drink that I just ordered."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['comedic-punchline', 'casual-goodbye'],
        examples: [
          {
            frameId: 'comedic-punchline',
            content: "So basically what I'm saying is, never try to be productive because the universe will literally do everything in its power to make sure you accomplish absolutely nothing. If I had just stayed in bed, at least I would have been comfortable while failing."
          },
          {
            frameId: 'casual-goodbye',
            content: "Anyway, that's all for today. I'm going to go take a nap because this whole adventure has exhausted me. Talk to you guys later!"
          }
        ]
      }
    ]
  },
  
  // SPORTS/ENTERTAINMENT CATEGORY
  {
    id: 'dude-perfect',
    name: 'Dude Perfect Style',
    creator: 'Dude Perfect',
    category: 'Sports',
    contentTypes: ['long'],
    description: 'High-energy sports challenges and trick shots',
    units: ['Hook', 'Challenge Setup', 'Content Journey', 'Climax', 'Outro'],
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
        unitType: 'Content Journey',
        frameIds: ['attempt-sequence', 'stakes-amplifier'],
        examples: [
          {
            frameId: 'attempt-sequence',
            content: "Cory with the first attempt... not even close! Tyler stepping up, looking confident. That one had good direction but short. Garrett with a massive heave... OH! That hit the backboard!"
          },
          {
            frameId: 'stakes-amplifier',
            content: "We're halfway through our attempts, and nobody has even hit the rim yet. This is proving way harder than we expected. The wind up here is making it nearly impossible to judge the distance."
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['winning-shot', 'triumph-over-adversity'],
        examples: [
          {
            frameId: 'winning-shot',
            content: "Down to the final shot. Cody needs this to win. Deep breath, wind check, and... OHHHHHH! IT WENT IN! NO WAY! THAT'S ABSOLUTELY INSANE! [slow-motion replay from multiple angles]"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['challenge-result', 'lighthearted-humor'],
        examples: [
          {
            frameId: 'challenge-result',
            content: "So Cody takes the win, and... [shows Ty in chicken suit jumping into the water with dramatic scream]. Thanks for watching Dam Shot Battle! What impossible shot should we try next? Let us know in the comments!"
          }
        ]
      }
    ]
  },
  
  // TECH REVIEW CATEGORY
  {
    id: 'mkbhd',
    name: 'MKBHD Style',
    creator: 'Marques Brownlee',
    category: 'Technology',
    contentTypes: ['long'],
    description: 'In-depth, cinematic tech product reviews',
    units: ['Hook', 'Intro', 'Product Overview', 'Deep Dive', 'Comparison', 'Final Thoughts', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['promise-of-value', 'visual-hook'],
        examples: [
          {
            frameId: 'promise-of-value',
            content: "This is the new iPhone 15 Pro Max, and after using it for two weeks, I've discovered some things Apple didn't tell you about."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['brief-product-overview', 'stat-drop'],
        examples: [
          {
            frameId: 'brief-product-overview',
            content: "What's up guys, MKBHD here. This year's iPhone is all about that new titanium design and the A17 Pro chip, but the real question is - how does it actually perform in day-to-day use?"
          }
        ]
      },
      {
        unitType: 'Product Overview',
        frameIds: ['teach-a-concept', 'design-analysis'],
        examples: [
          {
            frameId: 'design-analysis',
            content: "The new titanium frame is noticeably lighter than last year's stainless steel, but it also picks up fingerprints in a different way. The matte back glass feels familiar, and the new action button replaces the classic mute switch with customizable functions."
          }
        ]
      },
      {
        unitType: 'Deep Dive',
        frameIds: ['hands-on-demonstration', 'feature-highlight'],
        examples: [
          {
            frameId: 'hands-on-demonstration',
            content: "Let's talk about this new camera system. The 48MP main sensor now captures more detail in optimized lighting, and I've noticed significantly better dynamic range. Here are some side-by-side comparisons so you can see the difference yourself."
          }
        ]
      },
      {
        unitType: 'Comparison',
        frameIds: ['big-reveal', 'versus-competitors'],
        examples: [
          {
            frameId: 'big-reveal',
            content: "After running my standard battery tests, I'm seeing about a 12% improvement over last year's model. That translates to roughly 1.5 hours of additional screen time in real-world usage."
          },
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
        frameIds: ['summary', 'call-to-action'],
        examples: [
          {
            frameId: 'summary',
            content: "So that's been my experience with the iPhone 15 Pro Max. I'm curious - what feature are you most excited about? Let me know in the comments below. This has been MKBHD, and I'll catch you in the next one!"
          }
        ]
      }
    ]
  },
  
  // EDUCATIONAL/DOCUMENTARY CATEGORY
  {
    id: 'nas-daily',
    name: 'Nas Daily Style',
    creator: 'Nas Daily',
    category: 'Education',
    contentTypes: ['short'],
    description: 'Concise, high-energy educational mini-documentaries',
    units: ['Hook', 'Story Setup', 'Content Delivery', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['intriguing-question', 'attention-grabber'],
        examples: [
          {
            frameId: 'intriguing-question',
            content: "What if I told you there's a man who lives in a Boeing 727 airplane in the middle of the forest? And his story will change how you think about housing forever!"
          }
        ]
      },
      {
        unitType: 'Story Setup',
        frameIds: ['brief-teaser-intro', 'societal-issue'],
        examples: [
          {
            frameId: 'brief-teaser-intro',
            content: "In the United States, housing prices have increased 70% in just ten years, making traditional homes unaffordable for millions. But some people are finding INCREDIBLE alternatives!"
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['teach-a-concept', 'data-story'],
        examples: [
          {
            frameId: 'teach-a-concept',
            content: "Meet Bruce. 15 years ago, he bought a retired commercial airplane for $220,000 - less than the price of a small apartment. Then he spent 6 months and $40,000 transforming it into a home with running water, electricity, and even internet!"
          },
          {
            frameId: 'data-story',
            content: "His airplane home isn't just cheaper - it's actually MORE sustainable! The aluminum body will last for centuries without rotting, it's earthquake-proof, and the entire structure was saved from being scrapped and wasted!"
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['big-reveal', 'surprising-insight'],
        examples: [
          {
            frameId: 'big-reveal',
            content: "And Bruce isn't alone. Around the world, there are over 1,000 people living in converted vehicles - from airplanes to buses to shipping containers. What looks like desperation is actually INNOVATION!"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'signature-close'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "This story matters because it shows how thinking differently can solve seemingly impossible problems. Housing doesn't have to look like it has for the past 100 years. The future might be in repurposing what we already have!"
          },
          {
            frameId: 'signature-close',
            content: "Would YOU live in an airplane? I think I would! That's one minute, see you tomorrow!"
          }
        ]
      }
    ]
  },
  
  // BEAUTY/MAKEUP CATEGORY
  {
    id: 'nikkietutorials',
    name: 'NikkieTutorials Style',
    creator: 'Nikkie de Jager',
    category: 'Beauty',
    contentTypes: ['long'],
    description: 'Transformative makeup tutorials with personality',
    units: ['Hook', 'Intro', 'Tutorial Steps', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['promise-of-value', 'before-after-preview'],
        examples: [
          {
            frameId: 'promise-of-value',
            content: "I challenged myself to create a full glam look using ONLY drugstore products under $10, and honey, the results shocked even ME!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['brief-product-overview', 'greeting-intro'],
        examples: [
          {
            frameId: 'greeting-intro',
            content: "Hey guys! It's me, Nikkie, and welcome back to my channel! Today we're doing something really exciting - we're testing the viral TikTok beauty hacks that supposedly give you airbrushed skin without filters. Let's see if they actually work!"
          }
        ]
      },
      {
        unitType: 'Tutorial Steps',
        frameIds: ['step-by-step-demo', 'product-introduction'],
        examples: [
          {
            frameId: 'step-by-step-demo',
            content: "First, we're going to prime with this hyped-up primer that everyone's been losing their minds over. Now watch closely - instead of rubbing it in, you need to press it into the skin like THIS. See how it creates this subtle tacky base? That's what we want!"
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['question-rehook', 'first-impression'],
        examples: [
          {
            frameId: 'question-rehook',
            content: "Wait, can we just talk about how this foundation is literally $8 but looks like it could be high-end? I'm genuinely shocked at the coverage and finish. Let me zoom you in so you can see how it's sitting on my skin..."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['engagement-encouragement', 'call-to-action'],
        examples: [
          {
            frameId: 'engagement-encouragement',
            content: "If you enjoyed this video, don't forget to subscribe to my channel and turn on notifications so you never miss an upload! Let me know in the comments what other challenges or tutorials you'd like to see next. Thank you so much for watching, and I'll see you in the next one!"
          }
        ]
      }
    ]
  },
  
  // BUSINESS/MARKETING CATEGORY
  {
    id: 'garyv',
    name: 'Gary Vaynerchuk Style',
    creator: 'Gary Vaynerchuk',
    category: 'Business',
    contentTypes: ['short', 'long'],
    description: 'High-energy, direct business and motivational advice',
    units: ['Hook', 'Problem Setup', 'Content Delivery', 'Rehook', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['call-out-the-audience', 'attention-grabber'],
        examples: [
          {
            frameId: 'call-out-the-audience',
            content: "The reason you're not successful yet is because you're more worried about looking like you're winning than actually putting in the work to win!"
          }
        ]
      },
      {
        unitType: 'Problem Setup',
        frameIds: ['common-business-challenge', 'relatable-problem'],
        examples: [
          {
            frameId: 'relatable-problem',
            content: "Listen, I get so many DMs from 22-year-olds upset they're not millionaires yet. But you know what? You haven't done sh*t! You've been an adult for like 15 minutes!"
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['teach-a-concept', 'actionable-advice'],
        examples: [
          {
            frameId: 'teach-a-concept',
            content: "Patience and hustle - that's the formula. You need to work your face off for the next decade while everyone else is complaining. That's how you win in the long game."
          },
          {
            frameId: 'actionable-advice',
            content: "Here's what you do: Start documenting your journey on social, build an email list from day one, provide so much value people feel guilty not buying from you, then convert that attention into business."
          }
        ]
      },
      {
        unitType: 'Rehook',
        frameIds: ['question-rehook', 'quick-win'],
        examples: [
          {
            frameId: 'question-rehook',
            content: "You know what's crazy? Almost nobody does this! Most people are so focused on getting rich quick that they sabotage themselves in the long term. Are you thinking long-term or short-term?"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['motivational-close', 'call-to-action'],
        examples: [
          {
            frameId: 'motivational-close',
            content: "Listen, I was a D and F student who built a $60 million wine business because I outworked everyone. You think you can't do it? That's BS! Your past doesn't dictate your future!"
          },
          {
            frameId: 'call-to-action',
            content: "Stop watching motivational videos all day and go DO SOMETHING! One outreach email, one cold call, one piece of content. Right now, today. No more excuses!"
          }
        ]
      }
    ]
  },
  
  // COOKING/FOOD CATEGORY
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
  
  // GAMING/SIMS CATEGORY
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
        frameIds: ['visual-hook', 'challenge-setup'],
        examples: [
          {
            frameId: 'visual-hook',
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
        frameIds: ['step-by-step-demo', 'educational', 'humor'],
        examples: [
          {
            frameId: 'step-by-step-demo',
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
        frameIds: ['ask-a-question', 'call-to-action'],
        examples: [
          {
            frameId: 'ask-a-question',
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
  
  // SPORTS/GOLF CATEGORY
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
        frameIds: ['key-takeaway', 'encouragement'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "Remember, golf doesn't have to be complicated. Often the simplest solutions are the most effective. Focus on this shoulder movement, trust the process, and I promise you'll see a dramatic improvement in your ball flight. And the best part? This same movement pattern will help with all your clubs, not just the driver."
          },
          {
            frameId: 'encouragement',
            content: "What I love about this approach is that it's not just a band-aid fix - it addresses the root cause of your slice. And because it's based on a natural movement pattern, it's much easier to maintain than trying to consciously control your hands through impact. This is how the best players in the world swing - they use their body to deliver the club, not their hands."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'additional-resource'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "If you found this helpful, please give the video a thumbs up and subscribe to my channel for more simple, effective golf tips. And if you know someone who struggles with a slice, share this video with them - you might just save them years of frustration. Happy golfing, and I'll see you in the next video!"
          },
          {
            frameId: 'additional-resource',
            content: "If you have any questions about this technique, leave them in the comments below. I read every comment and do my best to help you further. You can also visit my website for more in-depth tutorials and lesson opportunities."
          }
        ]
      }
    ]
  },
  
  // FINANCE/PERSONAL FINANCE CATEGORY
  {
    id: 'graham-stephan',
    name: 'Graham Stephan Style',
    creator: 'Graham Stephan',
    category: 'Finance',
    contentTypes: ['long'],
    description: 'Practical personal finance with data-driven analysis',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['shocking-statement', 'problem-identification'],
        examples: [
          {
            frameId: 'shocking-statement',
            content: "According to a recent survey, 64% of Americans will retire with less than $10,000 in their savings account. Today I'm going to show you exactly how to avoid being one of them."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['credibility-establishment', 'contrarian-perspective'],
        examples: [
          {
            frameId: 'credibility-establishment',
            content: "When I bought my first investment property at 21, I was working as a real estate agent making only $16,000 a year. But I was saving 90% of my income by keeping my expenses ridiculously low."
          },
          {
            frameId: 'contrarian-perspective',
            content: "Here's the thing - most financial advice focuses on getting you to earn more money. But what they miss is that what you keep is far more important than what you make. Some of the highest-earning professionals I know are still living paycheck to paycheck because they don't understand this principle."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['data-driven-explanation', 'step-by-step-strategy', 'transparency'],
        examples: [
          {
            frameId: 'data-driven-explanation',
            content: "Let's look at what happens when you invest in the S&P 500 during a market crash versus dollar-cost averaging. Over the past 7 recessions, lump sum investors during the bottom outperformed by an average of 23% after just 3 years."
          },
          {
            frameId: 'step-by-step-strategy',
            content: "Here's exactly what I would do with $10,000 today: First, make sure you have 3-6 months of expenses in a high-yield savings account. Then, max out your Roth IRA contribution for the year - that's $6,000. Next, put the remaining amount into a low-cost index fund that tracks the total stock market. Don't try to time the market or pick individual stocks."
          },
          {
            frameId: 'transparency',
            content: "Full disclosure - I personally have about 60% of my net worth in real estate, 30% in index funds, and 10% in individual stocks and speculative investments. But I only started investing in individual companies after I had a solid foundation and understood the risks."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['real-world-example', 'tool-resource-recommendation', 'common-mistake-warning'],
        examples: [
          {
            frameId: 'real-world-example',
            content: "Let me show you exactly how this worked for my client Tom. He purchased a fourplex for $550,000 with an FHA loan at 3.5% down. His mortgage is $2,800, but he collects $3,300 in rent from the other three units, giving him $500 cash flow while living for free."
          },
          {
            frameId: 'tool-resource-recommendation',
            content: "I personally use Fidelity for my index fund investments because they offer zero-fee funds and excellent customer service. But Vanguard and Charles Schwab are also great options with similar low-cost index funds. Just make sure you're paying less than 0.1% in expense ratios."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-principle', 'long-term-impact'],
        examples: [
          {
            frameId: 'key-principle',
            content: "The single most important principle of building wealth is understanding that every dollar you save is a dollar that can work for you through compound interest. It's not about deprivation - it's about being intentional with your spending so your money goes toward what truly matters to you."
          },
          {
            frameId: 'long-term-impact',
            content: "Just think about this: if you invest $500 a month for 30 years with an average 8% return, you'll have over $745,000. But if you wait just 10 years to start, you'll only have about $226,000. That 10-year delay cost you over half a million dollars."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['call-to-action', 'community-building'],
        examples: [
          {
            frameId: 'call-to-action',
            content: "As always, the keys to wealth are pretty simple: spend less than you earn, invest the difference consistently, and be patient. Follow those principles, and financial freedom is just a matter of time. Try implementing just one strategy from this video this week."
          },
          {
            frameId: 'community-building',
            content: "If you found this video helpful, smash that like button and subscribe for new videos every week. And let me know in the comments what other financial topics you'd like me to cover. I read every comment."
          }
        ]
      }
    ]
  },
  
  // PRODUCTIVITY/EDUCATION CATEGORY
  {
    id: 'ali-abdaal',
    name: 'Ali Abdaal Style',
    creator: 'Ali Abdaal',
    category: 'Education',
    contentTypes: ['long'],
    description: 'Evidence-based productivity and learning techniques',
    units: ['Hook', 'Intro', 'Content Delivery', 'Practical Application', 'Case Study', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['problem-statement', 'promise-of-solution'],
        examples: [
          {
            frameId: 'problem-statement',
            content: "Have you ever spent hours studying for an exam only to forget everything when you actually sit down to take it? This frustrating experience happens because most of us are using study methods that science has proven to be ineffective."
          },
          {
            frameId: 'promise-of-solution',
            content: "In this video, I'm going to share the evidence-based study techniques that helped me get through medical school while running a business and YouTube channel. These methods will not only help you remember more but also significantly reduce your study time."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['personal-experience', 'content-overview'],
        examples: [
          {
            frameId: 'personal-experience',
            content: "When I was studying for my medical school finals, I initially made the same mistake most students make - re-reading notes and highlighting text. It felt productive, but my practice exam scores were disappointing. Everything changed when I discovered the research on effective learning."
          },
          {
            frameId: 'content-overview',
            content: "In this video, we'll cover three evidence-based techniques: spaced repetition, active recall, and interleaving. I'll explain the science behind each one, show you my personal implementation, and suggest tools to help you get started right away."
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['research-backed-insight', 'personal-application', 'step-by-step-method'],
        examples: [
          {
            frameId: 'research-backed-insight',
            content: "According to a landmark study published in Psychological Science, students who used active recall - testing themselves on material rather than reviewing it - remembered 50% more information a week later compared to students who used traditional study methods."
          },
          {
            frameId: 'personal-application',
            content: "Here's how I implemented active recall during med school: Instead of reading a textbook chapter from start to finish, I'd first look at the end-of-chapter questions and try to answer them without reviewing the material. Then I'd go back and read only the parts relevant to questions I couldn't answer."
          },
          {
            frameId: 'step-by-step-method',
            content: "The most effective way to implement spaced repetition is using a digital flashcard system like Anki. First, create cards that test your understanding rather than just definitions. Second, trust the algorithm - review cards when the system tells you to, not before. Third, limit new cards to 20-30 per day to maintain consistent reviews."
          }
        ]
      },
      {
        unitType: 'Practical Application',
        frameIds: ['tool-demonstration', 'habit-formation-strategy', 'common-pitfall-warning'],
        examples: [
          {
            frameId: 'tool-demonstration',
            content: "Let me show you how I set up my Notion database for interleaving. I have different subjects in columns, and I alternate between them during each study session. This forces my brain to constantly switch contexts, which research shows strengthens memory pathways and improves retrieval."
          },
          {
            frameId: 'habit-formation-strategy',
            content: "The key to making these techniques stick is integrating them into your existing routine. I attached my Anki review session to my morning coffee ritual. By pairing the new habit with an established one, I was able to maintain a 95% completion rate throughout my final year."
          },
          {
            frameId: 'common-pitfall-warning',
            content: "The biggest mistake people make when trying active recall is making their questions too easy. If you can answer a flashcard without really thinking, it's not effective. Challenge yourself with questions that require application of concepts, not just memorization of facts."
          }
        ]
      },
      {
        unitType: 'Case Study',
        frameIds: ['success-story', 'failure-analysis'],
        examples: [
          {
            frameId: 'success-story',
            content: "One of my YouTube viewers, Sarah, implemented these techniques for her bar exam. After failing the exam twice using traditional study methods, she passed on her third attempt while studying 50% fewer hours. The key difference was using active recall instead of passive review."
          },
          {
            frameId: 'failure-analysis',
            content: "On the flip side, my friend James tried using these methods but gave up after two weeks. When we analyzed what went wrong, we discovered he was creating too many flashcards too quickly. He got overwhelmed by the daily review load and abandoned the system entirely."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-principles', 'implementation-timeline'],
        examples: [
          {
            frameId: 'key-principles',
            content: "If there's one thing you take away from this video, it should be this: effective learning is not about how long you study, but how you use that time. Testing yourself is always more effective than reviewing, spacing out your learning beats cramming, and interleaving topics strengthens connections between concepts."
          },
          {
            frameId: 'implementation-timeline',
            content: "Don't expect immediate results when implementing these techniques. In fact, research shows that effective learning methods often feel more difficult in the moment. You might experience what psychologists call 'desirable difficulty' - where better learning techniques initially feel harder. Stick with it for at least three weeks to see the benefits."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['resource-recommendation', 'call-to-action'],
        examples: [
          {
            frameId: 'resource-recommendation',
            content: "If you want to dive deeper into these concepts, I highly recommend the books 'Make It Stick' by Peter Brown and 'Ultralearning' by Scott Young. I've linked them in the description along with templates for my Notion study system and my favorite Anki decks."
          },
          {
            frameId: 'call-to-action',
            content: "If you found this video helpful, give it a thumbs up and subscribe for more evidence-based productivity tips. Let me know in the comments which technique you're going to try first. And if you have friends struggling with their studies, share this video with them - it might just transform their learning experience."
          }
        ]
      }
    ]
  },
  
  // AUTOMOTIVE/RACING CATEGORY
  {
    id: 'cleetus-mcfarland',
    name: 'Cleetus McFarland Style',
    creator: 'Cleetus McFarland',
    category: 'Automotive',
    contentTypes: ['long'],
    description: 'High-energy automotive projects and racing content',
    units: ['Hook', 'Intro', 'Process', 'Testing', 'Event', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['project-introduction', 'goal-statement'],
        examples: [
          {
            frameId: 'project-introduction',
            content: "Alright guys! Today we're finally installing the twin-turbo setup on Leroy the Corvette, and if everything goes according to plan, we should be pushing well over 1000 horsepower to the wheels!"
          },
          {
            frameId: 'goal-statement',
            content: "The goal is to have this setup complete by this weekend so we can take Leroy to the Freedom Factory and see if we can break into the 8-second quarter mile range. It's going to be a tight timeline, but we're gonna send it!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['vehicle-history', 'modification-plan'],
        examples: [
          {
            frameId: 'vehicle-history',
            content: "For those of you who might be new to the channel, Leroy started life as a regular C6 Corvette, but after a little accident, we stripped all the body panels off and turned it into what we call a 'skeleton Vette.' Since then, we've been constantly upgrading the power and it's become an absolute monster."
          },
          {
            frameId: 'modification-plan',
            content: "Today's plan is to install these massive 76mm turbos, upgrade the fuel system with these 2000cc injectors, and flash a custom tune that our buddy Shane worked up. We're going from about 700 wheel horsepower to hopefully well over 1000, which should get us deep into the 8s in the quarter mile."
          }
        ]
      },
      {
        unitType: 'Process',
        frameIds: ['technical-explanation', 'installation-demonstration', 'problem-encounter'],
        examples: [
          {
            frameId: 'technical-explanation',
            content: "These turbos are a significant upgrade from our previous setup. At 76mm, they're going to flow a ton more air, but they'll also have more lag. To compensate, we're running a pretty aggressive wastegate spring setup that should help spool them up quicker at lower RPMs."
          },
          {
            frameId: 'installation-demonstration',
            content: "Now we're mounting the turbos to these custom headers. The key here is making sure everything is tight and properly aligned before final installation, because accessing these bolts once everything is in place is going to be nearly impossible. Trust me, I've learned that lesson the hard way!"
          },
          {
            frameId: 'problem-encounter',
            content: "Well, we've hit a bit of a snag. These oil feed lines are too short to reach with the new turbo position. We're going to have to make a quick run to the parts store or fabricate something custom. This is always how these projects go - expect the unexpected!"
          }
        ]
      },
      {
        unitType: 'Testing',
        frameIds: ['initial-test', 'performance-analysis', 'adjustment'],
        examples: [
          {
            frameId: 'initial-test',
            content: "Alright, moment of truth! Let's fire it up and see if we've got any obvious leaks or issues before we try to put some power through it. [Engine starts] It sounds ROWDY, brother! Listen to that turbo whistle!"
          },
          {
            frameId: 'performance-analysis',
            content: "Now we're on the dyno, and the numbers are looking insane! We're seeing 22 pounds of boost and the graph is still climbing steeply at 850 wheel horsepower. Let's see if we can push it a bit further with some tuning adjustments."
          },
          {
            frameId: 'adjustment',
            content: "After tweaking the fuel map and adding a bit more timing, we're now sitting at 1,067 horsepower to the wheels! That's a new record for Leroy, and should be more than enough to get us into the 8s. The torque curve is also much fatter than before, which should help with drivability."
          }
        ]
      },
      {
        unitType: 'Event',
        frameIds: ['competition-preparation', 'race-event-footage', 'result-reaction'],
        examples: [
          {
            frameId: 'competition-preparation',
            content: "We've made it to the Freedom Factory, and we're getting Leroy ready for some passes. Tire pressure is set at 15 psi, we've got the ice bath on the intercooler, and we're running VP Racing Q16 fuel for maximum performance. Everything is looking good for some serious speed!"
          },
          {
            frameId: 'race-event-footage',
            content: "Here we go! First pass of the day with the new setup. The launch feels strong, pulling hard through first and second gear. [Intense racing footage] AND ACROSS THE FINISH LINE! Let's go check the time slip and see what we ran."
          },
          {
            frameId: 'result-reaction',
            content: "ARE YOU KIDDING ME?! 8.92 at 158 miles per hour! WE DID IT! We're officially in the 8-second club with Leroy! [Celebration with team] All that hard work paid off, and the car is running better than ever. This is why we do this, guys!"
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['performance-assessment', 'future-improvements'],
        examples: [
          {
            frameId: 'performance-assessment',
            content: "Looking back at the data logs, I'm really happy with how everything performed. The turbos spooled quicker than expected, our air-fuel ratios stayed consistent through the entire run, and the transmission held up perfectly despite the huge increase in power."
          },
          {
            frameId: 'future-improvements',
            content: "There's still room for improvement though. We had some heat soak issues after multiple passes, so we might look at a more efficient intercooler setup. And I think with some suspension tuning and a better 60-foot time, we could potentially get into the low 8s or even high 7s."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['next-steps', 'call-to-action'],
        examples: [
          {
            frameId: 'next-steps',
            content: "Next up for Leroy is going to be some half-mile racing at the Wannagofast event next month. With this new power, we should be able to hit some serious speeds, so make sure you're subscribed so you don't miss that!"
          },
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this build and want to support the channel, check out our merch at Cleetus McFarland dot com. And drop a comment letting us know what you think we should do next with Leroy! Do it for Dale, y'all!"
          }
        ]
      }
    ]
  },
  
  // PHOTOGRAPHY/FILMMAKING CATEGORY
  {
    id: 'peter-mckinnon',
    name: 'Peter McKinnon Style',
    creator: 'Peter McKinnon',
    category: 'Photography',
    contentTypes: ['long'],
    description: 'Cinematic photography and filmmaking tutorials with high energy',
    units: ['Hook', 'Intro', 'Tutorial', 'Demonstration', 'Advanced', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-showcase', 'problem-statement'],
        examples: [
          {
            frameId: 'visual-showcase',
            content: "[Dramatic cinematic shot of water splashing in slow motion] Have you ever wondered how to capture epic, freeze-frame water splash photos that look like they cost thousands of dollars to produce? Well, grab your camera because today I'm going to show you how to create these shots in your own kitchen with gear you already own."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['technique-overview', 'equipment-introduction'],
        examples: [
          {
            frameId: 'technique-overview',
            content: "What's up everybody! Peter McKinnon here. Today we're diving into high-speed splash photography. This technique combines flash photography with precise timing to freeze liquids in mid-air, creating those mind-blowing shots you've seen all over Instagram."
          },
          {
            frameId: 'equipment-introduction',
            content: "For this shoot, I'm using my Canon R5 with the RF 100mm macro lens, two speedlights, some basic light stands, and a few household items for the setup. Don't worry if you don't have the exact same gear - I'll show you how to adapt with whatever equipment you have available."
          }
        ]
      },
      {
        unitType: 'Tutorial',
        frameIds: ['step-by-step-instruction', 'technical-explanation', 'common-mistake-warning'],
        examples: [
          {
            frameId: 'step-by-step-instruction',
            content: "First, we need to create our splash station. I'm using a clear glass container placed on a black backdrop. The key is to have your background far enough away so it falls completely out of focus. Next, position your flashes at 45-degree angles on either side of your container to create definition in the water."
          },
          {
            frameId: 'technical-explanation',
            content: "Here's where the magic happens: set your camera to manual mode with a shutter speed of 1/200th (or whatever your flash sync speed is), aperture around f/8 for enough depth of field, and ISO 100 for clean images. The key is that we're not actually using the camera's shutter speed to freeze the action - we're using the extremely short flash duration of the speedlights."
          },
          {
            frameId: 'common-mistake-warning',
            content: "The biggest mistake people make is trying to time the splash manually by pressing the shutter when they see something happening. That's virtually impossible because our reaction time is too slow. Instead, either use a trigger device or the burst method I'm about to show you."
          }
        ]
      },
      {
        unitType: 'Demonstration',
        frameIds: ['real-world-application', 'before-after-comparison', 'creative-variation'],
        examples: [
          {
            frameId: 'real-world-application',
            content: "[Shows action of dropping objects into water] What I'm doing is setting my camera to continuous high-speed shooting, dropping the object with one hand while holding the shutter button with the other. Out of 20 shots, you might get 2-3 perfect splash moments, but those will be absolute bangers!"
          },
          {
            frameId: 'before-after-comparison',
            content: "Look at this straight-out-of-camera shot compared to the final edited image. The differences are subtle but important - I've increased contrast, removed a few distracting bubbles in Photoshop, and enhanced the blues in the water to create this otherworldly look."
          },
          {
            frameId: 'creative-variation',
            content: "Once you've mastered the basic technique, try adding food coloring to the water, using differently shaped objects, or even capturing two objects colliding! [Shows examples] I also love replacing water with other liquids like milk or coffee for completely different textures and vibes."
          }
        ]
      },
      {
        unitType: 'Advanced',
        frameIds: ['pro-level-technique', 'gear-optimization', 'post-processing'],
        examples: [
          {
            frameId: 'pro-level-technique',
            content: "For those wanting to take this to the next level, consider investing in a sound trigger like the Pluto Trigger. It detects the exact moment of impact and fires your camera, giving you perfect timing every single time. This is what most commercial splash photographers use for consistent results."
          },
          {
            frameId: 'gear-optimization',
            content: "You can dramatically improve your results by adjusting your flash power and distance. Lower power settings on your speedlights actually create shorter flash durations, which freeze motion better. I'm running my flashes at 1/16 power here, which gives me approximately a 1/15,000th second flash duration - far faster than any camera shutter."
          },
          {
            frameId: 'post-processing',
            content: "In Photoshop, the key to enhancing these images is working with Curves adjustments to add dimension. I'll often create an S-curve for contrast, then do targeted curves adjustments on individual color channels. The red channel particularly can add drama to water splashes when you adjust it just right."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['key-takeaway', 'personal-workflow'],
        examples: [
          {
            frameId: 'key-takeaway',
            content: "The most important thing I've learned after years of doing splash photography is that quantity leads to quality. Even in professional shoots, we might take hundreds of frames to get that one perfect splash. Don't get discouraged if your first attempts aren't magazine-worthy - keep experimenting and shooting!"
          },
          {
            frameId: 'personal-workflow',
            content: "In my own work, I use these splash techniques not just for product photography but also to create custom stock images and textures that I can composite into other photos. I have an entire library of splash elements that I've photographed over the years that come in handy for all sorts of creative projects."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['challenge-assignment', 'call-to-action'],
        examples: [
          {
            frameId: 'challenge-assignment',
            content: "Here's your assignment: This weekend, set up a simple splash station with whatever you have available and shoot 100 frames. Pick your best three shots, edit them, and post them on Instagram with the hashtag #PMSplashChallenge so I can check out your work! I'll be featuring my favorites in the next video."
          },
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this tutorial, make sure to smash that subscribe button and hit the notification bell so you don't miss any future videos. Also, check out my Lightroom presets linked in the description if you want to achieve this same look in your images with one click. As always, make something awesome today. Peace!"
          }
        ]
      }
    ]
  },
  
  // GARDENING/PLANTS CATEGORY
  {
    id: 'garden-answer',
    name: 'Garden Answer Style',
    creator: 'Garden Answer',
    category: 'Gardening',
    contentTypes: ['long'],
    description: 'Practical gardening tutorials and beautiful plant showcases',
    units: ['Hook', 'Intro', 'Process', 'Education', 'Styling', 'Reveal', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['project-introduction', 'garden-problem'],
        examples: [
          {
            frameId: 'project-introduction',
            content: "Today we're going to be transforming this bare corner of our garden into a stunning shade garden filled with beautiful hostas, ferns, and astilbes that will thrive even with minimal sunlight. I'm so excited to show you how to work with these challenging conditions!"
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['plant-selection', 'design-plan'],
        examples: [
          {
            frameId: 'plant-selection',
            content: "I've selected a variety of shade-loving plants for this project. We have these gorgeous 'June' hostas with blue-green leaves edged in creamy yellow, some Japanese painted ferns with their stunning silver and burgundy fronds, and these 'Fanal' astilbes that will add beautiful plumes of red flowers in mid-summer."
          },
          {
            frameId: 'design-plan',
            content: "My design plan is to create layers of different heights and textures. We'll put the taller astilbes toward the back, medium-sized hostas in the middle, and the lower-growing ferns toward the front. I'm also incorporating some larger rocks to add year-round structure and create microenvironments for moss to grow naturally."
          }
        ]
      },
      {
        unitType: 'Process',
        frameIds: ['site-preparation', 'planting-demonstration', 'tool-showcase'],
        examples: [
          {
            frameId: 'site-preparation',
            content: "First, I need to prepare this area by removing any weeds and amending the soil. Shade gardens typically develop under trees where the soil can be quite depleted and dry. I'm adding plenty of compost and leaf mold to improve moisture retention and provide nutrients. This is especially important for hostas, which are heavy feeders."
          },
          {
            frameId: 'planting-demonstration',
            content: "When planting hostas, dig a hole about twice as wide as the root ball but only as deep. See how I'm gently teasing out the roots? This encourages them to grow outward into the new soil. Position the plant so the crown is level with the soil surface - planting too deep can cause rotting, while planting too high can expose roots and dry them out."
          },
          {
            frameId: 'tool-showcase',
            content: "This Japanese hori hori knife is one of my favorite planting tools. It's perfect for digging smaller holes, cutting through roots, and has measurement markings on the blade to help get your planting depth just right. I also always keep these Atlas Nitrile gloves handy - they're durable but still give you the sensitivity to feel what you're doing."
          }
        ]
      },
      {
        unitType: 'Education',
        frameIds: ['plant-care-instructions', 'seasonal-considerations', 'pest-management'],
        examples: [
          {
            frameId: 'plant-care-instructions',
            content: "Hostas and ferns both prefer consistent moisture, especially during their first season while establishing. I recommend watering deeply about once a week, more during hot spells. A 2-3 inch layer of mulch will help maintain soil moisture and suppress weeds. I'm using this shredded pine bark, which breaks down slowly and adds a nice natural look."
          },
          {
            frameId: 'seasonal-considerations',
            content: "One of the things I love about this shade garden design is how it changes through the seasons. In spring, the hostas will unfurl their leaves like works of art. Summer brings the astilbe flowers, and in fall, the ferns and hostas take on beautiful golden hues. Even in winter, the dried astilbe plumes add texture against the snow."
          },
          {
            frameId: 'pest-management',
            content: "The biggest challenge with hostas is usually slugs and deer. For slugs, I use a combination of strategies: copper tape around precious specimens, coffee grounds sprinkled on the soil, and occasionally organic slug bait after rainy periods. To deter deer, I spray the plants with a homemade mixture of egg solids, garlic, and hot pepper - it needs to be reapplied after rain but works amazingly well."
          }
        ]
      },
      {
        unitType: 'Styling',
        frameIds: ['arrangement-techniques', 'accessory-addition', 'final-touches'],
        examples: [
          {
            frameId: 'arrangement-techniques',
            content: "As I'm placing these plants, I'm thinking about contrast in leaf shape and texture. Notice how the broad, rippled leaves of the hostas look even more dramatic next to the delicate, feathery fern fronds. I also love to create visual rhythm by repeating certain plants throughout the bed rather than planting just one of each variety."
          },
          {
            frameId: 'accessory-addition',
            content: "To add year-round interest, I'm incorporating this beautiful stone lantern as a focal point. In shade gardens, hardscape elements become even more important since they provide structure when perennials die back in winter. I'm also adding these polished river stones to create a small dry streambed effect, which enhances the woodland feel."
          },
          {
            frameId: 'final-touches',
            content: "For the finishing touch, I'm tucking in a few of these woodland violets that I propagated from elsewhere in our garden. They'll naturalize over time, creating charming purple blooms in spring. I'm also adding a few stepping stones to create a pathway through the garden so we can get up close to appreciate the details of these shade-loving beauties."
          }
        ]
      },
      {
        unitType: 'Reveal',
        frameIds: ['completed-project', 'before-after-comparison'],
        examples: [
          {
            frameId: 'completed-project',
            content: "And here's our finished shade garden! I'm so pleased with how this turned out. The combination of different textures, heights, and shades of green creates such a peaceful, woodland atmosphere. It'll continue to fill in and become even more beautiful as the plants mature over the next few seasons."
          },
          {
            frameId: 'before-after-comparison',
            content: "Let's take a look at the before and after. What was once a bare, problem corner with exposed roots and patchy grass has been transformed into this lush, inviting garden space that embraces the shade rather than fighting it. And the best part is that this garden will be relatively low-maintenance once established."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['maintenance-tips', 'call-to-action'],
        examples: [
          {
            frameId: 'maintenance-tips',
            content: "To keep this garden looking its best, I'll divide the hostas every 4-5 years as they grow, cut back the astilbe plumes in late winter, and occasionally supplement with a slow-release shade plant fertilizer in spring. Otherwise, it's mostly just watering during dry spells and enjoying the beauty!"
          },
          {
            frameId: 'call-to-action',
            content: "I hope this has inspired you to embrace the shady spots in your own garden. If you enjoyed this video, please give it a thumbs up and subscribe for more garden projects and plant tours. Let me know in the comments what other challenging garden spaces you'd like help with. Happy gardening everyone!"
          }
        ]
      }
    ]
  },
  
  // MENTAL HEALTH/PSYCHOLOGY CATEGORY
  {
    id: 'therapy-in-a-nutshell',
    name: 'Therapy in a Nutshell Style',
    creator: 'Emma McAdam',
    category: 'Mental Health',
    contentTypes: ['long'],
    description: 'Clear, compassionate mental health education and techniques',
    units: ['Hook', 'Intro', 'Education', 'Application', 'Demonstration', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['problem-identification', 'solution-preview'],
        examples: [
          {
            frameId: 'problem-identification',
            content: "Do you ever find yourself caught in a spiral of anxious thoughts, where one worry leads to another, and another, until you feel completely overwhelmed? This pattern, called rumination, is one of the main drivers of anxiety and depression, but it's also something you can learn to interrupt and change."
          },
          {
            frameId: 'solution-preview',
            content: "In today's video, I'm going to teach you a powerful cognitive behavioral technique called 'thought stopping' that can help you break free from rumination cycles and regain control of your mind when anxiety takes over. This skill has helped thousands of my clients reduce their anxiety levels significantly in just a few weeks of practice."
          }
        ]
      },
      {
        unitType: 'Intro',
        frameIds: ['scientific-context', 'personal-relevance'],
        examples: [
          {
            frameId: 'scientific-context',
            content: "Hi, I'm Emma McAdam, a licensed therapist, and today we're talking about breaking the cycle of anxious thoughts. Cognitive research shows that we have about 60,000 thoughts per day, and for people with anxiety disorders, up to 80% of those thoughts may be negative or threat-focused. But here's the good news - neuroscience has also shown that we can literally rewire our thought patterns through consistent practice."
          },
          {
            frameId: 'personal-relevance',
            content: "This matters because your thoughts directly influence your emotions and behaviors. When you're caught in a loop of anxious thinking, your body responds as if the threat is real - releasing stress hormones, increasing your heart rate, and activating your fight-or-flight response. Over time, this creates a lot of unnecessary suffering and can even contribute to physical health problems."
          }
        ]
      },
      {
        unitType: 'Education',
        frameIds: ['concept-explanation', 'research-evidence', 'misconception-correction'],
        examples: [
          {
            frameId: 'concept-explanation',
            content: "Thought stopping is exactly what it sounds like - a deliberate interruption of an unproductive thought pattern. It works because it creates a pattern break in your neural firing, giving you a chance to redirect your attention. Think of it like changing the channel when a scary movie comes on TV - you're exercising your power to choose what plays on your mental screen."
          },
          {
            frameId: 'research-evidence',
            content: "Studies from the Journal of Consulting and Clinical Psychology have found that cognitive interventions like thought stopping, when practiced consistently, can reduce symptoms of anxiety by up to 60% - comparable to the effectiveness of medication but without the side effects. The key finding is that these techniques work best when they're practiced regularly, not just during moments of high anxiety."
          },
          {
            frameId: 'misconception-correction',
            content: "One common misconception is that thought stopping means suppressing your emotions or pretending problems don't exist. That's not the case at all. The goal isn't to ignore legitimate concerns, but rather to stop the unhelpful elaboration and catastrophizing that your mind adds to the original issue. You're not ignoring the initial thought - you're preventing it from snowballing into twenty additional worries."
          }
        ]
      },
      {
        unitType: 'Application',
        frameIds: ['practical-exercise', 'real-life-example', 'adaptation-options'],
        examples: [
          {
            frameId: 'practical-exercise',
            content: "Here's how to practice thought stopping in three steps: First, create a strong interruption. When you notice yourself ruminating, say 'STOP!' either out loud or firmly in your mind. Some people find it helpful to pair this with a physical action like gently snapping a rubber band on their wrist or clapping their hands. Second, take a deep breath and physically center yourself. And third, immediately redirect your attention to something constructive."
          },
          {
            frameId: 'real-life-example',
            content: "Let me show you how this might work in a real-life situation. Say you made a small mistake at work, and you start thinking: 'My boss is going to be so upset. I might get fired. Then I won't be able to pay my bills. I'll lose my apartment...' This is catastrophizing. When you notice this happening, you firmly tell yourself 'STOP!' then take a breath, and redirect with a more balanced thought like: 'I made a mistake that I can fix. Everyone makes mistakes, and this one isn't career-ending.'"
          },
          {
            frameId: 'adaptation-options',
            content: "You can adapt this technique to your personal style. Some people prefer visual interruptions, like imagining a big red stop sign. Others respond better to humor, like imagining their thoughts spoken in a silly cartoon voice. The key is finding what creates an effective pattern interrupt for your unique brain. Experiment with different approaches and see what works best for you."
          }
        ]
      },
      {
        unitType: 'Demonstration',
        frameIds: ['technique-modeling', 'common-reaction', 'troubleshooting'],
        examples: [
          {
            frameId: 'technique-modeling',
            content: "Let me demonstrate this with another common anxiety scenario. [Demonstrates worried facial expression] 'What if my health symptoms mean something serious? Maybe the doctor missed something. I could have a rare disease. What if treatments don't work?' [Firmly] 'STOP!' [Takes visible breath, changes posture] 'I've had a thorough checkup. My symptoms are being managed. Right now, I'm safe, and I'm taking good care of my health.'"
          },
          {
            frameId: 'common-reaction',
            content: "When people first try thought stopping, they often report that the anxious thoughts come right back. This is normal! Think of it like training a puppy - you'll need to gently redirect many times before the new habit sticks. If the thought returns, simply repeat the process. The goal isn't to never have the thought again; it's to get better at interrupting it quickly before it gains momentum."
          },
          {
            frameId: 'troubleshooting',
            content: "If you're finding that thought stopping isn't working well for you, here are a few troubleshooting tips: First, make sure your interruption is strong enough - it needs to genuinely disrupt your thought pattern. Second, the redirection is crucial - have a list of prepared alternative thoughts ready for common worry themes. And third, consider if you need to address an underlying issue through problem-solving rather than just thought stopping."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['benefit-summary', 'implementation-timeline'],
        examples: [
          {
            frameId: 'benefit-summary',
            content: "The benefits of mastering thought stopping extend far beyond reducing anxiety in the moment. Over time, you're actually rewiring your brain's default response patterns. Many of my clients report improved sleep, better concentration, more present-focused awareness, and a greater sense of choice in how they respond to triggers. Some even describe it as 'finally feeling like I'm in the driver's seat of my own mind.'"
          },
          {
            frameId: 'implementation-timeline',
            content: "Be patient with yourself as you learn this skill. In the first week, simply focus on noticing rumination when it happens. In week two, practice the thought stopping technique at least 3 times daily. By week three, most people start to catch their thoughts earlier in the spiral. And after about six weeks of consistent practice, many find that their mind automatically interrupts catastrophic thinking patterns without conscious effort."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['additional-resource', 'call-to-action'],
        examples: [
          {
            frameId: 'additional-resource',
            content: "If you want to go deeper with this practice, I've created a downloadable thought-stopping worksheet that includes a rumination tracking log and personalized redirection scripts. You can find the link in the description below. I also recommend pairing this technique with a regular relaxation practice, as it's easier to redirect thoughts when your baseline anxiety level is lower."
          },
          {
            frameId: 'call-to-action',
            content: "If you found this video helpful, please give it a thumbs up and subscribe for more mental health skills and education. I post new videos every Wednesday. Share in the comments which aspect of thought stopping you're most excited to try. And remember, small consistent steps lead to significant change. You've got this!"
          }
        ]
      }
    ]
  },
  
  // ANIMATION/EDUCATIONAL CATEGORY
  {
    id: 'kurzgesagt',
    name: 'Kurzgesagt Style',
    creator: 'Kurzgesagt',
    category: 'Animation',
    contentTypes: ['long'],
    description: 'Beautifully animated educational content on complex topics',
    units: ['Hook', 'Context', 'Explanation', 'Implication', 'Nuance', 'Reflection', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['existential-question', 'visual-metaphor'],
        examples: [
          {
            frameId: 'existential-question',
            content: "What if we could eliminate death from aging? Not just extend life by a few years, but potentially live for centuries or even indefinitely? This possibility, once firmly in the realm of science fiction, is now being seriously explored by scientists around the world. But would such a radical change be a blessing or a curse for humanity?"
          },
          {
            frameId: 'visual-metaphor',
            content: "Imagine human lifespan as a candle slowly burning down. For all of history, we've accepted that once the flame reaches the bottom, it must extinguish. But what if we could continuously add more wax, keeping the flame burning indefinitely? This is the promise - and the profound ethical question - that longevity research presents us with."
          }
        ]
      },
      {
        unitType: 'Context',
        frameIds: ['historical-background', 'scale-perspective'],
        examples: [
          {
            frameId: 'historical-background',
            content: "Humans have been obsessed with immortality for as long as we've been aware of our own mortality. Ancient Egyptians developed elaborate mummification rituals, Chinese emperors consumed mercury hoping for eternal life, and countless myths from around the world feature quests for immortality. But until recently, these were just dreams and legends."
          },
          {
            frameId: 'scale-perspective',
            content: "To understand the scale of this potential change, consider that for most of human history, average life expectancy was around 30 years. With modern medicine, sanitation, and nutrition, we've pushed this to about 73 years globally. But even the healthiest humans rarely live beyond 100 years. The change we're now contemplating would be as dramatic as the entire medical progress of the last few centuries, compounded many times over."
          }
        ]
      },
      {
        unitType: 'Explanation',
        frameIds: ['scientific-concept', 'visual-breakdown', 'analogy'],
        examples: [
          {
            frameId: 'scientific-concept',
            content: "At its core, aging is a process of accumulating cellular damage. Our DNA replication machinery isn't perfect, and over time, errors build up. Proteins misfold, telomeres shorten, mitochondria become dysfunctional, and cells enter a zombie-like state called senescence where they inflame surrounding tissues. These are the actual mechanisms of aging - and importantly, they're physical processes that could potentially be addressed."
          },
          {
            frameId: 'visual-breakdown',
            content: "Scientists are targeting aging through multiple pathways. Some focus on clearing senescent cells with compounds called senolytics. Others are exploring NAD+ boosters to improve mitochondrial function. Gene therapy approaches aim to express telomerase to lengthen telomeres, while more experimental approaches involve regular partial blood replacement or reprogramming cells to a more youthful state."
          },
          {
            frameId: 'analogy',
            content: "Think of your body like a complex city. Over time, garbage piles up, infrastructure deteriorates, and systems become inefficient. Current medicine is like having better firefighters to handle emergencies, but anti-aging research aims to continuously repair the roads, upgrade the power grid, and keep the whole city functioning smoothly indefinitely."
          }
        ]
      },
      {
        unitType: 'Implication',
        frameIds: ['human-impact', 'future-scenario', 'ethical-question'],
        examples: [
          {
            frameId: 'human-impact',
            content: "If these technologies succeed, the impact on human society would be profound. Careers could span centuries instead of decades. Relationships and family structures would transform when multiple generations might all appear to be the same biological age. Educational systems would need to accommodate much longer lifespans, perhaps with multiple careers becoming the norm rather than the exception."
          },
          {
            frameId: 'future-scenario',
            content: "Imagine a world where people routinely live to 200, 500, or even 1,000 years. Would we become more risk-averse, knowing we have centuries to lose? Or would extreme sports become more popular as boredom sets in? Would we develop greater wisdom and long-term thinking, or would psychological issues like boredom and existential crises become epidemic? We simply don't know how human psychology would adapt to such timescales."
          },
          {
            frameId: 'ethical-question',
            content: "This raises profound ethical questions. Would life extension be available to everyone, or only to the wealthy? What would happen to population growth and resource consumption? Would cultural progress slow as older generations remained in power longer? And perhaps most fundamentally: is mortality actually an important part of what gives human life meaning and motivates our accomplishments?"
          }
        ]
      },
      {
        unitType: 'Nuance',
        frameIds: ['counter-argument', 'limitation-acknowledgment', 'research-frontier'],
        examples: [
          {
            frameId: 'counter-argument',
            content: "Some researchers argue that fears about immortal dictators or extreme population growth are overblown. Fertility rates naturally decline with development, and even with eternal youth, accidents would still claim lives. As for preserving meaning, they argue that having more time doesn't necessarily diminish the value of experiences, just as a longer concert isn't less moving than a shorter one."
          },
          {
            frameId: 'limitation-acknowledgment',
            content: "It's important to acknowledge that despite promising research, significant extension of maximum human lifespan remains theoretical. Many interventions that extend lifespan in simpler organisms like worms or mice fail to translate to humans. The complexity of human aging, influenced by countless genes and environmental factors, may prove far more challenging than optimists suggest."
          },
          {
            frameId: 'research-frontier',
            content: "The cutting edge of this field is moving toward systems biology approaches that target multiple aging pathways simultaneously. Some researchers are developing comprehensive aging clocks based on epigenetic markers or blood biomarkers to measure biological rather than chronological age. Others are using machine learning to identify new compounds or drug combinations that might influence aging pathways not yet fully understood."
          }
        ]
      },
      {
        unitType: 'Reflection',
        frameIds: ['philosophical-takeaway', 'practical-consideration'],
        examples: [
          {
            frameId: 'philosophical-takeaway',
            content: "Perhaps the most profound aspect of this research is how it forces us to confront our assumptions about the inevitability of aging and death. For all of human history, mortality has been a fundamental condition of our existence, shaping our philosophies, religions, art, and social structures. Challenging this constant would require us to rethink what it means to be human at the most fundamental level."
          },
          {
            frameId: 'practical-consideration',
            content: "While dramatic life extension remains speculative, the research is already yielding practical benefits. Understanding aging mechanisms is helping develop treatments for age-related conditions like Alzheimer's and heart disease. Even modest extensions of 'healthspan' - the period of life spent in good health - would profoundly improve quality of life and reduce suffering for billions of people."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['question-prompt', 'call-to-action'],
        examples: [
          {
            frameId: 'question-prompt',
            content: "Would you choose to live for centuries if you could? How would you spend that time? And how might humanity need to adapt its social structures, economic systems, and even moral frameworks to accommodate such a profound change? There are no simple answers to these questions, but they may become increasingly relevant in the decades ahead."
          },
          {
            frameId: 'call-to-action',
            content: "If you enjoyed this exploration of longevity science and its implications, consider supporting our work on Patreon. Your contributions help us create more in-depth videos on complex topics like this one. Check out our sources in the description for more information, and let us know in the comments what other scientific frontiers you'd like us to explore in future videos."
          }
        ]
      }
    ]
  },
  
  // DANCE/TIKTOK CATEGORY
  {
    id: 'charli-damelio',
    name: 'Charli D\'Amelio Style',
    creator: 'Charli D\'Amelio',
    category: 'Lifestyle',
    contentTypes: ['short'],
    description: 'Trending dance routines and authentic Gen Z lifestyle content',
    units: ['Hook', 'Content Delivery', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['visual-hook', 'trending-sound'],
        examples: [
          {
            frameId: 'visual-hook',
            content: "[Starts with an immediate eye-catching pose or movement that transitions smoothly into the main dance]"
          }
        ]
      },
      {
        unitType: 'Content Delivery',
        frameIds: ['trending-dance', 'transformative-visual'],
        examples: [
          {
            frameId: 'trending-dance',
            content: "[Performs precise, clean choreography to trending song, with smooth transitions between movements and perfect timing]"
          },
          {
            frameId: 'transformative-visual',
            content: "[Incorporates visual effect transition that enhances the video - could be a creative outfit change, lighting shift, or creative editing]"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['subtle-call-to-action', 'authentic-expression'],
        examples: [
          {
            frameId: 'subtle-call-to-action',
            content: "[Simple wave, smile, or pointing gesture that encourages engagement without being overtly promotional]"
          }
        ]
      }
    ]
  },
  
  // BUSINESS/MOTIVATION SHORT-FORM CATEGORY
  {
    id: 'alex-hormozi',
    name: 'Alex Hormozi Style',
    creator: 'Alex Hormozi',
    category: 'Business',
    contentTypes: ['short'],
    description: 'Direct, value-packed business advice with no-nonsense delivery',
    units: ['Hook', 'Quick Context', 'Main Value', 'Punchline/Climax', 'Call to Action'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['direct-and-value-packed', 'intriguing-question'],
        examples: [
          {
            frameId: 'intriguing-question',
            content: "Want to know why most businesses fail to scale past $1 million? It's not what you think. Most entrepreneurs focus on the wrong lever entirely."
          }
        ]
      },
      {
        unitType: 'Quick Context',
        frameIds: ['brief-point-setup', 'relatable-moment'],
        examples: [
          {
            frameId: 'brief-point-setup',
            content: "I've built and sold multiple 8-figure businesses, and I've seen this pattern repeatedly: founders obsess over marketing and lead generation while ignoring the most profitable part of their business."
          },
          {
            frameId: 'relatable-moment',
            content: "I made this exact mistake in my first business. I spent thousands on ads, worked 80-hour weeks trying to get more leads, and was still barely profitable. Then I discovered this shift that changed everything."
          }
        ]
      },
      {
        unitType: 'Main Value',
        frameIds: ['simple-digestible-strategy-steps', 'teach-a-concept'],
        examples: [
          {
            frameId: 'simple-digestible-strategy-steps',
            content: "Focus on increasing your average transaction value instead of chasing more leads. It's simple math: If you double your prices but lose 30% of prospects, you still make 40% more money with the same effort. Then use those margins to outspend competitors on acquisition."
          },
          {
            frameId: 'teach-a-concept',
            content: "The key is understanding value perception. People don't buy based on your costs; they buy based on the perceived value gap - the difference between what they pay and what they believe they get. Increase that gap by improving your offer, not by lowering your price."
          }
        ]
      },
      {
        unitType: 'Punchline/Climax',
        frameIds: ['important-takeaway-summary', 'one-liner-wisdom'],
        examples: [
          {
            frameId: 'important-takeaway-summary',
            content: "So stop trying to find more customers for your products and start finding better products for your customers. That's how you scale past $1M, $10M, and beyond without working yourself to death."
          },
          {
            frameId: 'one-liner-wisdom',
            content: "Remember: If you can't make money with 10 customers, you won't magically make money with 10,000 customers. Fix your offer first, then scale."
          }
        ]
      },
      {
        unitType: 'Call to Action',
        frameIds: ['direct-and-confident', 'take-action-now'],
        examples: [
          {
            frameId: 'direct-and-confident',
            content: "Apply this to your business this week. Look at your main offer and ask: How can I increase the value 10X while only raising the price 2X? That's where the magic happens."
          },
          {
            frameId: 'take-action-now',
            content: "Stop scrolling. Take 5 minutes right now to list three ways you could add massive value to your existing offer. Your future self will thank you."
          }
        ]
      }
    ]
  },
  
  // CHALLENGES/ENTERTAINMENT CATEGORY
  {
    id: 'mrbeast',
    name: 'MrBeast Style',
    creator: 'MrBeast',
    category: 'Entertainment',
    contentTypes: ['long'],
    description: 'High-stakes challenges with prize money and philanthropy',
    units: ['Hook', 'Setup', 'Progress', 'Human Element', 'Climax', 'Resolution', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['challenge-announcement', 'prize-reveal'],
        examples: [
          {
            frameId: 'challenge-announcement',
            content: "I built a perfect replica of Squid Game in real life with 456 contestants competing for $456,000!"
          },
          {
            frameId: 'prize-reveal',
            content: "The last person to leave this circle wins $500,000 CASH! That's half a million dollars just for staying in one spot longer than everyone else!"
          }
        ]
      },
      {
        unitType: 'Setup',
        frameIds: ['rules-explanation', 'participant-introduction'],
        examples: [
          {
            frameId: 'rules-explanation',
            content: "Here are the rules: All 100 contestants will stand in this submarine for as long as possible. If you leave for ANY reason, you're eliminated. Last person remaining wins $100,000. Sounds simple, but we'll be throwing in challenges and temptations to make it interesting!"
          },
          {
            frameId: 'participant-introduction',
            content: "We found people from all walks of life for this challenge. We have doctors, students, professional athletes, and even a 72-year-old grandmother who says she can outlast everyone! Let's see if she's right!"
          }
        ]
      },
      {
        unitType: 'Progress',
        frameIds: ['milestone-achievement', 'elimination-rounds', 'unexpected-twist'],
        examples: [
          {
            frameId: 'milestone-achievement',
            content: "It's been 24 hours, and we still have 78 contestants remaining! To celebrate, I'm ordering pizza for everyone... but only the first 50 people to reach the food table get to eat. The rest have to watch and smell the pizza without getting any!"
          },
          {
            frameId: 'elimination-rounds',
            content: "We're down to our final 20 contestants! Now it's time for the wall sit challenge. Anyone who can't hold a wall sit for 5 minutes is instantly eliminated. The clock starts... NOW!"
          },
          {
            frameId: 'unexpected-twist',
            content: "PLOT TWIST! I'm offering $10,000 to anyone who voluntarily leaves right now. You have 30 seconds to decide - take the guaranteed money or stay for a chance at the grand prize! [Dramatic countdown music]"
          }
        ]
      },
      {
        unitType: 'Human Element',
        frameIds: ['emotional-reaction', 'contestant-backstory', 'interpersonal-dynamics'],
        examples: [
          {
            frameId: 'emotional-reaction',
            content: "[Contestant crying] 'I've been here for three days, barely slept, and I'm in so much pain... but my kids are watching, and I promised them I wouldn't give up. This money would change everything for our family.'"
          },
          {
            frameId: 'contestant-backstory',
            content: "Meet Carlos. He's a single dad working three jobs to support his daughter who has medical needs. He told us he would use the prize money to pay off her medical bills and start a college fund. [Shows pictures of his family]"
          },
          {
            frameId: 'interpersonal-dynamics',
            content: "Something incredible is happening! Sarah and Mike, who just met during this challenge, have been supporting each other for the past 50 hours. They've agreed that if either of them wins, they'll split the money. True friendship forming under extreme circumstances!"
          }
        ]
      },
      {
        unitType: 'Climax',
        frameIds: ['final-challenge', 'winner-determination'],
        examples: [
          {
            frameId: 'final-challenge',
            content: "We're down to our final two contestants who have been standing in this circle for 72 HOURS STRAIGHT! For the final challenge, they'll both hold these buckets of water with outstretched arms. First person to drop their bucket is the runner-up. [Intense music]"
          },
          {
            frameId: 'winner-determination',
            content: "OH MY GOODNESS! After an INSANE 4 days and 6 hours, we finally have our winner! David has outlasted everyone and is taking home the $250,000 grand prize! [Confetti explosion, celebration music, crew rushes in to congratulate]"
          }
        ]
      },
      {
        unitType: 'Resolution',
        frameIds: ['prize-delivery', 'life-impact'],
        examples: [
          {
            frameId: 'prize-delivery',
            content: "[Brings out briefcase full of cash] 'David, you've earned every dollar of this $250,000. Count it if you want - it's all there!' [Shows David's shocked face as he holds stacks of cash]"
          },
          {
            frameId: 'life-impact',
            content: "[Follow-up clip filmed 2 weeks later] 'With the prize money, I've already paid off all my student loans and put a down payment on my first house. I never thought I'd be debt-free at 26. This has completely changed the trajectory of my life. Thank you, MrBeast!'"
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['next-challenge-teaser', 'subscribe-reminder'],
        examples: [
          {
            frameId: 'next-challenge-teaser',
            content: "If you thought this was insane, wait until you see what we're doing next month! We're building an entire abandoned city where 1,000 people will compete in the ultimate game of hide and seek for ONE MILLION DOLLARS!"
          },
          {
            frameId: 'subscribe-reminder',
            content: "If you enjoyed this video, SMASH that subscribe button RIGHT NOW and hit the notification bell to be the first to know when we drop our next insane challenge! And remember, I'm giving away 10 PlayStations to random subscribers who comment on this video within the first 24 hours!"
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
    contentTypes: ['short', 'long'],
    description: 'Clear financial education with clever visual explanations',
    units: ['Hook', 'Problem Statement', 'Explanation', 'Example', 'Application', 'Quick Recap', 'Outro'],
    frames: [
      {
        unitType: 'Hook',
        frameIds: ['surprising-fact', 'cost-comparison'],
        examples: [
          {
            frameId: 'surprising-fact',
            content: "Did you know that if you invested just $6 a day from age 18 to 65, you'd have over a million dollars in retirement? Let me show you how..."
          }
        ]
      },
      {
        unitType: 'Problem Statement',
        frameIds: ['common-mistake', 'misconception-correction'],
        examples: [
          {
            frameId: 'common-mistake',
            content: "Most people think investing is about picking winning stocks, but 94% of your returns actually come from proper asset allocation, not stock selection."
          }
        ]
      },
      {
        unitType: 'Explanation',
        frameIds: ['visual-breakdown', 'simplified-concept'],
        examples: [
          {
            frameId: 'visual-breakdown',
            content: "Think of compound interest like rolling a snowball down a hill. At first, progress seems slow, but as your money grows, it builds on itself faster and faster."
          }
        ]
      },
      {
        unitType: 'Example',
        frameIds: ['practical-scenario', 'calculation-demo'],
        examples: [
          {
            frameId: 'practical-scenario',
            content: "Let's say you're 25 and invest $500 a month with an 8% average annual return. By 65, you'd have $1.4 million. But if you wait until 35, you'd only have about $600,000."
          }
        ]
      },
      {
        unitType: 'Application',
        frameIds: ['actionable-step', 'tool-recommendation'],
        examples: [
          {
            frameId: 'actionable-step',
            content: "The easiest way to start is to set up automatic investments to low-cost index funds in a Roth IRA, which gives you tax-free growth and withdrawals in retirement."
          }
        ]
      },
      {
        unitType: 'Quick Recap',
        frameIds: ['key-points', 'rule-of-thumb'],
        examples: [
          {
            frameId: 'key-points',
            content: "Remember these three rules: start early, be consistent, and keep fees low. That's 90% of what you need to know about successful investing."
          }
        ]
      },
      {
        unitType: 'Outro',
        frameIds: ['suggested-next-step', 'personal-motto'],
        examples: [
          {
            frameId: 'suggested-next-step',
            content: "If you haven't started investing yet, open a Roth IRA this week. Even $50 a month is better than nothing. Your future self will thank you."
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
    category: 'Entertainment',
    contentTypes: ['short', 'long'],
    description: 'Build your own custom content structure',
    units: ['Hook', 'Intro', 'Content', 'Call To Action', 'Outro']
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