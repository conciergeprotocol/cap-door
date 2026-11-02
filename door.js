import { createAnswer } from '@conciergeprotocol/agent'
import { generateText } from 'ai'
import { canonicalOrigin, detectSources, normalizeUrl, pickModel, siteName } from 'create-cap-door'

/** The door's settings, read from the environment and the website itself. */
export async function doorOptions() {
  if (!process.env.SITE_URL) throw new Error('Set SITE_URL to the website this door answers for, such as https://harborgoods.example.')
  const origin = await canonicalOrigin(normalizeUrl(process.env.SITE_URL))
  const [name, sources, model] = await Promise.all([
    process.env.SITE_NAME || siteName(origin),
    detectSources(origin),
    process.env.CAP_MODEL || chooseModel(),
  ])
  const answer = await createAnswer({
    model,
    instructions: `You are the concierge for ${name}, the website at ${origin}. Answer from the website. End each answer with the link to the page you used. When the site does not say, say so and link to ${origin}.`,
    sources,
    dailyTokens: Number(process.env.CAP_DAILY_TOKENS || 500_000),
  })
  console.log(`CAP door for ${origin} as "${name}" on ${model}`)
  return {
    agent: { name, chat: process.env.CHAT_URL || '' },
    answer,
    dailyLimit: Number(process.env.CAP_DAILY_LIMIT || 50),
  }
}

async function chooseModel() {
  const { model, error } = await pickModel(generateText)
  if (!model) throw new Error(`No model answered through AI Gateway: ${error}`)
  return model
}
