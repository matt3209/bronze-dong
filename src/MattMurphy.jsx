import './MattMurphy.css'

export default function MattMurphy({ onNavigate }) {
  return (
    <div className="mystery-page">
      <header className="mystery-heading">
        <p className="overline">The Order’s Bureau of Unnecessary Investigations</p>
        <h1>MattMurphy</h1>
        <p className="mystery-subtitle">The Buffalo File</p>
        <p className="mystery-deck">One city. Two witnesses. Absolutely no idea.</p>
        <p className="fiction-label">A completely fictional conspiracy comedy</p>
      </header>

      <article className="casefile" aria-label="The fictional MattMurphy investigation">
        <div className="casefile-topline">
          <span>Bronze Dong Archives · Case MM</span>
          <span className="case-stamp">Identity unresolved</span>
        </div>
        <section className="case-section opening-clue" aria-labelledby="clue-heading">
          <p className="chapter-label">Exhibit A · The entire evidence pile</p>
          <h2 id="clue-heading">They’re from Buffalo.</h2>
          <p>That is the entire file.</p>
          <p>We don’t know what MattMurphy looks like, what MattMurphy does, or whether “MattMurphy” is a person, a regional weather event, or what happens when two Irish surnames collide inside a snowblower.</p>
          <p>Every attempt to expand the dossier has produced another folder labeled <strong>BUFFALO</strong>, slightly damp.</p>
        </section>

        <section className="case-section" aria-labelledby="witness-heading">
          <p className="chapter-label">Exhibit B · The alleged knowers</p>
          <h2 id="witness-heading">Mitch and Chris know something. Allegedly.</h2>
          <div className="witness-statements">
            <blockquote><p>“Oh, yeah. Matt.”</p><cite>Mitch · claims to know them</cite></blockquote>
            <blockquote><p>“Yeah. I know MattMurphy.”</p><cite>Chris · also claims to know them</cite></blockquote>
          </div>
          <p>Chris nodded with the confidence of someone who has successfully returned a mattress without a receipt. Neither statement advanced the investigation. Both men then looked at a door that was not there.</p>
        </section>

        <section className="case-section" aria-labelledby="theories-heading">
          <p className="chapter-label">Exhibit C · Red string, no answers</p>
          <h2 id="theories-heading">The theory board has become structural.</h2>
          <p>Every theory below is entirely unsupported. This has not slowed the committee.</p>
          <dl className="theory-board">
            <div><dt>The Winter Appointment</dt><dd>MattMurphy is selected each autumn by a council of snow shovels to represent Buffalo in negotiations with February.</dd></div>
            <div><dt>The Sauce Situation</dt><dd>MattMurphy exists only when the correct wing sauce reaches room temperature. Attempts to recreate this condition produced lunch.</dd></div>
            <div><dt>The Municipal Goose</dt><dd>MattMurphy is a goose wearing a quarter-zip. This explains nothing, but the quarter-zip has been ordered.</dd></div>
            <div><dt>The Mitch-and-Chris Arrangement</dt><dd>Each assumes the other knows MattMurphy. Their friendship now rests on a load-bearing conversational misunderstanding.</dd></div>
          </dl>
          <p>Red string connects every theory to Buffalo. Additional red string connects Buffalo to a photograph of a stapler. The stapler has requested legal representation.</p>
        </section>

        <section className="case-section" aria-labelledby="operation-heading">
          <p className="chapter-label">Field report · Operation Just Ask Them</p>
          <h2 id="operation-heading">“Depends on the lake.”</h2>
          <p>Investigators arranged a casual encounter. Mitch brought chips. Chris brought an unmarked envelope. Inside was a smaller envelope labeled <strong>CHIPS</strong>.</p>
          <div className="interview-transcript">
            <p><span>Investigator</span><span className="transcript-response">“Is MattMurphy coming?”</span></p>
            <p><span>Mitch</span><span className="transcript-response">“Depends.”</span></p>
            <p><span>Investigator</span><span className="transcript-response">“On what?”</span></p>
            <p><span>Chris</span><span className="transcript-response"><em>Checks a watch with no hands.</em> “The lake.”</span></p>
          </div>
          <p>The meeting lost quorum when a folding chair declared itself Canadian.</p>
        </section>

        <details className="sealed-document">
          <summary><span>Unseal the final document</span><span className="seal-mark" aria-hidden="true">+</span></summary>
          <div className="sealed-content">
            <h2>The breakthrough. Probably.</h2>
            <p>An anonymous note appeared beneath the door: <em>“You’re asking the wrong question.”</em></p>
            <p>Investigators immediately asked the right question: “Who ordered fourteen pounds of shredded cheese?” Nobody answered.</p>
            <p>On the reverse of the note: <strong>“Still Buffalo, though.”</strong></p>
            <p>Then the office microwave displayed <strong>MATT</strong>.</p>
            <p>It was unplugged.</p>
            <p>This has been classified as a microwave issue.</p>
          </div>
        </details>

        <section className="case-status" aria-labelledby="status-heading">
          <p className="chapter-label">Current status</p>
          <h2 id="status-heading">The investigation continues.</h2>
          <p>Identity: unknown. Buffalo: our only lead.<br />Mitch and Chris: still claiming to know. Goose: unavailable for comment.</p>
          <p className="closing-line">If you are MattMurphy, please identify yourself.<br />If you are Buffalo, we have several questions.</p>
        </section>
        <p className="casefile-fineprint">Filed by the Order. Entirely made up. Alarmingly well organized.</p>
      </article>
      <a className="return-link" href="#" onClick={(event) => onNavigate('home', event)}>← Return to the Order</a>
    </div>
  )
}
