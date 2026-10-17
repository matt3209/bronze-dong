import { readFile, writeFile, mkdir, chmod } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { encryptArchive, decryptArchive } from '../src/archiveCrypto.js'

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = resolve(repository, '.private/archive.json')
const passwordPath = resolve(repository, '.private/password')
const outputPath = resolve(repository, 'public/hidden-archive.json')

try {
  const archive = JSON.parse(await readFile(sourcePath, 'utf8'))
  const password = (await readFile(passwordPath, 'utf8')).replace(/\r?\n$/, '')
  if (!password) throw new Error('The archive password is empty')
  if (archive.schemaVersion !== 1 || !Array.isArray(archive.events) || !Array.isArray(archive.sources)) {
    throw new Error('The private archive source is invalid')
  }
  await chmod(resolve(repository, '.private'), 0o700)
  await chmod(passwordPath, 0o600)
  await chmod(sourcePath, 0o600)
  const envelope = await encryptArchive(archive, password)
  const recovered = await decryptArchive(envelope, password)
  if (JSON.stringify(recovered) !== JSON.stringify(archive)) throw new Error('Archive verification failed')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(envelope, null, 2)}\n`)
  process.stdout.write('Updated and verified the encrypted archive.\n')
} catch (error) {
  process.stderr.write(`Archive update failed: ${error.code === 'ENOENT'
    ? 'Add .private/archive.json and .private/password first.' : error.message}\n`)
  process.exitCode = 1
}
