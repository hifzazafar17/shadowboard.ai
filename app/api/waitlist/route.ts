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

const waitlistEmails = new Map<string, { position: number; timestamp: number }>();
let counter = 247;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return Response.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (waitlistEmails.has(normalizedEmail)) {
      return Response.json({ 
        error: 'You\'re already on the list! Check your email.' 
      }, { status: 400 });
    }

    counter++;
    const position = counter;
    waitlistEmails.set(normalizedEmail, {
      position,
      timestamp: Date.now(),
    });

    console.log(`✅ New waitlist signup: ${normalizedEmail} (Position #${position})`);

    // ✅ FIX: Use Resend's proper test domain
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found');
      return Response.json({ success: true, position }); // Still return success to user
    }

    // Send confirmation email to USER
    try {
      const userEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'delivered@resend.dev', // ✅ Use this instead
          to: normalizedEmail,
          subject: "You're on the Shadow Board waitlist! 🎯",
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0A0A0A;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: #1A1A1A; border: 2px solid #FF2D20; padding: 40px;">
                  
                  <h1 style="color: #FF2D20; font-size: 2.5rem; margin: 0 0 20px 0; letter-spacing: 0.1em;">
                    YOU'RE IN!
                  </h1>
                  
                  <p style="color: #F5F0E8; font-size: 1.1rem; margin-bottom: 10px;">
                    Thanks for joining the Shadow Board AI waitlist.
                  </p>
                  
                  <p style="color: #FF2D20; font-size: 1.8rem; font-weight: bold; margin: 30px 0;">
                    Your position: #${position}
                  </p>
                  
                  <h2 style="color: #F5F0E8; margin-top: 40px; margin-bottom: 20px; font-size: 1.3rem;">
                    What happens next:
                  </h2>
                  
                  <ul style="color: #F5F0E8; line-height: 1.8; padding-left: 20px;">
                    <li style="margin-bottom: 15px;">
                      <strong>Within 48 hours:</strong> We launch Shadow Board AI
                    </li>
                    <li style="margin-bottom: 15px;">
                      <strong>You get instant access:</strong> We'll email you the moment we go live
                    </li>
                    <li style="margin-bottom: 15px;">
                      <strong>Your founding member perks:</strong> Lifetime 70% discount locked in ($9 vs $29/month)
                    </li>
                    <li style="margin-bottom: 15px;">
                      <strong>Unlimited analyses:</strong> As many shadow boards as you want
                    </li>
                    <li style="margin-bottom: 15px;">
                      <strong>Exclusive features:</strong> Action plan generator + weekly trends
                    </li>
                  </ul>
                  
                  <p style="color: #F5F0E8; margin-top: 40px; font-size: 1.1rem;">
                    Get ready to see what you're <strong>actually</strong> manifesting.
                    <br>The data doesn't lie 🔥
                  </p>
                  
                  <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #2A2A2A;">
                    <p style="color: #888; font-size: 0.95rem; margin-bottom: 15px;">
                      <strong>P.S.</strong> Only the first 100 people get founding member pricing. You're locked in.
                    </p>
                    <p style="color: #666; font-size: 0.85rem;">
                      Questions? Just reply to this email.<br>
                      Follow the build: <a href="https://x.com/hifzazafar17" style="color: #FF2D20;">@hifzazafar17</a>
                    </p>
                  </div>
                  
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      const responseData = await userEmailResponse.json();

      if (!userEmailResponse.ok) {
        console.error('❌ Failed to send user email:', responseData);
      } else {
        console.log(`📧 Confirmation email sent to ${normalizedEmail}`);
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    // Send notification email to YOU
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'delivered@resend.dev', // ✅ Use this
          to: 'hifzazafar116@gmail.com', // ✅ Your email to receive notifications
          subject: `🎯 New Waitlist Signup (#${position})`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 30px; background: #f5f5f5;">
              <h2 style="color: #FF2D20; margin-top: 0;">New Shadow Board Waitlist Signup</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 10px 0;"><strong>Email:</strong> ${normalizedEmail}</p>
                <p style="margin: 10px 0;"><strong>Position:</strong> #${position}</p>
                <p style="margin: 10px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p style="margin: 10px 0;"><strong>Total signups:</strong> ${waitlistEmails.size}</p>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 0.9rem;">
                View all logs: <a href="https://resend.com/logs" style="color: #FF2D20;">resend.com/logs</a>
              </p>
            </div>
          `,
        }),
      });
    } catch (notifyError) {
      console.error('❌ Failed to send notification:', notifyError);
    }

    return Response.json({
      success: true,
      position,
      message: 'Check your email for confirmation!',
    });

  } catch (err) {
    console.error('❌ Waitlist API error:', err);
    return Response.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    count: counter,
    signups: waitlistEmails.size,
  });
}