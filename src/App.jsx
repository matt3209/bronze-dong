import './App.css'
import hero from './assets/hero.png'

function App() {
  return (
    <main className="app">
      <h1 className="congrats-text">Congrats on Bronzing your Dong!!! Happy 30th!!!</h1>
      <div className="image-wrapper">
        <img src={hero} alt="Bronzed dong" className="hero-image" />
      </div>
    </main>
  )
}

export default App
