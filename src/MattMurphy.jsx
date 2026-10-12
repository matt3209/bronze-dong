import './MattMurphy.css'

export default function MattMurphy({ onNavigate }) {
  return (
    <div className="mystery-page">
      <header className="mystery-heading">
        <p className="overline">The Order’s Bureau of Unnecessary Investigations</p>
        <h1>MattMurphy</h1>
        <p className="mystery-subtitle">The Buffalo File</p>
        <p className="mystery-deck">One gamertag. Two squadmates. Absolutely no idea.</p>
      </header>

      <article className="casefile" aria-label="The MattMurphy online gaming mystery">
        <div className="casefile-topline">
          <span>Bronze Dong Archives · Case MM</span>
          <span className="case-stamp">Identity unresolved</span>
        </div>
        <section className="case-section opening-clue" aria-labelledby="clue-heading">
          <p className="chapter-label">Exhibit A · The entire evidence pile</p>
          <h2 id="clue-heading">They’re from Buffalo.</h2>
          <p>That is our only real-world clue.</p>
          <p>MattMurphy appears in gaming lobbies. We know the gamertag. We do not know who is inside the headset: a person, a goose, or Buffalo’s Department of Ranked Matchmaking.</p>
          <p>Every request for biographical information has produced the same answer: <strong>BUFFALO</strong>. Investigators have begun interrogating maps.</p>
        </section>

        <section className="case-section" aria-labelledby="witness-heading">
          <p className="chapter-label">Exhibit B · The actual squadmates</p>
          <h2 id="witness-heading">They’ve gamed with him. This clears up nothing.</h2>
          <div className="witness-statements">
            <blockquote><p>“We’ve played together. Good comms. From Buffalo.”</p><cite>Mitch · has gamed with MattMurphy</cite></blockquote>
            <blockquote><p>“Yeah, he’s been in our lobbies. I know the voice.”</p><cite>Chris · has also gamed with MattMurphy</cite></blockquote>
          </div>
          <p>They recognize his voice, join his parties, and know when he’s AFK. Asked who he is outside the game, both men stared at the loading screen as though it might issue a birth certificate.</p>
        </section>

        <section className="case-section" aria-labelledby="theories-heading">
          <p className="chapter-label">Exhibit C · Red string, no answers</p>
          <h2 id="theories-heading">The theory board has become structural.</h2>
          <p>Every theory below is entirely unsupported. This has not slowed the committee.</p>
          <dl className="theory-board">
            <div><dt>The Buffalo Rotation</dt><dd>The entire city operates one gamertag in shifts. Librarians handle ranked. The mayor covers bathroom breaks.</dd></div>
            <div><dt>The Headset Goose</dt><dd>MattMurphy is a goose with noise suppression. Every “one shot” is a honk processed through municipal software.</dd></div>
            <div><dt>The Lake Router</dt><dd>The lake is Buffalo’s router. Its password is a fish, and the fish has enabled two-factor authentication.</dd></div>
            <div><dt>The AFK Protocol</dt><dd>Whenever MattMurphy says “brb,” a snowblower boots Windows. Somewhere in Buffalo, a driveway receives a friend request.</dd></div>
          </dl>
          <p>Red string connects everything to Buffalo. The committee plugged it into a router. It now has terrible ping.</p>
        </section>

        <section className="case-section" aria-labelledby="operation-heading">
          <p className="chapter-label">Field report · Operation Open Mic</p>
          <h2 id="operation-heading">“Buffalo’s on push-to-talk.”</h2>
          <p>Investigators joined the lobby. Mitch readied up. Chris tested his mic. The lead detective accidentally equipped a <strong>CEREMONIAL BANANA</strong>.</p>
          <div className="interview-transcript">
            <p><span>Investigator</span><span className="transcript-response">“Matt, who are you, actually?”</span></p>
            <p><span>Mitch</span><span className="transcript-response">“He’s loading in.”</span></p>
            <p><span>Investigator</span><span className="transcript-response">“Why is the whole city muted?”</span></p>
            <p><span>Chris</span><span className="transcript-response"><em>Checks the party list.</em> “Buffalo’s on push-to-talk.”</span></p>
          </div>
          <p>The detective was promoted to Assistant Deputy Waiting for Players. The banana outranked him.</p>
        </section>

        <details className="sealed-document">
          <summary><span>Unseal the final document</span><span className="seal-mark" aria-hidden="true">+</span></summary>
          <div className="sealed-content">
            <h2>The headset incident.</h2>
            <p>Investigators requested a camera. MattMurphy’s mic lit up: <em>“Hang on. The next shift is here.”</em></p>
            <p>There was a honk, a snowblower starting, and somebody asking whether the library had remembered to reload.</p>
            <p>The gamertag typed: <strong>“Still Buffalo, though.”</strong></p>
            <p>Then the party roster briefly displayed <strong>BUFFALO (ALL)</strong>.</p>
            <p>Nobody had invited a municipality.</p>
            <p>This has been classified as a headset issue.</p>
          </div>
        </details>

        <section className="case-status" aria-labelledby="status-heading">
          <p className="chapter-label">Current status</p>
          <h2 id="status-heading">The investigation continues.</h2>
          <p>Identity: unknown. Buffalo: our only real-world lead.<br />Mitch and Chris: gaming teammates. Goose: mic muted.</p>
          <p className="closing-line">If you are MattMurphy, please enable video.<br />If you are Buffalo, stop queueing as a solo.</p>
        </section>
        <p className="casefile-fineprint">Filed by the Order. Entirely made up. Alarmingly well organized.</p>
      </article>
      <a className="return-link" href="#" onClick={(event) => onNavigate('home', event)}>← Return to the Order</a>
    </div>
  )
}
