import { useEffect, useRef, useState } from 'react'

export default function SiteNavigation({ page, onNavigate }) {
  const [open, setOpen] = useState(false)
  const navigationRef = useRef(null)
  const buttonRef = useRef(null)
  const selectPage = (destination, event) => {
    if (!onNavigate(destination, event)) return
    setOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const dismissOutside = (event) => {
      if (!navigationRef.current?.contains(event.target)) setOpen(false)
    }
    const dismissOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('keydown', dismissOnEscape)
    document.addEventListener('focusin', dismissOutside)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('keydown', dismissOnEscape)
      document.removeEventListener('focusin', dismissOutside)
    }
  }, [open])

  return (
    <header className="site-header" ref={navigationRef}>
      <a className="site-wordmark" href="#" onClick={(event) => {
        if (onNavigate('home', event)) setOpen(false)
      }}>
        Bronze<span>dongs</span><span className="wordmark-domain">.com</span>
      </a>
      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        <span className="menu-label">Menu</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>
      <nav id="site-menu" className="site-menu" aria-label="Main navigation" hidden={!open}>
        <p className="menu-overline">The Order’s Archives</p>
        <a href="#" aria-current={page === 'home' ? 'page' : undefined} onClick={(event) => selectPage('home', event)}>
          <span>Home</span><span className="menu-note">The Custodian</span>
        </a>
        <a href="#maniwaters" aria-current={page === 'maniwaters' ? 'page' : undefined} onClick={(event) => selectPage('maniwaters', event)}>
          <span>Mani Waters</span><span className="menu-note">MMXXVI</span>
        </a>
        <a href="#mattmurphy" aria-current={page === 'mattmurphy' ? 'page' : undefined} onClick={(event) => selectPage('mattmurphy', event)}>
          <span>MattMurphy</span><span className="menu-note">The Buffalo File</span>
        </a>
        <a href="#hidden" aria-current={page === 'hidden' ? 'page' : undefined} onClick={(event) => selectPage('hidden', event)}>
          <span>Hidden</span>
        </a>
      </nav>
    </header>
  )
}
