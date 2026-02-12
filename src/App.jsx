import { useState } from 'react'
import heroImage from './assets/hero.png'
import congratsImage from './assets/congrats.png'
import './App.css'

function App() {
  const [clicked, setClicked] = useState(false)

  return (
    <main className="app">
      <div className="image-wrapper">
        <img
          src={clicked ? congratsImage : heroImage}
          alt={clicked ? 'Congrats on the DONG Sara' : 'BRONZEDONGS.COM'}
          className="hero-image"
          width="1200"
          height="675"
          fetchPriority="high"
        />
        {!clicked && (
          <button
            className="registry-btn"
            onClick={() => setClicked(true)}
          >
            Registry
          </button>
        )}
      </div>
    </main>
  )
}

export default App
