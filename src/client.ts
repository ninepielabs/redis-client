import RedisClient from './models/RedisClient'

declare global {
  /* eslint-disable */
  var __NINEPIELABS_REDIS_CLIENT__: RedisClient
}

export function createClient(url?: string) {
  if (!url) {
    throw new Error('process.env.REDIS_URL is not defined')
  }
  return new RedisClient(url)
}

const client =
  globalThis.__NINEPIELABS_REDIS_CLIENT__ || createClient(process.env.REDIS_URL as string)

if (!globalThis.__NINEPIELABS_REDIS_CLIENT__) {
  globalThis.__NINEPIELABS_REDIS_CLIENT__ = client
}

export default client
