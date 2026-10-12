import crew from './assets/mani-waters-crew.jpg'

function ManiWaters({ onNavigate }) {
  return (
    <div className="app mani-waters-page">
      <div className="hero mani-waters-hero">
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

      <a className="return-link" href="#" onClick={(event) => onNavigate('home', event)}>← Return to the Order</a>
    </div>
  )
}

export default ManiWaters
