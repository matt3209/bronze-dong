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

The page displays only the factual `records` list: one item per tournament, with
the date, format, known partner, result, and source. Research notes and the raw
points ledger remain in the encrypted working data but are not displayed. Merge
matching state/ledger events rather than duplicating them; retain conflicting
reported results in the same item without guessing a resolution.

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
