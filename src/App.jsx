import './App.css'
import hero from './assets/hero.png'
import crew from './assets/mani-waters-crew.jpg'

function App() {
  return (
    <main className="app">
      <div className="hero">
        <header className="masthead">
          <p className="overline">The Ancient &amp; Venerable Order of the Bronze Dong</p>
          <h1 className="headline">
            Mani Waters <span className="no-wrap">MMXXVI</span>
          </h1>
          <div className="ornament" aria-hidden="true">
            <span className="rule" />
            <span className="wave">≈</span>
            <span className="rule" />
          </div>
          <p className="subhead">
            Congratulations <strong>Anna</strong> &amp; <strong>Justin</strong>
          </p>
          <p className="proclamation">
            on your Initiation to the Dong
          </p>

          <div className="initiates">
            <div className="plaque">
              <span className="plaque-name">Anna</span>
              <span className="plaque-title">Keeper of the Tides</span>
            </div>
            <div className="plaque">
              <span className="plaque-name">Justin</span>
              <span className="plaque-title">Bearer of the Bronze</span>
            </div>
          </div>

          <p className="rite">By water tested. By bronze received.</p>
        </header>

        <figure className="statue">
          <img
            src={hero}
            alt="Classical marble statue of a mustachioed man in sunglasses"
            className="statue-image"
          />
          <figcaption className="caption">
            <em>Custodian of the Waters</em> &mdash; marble &amp; bronze, eternal
          </figcaption>
        </figure>
      </div>

      <section className="gallery">
        <p className="gallery-overline">From the Permanent Collection</p>
        <figure className="artwork">
          <img
            src={crew}
            alt="Four members of the Order aboard a pontoon boat on the lake, surrounded by inflatable floaties"
            className="artwork-image"
          />
          <figcaption className="caption">
            <em>The Initiation Voyage</em> &mdash; light on water, Mani Waters, MMXXVI
          </figcaption>
        </figure>
      </section>

      <footer className="footer">
        Est. MCMXCVI &middot; Mani Waters MMXXVI &middot; Aes Numquam Aquam Timet
      </footer>
    </main>
  )
}

export default App
