import OpenAI from "openai";
import { env } from "../../config/env";

export class OpenAIService {
  private client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  // 🔒 Track last API call timestamp
  private lastCallTime = 0;

  // 🔒 Simple 1 request per second limiter
  private async rateLimit() {
    const now = Date.now();

    if (now - this.lastCallTime < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.lastCallTime = Date.now();
  }

  async scoreOpportunity(website: string, niche: string) {
    // ✅ Apply rate limit before API call
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
          content: `
Score this website (0-100) for guest posting in niche "${niche}".
Website: ${website}

Return JSON:
{
  "score": number,
  "reason": "short explanation"
}
`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content || "{}";

    try {
      return JSON.parse(content);
    } catch {
      return { score: 50, reason: "Default score due to parsing issue" };
    }
  }

  async generateOutreachEmail(data: {
    website: string;
    niche: string;
    userWebsite: string;
  }) {
    // ✅ Apply rate limit before API call
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
          content: `
Generate a personalized guest post outreach email.

Target Website: ${data.website}
Our Website: ${data.userWebsite}
Niche: ${data.niche}

Keep it ethical, value-driven, and professional.
Return:
{
  "subject": "...",
  "body": "..."
}
`
        }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content || "{}";

    try {
      return JSON.parse(content);
    } catch {
      return {
        subject: "Guest Post Collaboration",
        body: content
      };
    }
  }
}