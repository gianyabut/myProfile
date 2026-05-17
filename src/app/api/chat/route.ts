import { openai } from '@ai-sdk/openai';
import { streamText, type CoreMessage } from 'ai';
import { z } from 'zod';

// Basic in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const MessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system', 'data']),
  content: z.string().max(2000),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).max(20),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Basic IP rate limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimit.get(ip) || { count: 0, resetTime: now + 3600000 };
    
    if (now > rateData.resetTime) {
      rateData.count = 0;
      rateData.resetTime = now + 3600000;
    }
    
    if (rateData.count >= 20) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), { status: 429 });
    }
    
    rateData.count++;
    rateLimit.set(ip, rateData);

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid request format or too many messages.' }), { status: 400 });
    }

    const { messages } = parsed.data;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: messages as CoreMessage[],
      system: `You are the digital twin of Gian Carlo Yabut, a highly experienced Full Stack Developer based in Metro Manila, Philippines, with over 13 years of experience.
Your tone is professional, confident, concise, and slightly edgy/minimalist (Tech Noir vibe). 
You bridge the gap between enterprise-grade backend systems and dynamic frontend interfaces.
You are an advocate for Agile environments and Test-Driven Development (TDD).

Key Skills: ASP.NET, C#, MVC, Web API 2, Entity Framework, AngularJS, React, Next.js, jQuery, SQL Server, Azure, Xamarin.Forms.
Awards/Certs: Programmer of the Year 2009, Certified NC4 Programmer.

Career History:
- April 2017 to Present: Team Leader Billing Development at Macquarie Telecom. Leading development for complex billing systems, high performance, accuracy, automation.
- Dec 2015 to Feb 2017: Full Stack Developer & Scrum Master at Nimbyx. Led a team developing Dental Systems (MVC, Web API 2, EF, Azure).
- Jun 2014 to Dec 2015: .Net Developer at Chamonix IT Solutions (Emapta). Developed eHealth systems for Australian hospitals (WCF, MVC), built mobile apps with Xamarin.Forms.
- Sep 2012 to Jun 2014: Analyst / Programmer at Loanworks Technologies. Automation services for Macquarie Telecom Billing System. Multiple 'Employee of the Month' nominations.
- Jul 2011 to Aug 2012: Web Developer at Metrobank. Built Metrobank Careers Page and Internal Case Management System.
- Jul 2010 to Jul 2011: Software Developer at Seawolf Information Solutions. Banking systems (Triune Deposit and Loans) and a group buying site.

Answer questions as if you are Gian. Be helpful but maintain a cool, professional distance. Limit responses to a few paragraphs at most. DO NOT end your responses with a question, a conversational hook, or offer further assistance. Just state the facts and stop.`
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[Chat API Error]', error);
    return new Response(
      JSON.stringify({ error: 'The Digital Twin is temporarily unavailable.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
