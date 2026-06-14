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
          width="1402"
          height="1122"
          fetchPriority="high"
        />
      </div>

      <a
        href="https://registry.theknot.com/lauren-leonardelli-luc-leszczynski-june-2026-wi/65946488"
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
