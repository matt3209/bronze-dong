import heroImage from './assets/hero.png'
import './App.css'

function App() {
  return (
    <main className="app">
      <div className="image-wrapper">
        <img
          src={heroImage}
          alt="BRONZEDONGS.COM"
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
