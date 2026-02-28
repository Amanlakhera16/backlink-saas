import OpenAI from "openai";
import { z } from "zod";
import { env } from "../../config/env";

const scoreSchema = z.object({
  score: z.number().min(0).max(100),
  reason: z.string()
});

const emailSchema = z.object({
  subject: z.string(),
  body: z.string()
});

export class OpenAIService {
  private client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    maxRetries: 2
  });

  private lastCallTime = 0;

  private async rateLimit() {
    const now = Date.now();

    if (now - this.lastCallTime < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.lastCallTime = Date.now();
  }

  async scoreOpportunity(website: string, niche: string) {
    await this.rateLimit();

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert scoring backlink opportunities ethically."
        },
        {
          role: "user",
          content: `\nScore this website (0-100) for guest posting in niche "${niche}".\nWebsite: ${website}\n\nReturn JSON:\n{\n  "score": number,\n  "reason": "short explanation"\n}\n`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content || "{}";

    try {
      const parsed = scoreSchema.safeParse(JSON.parse(content));
      if (parsed.success) return parsed.data;
    } catch {
      // fall through
    }

    return { score: 50, reason: "Default score due to parsing issue" };
  }

  async generateOutreachEmail(data: {
    website: string;
    niche: string;
    userWebsite: string;
  }) {
    await this.rateLimit();

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional SEO outreach specialist."
        },
        {
          role: "user",
          content: `\nGenerate a personalized guest post outreach email.\n\nTarget Website: ${data.website}\nOur Website: ${data.userWebsite}\nNiche: ${data.niche}\n\nKeep it ethical, value-driven, and professional.\nReturn:\n{\n  "subject": "...",\n  "body": "..."\n}\n`
        }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content || "{}";

    try {
      const parsed = emailSchema.safeParse(JSON.parse(content));
      if (parsed.success) return parsed.data;
    } catch {
      // fall through
    }

    return {
      subject: "Guest Post Collaboration",
      body: content
    };
  }
}
