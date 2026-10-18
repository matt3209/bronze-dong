const encoder = new TextEncoder()
const decoder = new TextDecoder()
const iterations = 600000

const toBase64 = (bytes) => btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))
const fromBase64 = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0))

export function validateArchive(archive) {
  const requireStrings = (entry, fields) => {
    if (!entry || fields.some((field) => typeof entry[field] !== 'string')) {
      throw new Error('Archive content has missing or invalid text fields')
    }
  }
  const requireStringArray = (entry, field) => {
    if (!Array.isArray(entry[field]) || entry[field].some((value) => typeof value !== 'string')) {
      throw new Error(`Archive content has an invalid ${field} list`)
    }
  }
  if (archive?.schemaVersion !== 1) throw new Error('Unsupported archive content')
  requireStrings(archive, ['title', 'subtitle', 'updatedAt'])
  if (!/^\d{4}-\d{2}-\d{2}$/.test(archive.updatedAt)
    || !Number.isFinite(Date.parse(archive.updatedAt))) throw new Error('Invalid archive update date')
  requireStringArray(archive, 'summary')
  requireStringArray(archive, 'methodology')
  const sections = {
    highlights: ['title', 'detail'],
    events: ['id', 'date', 'season', 'title', 'division', 'location', 'result', 'rounds'],
    recollections: ['title', 'detail', 'status'],
    national: ['title', 'detail'],
    sources: ['id', 'title', 'locator', 'note'],
    researchLog: ['date', 'title', 'detail', 'status'],
    nextSteps: ['title', 'detail'],
  }
  for (const [section, fields] of Object.entries(sections)) {
    if (!Array.isArray(archive[section])) throw new Error(`Archive content is missing ${section}`)
    archive[section].forEach((entry) => requireStrings(entry, fields))
  }
  const sourceIds = new Set(archive.sources.map((source) => source.id))
  if (sourceIds.size !== archive.sources.length) throw new Error('Duplicate archive source IDs')
  archive.sources.forEach((source) => {
    if (source.url !== null && (typeof source.url !== 'string'
      || !['https:', 'http:'].includes(new URL(source.url).protocol))) throw new Error('Invalid archive source URL')
    if (source.excerpt !== undefined && typeof source.excerpt !== 'string') throw new Error('Invalid archive source excerpt')
    if (source.linkLabel !== undefined && (typeof source.linkLabel !== 'string' || !source.linkLabel.trim())) {
      throw new Error('Invalid archive source link label')
    }
  })
  const referencedEntries = [...archive.highlights, ...archive.events, ...archive.national]
  if (archive.photoAlbums !== undefined) {
    if (!Array.isArray(archive.photoAlbums)) throw new Error('Invalid photo albums')
    archive.photoAlbums.forEach((entry) => requireStrings(entry, ['id', 'title', 'description']))
    if (new Set(archive.photoAlbums.map((entry) => entry.id)).size !== archive.photoAlbums.length) {
      throw new Error('Duplicate photo album IDs')
    }
    referencedEntries.push(...archive.photoAlbums)
  }
  if (archive.records !== undefined) {
    if (!Array.isArray(archive.records)) throw new Error('Invalid tournament records')
    archive.records.forEach((entry) => {
      requireStrings(entry, ['id', 'date', 'title', 'division', 'result'])
      requireStringArray(entry, 'partners')
      if (entry.dateStart !== undefined && (typeof entry.dateStart !== 'string'
        || !/^\d{4}-\d{2}-\d{2}$/.test(entry.dateStart)
        || !Number.isFinite(Date.parse(entry.dateStart))
        || new Date(entry.dateStart).toISOString().slice(0, 10) !== entry.dateStart)) {
        throw new Error('Invalid tournament start date')
      }
      if (entry.table !== undefined) {
        requireStrings(entry.table, ['mattSpeaker', 'partnerSpeaker', 'place', 'placeDetail', 'record', 'recordDetail'])
        requireStringArray(entry.table, 'speakerAwards')
        if (entry.table.speakerStats !== undefined) requireStringArray(entry.table, 'speakerStats')
      }
    })
    if (new Set(archive.records.map((entry) => entry.id)).size !== archive.records.length) {
      throw new Error('Duplicate tournament record IDs')
    }
    referencedEntries.push(...archive.records)
  }
  if (archive.pointsHistory !== undefined) {
    const history = archive.pointsHistory
    requireStrings(history, ['title', 'intro'])
    if (!Array.isArray(history.entries)) throw new Error('Invalid points history entries')
    history.entries.forEach((entry) => {
      requireStrings(entry, ['id', 'description', 'date', 'category', 'result', 'enteredOn', 'coach'])
      if (!Number.isSafeInteger(entry.points) || entry.points < 0) throw new Error('Invalid points history value')
    })
    if (new Set(history.entries.map((entry) => entry.id)).size !== history.entries.length) {
      throw new Error('Duplicate points history IDs')
    }
    const total = history.entries.reduce((sum, entry) => sum + entry.points, 0)
    if (!Number.isSafeInteger(history.total) || !Number.isSafeInteger(total) || history.total !== total) {
      throw new Error('Invalid points history total')
    }
    referencedEntries.push(history)
  }
  for (const entry of referencedEntries) {
    requireStringArray(entry, 'sourceIds')
    if (entry.sourceIds.some((id) => !sourceIds.has(id))) throw new Error('Unknown archive source reference')
  }
  archive.events.forEach((entry) => {
    requireStringArray(entry, 'partners')
    requireStringArray(entry, 'notes')
  })
  return archive
}

async function deriveArchiveKey(password, salt) {
  const passwordKey = await globalThis.crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'],
  )
  return globalThis.crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptArchive(archive, password) {
  validateArchive(archive)
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16))
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveArchiveKey(password, salt)
  const ciphertext = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(archive)),
  )
  return {
    version: 1,
    algorithm: 'AES-GCM',
    keyDerivation: 'PBKDF2-SHA-256',
    iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
  }
}

export async function decryptArchive(envelope, password) {
  if (envelope.version !== 1 || envelope.algorithm !== 'AES-GCM'
    || envelope.keyDerivation !== 'PBKDF2-SHA-256' || envelope.iterations !== iterations) {
    throw new Error('Unsupported archive format')
  }
  const salt = fromBase64(envelope.salt)
  const iv = fromBase64(envelope.iv)
  const ciphertext = fromBase64(envelope.ciphertext)
  if (salt.length !== 16 || iv.length !== 12 || ciphertext.length <= 16) {
    throw new Error('Invalid archive data')
  }
  const key = await deriveArchiveKey(password, salt)
  const plaintext = await globalThis.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return validateArchive(JSON.parse(decoder.decode(plaintext)))
}
