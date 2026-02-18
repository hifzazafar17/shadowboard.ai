// import Anthropic from '@anthropic-ai/sdk';
// import { NextRequest } from 'next/server';

// // Domain category map
// const CATEGORIES: Record<string, string> = {
//   // Social
//   'twitter.com': 'social', 'x.com': 'social', 'facebook.com': 'social',
//   'instagram.com': 'social', 'linkedin.com': 'social', 'tiktok.com': 'social',
//   'reddit.com': 'social', 'snapchat.com': 'social', 'pinterest.com': 'social',
//   // Video
//   'youtube.com': 'video', 'netflix.com': 'video', 'twitch.tv': 'video',
//   'vimeo.com': 'video', 'disneyplus.com': 'video',
//   // Productivity
//   'notion.so': 'productivity', 'trello.com': 'productivity', 'asana.com': 'productivity',
//   'slack.com': 'productivity', 'figma.com': 'productivity', 'linear.app': 'productivity',
//   // Code
//   'github.com': 'coding', 'stackoverflow.com': 'coding', 'vercel.com': 'coding',
//   'npmjs.com': 'coding', 'developer.mozilla.org': 'coding',
//   // Learning
//   'udemy.com': 'learning', 'coursera.org': 'learning', 'medium.com': 'learning',
//   'substack.com': 'learning',
//   // Shopping
//   'amazon.com': 'shopping', 'ebay.com': 'shopping', 'aliexpress.com': 'shopping',
//   // News
//   'cnn.com': 'news', 'bbc.com': 'news', 'nytimes.com': 'news',
// };

// function getDomain(url: string): string {
//   try {
//     const u = new URL(url);
//     return u.hostname.replace('www.', '');
//   } catch {
//     return url;
//   }
// }

// function getCategory(domain: string): string {
//   return CATEGORIES[domain] || 'other';
// }

// function parseHistory(raw: any): {
//   topSites: { domain: string; visits: number; category: string }[];
//   categoryBreakdown: { category: string; percentage: number }[];
//   totalVisits: number;
// } {
//   const siteCounts: Record<string, number> = {};

//   // Handle Chrome format: { Browser History: [{url, title, time_usec}] }
//   let entries: any[] = [];

//   if (raw?.['Browser History']) {
//     entries = raw['Browser History'];
//   } else if (Array.isArray(raw)) {
//     entries = raw;
//   } else if (raw?.history) {
//     entries = raw.history;
//   } else {
//     // Try to find any array in the object
//     const keys = Object.keys(raw);
//     for (const key of keys) {
//       if (Array.isArray(raw[key])) {
//         entries = raw[key];
//         break;
//       }
//     }
//   }

//   // Count visits per domain
//   for (const entry of entries) {
//     const url = entry?.url || entry?.URL || entry?.href || '';
//     if (!url || url.startsWith('chrome://') || url.startsWith('about:')) continue;
//     const domain = getDomain(url);
//     siteCounts[domain] = (siteCounts[domain] || 0) + 1;
//   }

//   // Sort by visits
//   const sorted = Object.entries(siteCounts)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 50);

//   const topSites = sorted.map(([domain, visits]) => ({
//     domain,
//     visits,
//     category: getCategory(domain),
//   }));

//   // Category breakdown
//   const totalVisits = topSites.reduce((s, x) => s + x.visits, 0);
//   const catCounts: Record<string, number> = {};
//   for (const site of topSites) {
//     catCounts[site.category] = (catCounts[site.category] || 0) + site.visits;
//   }
//   const categoryBreakdown = Object.entries(catCounts)
//     .sort((a, b) => b[1] - a[1])
//     .map(([category, count]) => ({
//       category,
//       percentage: Math.round((count / totalVisits) * 100),
//     }));

//   return { topSites, categoryBreakdown, totalVisits };
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { historyData } = await req.json();

//     if (!historyData) {
//       return Response.json({ error: 'No history data provided' }, { status: 400 });
//     }

//     // Parse the history
//     const { topSites, categoryBreakdown, totalVisits } = parseHistory(historyData);

