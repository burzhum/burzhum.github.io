import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { runCommand } from '../lib/terminal'

export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState([{ lines: ["type 'help' to begin"] }])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === '`') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-terminal', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-terminal', onOpen)
    }
  }, [])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => { endRef.current?.scrollIntoView() }, [history])

  const submit = (e) => {
    e.preventDefault()
    const res = runCommand(input)
    if (res.action === 'clear') setHistory([])
    else setHistory(h => [...h, { prompt: input, lines: res.lines }])
    if (res.action === 'exit') setTimeout(() => setOpen(false), 300)
    if (res.action === 'nav-lab') setTimeout(() => { setOpen(false); navigate('/lab') }, 400)
    setInput('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-0 z-50 h-[45vh] bg-bg border-t-2 border-accent font-mono text-xs md:text-sm flex flex-col"
          role="dialog" aria-label="terminal"
        >
          <div className="flex justify-between items-center px-4 py-1.5 border-b border-line text-muted">
            <span>asrul@infra: interactive session</span>
            <button onClick={() => setOpen(false)} className="hover:text-accent">[x] esc</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {history.map((h, i) => (
              <div key={i}>
                {h.prompt !== undefined && <p><span className="text-accent">$ </span>{h.prompt}</p>}
                {h.lines.map((l, j) => <p key={j} className="text-muted whitespace-pre-wrap">{l}</p>)}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 px-4 py-2 border-t border-line">
            <span className="text-accent">$</span>
            <input
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-ink"
              style={{ caretColor: 'var(--accent)' }}
              aria-label="terminal input" autoComplete="off" spellCheck="false"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
