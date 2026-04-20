import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import ical from 'node-ical'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = Number(process.env.PORT ?? 8787)
const SMOOBU_PROPERTY_ID = process.env.SMOOBU_PROPERTY_ID ?? '1681867'
const SMOOBU_ICAL_TOKEN = process.env.SMOOBU_ICAL_TOKEN ?? ''
const SMOOBU_ICAL_URL = process.env.SMOOBU_ICAL_URL ?? ''
const CACHE_MS = Number(process.env.AVAILABILITY_CACHE_MINUTES ?? 10) * 60 * 1000
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'bookings@the3stripes.be'
const SMTP_HOST = process.env.SMTP_HOST ?? ''
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587)
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
const SMTP_USER = process.env.SMTP_USER ?? ''
const SMTP_PASS = process.env.SMTP_PASS ?? ''
const SMTP_FROM = process.env.SMTP_FROM ?? CONTACT_TO_EMAIL

const cache = {
  fetchedAt: 0,
  payload: null,
}

let mailerTransport = null

function getMailerTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  if (mailerTransport) {
    return mailerTransport
  }

  mailerTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  return mailerTransport
}

function toDateOnlyISO(date) {
  return date.toISOString().slice(0, 10)
}

function getCalendarUrl() {
  if (SMOOBU_ICAL_URL) {
    return SMOOBU_ICAL_URL
  }

  if (!SMOOBU_PROPERTY_ID || !SMOOBU_ICAL_TOKEN) {
    return ''
  }

  return `https://login.smoobu.com/ical/detail/${SMOOBU_PROPERTY_ID}.ics?s=${SMOOBU_ICAL_TOKEN}`
}

function getDateRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const to = new Date(from)
  to.setDate(to.getDate() + 365)
  return { from, to }
}

function buildBlockedDates(events, range) {
  const blocked = new Set()

  for (const event of events) {
    if (event.type !== 'VEVENT' || !event.start) {
      continue
    }

    const start = new Date(event.start)
    const end = event.end ? new Date(event.end) : new Date(start.getTime() + 86400000)

    if (end < range.from || start > range.to) {
      continue
    }

    const day = new Date(Math.max(start.getTime(), range.from.getTime()))
    day.setHours(0, 0, 0, 0)

    const exclusiveEnd = new Date(Math.min(end.getTime(), range.to.getTime() + 86400000))
    exclusiveEnd.setHours(0, 0, 0, 0)

    while (day < exclusiveEnd) {
      blocked.add(toDateOnlyISO(day))
      day.setDate(day.getDate() + 1)
    }
  }

  return Array.from(blocked).sort()
}

async function fetchAvailabilityPayload() {
  const calendarUrl = getCalendarUrl()

  if (!calendarUrl) {
    const range = getDateRange()
    return {
      configured: false,
      source: 'not-configured',
      stale: false,
      message:
        'Smoobu calendar is not configured. Add SMOOBU_ICAL_URL or SMOOBU_ICAL_TOKEN in .env.',
      lastUpdated: null,
      blockedDates: [],
      range: { from: toDateOnlyISO(range.from), to: toDateOnlyISO(range.to) },
    }
  }

  const now = Date.now()
  if (cache.payload && now - cache.fetchedAt < CACHE_MS) {
    return cache.payload
  }

  const range = getDateRange()
  const parsed = await ical.async.fromURL(calendarUrl)
  const events = Object.values(parsed)
  const blockedDates = buildBlockedDates(events, range)

  const payload = {
    configured: true,
    source: 'smoobu-ical',
    stale: false,
    message: null,
    lastUpdated: new Date().toISOString(),
    blockedDates,
    range: { from: toDateOnlyISO(range.from), to: toDateOnlyISO(range.to) },
  }

  cache.payload = payload
  cache.fetchedAt = now
  return payload
}

app.get('/api/availability', async (_req, res) => {
  try {
    const payload = await fetchAvailabilityPayload()
    res.json(payload)
  } catch (error) {
    const calendarUrl = getCalendarUrl()

    if (cache.payload) {
      res.json({
        ...cache.payload,
        stale: true,
        message: 'Smoobu sync temporarily unavailable. Showing latest cached data.',
      })
      return
    }

    res.status(502).json({
      configured: Boolean(calendarUrl),
      source: 'smoobu-ical',
      stale: true,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to read Smoobu calendar feed.',
      lastUpdated: null,
      blockedDates: [],
      range: null,
    })
  }
})

app.post('/api/contact', async (req, res) => {
  const { fullName, email, company, phone, message } = req.body ?? {}

  if (
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    fullName.trim().length < 2 ||
    email.trim().length < 5 ||
    message.trim().length < 10
  ) {
    res.status(400).json({
      ok: false,
      message: 'Please complete all required contact fields.',
    })
    return
  }

  const transport = getMailerTransport()
  if (!transport) {
    res.status(503).json({
      ok: false,
      message: 'Email service is not configured yet.',
    })
    return
  }

  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: CONTACT_TO_EMAIL,
      replyTo: email.trim(),
      subject: `Enterprise rental request - ${fullName.trim()}`,
      text: [
        'New enterprise rental inquiry from website',
        '',
        `Name: ${fullName.trim()}`,
        `Email: ${email.trim()}`,
        `Company: ${typeof company === 'string' ? company.trim() : ''}`,
        `Phone: ${typeof phone === 'string' ? phone.trim() : ''}`,
        '',
        'Message:',
        message.trim(),
      ].join('\n'),
    })

    res.json({
      ok: true,
      message: 'Your request has been sent successfully.',
    })
  } catch (error) {
    res.status(502).json({
      ok: false,
      message:
        error instanceof Error ? error.message : 'Unable to send email right now.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Availability API running on http://localhost:${PORT}`)
})
