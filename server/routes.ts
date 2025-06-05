import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export function registerRoutes(app: Express): Server {
  // Smart Recommendation API endpoint
  app.post("/api/recommend-skeleton", async (req, res) => {
    try {
      const { videoIdea, audienceGoal, overallGoal, preferredLength, targetAudience, contentStyle } = req.body;

      if (!videoIdea || !audienceGoal || !overallGoal) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Available templates for analysis
      const templates = [
        { name: "Lilsimsie Style", category: "Entertainment", units: ["Hook", "Intro", "Content Journey", "Rehook", "Outro", "Call To Action"], description: "Gaming/streaming content with strong hooks" },
        { name: "Dude Perfect Style", category: "Entertainment", units: ["Hook", "Intro", "Content Journey", "Outro", "Call To Action"], description: "Sports and trick content" },
        { name: "Casey Neistat Style", category: "Lifestyle", units: ["Hook", "Intro", "Story Arc", "Conclusion"], description: "Daily vlog and storytelling format" },
        { name: "Emma Chamberlain Style", category: "Lifestyle", units: ["Hook", "Intro", "Content Journey", "Outro"], description: "Casual lifestyle and personal content" },
        { name: "Alex Hormozi Style", category: "Business", units: ["Hook", "Problem", "Solution", "Proof", "Call To Action"], description: "Business and educational content" },
        { name: "GaryVee Style", category: "Business", units: ["Hook", "Value Bomb", "Story", "Call To Action"], description: "Motivational business content" }
      ];

      const analysisPrompt = `You are an expert content strategist analyzing video concepts to recommend the best content structure.

Video Idea: ${videoIdea}
What audience should get out of it: ${audienceGoal}
Overall goal: ${overallGoal}
Preferred length: ${preferredLength}
Target audience: ${targetAudience || 'Not specified'}
Content style preference: ${contentStyle || 'Not specified'}

Available Templates:
${templates.map(t => 
  `- ${t.name} (${t.category}): ${t.description} | Units: ${t.units.join(' → ')}`
).join('\n')}

Available Custom Units:
Hook, Intro, Problem, Problem Expansion, Solution, Content Journey, Story Arc, Value Bomb, Proof, Rehook, Outro, Call To Action, Conclusion

Based on this information, analyze the video concept and either:
1. RECOMMEND an existing template that best matches (provide the exact template name and reasoning)
2. SUGGEST a custom structure if no template is ideal (provide units and reasoning)

Respond in JSON format:
{
  "recommendation_type": "template" or "custom",
  "template_name": "exact template name if recommending template",
  "custom_units": ["unit1", "unit2"] if suggesting custom,
  "reasoning": "detailed explanation of why this structure works best",
  "confidence": "high/medium/low"
}`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert content strategist. Analyze video concepts and recommend optimal content structures. Always respond with valid JSON."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      res.json(analysis);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({ error: "Failed to generate recommendation" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
