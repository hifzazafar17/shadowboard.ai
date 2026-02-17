'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import ShadowBoardResult from '@/components/ShadowBoardResult';

type Stage = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

interface ShadowBoard {
  realityCheck: string;
  shadowPatterns: string[];
  theGap: string;
  brutalTruth: string;
  topSites: { domain: string; visits: number; category: string }[];
}

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [result, setResult] = useState<ShadowBoard | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = async (file: File) => {
    setFileName(file.name);
    setStage('uploading');

    try {
      const text = await file.text();
      let parsed: any;

      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error('Could not parse file. Make sure it\'s a valid JSON export.');
      }

      setStage('analyzing');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyData: parsed }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResult(data);
      setStage('done');

    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
      setStage('error');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
    disabled: stage !== 'idle' && stage !== 'error',
  });

  const reset = () => {
    setStage('idle');
    setResult(null);
    setErrorMsg('');
    setFileName('');
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>

      {/* Top red line */}
      <div style={{ height: '2px', backgroundColor: '#FF2D20' }} />

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', borderBottom: '1px solid #1A1A1A',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#FF2D20', borderRadius: '50%' }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.3em', color: '#F5F0E8' }}>SHADOWBOARD</span>
          <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#888', border: '1px solid #2A2A2A', padding: '2px 6px' }}>AI</span>
        </Link>
        <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#444' }}>
          ← <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Back to home</Link>
        </span>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>

        {/* ── IDLE: Show upload UI ── */}
        {(stage === 'idle' || stage === 'error') && (
          <>
            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ height: '1px', width: '32px', backgroundColor: '#FF2D20' }} />
                <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Step 1 of 2
                </span>
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#F5F0E8', lineHeight: 0.95, marginBottom: '16px' }}>
                UPLOAD YOUR<br />
                <span style={{ color: '#FF2D20' }}>BROWSER HISTORY</span>
              </h1>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#888', lineHeight: 1.8 }}>
                Your data is analyzed instantly and never stored. Zero retention.
              </p>
            </div>

            {/* How to export guide */}
            <div style={{ border: '1px solid #1A1A1A', padding: '24px', marginBottom: '32px', backgroundColor: '#0D0D0D' }}>
              <p style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#FF2D20', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
                How to export your history
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { browser: 'Chrome', steps: 'Settings → Privacy and security → Delete browsing data → Export data (JSON)' },
                  { browser: 'Firefox', steps: 'about:config → then use History Export Add-on or copy from profile folder' },
                  { browser: 'Edge', steps: 'Settings → Privacy → Export browsing data → Browsing history' },
                ].map((item) => (
                  <div key={item.browser} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#FF2D20', flexShrink: 0, minWidth: '60px' }}>
                      {item.browser}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#444', lineHeight: 1.6 }}>
                      {item.steps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {stage === 'error' && (
              <div style={{ border: '1px solid #FF2D20', padding: '16px', marginBottom: '24px', backgroundColor: 'rgba(255,45,32,0.05)' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#FF2D20' }}>
                  ⚠ {errorMsg}
                </p>
              </div>
            )}

            {/* Dropzone */}
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#FF2D20' : '#2A2A2A'}`,
                backgroundColor: isDragActive ? 'rgba(255,45,32,0.05)' : '#0D0D0D',
                padding: '60px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '24px',
              }}
            >
              <input {...getInputProps()} />
              <div style={{ marginBottom: '16px', fontSize: '2rem' }}>
                {isDragActive ? '📂' : '📁'}
              </div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: isDragActive ? '#FF2D20' : '#F5F0E8', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {isDragActive ? 'DROP IT HERE' : 'DRAG & DROP YOUR FILE'}
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#444' }}>
                or click to browse · JSON only · max 50MB
              </p>
            </div>

            {/* Privacy note */}
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', textAlign: 'center', lineHeight: 1.8 }}>
              🔒 Your browsing data is processed in memory only. Never logged, never stored.<br />
              We use Anthropic Claude API with zero data retention.
            </p>
          </>
        )}

        {/* ── LOADING STATES ── */}
        {(stage === 'uploading' || stage === 'analyzing') && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
              {/* Animated bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '6px', height: '48px', marginBottom: '32px' }}>
                {[1,2,3,4,5,6,7].map((i) => (
                  <div key={i} style={{
                    width: '6px',
                    backgroundColor: '#FF2D20',
                    borderRadius: '2px',
                    animation: `barPulse 1s ease-in-out ${i * 0.1}s infinite alternate`,
                    height: `${20 + Math.random() * 28}px`,
                  }} />
                ))}
              </div>

              <style>{`
                @keyframes barPulse {
                  from { transform: scaleY(0.3); opacity: 0.4; }
                  to   { transform: scaleY(1);   opacity: 1; }
                }
              `}</style>

              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#F5F0E8', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {stage === 'uploading' ? 'READING FILE...' : 'ANALYZING PATTERNS...'}
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888' }}>
                {stage === 'uploading'
                  ? `Parsing ${fileName}`
                  : 'AI is revealing what you\'re actually manifesting'
                }
              </p>
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
              {[
                { label: 'File received', done: true },
                { label: 'Parsing history data', done: stage === 'analyzing' },
                { label: 'Identifying patterns', done: stage === 'analyzing' },
                { label: 'Generating brutal truth', done: false },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: step.done ? '#FF2D20' : '#1A1A1A',
                    border: step.done ? 'none' : '1px solid #2A2A2A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.done && <span style={{ color: '#000', fontSize: '10px' }}>✓</span>}
                  </div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '11px',
                    color: step.done ? '#F5F0E8' : '#444',
                  }}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {stage === 'done' && result && (
          <ShadowBoardResult result={result} onReset={reset} />
        )}

      </div>
    </main>
  );
}