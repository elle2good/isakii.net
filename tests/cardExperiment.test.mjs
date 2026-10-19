import test from 'node:test'
import assert from 'node:assert/strict'
import { analyticsAllowed, validExposure, exposeCards, readExposure, recordEngagement, foregroundDelta, EXPOSURE_KEY } from '../lib/cardExperiment.ts'

const storage = new Map()
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) }
globalThis.window = { location: { hostname: 'isakii.net', pathname: '/', search: '' } }
const events = []
const sdk = { get_distinct_id: () => 'visitor-a', capture: (event, properties) => events.push({ event, properties }) }

test('reading time excludes hidden and unfocused tabs and caps suspended timer gaps', () => {
  assert.equal(foregroundDelta(1000, 2000, true, true), 1000)
  assert.equal(foregroundDelta(1000, 2000, false, true), 0)
  assert.equal(foregroundDelta(1000, 2000, true, false), 0)
  assert.equal(foregroundDelta(1000, 100000, true, true), 1500)
  assert.equal(foregroundDelta(2000, 1000, true, true), 0)
})

test('excludes review traffic, preferences, explicit previews, and opted-out browsers', () => {
  assert.equal(analyticsAllowed(), true)
  for (const search of ['?cardTest=direct', '?preview=Abelian-community']) {
    window.location.search = search
    assert.equal(analyticsAllowed(), false)
  }
  window.location.search = ''
  window.location.hostname = 'localhost'
  assert.equal(analyticsAllowed(), false)
  window.location.hostname = 'isakii.net'
  localStorage.setItem('isakii.analytics.optOut', '1')
  assert.equal(analyticsAllowed(), false)
  localStorage.removeItem('isakii.analytics.optOut')
})

test('attribution rejects different identities, future timestamps and expired windows', () => {
  const exposure = { id: 'a', variant: 'direct', at: 1000 }
  assert.equal(validExposure(exposure, 'a', 2000), true)
  assert.equal(validExposure(exposure, 'b', 2000), false)
  assert.equal(validExposure(exposure, 'a', 999), false)
  assert.equal(validExposure(exposure, 'a', 1000 + 86400000), false)
  assert.equal(validExposure({ ...exposure, variant: 'unknown' }, 'a', 2000), false)
})

test('first exposure is fixed and engagement is recorded once', () => {
  exposeCards(sdk, 'control')
  const first = readExposure(sdk)
  exposeCards(sdk, 'direct')
  assert.deepEqual(readExposure(sdk), first)
  assert.equal(events.filter(x => x.event === 'catalogue_exposure').length, 1)
  recordEngagement(sdk, 'Abelian-community')
  recordEngagement(sdk, 'Raydium-event')
  assert.equal(events.filter(x => x.event === 'engaged_case_study').length, 1)
  assert.equal(events.at(-1).properties['$feature/homepage-card-preview-v1'], 'control')
})

test('opt-out prevents further events and unavailable storage fails closed', () => {
  const count = events.length
  localStorage.setItem('isakii.analytics.optOut', '1')
  recordEngagement(sdk, 'Abelian-community')
  assert.equal(readExposure(sdk), null)
  assert.equal(events.length, count)
  localStorage.removeItem('isakii.analytics.optOut')
  localStorage.removeItem(EXPOSURE_KEY)
  const get = localStorage.getItem
  localStorage.getItem = () => { throw new Error('Storage blocked') }
  assert.equal(analyticsAllowed(), false)
  exposeCards(sdk, 'direct')
  assert.equal(events.length, count)
  localStorage.getItem = get
})
