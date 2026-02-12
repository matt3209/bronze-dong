import { useState } from 'react'
import heroImage from './assets/hero.png'
import congratsImage from './assets/congrats.png'
import './App.css'

function App() {
  const [clicked, setClicked] = useState(false)

  return (
    <main className="app">
      <div
        className="image-wrapper"
        role="button"
        tabIndex={0}
        onClick={() => setClicked(true)}
        onKeyDown={(e) => e.key === 'Enter' && setClicked(true)}
        style={{ cursor: clicked ? 'default' : 'pointer' }}
      >
        <img
          src={clicked ? congratsImage : heroImage}
          alt={clicked ? 'Congrats on the DONG Sara' : 'BRONZEDONGS.COM'}
          className="hero-image"
          width="1200"
          height="675"
          fetchPriority="high"
        />
      </div>

      <a
        href="https://www.theknot.com/us/sara-opie-and-mitch-deuster-feb-2026/registry"
        target="_blank"
        rel="noopener noreferrer"
        className="registry-button"
      >
        View Our Wedding Registry
      </a>
    </main>
  )
}

export default App
