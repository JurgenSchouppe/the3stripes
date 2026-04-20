import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { motion } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { formatDistanceToNow } from 'date-fns'
import 'react-day-picker/dist/style.css'
import './App.css'
import the3stripesLogo from './assets/the3stripes-logo.png'
import kortenberg0181 from './assets/kortenberg-0181.png'
import kortenberg8797 from './assets/kortenberg-8797.png'
import kortenberg8373 from './assets/kortenberg-8373.png'
import kortenberg8374 from './assets/kortenberg-8374.png'
import kortenberg8508 from './assets/kortenberg-8508.png'
import kortenberg8377 from './assets/kortenberg-8377.png'

const AIRBNB_URL =
  'https://www.airbnb.be/rooms/1645546262205288199?c=.pi80.pkTUVTU0FHSU5HX05FV19NRVNTQUdFX0VNQUlMX0RJR0VTVA%3D%3D&euid=ec3bd557-b204-f3c4-5b02-d4c8074f2604&source_impression_id=p3_1776406002_P3LyfV7qY_O5H_6q'
const BOOKING_URL =
  'https://www.booking.com/hotel/be/deluxe-home-garden-and-pool-optional-pm.nl.html?label=gen173bo-10CAsoFUInZGVsdXhlLWhvbWUtZ2FyZGVuLWFuZC1wb29sLW9wdGlvbmFsLXBtSDNYA2gViAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuALP7YfPBsACAdICJGQ3OWFlMWE1LWFlODEtNGE3YS1hNDkwLTQzMTQ3N2FmNzZlN9gCAeACAQ&sid=6bf9c63780af410d6023465a5c40c489&dist=0&sb_price_type=total&type=total&chal_t=1776667916488&force_referer='
const WHATSAPP_URL = 'https://wa.me/32470963710'

const amenities = [
  'Premium bedding and designer interiors',
  'Self check-in for effortless arrivals',
  'High-speed Wi-Fi for work and streaming',
  'Fully equipped kitchen and dining area',
  'Smart TV with major apps',
  'Curated local recommendations',
]

const gardenPoolThumbs = [
  'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/00b88a7c-cb5d-4911-8e66-68beacf0e87f.jpeg',
  'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/faedbe63-7498-4e7c-a7f0-d688b28447b5.jpeg',
  kortenberg8797,
  kortenberg8373,
  kortenberg8374,
  kortenberg8508,
  kortenberg8377,
]

type Suite = {
  id: string
  title: string
  status: string
  description: string
  photos: string[]
}

