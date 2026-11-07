import { useEffect, useRef, useState } from 'react'
import alison from './assets/alison-birthday.jpg'
import birthdayVideo from './assets/birthday-surprise.mp4'
import './BirthdayHomePage.css'

export default function BirthdayHomePage({ onNavigate }) {
  const dialogRef = useRef(null)
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  const openGift = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    dialogRef.current.showModal()
    videoRef.current.currentTime = 0
    videoRef.current.play().catch(() => { /* Native controls remain available if playback needs another tap. */ })
  }

  useEffect(() => {
    const closeVideo = () => dialogRef.current?.close()
    window.addEventListener('hashchange', closeVideo)
    return () => window.removeEventListener('hashchange', closeVideo)
  }, [])

  return (
    <section className="birthday-home" aria-labelledby="birthday-title">
      <div className="birthday-party" aria-hidden="true">
        <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
      </div>
      <div className="birthday-layout">
        <div className="birthday-message">
          <p className="birthday-eyebrow"><span aria-hidden="true">✦</span> A Bronze Dongs birthday</p>
          <h1 id="birthday-title">Happy 30th <em>Alison!</em></h1>
          <a className="birthday-gift" href={birthdayVideo} onClick={openGift} aria-haspopup="dialog">
            <svg className="birthday-cup" width="32" height="36" viewBox="0 0 32 36" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 10h20l-3 23H9L6 10ZM4 6h24v4H4V6ZM8 6l2-4h12l2 4M8 17h16M9 25h14" strokeLinejoin="round" />
              <path d="m16 18 1.2 2.1 2.3.5-1.6 1.8.2 2.4-2.1-1-2.1 1 .2-2.4-1.6-1.8 2.3-.5L16 18Z" strokeWidth="1" />
            </svg>
            <span>click here for a <strong>starbucks giftcard!</strong></span>
            <span className="birthday-gift-arrow" aria-hidden="true">↗</span>
          </a>
          <p className="birthday-wish">Here’s to you. And a very well-earned coffee.</p>
        </div>
        <div className="birthday-photo">
          <figure className="birthday-photo-frame">
            <img src={alison} alt="Alison curled up on a red beanbag with a pillow, surrounded by colorful beanbags and teal bunk beds" width="2142" height="2856" fetchpriority="high" />
            <figcaption><span>The birthday girl</span><span aria-hidden="true">♡</span></figcaption>
          </figure>
          <div className="birthday-seal" aria-hidden="true">
            <svg viewBox="0 0 120 120" focusable="false">
              <text className="birthday-seal-label" x="60" y="36">HELLO,</text>
              <text className="birthday-seal-number" x="60" y="76">30</text>
              <text className="birthday-seal-label" x="60" y="96">LOOKING GOOD.</text>
            </svg>
          </div>
        </div>
      </div>
      <footer className="birthday-footer">
        <span>With love, Bronze Dongs <span aria-hidden="true">♡</span></span>
        <a href="#archived-homepage" onClick={(event) => onNavigate('archived-homepage', event)}>Archived Homepage <span aria-hidden="true">↗</span></a>
      </footer>
      <dialog className="birthday-video-dialog" ref={dialogRef} aria-labelledby="birthday-video-title" onClose={() => videoRef.current?.pause()}>
        <div className="birthday-video-heading">
          <h2 id="birthday-video-title">Surprise, Alison!</h2>
          <button type="button" onClick={() => dialogRef.current.close()} aria-label="Close video">×</button>
        </div>
        <video ref={videoRef} src={birthdayVideo} controls playsInline preload="none" aria-label="Birthday surprise video" onCanPlay={() => setVideoError(false)} onError={() => setVideoError(true)}>
          Your browser cannot play this video. <a href={birthdayVideo}>Open the video file</a>.
        </video>
        {videoError && <p className="birthday-video-error">Having trouble playing? <a href={birthdayVideo}>Open the video file.</a></p>}
      </dialog>
    </section>
  )
}
