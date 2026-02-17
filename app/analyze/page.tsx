// 'use client';

// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import Link from 'next/link';
// import ShadowBoardResult from '@/components/ShadowBoardResult';

// type Stage = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

// interface ShadowBoard {
//   realityCheck: string;
//   shadowPatterns: string[];
//   theGap: string;
//   brutalTruth: string;
//   topSites: { domain: string; visits: number; category: string }[];
// }

// export default function AnalyzePage() {
//   const [stage, setStage] = useState<Stage>('idle');
//   const [result, setResult] = useState<ShadowBoard | null>(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [fileName, setFileName] = useState('');

//   const processFile = async (file: File) => {
//     setFileName(file.name);
//     setStage('uploading');

//     try {
//       const text = await file.text();
//       let parsed: any;

//       try {
//         parsed = JSON.parse(text);
//       } catch {
//         throw new Error('Could not parse file. Make sure it\'s a valid JSON export.');
//       }

//       setStage('analyzing');

//       const response = await fetch('/api/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ historyData: parsed }),
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Analysis failed. Please try again.');
//       }

//       const data = await response.json();
//       setResult(data);
//       setStage('done');

//     } catch (err: any) {
//       setErrorMsg(err.message || 'Something went wrong.');
//       setStage('error');
//     }
//   };

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       processFile(acceptedFiles[0]);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'application/json': ['.json'] },
//     maxSize: 50 * 1024 * 1024,
//     maxFiles: 1,
//     disabled: stage !== 'idle' && stage !== 'error',
//   });

//   const reset = () => {
//     setStage('idle');
//     setResult(null);
//     setErrorMsg('');
//     setFileName('');
//   };

//   return (
//     <main style={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>

//       {/* Top red line */}
//       <div style={{ height: '2px', backgroundColor: '#FF2D20' }} />

//       {/* Nav */}
//       <nav style={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '20px 24px', borderBottom: '1px solid #1A1A1A',
//       }}>
//         <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
//           <div style={{ width: '8px', height: '8px', backgroundColor: '#FF2D20', borderRadius: '50%' }} />
//           <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.3em', color: '#F5F0E8' }}>SHADOWBOARD</span>
//           <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', border: '1px solid #2A2A2A', padding: '2px 6px' }}>AI</span>
//         </Link>
//         <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#444' }}>
//           ← <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Back to home</Link>
//         </span>
//       </nav>

//       <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>

//         {/* ── IDLE: Show upload UI ── */}
//         {(stage === 'idle' || stage === 'error') && (
//           <>
//             {/* Header */}
//             <div style={{ marginBottom: '48px' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
//                 <div style={{ height: '1px', width: '32px', backgroundColor: '#FF2D20' }} />
//                 <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
//                   Step 1 of 2
//                 </span>
//               </div>
//               <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#F5F0E8', lineHeight: 0.95, marginBottom: '16px' }}>
//                 UPLOAD YOUR<br />
//                 <span style={{ color: '#FF2D20' }}>BROWSER HISTORY</span>
//               </h1>
//               <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#888', lineHeight: 1.8 }}>
//                 Your data is analyzed instantly and never stored. Zero retention.
//               </p>
//             </div>

//             {/* How to export guide */}
//             <div style={{ border: '1px solid #1A1A1A', padding: '24px', marginBottom: '32px', backgroundColor: '#0D0D0D' }}>
//               <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
//                 How to export your history
//               </p>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 {[
//                   { browser: 'Chrome', steps: 'Settings → Privacy and security → Delete browsing data → Export data (JSON)' },
//                   { browser: 'Firefox', steps: 'about:config → then use History Export Add-on or copy from profile folder' },
//                   { browser: 'Edge', steps: 'Settings → Privacy → Export browsing data → Browsing history' },
//                 ].map((item) => (
//                   <div key={item.browser} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
//                     <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#FF2D20', flexShrink: 0, minWidth: '60px' }}>
//                       {item.browser}
//                     </span>
//                     <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#444', lineHeight: 1.6 }}>
//                       {item.steps}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Error message */}
//             {stage === 'error' && (
//               <div style={{ border: '1px solid #FF2D20', padding: '16px', marginBottom: '24px', backgroundColor: 'rgba(255,45,32,0.05)' }}>
//                 <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#FF2D20' }}>
//                   ⚠ {errorMsg}
//                 </p>
//               </div>
//             )}

//             {/* Dropzone */}
//             <div
//               {...getRootProps()}
//               style={{
//                 border: `2px dashed ${isDragActive ? '#FF2D20' : '#2A2A2A'}`,
//                 backgroundColor: isDragActive ? 'rgba(255,45,32,0.05)' : '#0D0D0D',
//                 padding: '60px 24px',
//                 textAlign: 'center',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 marginBottom: '24px',
//               }}
//             >
//               <input {...getInputProps()} />
//               <div style={{ marginBottom: '16px', fontSize: '2rem' }}>
//                 {isDragActive ? '📂' : '📁'}
//               </div>
//               <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: isDragActive ? '#FF2D20' : '#F5F0E8', letterSpacing: '0.1em', marginBottom: '8px' }}>
//                 {isDragActive ? 'DROP IT HERE' : 'DRAG & DROP YOUR FILE'}
//               </p>
//               <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#444' }}>
//                 or click to browse · JSON only · max 50MB
//               </p>
//             </div>