const experiences = [
  {
    id: 'kortenberg',
    title: 'Kortenberg Suites',
    status: 'Now welcoming guests',
    description:
      'Contemporary comfort near Brussels Airport and Leuven, ideal for business trips and elegant city breaks.',
    photos: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/3283a4c2-577b-4c6a-b8b3-81b13f1ad3e6.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/00a6191d-6643-4aff-a4e0-26db3a60b3a0.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/00b88a7c-cb5d-4911-8e66-68beacf0e87f.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/0986293f-ac6a-4563-b5c1-5fe814b94c4d.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/1a9457b7-9d65-4c0b-87d2-5702d5e890d2.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/1eb5201b-7fd3-41b6-8770-527da0f460ca.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/1f7f5d76-b917-408b-8f8a-bd05e02fd03c.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/21c8da72-a681-4b54-bd1e-b3615221349a.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/2fcee9a0-8dad-404c-9fea-c37d9136d597.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/305f8eb4-fda5-4e9a-a749-9b46c08b1640.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/34821df3-0728-4185-aa03-cd1c3451208b.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/35b298ba-7a38-4d44-a960-d8cfd9a8bc83.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/4179acd3-241f-4f93-9ce0-8dfb54bceb60.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/4ae92a0a-7408-45d4-8a01-6037a1a8338a.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/59666562-374d-4bb3-ab46-21b7664ecb2d.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/5f8c7f67-bbd7-45cf-b9d5-8e2baa163b50.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/61783c17-1ef5-4f31-b76f-6589d6c58cfb.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/657cf230-6b17-417f-b287-eacde2475d4f.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/6ccdd0b0-baa6-46d2-8109-e156c0113fed.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/750ec648-a179-4737-8ead-21b6c7bae757.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/7ab24d98-72a1-4005-8ec5-401166860b99.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/7b8d6dea-6b68-4629-9129-978af75443ab.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/7cdc1a48-86b2-4510-acc0-ba4513693463.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/7d933019-e0ed-40d8-943b-308fce69d4d2.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/86a0d051-dfa2-4df1-a249-1afad2b13f97.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/881ef218-ade4-421e-9688-36ea03cdfc58.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/8a894a81-0965-44f9-9dd0-740dca495be9.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/9368150b-1b6a-4133-9a94-74e0ee5a0ce1.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/a15a263a-d738-4708-b76a-8c7f327def4c.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/a2348ef7-7b3a-4ca9-a2e3-31379cdde235.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/a7e901d8-97b5-4bbd-ab52-0af4cb2b3258.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/abfb9744-93a3-4d8a-9986-4b378630d564.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/d79b2587-be59-439b-82dc-ea6713f9a6d6.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/e54a73b2-472a-42cf-9227-00d2c8e582c0.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/eb84e4e0-2511-4874-84ed-693ac7effc62.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/ee6b4815-9d11-46eb-862c-eec4a2cf5e8b.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/faedbe63-7498-4e7c-a7f0-d688b28447b5.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1645546262205288199/original/fc703bf3-6d5a-41a6-bf0f-7a4db996c841.jpeg',
      kortenberg0181,
      kortenberg8797,
      kortenberg8373,
      kortenberg8374,
      kortenberg8508,
      kortenberg8377,
    ],
  },
  {
    id: 'oudenaarde',
    title: 'Oudenaarde Suites',
    status: 'Opening soon',
    description:
      'A refined retreat in the Flemish Ardennes, inspired by the iconic Koppenberg cobbles and wooded cycling climbs.',
    photos: [
      'https://mooistestedentrips.nl/wp-content/uploads/2022/03/oudenaarde-belgie-tips.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/3/34/Koppenberg_hill_1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/59/Koppenberg_hill_2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/20/Koppenberg_cobbles.jpg',
    ],
  },
] satisfies Suite[]

const MIN_STAY_NIGHTS = 2

type AvailabilityPayload = {
  configured: boolean
  source: string
  stale: boolean
  message: string | null
  lastUpdated: string | null
  blockedDates: string[]
  range: {
    from: string
    to: string
  }
}

type ContactFormData = {
  fullName: string
  email: string
  company: string
  phone: string
  message: string
}

