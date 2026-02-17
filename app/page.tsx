'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const BRUTAL_TRUTHS = [
  '"You\'re manifesting research paralysis, not execution."',
  '"47 hours on Twitter. 2 hours on your business. Do the math."',
  '"You\'re collecting motivation like Pokémon cards."',
  '"You know enough. You\'re avoiding the work."',
  '"Your search history is a graveyard of unfinished ideas."',
];

export default function Home() {
  const [count, setCount] = useState(2847);
  const [truthIndex, setTruthIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const truth = BRUTAL_TRUTHS[truthIndex];
    let i = 0;
    setDisplayText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (i < truth.length) {
        setDisplayText(truth.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
        setTimeout(() => {
          setTruthIndex(prev => (prev + 1) % BRUTAL_TRUTHS.length);
        }, 3000);
      }
    }, 35);

    return () => clearInterval(typeInterval);
  }, [truthIndex]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Top red line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: '#FF2D20' }} />

      {/* NAV */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid #1A1A1A',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#FF2D20', borderRadius: '50%' }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.3em', color: '#F5F0E8' }}>
            SHADOWBOARD
          </span>
          <span style={{
            fontSize: '10px', fontFamily: "'Space Mono', monospace",
            color: '#888', border: '1px solid #2A2A2A',
            padding: '2px 6px', marginLeft: '4px',
          }}>AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#888' }}>
            <span style={{ color: '#FF2D20' }}>{count.toLocaleString()}</span> boards generated
          </span>
          <Link href="/analyze" style={{
            fontSize: '11px', fontFamily: "'Space Mono', monospace",
            border: '1px solid #FF2D20', color: '#FF2D20',
            padding: '6px 12px', textDecoration: 'none',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.backgroundColor = '#FF2D20';
              (e.target as HTMLElement).style.color = '#000';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
              (e.target as HTMLElement).style.color = '#FF2D20';
            }}
          >
            GET YOURS →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px 64px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Tag line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }} className="animate-fade-up">
          <div style={{ height: '1px', width: '32px', backgroundColor: '#FF2D20' }} />
          <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            AI-Powered Reality Check
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(3.5rem, 12vw, 9rem)',
          lineHeight: 0.9,
          color: '#F5F0E8',
          marginBottom: '24px',
        }}>
          <span style={{ display: 'block' }} className="animate-fade-up">YOUR</span>
          <span style={{ display: 'block', color: '#FF2D20', animationDelay: '0.15s' }} className="animate-fade-up">VISION BOARD</span>
          <span style={{ display: 'block', animationDelay: '0.2s' }} className="animate-fade-up">IS LYING</span>
          <span style={{ display: 'block', animationDelay: '0.25s' }} className="animate-fade-up">TO YOU.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          color: '#888', fontFamily: "'Space Mono', monospace",
          fontSize: '14px', maxWidth: '480px', lineHeight: 1.8,
          marginBottom: '40px',
        }} className="animate-fade-up">
          Your browser history is an objective record of your real priorities.
          Not what you claim. Not what you wish.{' '}
          <span style={{ color: '#F5F0E8' }}>What you actually do.</span>
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px', flexWrap: 'wrap' }} className="animate-fade-up">
          <Link href="/analyze" style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            backgroundColor: '#FF2D20', color: '#000',
            fontFamily: "'Space Mono', monospace", fontWeight: 'bold',
            padding: '16px 24px', fontSize: '14px',
            textDecoration: 'none',
            transition: 'background-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#CC2419')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF2D20')}
          >
            GET MY SHADOW BOARD →
          </Link>
          <span style={{ fontSize: '11px', color: '#888', fontFamily: "'Space Mono', monospace" }}>
            Free · 60 seconds · No account
          </span>
        </div>

        {/* Typewriter */}
        <div style={{ borderLeft: '2px solid #FF2D20', paddingLeft: '16px', maxWidth: '600px' }} className="animate-fade-up">
          <p style={{ fontSize: '11px', color: '#888', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>
            Real shadow board result:
          </p>
          <p style={{ fontSize: '14px', fontFamily: "'Space Mono', monospace", color: '#F5F0E8', minHeight: '24px' }}>
            {displayText}
            {isTyping && <span className="animate-blink" style={{ color: '#FF2D20' }}>_</span>}
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { value: count.toLocaleString(), label: 'Boards Generated' },
            { value: '<60s', label: 'Time to Insight' },
            { value: '100%', label: 'Objective Truth' },
            { value: '$0', label: 'Cost to Start' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#FF2D20' }}>{stat.value}</p>
              <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ height: '1px', width: '32px', backgroundColor: '#FF2D20' }} />
          <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            How It Works
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', backgroundColor: '#1A1A1A' }}>
          {[
            { step: '01', title: 'EXPORT', desc: 'Export your browser history as JSON. Takes 30 seconds in Chrome or Firefox.', detail: 'Chrome → Settings → Privacy → Export Data' },
            { step: '02', title: 'UPLOAD', desc: 'Drag and drop your file. Data stays on your device until you choose to analyze.', detail: 'Zero retention. We analyze and discard.' },
            { step: '03', title: 'CONFRONT', desc: 'AI reveals what your behavior actually manifests vs what you claim to want.', detail: 'Brutal truth. Actionable insight.' },
          ].map((item) => (
            <div key={item.step} style={{ backgroundColor: '#0A0A0A', padding: '32px', transition: 'background-color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#111')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0A0A0A')}
            >
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', color: '#1A1A1A', marginBottom: '16px', transition: 'color 0.3s' }}>{item.step}</p>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: '#F5F0E8', marginBottom: '12px', letterSpacing: '0.05em' }}>{item.title}</h3>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888', lineHeight: 1.7, marginBottom: '16px' }}>{item.desc}</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#444', borderTop: '1px solid #1A1A1A', paddingTop: '16px' }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE SHADOW BOARD */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ height: '1px', width: '32px', backgroundColor: '#FF2D20' }} />
          <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sample Shadow Board</span>
        </div>

        <div style={{ border: '1px solid #1A1A1A', padding: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sample Output</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Reality Check</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#F5F0E8', lineHeight: 1.8 }}>
                You spent 42 hours consuming content about startups and 2.5 hours actually building. Your behavior reveals you are manifesting the identity of a founder without the work of one.
              </p>
            </div>

            <div>
              <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Shadow Patterns</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Peak Twitter activity during work hours — escaping execution', 'Searched "how to validate startup ideas" 23 times, validated zero', '14 hours of productivity content consumed. Zero systems implemented.'].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: '#FF2D20', fontFamily: "'Space Mono', monospace", fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>→</span>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888', lineHeight: 1.6 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>The Gap</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888', fontStyle: 'italic', lineHeight: 1.7 }}>
                No customer conversations. No product commits. No revenue experiments. You're researching success instead of creating it.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #FF2D20', paddingLeft: '16px' }}>
              <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Brutal Truth</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#F5F0E8', lineHeight: 1.1 }}>
                You know enough. You're avoiding execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 8vw, 6rem)', color: '#F5F0E8', lineHeight: 0.9, marginBottom: '24px' }}>
          READY FOR<br />
          <span style={{ color: '#FF2D20' }}>YOUR TRUTH?</span>
        </h2>
        <p style={{ color: '#888', fontFamily: "'Space Mono', monospace", fontSize: '13px', marginBottom: '40px', maxWidth: '360px', margin: '0 auto 40px' }}>
          Free. 60 seconds. No account. Just the data your behavior has been hiding from you.
        </p>
        <Link href="/analyze" style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          backgroundColor: '#FF2D20', color: '#000',
          fontFamily: "'Space Mono', monospace", fontWeight: 'bold',
          padding: '20px 32px', fontSize: '14px',
          textDecoration: 'none',
        }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#CC2419')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF2D20')}
        >
          GET MY SHADOW BOARD FREE →
        </Link>
        <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#444', marginTop: '24px' }}>
          🔒 Your browsing data is never stored. Analyzed and discarded instantly.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1A1A1A', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#FF2D20', borderRadius: '50%' }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.2em', color: '#888' }}>SHADOWBOARD AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/privacy" style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#444', textDecoration: 'none' }}>Privacy Policy</Link>
            <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#444' }}>Built in public · @hifzazafar</span>
          </div>
        </div>
      </footer>

      {/* Bottom red line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#FF2D20', opacity: 0.3 }} />

    </main>
  );
}