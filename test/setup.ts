import { createCollection, createDirectus, createItems, rest, staticToken, createPermissions, readPolicies, createTranslations } from '@directus/sdk'
import { exec } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { promisify } from 'node:util'

const path = fileURLToPath(new URL('./', import.meta.url))
const controller = new AbortController()

export async function setup() {
  await startDirectus()
  await promisify(exec)('npx nuxt prepare', { cwd: join(path, 'fixtures/basic') })
}

export async function teardown() {
  await stopDirectus()
}

// Create a directus instance and launch it
async function startDirectus() {
  return new Promise<void>((resolve, reject) => {
    exec('npx directus bootstrap', { cwd: path }, (error) => {
      if (error) return reject(error)
      exec('npx directus start', { cwd: path, signal: controller.signal })
      const interval = setInterval(async () => {
        if (await isDirectusReady()) {
          clearInterval(interval)
          await createDummyData()
          resolve()
        }
      }, 1000)
    })
  })
}

/**
 * Create a projects collection and some items.
 */
async function createDummyData() {
  try {
    const directus = createDirectus('http://localhost:8055').with(rest()).with(staticToken('test-token'))

    await directus.request(createCollection({
      collection: 'projects',
      schema: {
        name: 'projects',
      },
      fields: [{
        field: 'id',
        type: 'integer',
        schema: {
          is_primary_key: true,
          has_auto_increment: true,
        },
      }, {
        field: 'name',
        type: 'string',
        schema: {
          is_nullable: false,
        },
      }, {
        field: 'picture',
        type: 'string',
        schema: {
          is_nullable: true,
        },
      }],
    }))

    await directus.request(createItems('projects', [
      { name: 'Project 1' },
    ]))

    const [publicPolicy] = await directus.request(readPolicies({
      fields: ['id'],
      filter: { name: { _eq: '$t:public_label' } },
    }))

    if (!publicPolicy) throw new Error('Public policy not found')

    await directus.request(createPermissions([{
      policy: publicPolicy.id,
      fields: ['*'],
      action: 'read',
      collection: 'projects',
    }, {
      policy: publicPolicy.id,
      fields: ['*'],
      action: 'read',
      collection: 'directus_translations',
    }, {
      policy: publicPolicy.id,
      fields: ['*'],
      action: 'read',
      collection: 'directus_files',
    }],
    ))

    await directus.request(createTranslations([{
      language: 'en-US',
      key: 'hello',
      value: 'Hello',
    }, {
      language: 'fr-FR',
      key: 'hello',
      value: 'Bonjour',
    }]))
  }
  catch (error) {
    console.error('Error creating dummy data:', error)
  }
}

/**
 *
 */
/**
 * Test if directus is ready.
 */
async function isDirectusReady() {
  try {
    const res = await fetch('http://localhost:8055/server/ping')
    return res.ok
  }
  catch {
    return false
  }
}

/**
 * Stop the directus instance.
 */
async function stopDirectus() {
  return new Promise<void>((resolve) => {
    controller.abort()
    console.info('Directus stopped')
    exec('rm db.sqlite', { cwd: path }, () => {
      resolve()
    })
  })
}
