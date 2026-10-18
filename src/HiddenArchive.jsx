import { useEffect, useRef, useState } from 'react'
import { decryptArchive } from './archiveCrypto'
import './HiddenArchive.css'

const formatDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${value}T12:00:00Z`))

function SourceLinks({ ids, sources }) {
  return <div className="archive-source-links">{ids.map((id) => {
    const source = sources.find((entry) => entry.id === id)
    return source && <div className="archive-source" key={id}>
      {source.excerpt && <>
        <p className="archive-source-title">{source.title}</p>
        <blockquote>{source.excerpt}</blockquote>
        <p className="archive-source-locator">{source.locator}</p>
      </>}
      {source.url
        ? <a href={source.url} target="_blank" rel="noreferrer">{source.excerpt ? (source.linkLabel || 'Archive metadata') : source.title} ↗</a>
        : <span className="archive-source-label">{source.title}</span>}
    </div>
  })}</div>
}

function RecordedValue({ value }) {
  return value || <span className="archive-missing" aria-label="Not documented">—</span>
}

function TournamentRow({ record, sources }) {
  const result = record.table || { record: record.result }
  const sourceDialogRef = useRef(null)

  return (
    <tr className={result.place === '1st' ? 'archive-result--winner' : undefined}>
      <td className="archive-table__date">{record.date}</td>
      <th className="archive-table__tournament" scope="row">
        <span>{record.title}</span>
        <span className="archive-table__secondary">{record.division}</span>
      </th>
      <td><RecordedValue value={record.partners.join(' & ')} /></td>
      <td className="archive-table__position"><RecordedValue value={result.mattSpeaker} /></td>
      <td className="archive-table__position"><RecordedValue value={result.partnerSpeaker} /></td>
      <td className="archive-table__place">
        <RecordedValue value={result.place} />
        {result.placeDetail && <span className="archive-table__secondary">{result.placeDetail}</span>}
      </td>
      <td className="archive-table__record">
        <RecordedValue value={result.record} />
        {result.recordDetail && <span className="archive-table__secondary">{result.recordDetail}</span>}
      </td>
      <td><RecordedValue value={result.speakerAwards?.join('; ')} /></td>
      <td className="archive-table__sources">
        <button type="button" className="archive-source-button" aria-haspopup="dialog"
          aria-label={`Sources for ${record.title}, ${record.date}`}
          onClick={() => sourceDialogRef.current?.showModal()}>Sources</button>
        <dialog className="archive-sources-dialog" ref={sourceDialogRef} aria-label={`Sources for ${record.title}, ${record.date}`}>
          <div className="archive-sources-dialog__header">
            <h3>{record.title}<span>{record.date}</span></h3>
            <button type="button" className="archive-lock-button" onClick={() => sourceDialogRef.current?.close()}>Close</button>
          </div>
          <SourceLinks ids={record.sourceIds} sources={sources} />
        </dialog>
      </td>
    </tr>
  )
}

function ArchiveContent({ archive, onLock }) {
  const titleRef = useRef(null)
  const records = archive.records.every((record) => record.dateStart)
    ? [...archive.records].sort((first, second) => first.dateStart.localeCompare(second.dateStart))
    : archive.records
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
        <p className="archive-summary">The NSDA points history is incomplete. Only documented results appear here.</p>
      </header>
      <section className="archive-section" aria-labelledby="archive-results">
        <h2 className="archive-section-heading" id="archive-results">Tournament results</h2>
        <p className="archive-table-key" id="archive-table-key">— Not documented. “Entry list” identifies a registered pairing, not a completed result.</p>
        <p className="archive-table-scroll-hint" id="archive-scroll-hint">Scroll sideways to see every column.</p>
        <div className="archive-table-scroll" role="region" aria-label="Tournament results grid" aria-describedby="archive-table-key archive-scroll-hint" tabIndex={0}>
          <table className="archive-results-table">
            <caption className="visually-hidden">Tournament records in date order. Events without an exact date retain their documented season.</caption>
            <colgroup>
              <col className="archive-column-date" /><col className="archive-column-tournament" />
              <col className="archive-column-partner" /><col className="archive-column-position" />
              <col className="archive-column-position" /><col className="archive-column-place" />
              <col className="archive-column-record" /><col className="archive-column-awards" />
              <col className="archive-column-sources" />
            </colgroup>
            <thead><tr>
              <th scope="col">Date</th><th scope="col">Tournament / division</th><th scope="col">Partner</th>
              <th scope="col">Matt’s position</th><th scope="col">Partner’s position</th>
              <th scope="col">Place / finish</th><th scope="col">W–L record</th>
              <th scope="col">Speaker awards</th><th scope="col">Sources</th>
            </tr></thead>
            <tbody>{records.map((record) => <TournamentRow key={record.id} record={record} sources={archive.sources} />)}</tbody>
          </table>
        </div>
      </section>
      {archive.photoAlbums?.length > 0 && <section className="archive-photo-albums" aria-labelledby="archive-photo-albums">
        <h2 className="archive-section-heading" id="archive-photo-albums">Photo albums to review</h2>
        {archive.photoAlbums.map((album) => <div key={album.id}>
          <h3>{album.title}</h3>
          <p>{album.description}</p>
          <SourceLinks ids={album.sourceIds} sources={archive.sources} />
        </div>)}
      </section>}
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
