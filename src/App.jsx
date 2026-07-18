import './App.css'
import hero from './assets/hero.png'

function App() {
  return (
    <main className="app">
      <div className="hero">
        <header className="masthead">
          <p className="overline">The Bronzedongs Gallery Proudly Presents</p>
          <h1 className="headline">
            Congrats on Bronzing <span className="no-wrap">your Dong!!!</span>
          </h1>
          <div className="ornament" aria-hidden="true">
            <span className="rule" />
            <span className="diamond" />
            <span className="rule" />
          </div>
          <p className="subhead">Happy 30th!!!</p>
        </header>

        <figure className="statue">
          <img
            src={hero}
            alt="Classical marble statue of a mustachioed man in sunglasses"
            className="statue-image"
          />
          <figcaption className="caption">
            <em>Man at Thirty</em> &mdash; marble &amp; bronze, 2026
          </figcaption>
        </figure>
      </div>

      <footer className="footer">Est. MCMXCVI &middot; Bronzed MMXXVI</footer>
    </main>
  )
}

export default App
