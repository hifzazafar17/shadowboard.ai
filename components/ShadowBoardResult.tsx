'use client';

import { useState } from 'react';

interface ShadowBoard {
  realityCheck: string;
  shadowPatterns: string[];
  theGap: string;
  brutalTruth: string;
  topSites: { domain: string; visits: number; category: string }[];
}

export default function ShadowBoardResult({
  result,
  onReset,
}: {
  result: ShadowBoard;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyTruth = () => {
    navigator.clipboard.writeText(
      `My Shadow Board AI brutal truth:\n\n"${result.brutalTruth}"\n\nshadowboard.vercel.app`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `My Shadow Board AI just revealed my brutal truth:\n\n"${result.brutalTruth}"\n\nGet yours free 👇`
    );
    const url = encodeURIComponent('https://shadowboard.vercel.app');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ height: '1px', width: '32px', backgroundColor: '#FF2D20' }} />
          <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Your Shadow Board
          </span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#F5F0E8', lineHeight: 0.95, marginBottom: '12px' }}>
          HERE'S YOUR<br />
          <span style={{ color: '#FF2D20' }}>BRUTAL TRUTH</span>
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#444' }}>
          Based on your actual behavior. No filter.
        </p>
      </div>

      {/* Result card */}
      <div style={{ border: '1px solid #1A1A1A', marginBottom: '32px' }}>

        {/* Reality Check */}
        <div style={{ padding: '28px', borderBottom: '1px solid #1A1A1A' }}>
          <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
            01 / Reality Check
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#F5F0E8', lineHeight: 1.8 }}>
            {result.realityCheck}
          </p>
        </div>

        {/* Shadow Patterns */}
        <div style={{ padding: '28px', borderBottom: '1px solid #1A1A1A' }}>
          <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
            02 / Shadow Patterns
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.shadowPatterns.map((pattern, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#FF2D20', fontFamily: "'Space Mono', monospace", fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>→</span>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888', lineHeight: 1.7 }}>{pattern}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Gap */}
        <div style={{ padding: '28px', borderBottom: '1px solid #1A1A1A' }}>
          <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
            03 / The Gap
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888', fontStyle: 'italic', lineHeight: 1.8 }}>
            {result.theGap}
          </p>
        </div>

        {/* Brutal Truth */}
        <div style={{ padding: '28px', borderLeft: '4px solid #FF2D20' }}>
          <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
            04 / Brutal Truth
          </p>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#F5F0E8', lineHeight: 1.05 }}>
            {result.brutalTruth}
          </p>
        </div>
      </div>

      {/* Top sites breakdown */}
      {result.topSites && result.topSites.length > 0 && (
        <div style={{ border: '1px solid #1A1A1A', padding: '24px', marginBottom: '32px' }}>
          <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
            Your Top Sites
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.topSites.slice(0, 8).map((site, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#444', minWidth: '20px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#F5F0E8', flex: 1 }}>
                  {site.domain}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#444' }}>
                  {site.visits} visits
                </span>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: '9px',
                  color: '#FF2D20', border: '1px solid #2A2A2A',
                  padding: '2px 6px', textTransform: 'uppercase',
                }}>
                  {site.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <button
          onClick={shareOnTwitter}
          style={{
            backgroundColor: '#FF2D20', color: '#000',
            fontFamily: "'Space Mono', monospace", fontWeight: 'bold',
            padding: '14px 20px', fontSize: '12px',
            border: 'none', cursor: 'pointer', flex: 1,
          }}
        >
          SHARE ON X/TWITTER →
        </button>
        <button
          onClick={copyTruth}
          style={{
            backgroundColor: 'transparent', color: '#F5F0E8',
            fontFamily: "'Space Mono', monospace",
            padding: '14px 20px', fontSize: '12px',
            border: '1px solid #2A2A2A', cursor: 'pointer', flex: 1,
          }}
        >
          {copied ? '✓ COPIED!' : 'COPY BRUTAL TRUTH'}
        </button>
        <button
          onClick={onReset}
          style={{
            backgroundColor: 'transparent', color: '#444',
            fontFamily: "'Space Mono', monospace",
            padding: '14px 20px', fontSize: '12px',
            border: '1px solid #1A1A1A', cursor: 'pointer',
          }}
        >
          ANALYZE AGAIN
        </button>
      </div>

      {/* Privacy note */}
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', textAlign: 'center', lineHeight: 1.8 }}>
        🔒 Your data was analyzed and immediately discarded. Nothing was stored.
      </p>
    </div>
  );
}