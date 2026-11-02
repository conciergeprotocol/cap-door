import { createCapHandler } from '@conciergeprotocol/server'
import { doorOptions } from '../door.js'

// Work after a response is not kept alive here, so each answer finishes inside its request.
const door = doorOptions().then((options) => createCapHandler({
  ...options,
  databaseUrl: process.env.DATABASE_URL || '',
  sqlitePath: process.env.DATABASE_URL ? undefined : ':memory:',
  waitSeconds: 240,
}))

const handle = async (request) => (await door).handle(request)

export const GET = handle
export const HEAD = handle
export const POST = handle
export const OPTIONS = handle
