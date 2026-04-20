import { motion } from 'framer-motion'
import './App.css'

const AIRBNB_URL =
  'https://www.airbnb.be/rooms/1645546262205288199?c=.pi80.pkTUVTU0FHSU5HX05FV19NRVNTQUdFX0VNQUlMX0RJR0VTVA%3D%3D&euid=ec3bd557-b204-f3c4-5b02-d4c8074f2604&source_impression_id=p3_1776406002_P3LyfV7qY_O5H_6q'

const amenities = [
  'Premium bedding and designer interiors',
  'Self check-in for effortless arrivals',
  'High-speed Wi-Fi for work and streaming',
  'Fully equipped kitchen and dining area',
  'Smart TV with major apps',
  'Curated local recommendations',
]

const experiences = [
  {
    title: 'Kortenberg Suites',
    status: 'Now welcoming guests',
    description:
      'Contemporary comfort near Brussels Airport and Leuven, ideal for business trips and elegant city breaks.',
    image:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Oudenaarde Suites',
    status: 'Opening soon',
    description:
      'A refined retreat in the Flemish Ardennes, crafted for scenic escapes and long weekend luxury stays.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
]

function App() {
  return (
    <main className="page">
      <header className="site-header">
        <span className="brand-mark">THE 3 STRIPES SUITES</span>
        <a href={AIRBNB_URL} target="_blank" rel="noreferrer" className="ghost-link">
          View on Airbnb
        </a>
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
        >
          Modern suites with hotel-level comfort in Kortenberg,
          <br />
          and Oudenaarde coming soon.
        </motion.h1>
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
          <a href={AIRBNB_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
            Reserve your stay
          </a>
          <a href="#locations" className="btn btn-secondary">
            Explore locations
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={experience.image} alt={experience.title} loading="lazy" />
            <div className="location-content">
              <span className="status-chip">{experience.status}</span>
              <h3>{experience.title}</h3>
              <p>{experience.description}</p>
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

      <section className="cta">
        <h2>Ready for your next luxury stay?</h2>
        <p>
          Book directly on Airbnb today and be among the first to discover our
          growing collection in Belgium.
        </p>
        <a href={AIRBNB_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
          Book on Airbnb
        </a>
      </section>

      <footer className="footer">
        <p>Luxury suites in Kortenberg. Oudenaarde opening soon.</p>
      </footer>
    </main>
  )
}

export default App
