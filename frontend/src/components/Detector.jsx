import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const SEV = { High: 'bg-magenta/90 text-white', Medium: 'bg-violet text-white', None: 'bg-aqua text-abyss' }

export default function Detector() {
  const input = useRef()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const pick = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('Choose a JPG or PNG image of a cotton leaf.'); setStatus('error'); return }
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError(''); setStatus('ready')
  }

  const analyze = async () => {
    setStatus('loading'); setError('')
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch(`${API}/predict`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'The analysis failed. Try again.')
      setResult(data); setStatus('done')
    } catch (e) {
      setError(e.message === 'Failed to fetch' ? `Cannot reach the API at ${API}. Start the backend and try again.` : e.message)
      setStatus('error')
    }
  }

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(''); setStatus('idle') }
  const pct = result ? Math.round(result.confidence * 100) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Upload card */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}
          onClick={() => !preview && input.current.click()}
          onKeyDown={(e) => e.key === 'Enter' && !preview && input.current.click()}
          role="button" tabIndex={0} aria-label="Upload a cotton leaf image"
          className={`relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${drag ? 'border-aqua bg-aqua/10' : 'border-mist/30 bg-deep/60'}`}
        >
          {preview ? (
            <img src={preview} alt="Selected leaf" className="h-full w-full object-cover" />
          ) : (
            <div className="px-6 text-center">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-grad-card text-2xl text-white">+</motion.div>
              <p className="font-display text-xl font-bold text-white">Drop a leaf photo here</p>
              <p className="mt-1 text-sm text-mist/70">or click to choose a JPG or PNG. One leaf, in focus, works best.</p>
            </div>
          )}
          {status === 'loading' && (
            <motion.div className="absolute inset-x-0 h-1 bg-aqua shadow-[0_0_24px_6px_#22E5D3]" initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} />
          )}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files[0])} />
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={analyze} disabled={!file || status === 'loading'} className="rounded-full bg-grad-card px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
            {status === 'loading' ? 'Analysing leaf…' : 'Analyse leaf'}
          </button>
          {preview && <button onClick={reset} className="rounded-full border border-mist/30 px-6 py-3 text-sm font-bold text-mist transition hover:bg-mist/10">Choose another photo</button>}
        </div>
      </div>

      {/* Result card */}
      <div className="glass min-h-[22rem] rounded-3xl p-5 sm:p-6" aria-live="polite">
        <AnimatePresence mode="wait">
          {status === 'done' && result ? (
            <motion.div key="res" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{result.disease}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${SEV[result.severity]}`}>{result.severity === 'None' ? 'Healthy' : `${result.severity} severity`}</span>
              </div>
              <div className="mt-5">
                <div className="mb-1 flex justify-between text-sm"><span>Confidence</span><span className="font-bold text-white">{pct}%</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-deep"><motion.div className="h-full rounded-full bg-gradient-to-r from-aqua to-magenta" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} /></div>
              </div>
              <p className="mb-2 mt-5 text-sm text-mist/70">Words the decoder generated, one at a time:</p>
              <div className="flex flex-wrap gap-2">
                {result.sequence.map((t, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.4 }} className="rounded-full border border-aqua/50 px-3 py-1 font-mono text-xs text-aqua">{t}</motion.span>
                ))}
              </div>
              <dl className="mt-6 space-y-4 text-sm leading-relaxed">
                {[['What you see', result.symptoms], ['What to do', result.treatment], ['How to prevent it', result.prevention]].map(([k, v]) => (
                  <div key={k}><dt className="font-bold text-white">{k}</dt><dd className="text-mist/80">{v}</dd></div>
                ))}
              </dl>
            </motion.div>
          ) : status === 'error' ? (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[18rem] flex-col items-center justify-center text-center">
              <p className="font-display text-xl font-bold text-white">That didn’t work</p>
              <p className="mt-2 max-w-sm text-sm text-mist/80">{error}</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[18rem] flex-col items-center justify-center text-center">
              <p className="font-display text-xl font-bold text-white">Your result appears here</p>
              <p className="mt-2 max-w-sm text-sm text-mist/70">Add a leaf photo and choose Analyse leaf to see the disease, a confidence score and advice.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
