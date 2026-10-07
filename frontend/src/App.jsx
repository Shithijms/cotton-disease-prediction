import { lazy, Suspense, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Detector from './components/Detector.jsx'
import { DISEASES } from './data.js'

const Scene3D = lazy(() => import('./components/Scene3D.jsx'))
const NAMES = Object.keys(DISEASES)
const NAV = [['Home', '#home'], ['Detect', '#detect'], ['How it works', '#how'], ['Diseases', '#diseases'], ['Why use it', '#why']]

const Pill = ({ children }) => (
  <span className="rounded-full border border-magenta/70 bg-magenta/10 px-3 py-1 text-[11px] font-bold tracking-wide text-mist">{children}</span>
)

function Star({ className }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }} aria-hidden="true">
      <path d="M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2Z" fill="none" stroke="#A6F0E8" strokeWidth="2.5" />
    </motion.svg>
  )
}

export default function App() {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState(NAMES[0])
  const d = DISEASES[tab]
  const reveal = reduce ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6 } }

  return (
    <div className="relative">
      {/* ambient glows, like the reference's purple wash */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_40%_at_0%_20%,rgba(211,27,230,.28),transparent),radial-gradient(50%_40%_at_100%_70%,rgba(34,229,211,.16),transparent)]" />

      {/* Nav */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
            <Star className="h-6 w-6" />Cotton<span className="font-medium text-aqua">Scan</span>
          </a>
          <ul className="glass hidden gap-1 rounded-full p-1 md:flex">
            {NAV.map(([n, h], i) => (
              <li key={n}><a href={h} className={`block rounded-full px-4 py-1.5 text-xs font-bold transition ${i === 0 ? 'bg-white text-abyss' : 'text-mist hover:bg-mist/10'}`}>{n}</a></li>
            ))}
          </ul>
          <a href="#detect" className="rounded-full bg-grad-card px-5 py-2 text-xs font-bold text-white transition hover:brightness-110">Scan a leaf</a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section id="home" className="grid items-center gap-8 pb-16 pt-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2"><Pill>CNN encoder</Pill><Pill>LSTM decoder</Pill><Pill>Teacher-forced training</Pill><Pill>FastAPI</Pill></div>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-5xl font-extrabold uppercase leading-[0.95] sm:text-7xl">
              <span className="text-outline block">Spot the disease</span>
              <span className="block bg-gradient-to-r from-magenta to-violet bg-clip-text text-transparent">before it spreads</span>
            </motion.h1>
            <p className="mt-6 max-w-lg text-lg text-mist/90">Upload a photo of a cotton leaf. Get the disease name, a confidence score and what to do next, in seconds.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#detect" className="rounded-full bg-grad-card px-7 py-3 text-sm font-bold text-white transition hover:brightness-110">Scan a leaf</a>
              <a href="#diseases" className="rounded-full border border-mist/40 px-7 py-3 text-sm font-bold text-white transition hover:bg-mist/10">See the diseases</a>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[22rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet/70 via-deep to-abyss ring-1 ring-mist/20 sm:h-[28rem] lg:rounded-tl-[4rem]">
              {!reduce && <Suspense fallback={null}><Scene3D /></Suspense>}
            </div>
            <Star className="absolute -right-3 -top-5 h-12 w-12" />
          </div>
        </section>

        {/* Marquee */}
        <section aria-label="Conditions recognised" className="pb-20 text-center">
          <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">6 leaf conditions recognised</p>
          <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="marquee flex w-max gap-12 font-display text-2xl font-bold text-mist/60">
              {[...NAMES, ...NAMES, ...NAMES, ...NAMES].map((n, i) => <span key={i}>{n}</span>)}
            </div>
          </div>
        </section>

        {/* Detector */}
        <motion.section id="detect" className="scroll-mt-24 pb-24" {...reveal}>
          <h2 className="mb-2 font-display text-3xl font-extrabold uppercase text-white">Scan a leaf</h2>
          <p className="mb-8 max-w-xl text-mist/80">Choose a clear photo of a single cotton leaf. The model reads the image and writes out its diagnosis.</p>
          <Detector />
          <p className="mt-4 text-xs text-mist/60">This is a screening aid, not a substitute for an agronomist. Confirm serious cases with a local expert before spraying.</p>
        </motion.section>

        {/* How it works */}
        <motion.section id="how" className="scroll-mt-24 pb-24" {...reveal}>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-10">
            <h2 className="font-display text-3xl font-extrabold uppercase text-white">How it works</h2>
            <p className="max-w-md text-sm text-mist/80">One network reads the picture and a second writes the answer, word by word.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="glass rounded-3xl p-6 md:col-span-3"><h3 className="font-display text-xl font-bold text-white">CNN encoder</h3><p className="mt-2 text-sm text-mist/80">An EfficientNet network turns the leaf photo into a compact summary of its colours, textures and spots.</p></div>
            <div className="rounded-3xl bg-grad-card p-6 md:col-span-2"><h3 className="font-display text-xl font-bold text-white">LSTM decoder</h3><p className="mt-2 text-sm text-white/90">Starting from that summary, the decoder writes the disease name one word at a time.</p></div>
            <div className="rounded-3xl bg-grad-card p-6 md:col-span-2"><h3 className="font-display text-xl font-bold text-white">Teacher forcing</h3><p className="mt-2 text-sm text-white/90">While training, the decoder is shown the correct previous word at each step, so it learns faster and more steadily.</p></div>
            <div className="glass rounded-3xl p-6 md:col-span-3"><h3 className="font-display text-xl font-bold text-white">Live prediction</h3><p className="mt-2 text-sm text-mist/80">When you upload a photo there is no answer key. The decoder feeds its own previous word back in until it reaches the end token.</p></div>
          </div>
        </motion.section>

        {/* Diseases */}
        <motion.section id="diseases" className="scroll-mt-24 pb-24" {...reveal}>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-display text-3xl font-extrabold uppercase text-white">Diseases</h2>
            <div role="tablist" className="flex flex-wrap gap-2">
              {NAMES.map((n) => (
                <button key={n} role="tab" aria-selected={tab === n} onClick={() => setTab(n)} className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${tab === n ? 'bg-grad-card text-white' : 'border border-mist/30 text-mist hover:bg-mist/10'}`}>{n}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
            <div>
              <h3 className="bg-gradient-to-r from-magenta to-violet bg-clip-text font-display text-4xl font-extrabold uppercase leading-none text-transparent">{tab}</h3>
              <p className="mt-3 text-sm text-mist/80">Severity: <b className="text-white">{d.severity === 'None' ? 'None, healthy leaf' : d.severity}</b></p>
            </div>
            <motion.div key={tab} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="grid gap-4 sm:grid-cols-3">
              {[['What you see', d.symptoms], ['What to do', d.treatment], ['How to prevent it', d.prevention]].map(([k, v]) => (
                <div key={k} className="flex min-h-[12rem] flex-col justify-end rounded-3xl bg-grad-card p-5">
                  <h4 className="font-display text-lg font-bold text-white">{k}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{v}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Why */}
        <motion.section id="why" className="scroll-mt-24 pb-24" {...reveal}>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-10">
            <h2 className="font-display text-3xl font-extrabold uppercase text-white">Why use it</h2>
            <p className="max-w-sm text-sm text-mist/80">Built for quick checks in the field, not lab reports.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Results in seconds', 'Advice in plain language', 'Works with phone photos', 'Shows its word-by-word answer', 'Six conditions covered', 'Open API with live docs'].map((t) => (
              <motion.div key={t} whileHover={reduce ? undefined : { y: -4 }} className="glass rounded-2xl p-5">
                <div className="mb-8 grid h-8 w-8 place-items-center rounded-lg bg-magenta text-sm font-bold text-white">✓</div>
                <p className="font-display text-lg font-bold text-white">{t}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-mist/10 px-4 py-8 text-center text-xs text-mist/60">
        CottonScan is a research prototype for screening support, not a diagnosis.
      </footer>
    </div>
  )
}
