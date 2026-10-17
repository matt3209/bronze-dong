import { useEffect, useRef, useState } from 'react'
import { decryptArchive } from './archiveCrypto'
import './HiddenArchive.css'

const formatDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${value}T12:00:00Z`))

function SourceLinks({ ids, sources }) {
  return <div className="archive-source-links">{ids.map((id) => {
    const source = sources.find((entry) => entry.id === id)
    return source && (source.url
      ? <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
      : <span className="archive-source-label" key={id}>{source.title}</span>)
  })}</div>
}

function ArchiveContent({ archive, onLock }) {
  const titleRef = useRef(null)
  useEffect(() => { titleRef.current?.focus() }, [])

  return (
    <article className="archive-page">
      <div className="archive-toolbar">
        <span className="archive-updated">Updated {formatDate(archive.updatedAt)}</span>
        <button className="archive-lock-button" type="button" onClick={onLock}>Lock archive</button>
      </div>
      <header className="archive-header">
        <h1 className="archive-title" tabIndex={-1} ref={titleRef}>{archive.title}</h1>
        <p className="archive-subtitle">{archive.subtitle}</p>
        <p className="archive-summary">The NSDA points history is incomplete.</p>
      </header>
      <section className="archive-section" aria-labelledby="archive-results">
        <h2 className="archive-section-heading" id="archive-results">Tournament results</h2>
        <div className="archive-timeline">{archive.records.map((record) => (
          <section className="archive-event" key={record.id}>
            <div className="archive-event__date">{record.date}</div>
            <div className="archive-event__body">
              <h3>{record.title}</h3>
              {record.division && <p className="archive-event__meta">{record.division}</p>}
              {record.partners.length > 0 && <p>{record.partners.length === 1 ? 'Partner' : 'Partners'}: <strong>{record.partners.join(' & ')}</strong></p>}
              <p className="archive-event__result">{record.result}</p>
              <SourceLinks ids={record.sourceIds} sources={archive.sources} />
            </div>
          </section>
        ))}</div>
      </section>
    </article>
  )
}

export default function HiddenArchive() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [archive, setArchive] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef(0)
  const passwordRef = useRef(null)

  useEffect(() => () => { requestRef.current += 1 }, [])
  useEffect(() => { if (!archive) passwordRef.current?.focus() }, [archive])
  useEffect(() => { if (error && !busy) passwordRef.current?.focus() }, [error, busy])

  const lock = () => {
    requestRef.current += 1
    setArchive(null)
    setPassword('')
    setShowPassword(false)
    setError('')
    setBusy(false)
  }

  const unlock = async (event) => {
    event.preventDefault()
    const request = ++requestRef.current
    setBusy(true)
    setError('')
    if (!globalThis.crypto?.subtle) {
      setError('Open this page over HTTPS to unlock the archive.')
      setBusy(false)
      return
    }
    let envelope
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}hidden-archive.json`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Archive unavailable')
      envelope = await response.json()
    } catch {
      if (request !== requestRef.current) return
      setError('The archive could not be loaded. Please try again.')
      setBusy(false)
      return
    }
    try {
      const content = await decryptArchive(envelope, password)
      if (request !== requestRef.current) return
      setArchive(content)
      setPassword('')
      setShowPassword(false)
      window.scrollTo(0, 0)
    } catch {
      if (request !== requestRef.current) return
      setError('That password didn’t unlock the archive. Try again.')
    } finally {
      if (request === requestRef.current) setBusy(false)
    }
  }

  if (archive) return <ArchiveContent archive={archive} onLock={lock} />

  return (
    <section className="hidden-gate" aria-labelledby="hidden-title">
      <div className="hidden-gate__panel">
        <svg className="hidden-gate__mark" viewBox="0 0 48 56" fill="none" aria-hidden="true">
          <path d="M13 24v-8a11 11 0 0 1 22 0v8M8 24h32v27H8z" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="36" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M24 39v5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <h1 id="hidden-title" className="hidden-gate__title">Hidden</h1>
        <form className="hidden-gate__form" onSubmit={unlock}>
          <label className="hidden-gate__label" htmlFor="archive-password">Password</label>
          <div className="hidden-gate__input-row">
            <input className="hidden-gate__input" id="archive-password" ref={passwordRef}
              type={showPassword ? 'text' : 'password'} value={password}
              onChange={(event) => setPassword(event.target.value)} autoComplete="current-password"
              required disabled={busy} aria-invalid={Boolean(error)} aria-describedby={error ? 'archive-error' : undefined} />
            <button className="hidden-gate__reveal" type="button" disabled={busy}
              aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          <button className="hidden-gate__submit" type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Unlocking…' : 'Unlock'}</button>
          {error && <p className="hidden-gate__error" id="archive-error" role="alert">{error}</p>}
        </form>
      </div>
    </section>
  )
}