//             {/* Privacy note */}
//             <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', textAlign: 'center', lineHeight: 1.8 }}>
//               🔒 Your browsing data is processed in memory only. Never logged, never stored.<br />
//               We use Anthropic Claude API with zero data retention.
//             </p>
//           </>
//         )}

//         {/* ── LOADING STATES ── */}
//         {(stage === 'uploading' || stage === 'analyzing') && (
//           <div style={{ textAlign: 'center', padding: '80px 24px' }}>
//             <div style={{ marginBottom: '32px' }}>
//               {/* Animated bars */}
//               <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '6px', height: '48px', marginBottom: '32px' }}>
//                 {[1,2,3,4,5,6,7].map((i) => (
//                   <div key={i} style={{
//                     width: '6px',
//                     backgroundColor: '#FF2D20',
//                     borderRadius: '2px',
//                     animation: `barPulse 1s ease-in-out ${i * 0.1}s infinite alternate`,
//                     height: `${20 + Math.random() * 28}px`,
//                   }} />
//                 ))}
//               </div>

//               <style>{`
//                 @keyframes barPulse {
//                   from { transform: scaleY(0.3); opacity: 0.4; }
//                   to   { transform: scaleY(1);   opacity: 1; }
//                 }
//               `}</style>

//               <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#F5F0E8', letterSpacing: '0.1em', marginBottom: '8px' }}>
//                 {stage === 'uploading' ? 'READING FILE...' : 'ANALYZING PATTERNS...'}
//               </p>
//               <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888' }}>
//                 {stage === 'uploading'
//                   ? `Parsing ${fileName}`
//                   : 'AI is revealing what you\'re actually manifesting'
//                 }
//               </p>
//             </div>

//             {/* Progress steps */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
//               {[
//                 { label: 'File received', done: true },
//                 { label: 'Parsing history data', done: stage === 'analyzing' },
//                 { label: 'Identifying patterns', done: stage === 'analyzing' },
//                 { label: 'Generating brutal truth', done: false },
//               ].map((step, i) => (
//                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <div style={{
//                     width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
//                     backgroundColor: step.done ? '#FF2D20' : '#1A1A1A',
//                     border: step.done ? 'none' : '1px solid #2A2A2A',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   }}>
//                     {step.done && <span style={{ color: '#000', fontSize: '10px' }}>✓</span>}
//                   </div>
//                   <span style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: '11px',
//                     color: step.done ? '#F5F0E8' : '#444',
//                   }}>{step.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── RESULTS ── */}
//         {stage === 'done' && result && (
//           <ShadowBoardResult result={result} onReset={reset} />
//         )}

//       </div>
//     </main>
//   );
// }





