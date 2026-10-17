import { useEffect, useRef, useState } from 'react'
import { decryptArchive } from './archiveCrypto'
import './HiddenArchive.css'

const formatDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${value}T12:00:00Z`))

function SourceLinks({ ids, sources }) {
  return <div className="archive-source-links">{ids.map((id) => {
    const source = sources.find((entry) => entry.id === id)
    return source && <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
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
        <p className="archive-eyebrow">Personal archive · Research in progress</p>
        <h1 className="archive-title" tabIndex={-1} ref={titleRef}>{archive.title}</h1>
        <p className="archive-subtitle">{archive.subtitle}</p>
        <div className="archive-summary">{archive.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </header>
      <nav className="archive-jump-links" aria-label="Archive sections">
        <a href="#career-record" onClick={(event) => { event.preventDefault(); document.getElementById('career-record')?.scrollIntoView() }}>Career record</a>
        <a href="#archive-recollections" onClick={(event) => { event.preventDefault(); document.getElementById('archive-recollections')?.scrollIntoView() }}>Recollections</a>
        <a href="#archive-sources" onClick={(event) => { event.preventDefault(); document.getElementById('archive-sources')?.scrollIntoView() }}>Sources</a>
        <a href="#archive-progress" onClick={(event) => { event.preventDefault(); document.getElementById('archive-progress')?.scrollIntoView() }}>Research progress</a>
      </nav>
      <section className="archive-section" aria-labelledby="archive-highlights-title">
        <h2 className="archive-section-heading" id="archive-highlights-title">Documented highlights</h2>
        <div className="archive-highlights">{archive.highlights.map((highlight) => (
          <div className="archive-highlight" key={highlight.title}>
            <h3>{highlight.title}</h3><p>{highlight.detail}</p>
            <SourceLinks ids={highlight.sourceIds} sources={archive.sources} />
          </div>
        ))}</div>
      </section>
      <section className="archive-section" aria-labelledby="career-record">
        <h2 className="archive-section-heading" id="career-record">Career record</h2>
        <div className="archive-timeline">{archive.events.map((event) => (
          <section className="archive-event" key={event.id}>
            <div className="archive-event__date"><span>{event.season}</span><p>{event.date}</p></div>
            <div className="archive-event__body">
              <h3>{event.title}</h3>
              <p className="archive-event__meta">{event.division} · {event.location}</p>
              <p>Partner: <strong>{event.partners.join(' & ')}</strong></p>
              <p className="archive-event__result">{event.result}</p>
              <p className="archive-event__rounds">{event.rounds}</p>
              <ul className="archive-event__notes">{event.notes.map((note) => <li key={note}>{note}</li>)}</ul>
              <SourceLinks ids={event.sourceIds} sources={archive.sources} />
            </div>
          </section>
        ))}</div>
      </section>
      <section className="archive-section" aria-labelledby="archive-recollections">
        <h2 className="archive-section-heading" id="archive-recollections">Recollections</h2>
        <div className="archive-memory-list">{archive.recollections.map((memory) => (
          <div className="archive-memory" key={memory.title}>
            <span className="archive-status">{memory.status}</span>
            <h3>{memory.title}</h3><p>{memory.detail}</p>
          </div>
        ))}</div>
      </section>
      <section className="archive-section" aria-labelledby="archive-national-title">
        <h2 className="archive-section-heading" id="archive-national-title">National competition</h2>
        <div className="archive-national-list">{archive.national.map((entry) => (
          <div className="archive-national-item" key={entry.title}>
            <h3>{entry.title}</h3><p>{entry.detail}</p>
            <SourceLinks ids={entry.sourceIds} sources={archive.sources} />
          </div>
        ))}</div>
      </section>
      <section className="archive-section" aria-labelledby="archive-sources">
        <h2 className="archive-section-heading" id="archive-sources">Original records and archive leads</h2>
        <ol className="archive-source-list">{archive.sources.map((source) => (
          <li className="archive-source" id={`source-${source.id}`} key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
            <p className="archive-source__locator">{source.locator}</p>
            <p>{source.note}</p>
          </li>
        ))}</ol>
      </section>
      <section className="archive-section" aria-labelledby="archive-progress">
        <h2 className="archive-section-heading" id="archive-progress">Research progress</h2>
        <div className="archive-progress-list">{archive.researchLog.map((entry) => (
          <div className="archive-progress" key={entry.title}>
            <span className="archive-status">{entry.status}</span>
            <h3>{entry.title}</h3><p>{entry.detail}</p>
          </div>
        ))}</div>
        <h3>Next records to recover</h3>
        <ul className="archive-next-list">{archive.nextSteps.map((entry) => (
          <li key={entry.title}><strong>{entry.title}.</strong> {entry.detail}</li>
        ))}</ul>
      </section>
      <section className="archive-section archive-methodology" aria-labelledby="archive-method-title">
        <h2 className="archive-section-heading" id="archive-method-title">How to read these records</h2>
        {archive.methodology.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
