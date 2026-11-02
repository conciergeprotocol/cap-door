import { existsSync } from 'node:fs'
import { createCapServer } from '@conciergeprotocol/server'
import { doorOptions } from './door.js'

if (existsSync('.env')) process.loadEnvFile('.env')

const cap = await createCapServer(await doorOptions())
const { port } = await cap.listen()
console.log(`CAP door on port ${port}`)
