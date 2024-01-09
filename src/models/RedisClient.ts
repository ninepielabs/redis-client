import { createClient, RedisClientType } from 'redis'
import debug from 'debug'

const DEBUGGER = debug('redis-client')

const DELETED = '__DELETED__'

const log = {
  error: (err: unknown) => DEBUGGER(err),
  info: (msg: unknown) => DEBUGGER(msg),
}

interface RedisClientState {
  get<T = any>(key: string): Promise<T | null>

  set(key: string, value: any): Promise<string | null>

  del(key: string, soft?: boolean): Promise<void>

  incr(key: string): Promise<number>

  expire(key: string, seconds: number): Promise<boolean>
}

class RedisClient implements RedisClientState {
  url: string
  client: RedisClientType
  isConnected: boolean

  constructor(url: string) {
    const client = createClient({ url }).on('error', log.error)

    this.url = url
    this.client = client as RedisClientType
    this.isConnected = false
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect()
      this.isConnected = true

      log.info('Redis connected')
    }
  }

  async get<T = any>(key: string) {
    await this.connect()

    const data = await this.client.get(key)

    try {
      return JSON.parse(data as string) as T
    } catch {
      return null
    }
  }

  async set(key: string, value: any) {
    await this.connect()
    return this.client.set(key, JSON.stringify(value))
  }

  async del(key: string, soft = false) {
    await this.connect()

    if (soft) {
      await this.client.set(key, DELETED)
    } else {
      await this.client.del(key)
    }
  }

  async incr(key: string) {
    await this.connect()

    return this.client.incr(key)
  }

  async expire(key: string, seconds: number) {
    await this.connect()

    return this.client.expire(key, seconds)
  }
}

export default RedisClient
