'use client'
import React from 'react'

type Props = {
  url: string
  title?: string
  text?: string
}

export default function ShareButton({ url, title, text }: Props) {
  const handleShare = async () => {
    const shareData = { title: title || '', text: text || '', url }
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share(shareData)
        return
      } catch (err) {
        // ignore and fallback
      }
    }

    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(text || title || '')
    const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
    window.open(twitter, '_blank', 'noopener')
  }

  return (
    <button className="share-button" onClick={handleShare} aria-label="Share product">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ marginLeft: 8 }}>Share</span>
    </button>
  )
}
