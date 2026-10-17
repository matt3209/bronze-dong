import { useEffect, useRef, useState } from 'react'
import './App.css'
import hero from './assets/hero.png'
import SiteNavigation from './SiteNavigation'
import MattMurphy from './MattMurphy'
import ManiWaters from './ManiWaters'
import HiddenArchive from './HiddenArchive'

function HomePage() {
  return (
    <div className="app statue-home">
      <h1 className="visually-hidden">Chris, Custodian of the Waters</h1>
        <figure className="statue">
          <img
            src={hero}
            alt="Classical marble statue of Chris wearing sunglasses"
            className="statue-image"
          />
          <figcaption className="caption">
            <em>Custodian of the Waters</em> &mdash; marble &amp; bronze, eternal
          </figcaption>
        </figure>
      <footer className="footer">
        Est. MCMXCVI &middot; Aes Numquam Aquam Timet
      </footer>
    </div>
  )
}

const pageFromHash = () => ({
  '#mattmurphy': 'mattmurphy',
  '#maniwaters': 'maniwaters',
  '#hidden': 'hidden',
})[window.location.hash] || 'home'

const pageTitles = {
  home: 'BRONZEDONGS.COM · THE BRONZE DONG',
  maniwaters: 'BRONZEDONGS.COM · MANI WATERS MMXXVI',
  mattmurphy: 'MattMurphy · The Buffalo File · BRONZEDONGS.COM',
  hidden: 'Hidden · BRONZEDONGS.COM',
}

function App() {
  const [page, setPage] = useState(pageFromHash)
  const mainRef = useRef(null)
  const firstRender = useRef(true)
  const scrollAfterNavigation = useRef(false)

  const navigateTo = (destination, event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
    if (destination === page) window.scrollTo(0, 0)
    else scrollAfterNavigation.current = true
    return true
  }

  useEffect(() => {
    const updatePage = () => setPage(pageFromHash())
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => {
    document.title = pageTitles[page]
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (scrollAfterNavigation.current) {
      window.scrollTo(0, 0)
      scrollAfterNavigation.current = false
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [page])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        mainRef.current?.focus()
        mainRef.current?.scrollIntoView()
      }}>Skip to content</a>
      <a className="somewhere-link" href="https://somewherefun.org/">
        <span>Find your next trip with <span className="somewhere-wordmark">Somewhere</span></span>
        <span aria-hidden="true">&rarr;</span>
      </a>
      <SiteNavigation page={page} onNavigate={navigateTo} />
      <main id="main-content" className="page-content" ref={mainRef} tabIndex={-1}>
        <div className="page-view" hidden={page !== 'home'}><HomePage /></div>
        <div className="page-view" hidden={page !== 'maniwaters'}><ManiWaters onNavigate={navigateTo} /></div>
        <div className="page-view" hidden={page !== 'mattmurphy'}><MattMurphy onNavigate={navigateTo} /></div>
        {page === 'hidden' && <HiddenArchive />}
      </main>
    </div>
  )
}

export default App
