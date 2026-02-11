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
          width="1200"
          height="675"
          fetchPriority="high"
        />
      </div>
    </main>
  )
}

export default App
