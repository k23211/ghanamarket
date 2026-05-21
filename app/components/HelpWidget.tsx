'use client';

import { useState } from 'react';

const SUGGESTIONS = [
  { label: 'Report an issue', value: 'I found a bug or problem on Vendoxa.' },
  { label: 'Ask about selling', value: 'I want to know how to sell on Vendoxa.' },
  { label: 'Ask about buying', value: 'I need help finding a product to buy.' },
  { label: 'Contact support', value: 'I need assistance with my account or payment.' },
];

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const subject = encodeURIComponent('Vendoxa Help Request');
  const body = encodeURIComponent(
    `${suggestion ? `AI assistance prompt: ${suggestion}\n\n` : ''}${message}`
  );
  const mailto = `mailto:ghanamarketplacegh@gmail.com?subject=${subject}&body=${body}`;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div style={{
          width: 320,
          background: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 22,
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          color: '#fff',
          padding: 16,
          marginBottom: 12,
          fontFamily: "'Segoe UI', sans-serif",
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Vendoxa Help</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>AI assistance and fast contact support</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' }}
              aria-label="Close help"
            >
              ×
            </button>
          </div>

          <div style={{ fontSize: 12, color: '#bbb', marginBottom: 12, lineHeight: 1.5 }}>
            Choose a suggestion, type your question, then send the message through your email client.
          </div>

          <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            {SUGGESTIONS.map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSuggestion(item.value)}
                style={{
                  background: suggestion === item.value ? '#f5a623' : '#1a1a1a',
                  color: suggestion === item.value ? '#111' : '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '10px 12px',
                  textAlign: 'left',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            style={{
              width: '100%',
              minHeight: 100,
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: 12,
              color: '#fff',
              fontSize: 13,
              resize: 'vertical',
              marginBottom: 12,
            }}
          />

          <a
            href={mailto}
            onClick={() => setOpen(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              background: 'linear-gradient(135deg, #f5a623, #ffc95e)',
              color: '#111',
              fontSize: 13,
              fontWeight: 700,
              padding: '12px 16px',
              borderRadius: 16,
              textDecoration: 'none',
            }}
          >
            Send message to Vendoxa
          </a>

          <div style={{ marginTop: 12, fontSize: 11, color: '#777', lineHeight: 1.4 }}>
            Your report will be sent to <strong>ghanamarketplacegh@gmail.com</strong>.
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          background: '#f5a623',
          color: '#111',
          fontSize: 24,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 20px 40px rgba(0,0,0,0.24)',
        }}
        aria-label="Open help"
      >
        ?
      </button>
    </div>
  );
}