//     if (topSites.length === 0) {
//       return Response.json({
//         error: 'Could not extract any URLs from your file. Make sure it\'s a valid browser history export.'
//       }, { status: 400 });
//     }

//     // Build prompt
//     const sitesText = topSites
//       .slice(0, 20)
//       .map(s => `- ${s.domain}: ${s.visits} visits (${s.category})`)
//       .join('\n');

//     const catText = categoryBreakdown
//       .map(c => `- ${c.category}: ${c.percentage}%`)
//       .join('\n');

//     const prompt = `You are a brutally honest behavioral analyst. Analyze this person's browsing history to reveal what they're ACTUALLY manifesting — not what they wish or claim to want.

// TOP VISITED SITES:
// ${sitesText}

// TIME DISTRIBUTION BY CATEGORY:
// ${catText}

// TOTAL VISITS ANALYZED: ${totalVisits}

// Provide a sharp, insightful analysis in this EXACT JSON format (no markdown, no backticks, just raw JSON):
// {
//   "realityCheck": "2-3 sentences revealing what their actual behavior shows about their true priorities. Be direct and specific using the data.",
//   "shadowPatterns": [
//     "First specific observation based on the data",
//     "Second specific observation based on the data", 
//     "Third specific observation based on the data"
//   ],
//   "theGap": "One paragraph about what they claim to want but are clearly NOT doing based on this data.",
//   "brutalTruth": "One powerful sentence — their ultimate wake-up call. Make it land hard but fair."
// }

// Rules:
// - Be specific to THEIR data, not generic
// - Be direct but not cruel
// - Use actual domain names from their data
// - Focus on the gap between stated goals and actual behavior
// - Do NOT add any text outside the JSON`;

//     // Call Claude API
//     const client = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY!,
//     });

//     const message = await client.messages.create({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 800,
//       messages: [{ role: 'user', content: prompt }],
//     });

//     const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

//     // Parse JSON response
//     let analysis;
//     try {
//       // Strip any accidental markdown
//       const cleaned = responseText.replace(/```json|```/g, '').trim();
//       analysis = JSON.parse(cleaned);
//     } catch {
//       console.error('Claude response was not valid JSON:', responseText);
//       return Response.json({ error: 'Analysis failed to parse. Please try again.' }, { status: 500 });
//     }

//     return Response.json({
//       ...analysis,
//       topSites: topSites.slice(0, 10),
//     });

//   } catch (err: any) {
//     console.error('API error:', err);

//     if (err?.status === 401) {
//       return Response.json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY.' }, { status: 500 });
//     }

//     return Response.json({
//       error: err.message || 'Something went wrong. Please try again.'
//     }, { status: 500 });
//   }
// }




import { NextRequest } from 'next/server';

// Simple in-memory storage (resets on redeploy, but good enough for launch)
const waitlistEmails = new Map<string, { position: number; timestamp: number; email: string }>();
let counter = 247;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validation
    if (!email || !email.includes('@')) {
      return Response.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicates
    if (waitlistEmails.has(normalizedEmail)) {
      return Response.json({ 
        error: 'You\'re already on the list!' 
      }, { status: 400 });
    }

    // Add to waitlist
    counter++;
    const position = counter;
    const timestamp = Date.now();
    
    waitlistEmails.set(normalizedEmail, {
      position,
      timestamp,
      email: normalizedEmail,
    });

    // ✅ Log to Vercel console (you can see in deployment logs)
    console.log(`✅ NEW SIGNUP #${position}: ${normalizedEmail} at ${new Date(timestamp).toISOString()}`);
    
    // 📊 Print current list (so you don't lose data)
    console.log(`📊 Total signups: ${waitlistEmails.size}`);
    console.log('Current waitlist:', Array.from(waitlistEmails.values()));

    return Response.json({
      success: true,
      position,
      total: waitlistEmails.size,
    });

  } catch (err) {
    console.error('❌ Waitlist error:', err);
    return Response.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 });
  }
}

// GET endpoint to see stats
export async function GET() {
  return Response.json({
    count: counter,
    signups: waitlistEmails.size,
    emails: Array.from(waitlistEmails.values()).map(e => ({
      email: e.email,
      position: e.position,
    })),
  });
}