function App() {
  const [availability, setAvailability] = useState<AvailabilityPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeSuiteId, setActiveSuiteId] = useState<string | null>(null)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isBookingSelectorOpen, setIsBookingSelectorOpen] = useState(false)
  const gardenPoolStripRef = useRef<HTMLDivElement | null>(null)
  const [contactForm, setContactForm] = useState<ContactFormData>({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })
  const [isSendingContact, setIsSendingContact] = useState(false)
  const [contactStatus, setContactStatus] = useState<{
    kind: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadAvailability = async () => {
      try {
        const response = await fetch('/api/availability', {
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Could not load availability right now.')
        }

        const payload = (await response.json()) as AvailabilityPayload
        if (!isMounted) {
          return
        }

        setAvailability(payload)
        setErrorMessage(null)
      } catch (error) {
        if (!isMounted) {
          return
        }
        const fallbackMessage =
          error instanceof Error ? error.message : 'Could not load availability.'
        setErrorMessage(fallbackMessage)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadAvailability()
    const refreshId = window.setInterval(loadAvailability, 5 * 60 * 1000)

    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [])

  const blockedDays = useMemo(
    () => (availability?.blockedDates ?? []).map((day) => new Date(`${day}T00:00:00`)),
    [availability],
  )

  const activeSuite = useMemo(
    () => experiences.find((suite) => suite.id === activeSuiteId) ?? null,
    [activeSuiteId],
  )

  useEffect(() => {
    if (!activeSuite) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSuiteId(null)
        return
      }

      if (event.key === 'ArrowRight') {
        setActivePhotoIndex((currentIndex) =>
          (currentIndex + 1) % activeSuite.photos.length,
        )
      }

      if (event.key === 'ArrowLeft') {
        setActivePhotoIndex((currentIndex) =>
          (currentIndex - 1 + activeSuite.photos.length) % activeSuite.photos.length,
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSuite])

  const openSuiteViewer = (suiteId: string) => {
    setActiveSuiteId(suiteId)
    setActivePhotoIndex(0)
  }

  const onLocationCardKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
    suiteId: string,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openSuiteViewer(suiteId)
    }
  }

  const closeSuiteViewer = () => {
    setActiveSuiteId(null)
  }

  const openBookingSelector = () => {
    setIsBookingSelectorOpen(true)
  }

  const closeBookingSelector = () => {
    setIsBookingSelectorOpen(false)
  }

  const openKortenbergPhoto = (photoUrl: string) => {
    const suite = experiences.find((item) => item.id === 'kortenberg')
    if (!suite) {
      return
    }

    const photoIndex = suite.photos.indexOf(photoUrl)
    setActiveSuiteId('kortenberg')
    setActivePhotoIndex(photoIndex >= 0 ? photoIndex : 0)
  }

  const scrollGardenThumbs = (direction: 'left' | 'right') => {
    const container = gardenPoolStripRef.current
    if (!container) {
      return
    }

    const amount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  const onContactFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setContactForm((current) => ({ ...current, [name]: value }))
  }

  const submitEnterpriseContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSendingContact(true)
    setContactStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string }

      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.message ?? 'Unable to send your request right now.')
      }

      setContactStatus({
        kind: 'success',
        message: 'Thanks, your enterprise request was sent to bookings@the3stripes.be.',
      })
      setContactForm({
        fullName: '',
        email: '',
        company: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      setContactStatus({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Unable to send your request right now.',
      })
    } finally {
      setIsSendingContact(false)
    }
  }

  const goToNextPhoto = () => {
    if (!activeSuite) {
      return
    }

    setActivePhotoIndex((currentIndex) => (currentIndex + 1) % activeSuite.photos.length)
  }

  const goToPreviousPhoto = () => {
    if (!activeSuite) {
      return
    }

    setActivePhotoIndex(
      (currentIndex) => (currentIndex - 1 + activeSuite.photos.length) % activeSuite.photos.length,
    )
  }

  const lastUpdatedLabel =
    availability?.lastUpdated != null
      ? formatDistanceToNow(new Date(availability.lastUpdated), { addSuffix: true })
      : null

  return (
    <main className="page">
      <div className="top-banner" role="note" aria-label="Special rental announcement">
        Kortenberg is also available on custom demand with heated pool, garden, and
        poolhouse access on special request.
      </div>
      <section className="garden-pool-strip" aria-label="Garden and pool thumbnails">
        <p>Garden, heated pool and poolhouse preview</p>
        <div className="garden-pool-carousel">
          <button
            type="button"
            className="garden-nav-btn"
            aria-label="Scroll garden thumbnails left"
            onClick={() => scrollGardenThumbs('left')}
          >
            &#8249;
          </button>
          <div className="garden-pool-grid" ref={gardenPoolStripRef}>
            {gardenPoolThumbs.map((photo) => (
              <button
                key={photo}
                type="button"
                className="garden-pool-thumb"
                onClick={() => openKortenbergPhoto(photo)}
              >
                <img src={photo} alt="Kortenberg garden or pool area" loading="lazy" />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="garden-nav-btn"
            aria-label="Scroll garden thumbnails right"
            onClick={() => scrollGardenThumbs('right')}
          >
            &#8250;
          </button>
        </div>
      </section>

      <header className="site-header">
        <img src={the3stripesLogo} alt="The 3 Stripes Suites logo" className="brand-logo" />
        <div className="header-links">
          <a href={AIRBNB_URL} target="_blank" rel="noreferrer" className="ghost-link">
            View on Airbnb
          </a>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="ghost-link">
            View on Booking.com
          </a>
          <a href="#enterprise-contact" className="ghost-link oak-link">
            Business Rental
          </a>
        </div>
      </header>

      <section className="hero">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Luxury short stays in Belgium
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Experience calm interiors, premium finishes, and seamless stays designed
          for couples, professionals, and travelers who appreciate details.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            type="button"
            className="btn btn-primary btn-action"
            onClick={openBookingSelector}
          >
            Reserve your stay
          </button>
          <a href="#locations" className="btn btn-secondary">
            Explore locations
          </a>
          <a href="#enterprise-contact" className="btn btn-secondary">
            Enterprise & Business Rental
          </a>
        </motion.div>
      </section>

      <section className="stats">
        <article>
          <h2>2</h2>
          <p>Signature destinations</p>
        </article>
        <article>
          <h2>24/7</h2>
          <p>Self check-in comfort</p>
        </article>
        <article>
          <h2>5-star</h2>
          <p>Design-inspired experience</p>
        </article>
      </section>

      <section id="locations" className="locations">
        {experiences.map((experience, index) => (
          <motion.article
            key={experience.title}
            className="location-card"
            role="button"
            tabIndex={0}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => openSuiteViewer(experience.id)}
            onKeyDown={(event) => onLocationCardKeyDown(event, experience.id)}
          >
            <img src={experience.photos[0]} alt={experience.title} loading="lazy" />
            <div className="location-content">
              <span className="status-chip">{experience.status}</span>
              <h3>{experience.title}</h3>
              <p>{experience.description}</p>
              <button
                type="button"
                className="suite-viewer-btn"
                onClick={() => openSuiteViewer(experience.id)}
              >
                View suite photos
              </button>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="amenities">
        <h2>Why guests choose us</h2>
        <div className="amenity-grid">
          {amenities.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section id="enterprise-contact" className="enterprise-contact">
        <div className="enterprise-copy">
          <h2>Enterprise and business rental requests</h2>
          <p>
            Need a tailored company stay or project housing in Kortenberg? Our
            setup includes a separate office area for focused work, meetings, and
            longer business stays. Send your request and we will respond quickly.
          </p>
        </div>
        <form className="enterprise-form" onSubmit={submitEnterpriseContact}>
          <div className="enterprise-grid">
            <input
              name="fullName"
              value={contactForm.fullName}
              onChange={onContactFieldChange}
              placeholder="Full name *"
              required
            />
            <input
              name="email"
              type="email"
              value={contactForm.email}
              onChange={onContactFieldChange}
              placeholder="Business email *"
              required
            />
            <input
              name="company"
              value={contactForm.company}
              onChange={onContactFieldChange}
              placeholder="Company"
            />
            <input
              name="phone"
              value={contactForm.phone}
              onChange={onContactFieldChange}
              placeholder="Phone"
            />
          </div>
          <textarea
            name="message"
            value={contactForm.message}
            onChange={onContactFieldChange}
            placeholder="Tell us your dates, team size, and specific needs *"
            rows={5}
            required
          />
          <button type="submit" className="btn btn-primary btn-action" disabled={isSendingContact}>
            {isSendingContact ? 'Sending...' : 'Send request'}
          </button>
          {contactStatus && (
            <p className={`enterprise-status ${contactStatus.kind}`}>{contactStatus.message}</p>
          )}
        </form>
      </section>

      <section className="availability">
        <div className="availability-copy">
          <h2>Live availability calendar</h2>
          <p>
            This calendar syncs from Smoobu via iCal and refreshes automatically every
            5 minutes to keep your website aligned with booking availability.
          </p>
          {availability?.configured === false && (
            <p className="availability-note">
              Add Smoobu calendar settings in <code>.env</code> (
              <code>SMOOBU_ICAL_URL</code> or <code>SMOOBU_ICAL_TOKEN</code>) to enable this
              live sync.
            </p>
          )}
          {errorMessage && <p className="availability-error">{errorMessage}</p>}
          {availability?.stale && (
            <p className="availability-note">
              Showing cached data while Smoobu sync catches up.
            </p>
          )}
          {lastUpdatedLabel && (
            <p className="availability-meta">Last synced {lastUpdatedLabel}.</p>
          )}
          <p className="availability-note">
            Minimum stay: {MIN_STAY_NIGHTS} nights (final rules remain managed on Airbnb).
          </p>
          <div className="availability-legend" aria-label="Calendar legend">
            <span>
              <i className="legend-dot legend-available" /> Available
            </span>
            <span>
              <i className="legend-dot legend-blocked" /> Blocked
            </span>
          </div>
        </div>
        <div className="calendar-wrap">
          {isLoading ? (
            <p className="availability-meta">Loading calendar...</p>
          ) : (
            <DayPicker
              mode="single"
              numberOfMonths={2}
              disabled={blockedDays}
              captionLayout="dropdown"
              fromYear={new Date().getFullYear()}
              toYear={new Date().getFullYear() + 2}
              pagedNavigation
              className="availability-calendar"
            />
          )}
        </div>
      </section>

      <section className="cta">
        <h2>Ready for your next luxury stay?</h2>
        <p>
          Book directly on Airbnb today and be among the first to discover our
          growing collection in Belgium.
        </p>
        <div className="cta-actions">
          <button
            type="button"
            className="btn btn-primary btn-action"
            onClick={openBookingSelector}
          >
            Book on Airbnb
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-action"
            onClick={openBookingSelector}
          >
            Book on Booking.com
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>Luxury suites in Kortenberg. Oudenaarde opening soon.</p>
      </footer>

      {activeSuite && (
        <div className="suite-viewer-overlay" role="dialog" aria-modal="true">
          <div className="suite-viewer-panel">
            <div className="suite-viewer-top">
              <div>
                <h3>{activeSuite.title}</h3>
                <p>
                  Photo {activePhotoIndex + 1} of {activeSuite.photos.length}
                </p>
              </div>
              <button
                type="button"
                className="suite-viewer-close"
                onClick={closeSuiteViewer}
                aria-label="Close photo viewer"
              >
                Close
              </button>
            </div>

            <img
              src={activeSuite.photos[activePhotoIndex]}
              alt={`${activeSuite.title} photo ${activePhotoIndex + 1}`}
              className="suite-viewer-main-photo"
            />

            <div className="suite-viewer-controls">
              <button type="button" className="suite-viewer-nav" onClick={goToPreviousPhoto}>
                Previous
              </button>
              <button type="button" className="suite-viewer-nav" onClick={goToNextPhoto}>
                Next
              </button>
            </div>

            <div className="suite-viewer-thumbs">
              {activeSuite.photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  className={`suite-thumb ${index === activePhotoIndex ? 'is-active' : ''}`}
                  onClick={() => setActivePhotoIndex(index)}
                >
                  <img src={photo} alt={`${activeSuite.title} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isBookingSelectorOpen && (
        <div
          className="booking-selector-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Choose booking platform"
          onClick={closeBookingSelector}
        >
          <div className="booking-selector-card" onClick={(event) => event.stopPropagation()}>
            <h3>Choose where to book</h3>
            <p>Select your preferred booking platform.</p>
            <div className="booking-selector-actions">
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                onClick={closeBookingSelector}
              >
                Book on Airbnb
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                onClick={closeBookingSelector}
              >
                Book on Booking.com
              </a>
            </div>
            <button
              type="button"
              className="booking-selector-cancel"
              onClick={closeBookingSelector}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-fab"
      >
        <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 3.2c-7.1 0-12.8 5.7-12.8 12.8 0 2.4.7 4.8 2 6.8L3 29l6.4-2.1c1.9 1 4.2 1.6 6.6 1.6 7.1 0 12.8-5.7 12.8-12.8S23.1 3.2 16 3.2Zm0 23.1c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.8 1.3 1.2-3.7-.2-.4c-1.1-1.7-1.6-3.6-1.6-5.7 0-5.7 4.6-10.4 10.4-10.4S26.4 10 26.4 15.7 21.8 26.3 16 26.3Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.7-1-1-1.6-2.2-1.8-2.5-.2-.3 0-.5.1-.6.1-.1.3-.3.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-.9-2.4-.3-.6-.5-.6-.7-.6h-.6c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.4.7.3 1.3.6 1.7.7.7.2 1.4.2 1.9.1.6-.1 1.8-.8 2-1.5.3-.7.3-1.3.2-1.5 0-.1-.2-.2-.5-.3Z"
          />
        </svg>
      </a>
    </main>
  )
}

export default App
