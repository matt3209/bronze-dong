# Hidden archive

The `Hidden` navigation item opens `#hidden`. Its content is encrypted locally and
decrypted in the browser after the password is entered. Leaving the tab or choosing
**Lock archive** discards the decrypted content. Nothing is saved in browser storage.

## Update the research

The local working files are ignored by Git:

- `.private/archive.json`: structured research, source links, and progress notes.
- `.private/password`: the unlock password, on a single line.
- `.private/source-packets/`: downloaded original research sources.

Edit the research file, preserving its schema, then run:

```sh
npm run archive:update
npm run build
```

The optional `pointsHistory` section preserves incomplete membership-ledger rows
separately from tournament result packets. Keep blank records blank, retain entry
dates and coach attribution, and flag conflicts without double-counting an event.
Its total covers only the supplied rows, never the full career. A source without a
public URL uses `url: null` and appears as a text citation rather than a fabricated link.
An optional plain-text `source.excerpt` appears in the row's Sources dialog with
the existing locator and an archive-metadata link. Keep excerpts short and verbatim;
never render archived HTML or scripts, and distinguish an index record from the
original article. Source dialogs remain inside the unlocked archive.

The page displays only the factual `records` list as a chronological grid. Each
record can include a `table` object with `mattSpeaker`, `partnerSpeaker`, `place`,
`placeDetail`, `record`, `recordDetail`, and a `speakerAwards` string array. Empty
strings and empty award lists display as a dash, meaning not documented, never
zero or no award. Keep speaker positions blank unless the source labels them;
roster order and summed ballot ranks do not establish a speaking position or award.
Preliminary seeds are not final placements. Label registered pairings as entry-list
evidence, not completed results. The older free-text `result` remains a fallback.

Provide a validated ISO `dateStart` when the tournament date is known; when every
row has one, the grid sorts chronologically by that field. Otherwise maintain
`records` in date order with period-only entries in their documented season.
Never invent an exact date to make a period-only entry sortable. Tournament dates
can combine a contemporary calendar/invitation with a separate completed result;
they do not establish that the pair debated on every day of a multi-day event.
Research notes and the raw points ledger remain encrypted but are not displayed.
Merge matching state/ledger events rather than duplicating them; retain conflicting
reported results in the same row without guessing a resolution.

The update command encrypts the content with a new random salt and IV and verifies
that it decrypts before writing `public/hidden-archive.json`. Publish that encrypted
file with the site changes through the existing deployment workflow. A normal build
uses the committed ciphertext and does not require either private working file.
Vite also blocks requests for the private working directory during local development.

Keep a private backup of the working files. To recover the JSON from a checkout that
has only the encrypted file, use `decryptArchive` from `src/archiveCrypto.js` with the
password. Do not put the password in frontend environment variables, source code,
commit messages, or shell history. Password rotation requires regenerating the
payload; an older public Git revision can still be decrypted with its old password.

The payload uses AES-GCM with a key derived by PBKDF2-SHA-256. Visitors can download
the ciphertext and attempt passwords offline, so use a strong, unique password.
This is a static encrypted archive, without server accounts or access logging.