'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(247); // starting count

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Check your email for your waitlist position!');
        setEmail('');
        setCount(prev => prev + 1);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to join');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
      
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Top red line */}
      <div style={{ height: '2px', backgroundColor: '#FF2D20' }} />

      {/* Nav */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', borderBottom: '1px solid #1A1A1A',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#FF2D20', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.3em', color: '#F5F0E8' }}>
            SHADOWBOARD
          </span>
          <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', border: '1px solid #2A2A2A', padding: '2px 6px' }}>AI</span>
        </Link>
        <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#444' }}>
          <span style={{ color: '#FF2D20' }}>{count}</span> joined
        </div>
      </nav>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.6s ease forwards; }
      `}</style>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>
        
        {/* Launch badge */}
        <div className="slide-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', border: '1px solid #FF2D20', padding: '8px 20px', backgroundColor: 'rgba(255,45,32,0.05)' }}>
          <div style={{ width: '6px', height: '6px', backgroundColor: '#FF2D20', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
            Launching in 48 Hours
          </span>
        </div>

        {/* Headline */}
        <h1 className="slide-up" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(2.8rem, 9vw, 6rem)',
          lineHeight: 0.92,
          color: '#F5F0E8',
          marginBottom: '20px',
          animationDelay: '0.1s',
        }}>
          BE FIRST TO GET<br />
          YOUR <span style={{ color: '#FF2D20' }}>BRUTAL TRUTH</span>
        </h1>

        <p className="slide-up" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '15px',
          color: '#888',
          lineHeight: 1.8,
          marginBottom: '40px',
          animationDelay: '0.2s',
        }}>
          Your browser history reveals what you're <span style={{ color: '#F5F0E8', fontWeight: 'bold' }}>actually</span> manifesting.
          Not what you wish. Not what you claim. What you <span style={{ color: '#F5F0E8', fontWeight: 'bold' }}>do</span>.
        </p>

        {/* Waitlist form */}
        <div className="slide-up" style={{ marginBottom: '48px', animationDelay: '0.3s' }}>
          {status !== 'success' ? (
            <>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={status === 'submitting'}
                    required
                    style={{
                      flex: 1,
                      minWidth: '240px',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      padding: '16px 18px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #2A2A2A',
                      color: '#F5F0E8',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF2D20'}
                    onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      fontWeight: 'bold',
                      padding: '16px 32px',
                      backgroundColor: status === 'submitting' ? '#555' : '#FF2D20',
                      color: '#000',
                      border: 'none',
                      cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { if (status === 'idle') e.currentTarget.style.backgroundColor = '#CC2419'; }}
                    onMouseLeave={(e) => { if (status === 'idle') e.currentTarget.style.backgroundColor = '#FF2D20'; }}
                  >
                    {status === 'submitting' ? 'JOINING...' : 'GET EARLY ACCESS →'}
                  </button>
                </div>
                
                {status === 'error' && (
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#FF2D20', marginTop: '8px' }}>
                    ⚠ {message}
                  </p>
                )}
              </form>

              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#444', marginTop: '12px' }}>
                🔒 No spam ever. Launching in 48 hours. First 100 get special perks.
              </p>
            </>
          ) : (
            <div style={{
              border: '2px solid #FF2D20',
              padding: '32px',
              backgroundColor: 'rgba(255,45,32,0.05)',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#FF2D20', marginBottom: '12px', lineHeight: 1 }}>
                YOU'RE IN!
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#F5F0E8', marginBottom: '8px' }}>
                {message}
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#666' }}>
                You're person #{count} on the list.
              </p>
            </div>
          )}
        </div>

        {/* OFFER SECTION */}
        <div className="slide-up" style={{
          border: '2px solid #FF2D20',
          padding: '32px',
          marginBottom: '32px',
          backgroundColor: 'rgba(255,45,32,0.03)',
          animationDelay: '0.4s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ height: '1px', width: '24px', backgroundColor: '#FF2D20' }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#FF2D20', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold' }}>
              First 100 Founders Only
            </span>
          </div>

          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#F5F0E8', lineHeight: 1, marginBottom: '20px' }}>
            FOUNDING MEMBER<br />PERKS
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🎯', text: 'Immediate access when we launch (within 48 hours)', highlight: false },
              { icon: '💎', text: 'Lifetime 70% discount on all premium features', highlight: true },
              { icon: '🔓', text: 'Unlimited shadow board analyses (normally 1 free)', highlight: true },
              { icon: '📊', text: 'Weekly trend tracking + accountability emails', highlight: false },
              { icon: '🎁', text: 'Exclusive: Action plan generator (not available to others)', highlight: true },
              { icon: '🤝', text: 'Direct line to founders + priority feature requests', highlight: false },
            ].map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>{perk.icon}</span>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '13px',
                  color: perk.highlight ? '#F5F0E8' : '#888',
                  fontWeight: perk.highlight ? 'bold' : 'normal',
                  lineHeight: 1.6,
                }}>
                  {perk.text}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            border: '1px solid #2A2A2A',
            backgroundColor: '#0D0D0D',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#FF2D20', lineHeight: 1 }}>
                $0
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#444', textDecoration: 'line-through' }}>
                $29/month
              </span>
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#666' }}>
              Founding members pay <span style={{ color: '#FF2D20', fontWeight: 'bold' }}>$9/month</span> forever. That's 70% off for life.
            </p>
          </div>
        </div>

        {/* Social proof avatars */}
        <div className="slide-up" style={{ marginBottom: '40px', animationDelay: '0.5s' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex' }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: ['#FF2D20', '#1A1A1A', '#FF2D20', '#1A1A1A', '#1A1A1A', '#FF2D20', '#1A1A1A', '#1A1A1A'][i],
                    border: '3px solid #0A0A0A',
                    marginLeft: i > 0 ? '-10px' : '0',
                    zIndex: 8 - i,
                  }}
                />
              ))}
            </div>
          </div>
          <p style={{ textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#666' }}>
            <span style={{ color: '#FF2D20', fontWeight: 'bold' }}>{count}</span> forward-thinkers already joined
          </p>
        </div>

        {/* What happens next */}
        <div className="slide-up" style={{ border: '1px solid #1A1A1A', padding: '28px', animationDelay: '0.6s' }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
            What Happens Next:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { time: 'Now', action: 'You join the waitlist' },
              { time: '24h', action: 'We send you behind-the-scenes updates + your waitlist position' },
              { time: '48h', action: 'We launch. You get instant email with access link' },
              { time: '48h', action: 'You upload browser history → get your brutal truth in 60 seconds' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '40px',
                  height: '40px',
                  border: '1px solid #2A2A2A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#666',
                  backgroundColor: '#0D0D0D',
                }}>
                  {step.time}
                </div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888', paddingTop: '10px', lineHeight: 1.6 }}>
                  {step.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ-style urgency */}
        <div className="slide-up" style={{ marginTop: '40px', animationDelay: '0.7s' }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#444', textAlign: 'center', lineHeight: 1.8 }}>
            Only <span style={{ color: '#FF2D20', fontWeight: 'bold' }}>first 100 people</span> get founding member perks.<br />
            After that, it's regular pricing. No exceptions.
          </p>
        </div>
      </div>
    </main>
  );
}