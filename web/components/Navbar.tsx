'use client'
import React from 'react'

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 4V2M12 22v-2M4.22 4.22L2.81 2.81M21.19 21.19l-1.41-1.41M4 12H2M22 12h-2M4.22 19.78l-1.41 1.41M21.19 2.81l-1.41 1.41" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="var(--text)" strokeWidth="1.5"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">Agriquex</div>
    </header>
  )
}
