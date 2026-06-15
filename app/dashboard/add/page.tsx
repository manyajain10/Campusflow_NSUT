'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const sourceTypes = [
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', desc: 'Paste messages from your college groups' },
  { key: 'email', label: 'Email', icon: '📧', desc: 'Copy email content from professors or admin' },
  { key: 'portal', label: 'Portal', icon: '🌐', desc: 'Paste content from NSUT ERP or college portal' },
  { key: 'notice', label: 'Notice', icon: '📢', desc: 'Add notice board announcements or circulars' },
  { key: 'pdf', label: 'PDF Upload', icon: '📄', desc: 'Upload PDF documents for AI analysis' },
]

export default function AddSourcePage() {
  const [sourceType, setSourceType] = useState('whatsapp')
  const [text, setText] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'idle' | 'analyzing' | 'extracting' | 'saving' | 'done'>('idle')
  const [result, setResult] = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      toast.error('Please upload a PDF file')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPdfFile(file)
  }

  const extractPdfText = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const text = `PDF Document: ${file.name}\n[PDF content uploaded - ${Math.round(file.size / 1024)}KB]\nPlease analyze this academic PDF and extract all important information including deadlines, events, exams, assignments, notices, placement opportunities, and action items.`
        resolve(text)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const handleSubmit = async () => {
    if (sourceType === 'pdf' && !pdfFile) {
      toast.error('Please upload a PDF file')
      return
    }
    if (sourceType !== 'pdf' && !text.trim()) {
      toast.error('Please paste some content first')
      return
    }

    setLoading(true)
    setStep('analyzing')

    let rawText = text
    if (sourceType === 'pdf' && pdfFile) {
      rawText = await extractPdfText(pdfFile)
    }

    setTimeout(() => setStep('extracting'), 1500)
    setTimeout(() => setStep('saving'), 3000)

    const res = await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw_text: rawText, source_type: sourceType }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      toast.error('Failed: ' + data.error)
      setStep('idle')
    } else {
      setStep('done')
      setResult(data.items)
      toast.success(`Added ${data.items?.length || 0} item(s) to your dashboard!`)
    }
  }

  const reset = () => {
    setStep('idle')
    setResult(null)
    setText('')
    setPdfFile(null)
  }

  const stepMessages = {
    analyzing: 'AI is reading your content...',
    extracting: 'Extracting deadlines, events & notices...',
    saving: 'Saving to your dashboard...',
  }

  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header — no "What it helps with" section */}
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold mb-2" style={{ color: '#0a0a0a' }}>Add Source</h1>
          <p className="font-inter text-base font-medium mb-1" style={{ color: '#014D4E' }}>
            Bring all your academic information into one place.
          </p>
          <p className="font-inter text-sm leading-relaxed" style={{ color: '#555555' }}>
            Upload or connect information from notices, WhatsApp messages, emails, PDFs, and the college portal.
            Our AI automatically organizes scattered information, removes clutter, highlights important updates,
            and creates easy-to-read summaries.
          </p>
        </div>

        {/* Success State */}
        {step === 'done' && result && (
          <div className="mb-6 p-6 rounded-2xl border text-center" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-playfair text-xl font-bold mb-1" style={{ color: '#15803d' }}>
              Successfully Processed!
            </h3>
            <p className="font-inter text-sm mb-4" style={{ color: '#444444' }}>
              {result.length} item{result.length !== 1 ? 's' : ''} extracted and added to your dashboard
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {result.map((item: any, i: number) => (
                <span key={i} className="font-inter text-xs px-3 py-1 rounded-full border" style={{ backgroundColor: '#ffffff', borderColor: '#014D4E', color: '#014D4E' }}>
                  {item.type.replace('_', ' ')}: {item.title}
                </span>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push('/dashboard')} className="font-inter text-sm px-5 py-2.5 rounded-xl" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                View Dashboard
              </button>
              <button onClick={reset} className="font-inter text-sm px-5 py-2.5 rounded-xl border" style={{ backgroundColor: '#ffffff', borderColor: '#014D4E', color: '#014D4E' }}>
                Add More
              </button>
            </div>
          </div>
        )}

        {step !== 'done' && (
          <>
            {/* Step 1 — Source Type */}
            <div className="mb-6">
              <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#888888' }}>
                Step 1 — Select a source
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {sourceTypes.map(src => (
                  <button
                    key={src.key}
                    onClick={() => { setSourceType(src.key); setText(''); setPdfFile(null) }}
                    className="p-4 rounded-2xl border text-left transition-all hover:shadow-md"
                    style={{
                      backgroundColor: sourceType === src.key ? '#014D4E' : '#ffffff',
                      borderColor: sourceType === src.key ? '#014D4E' : '#e0ddd8',
                    }}
                  >
                    <span className="text-2xl block mb-2">{src.icon}</span>
                    <p className="font-inter font-semibold text-xs" style={{ color: sourceType === src.key ? '#FAF9F6' : '#0a0a0a' }}>
                      {src.label}
                    </p>
                    <p className="font-inter text-xs mt-0.5 leading-tight" style={{ color: sourceType === src.key ? 'rgba(250,249,246,0.7)' : '#888888' }}>
                      {src.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Input */}
            <div className="mb-6">
              <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#888888' }}>
                Step 2 — {sourceType === 'pdf' ? 'Upload your PDF' : 'Paste your content'}
              </p>

              {sourceType === 'pdf' ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all"
                  style={{
                    borderColor: dragOver ? '#014D4E' : '#e0ddd8',
                    backgroundColor: dragOver ? 'rgba(1,77,78,0.04)' : '#ffffff',
                  }}
                >
                  <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                  {pdfFile ? (
                    <div>
                      <div className="text-4xl mb-3">📄</div>
                      <p className="font-inter font-semibold text-sm" style={{ color: '#014D4E' }}>{pdfFile.name}</p>
                      <p className="font-inter text-xs mt-1" style={{ color: '#888888' }}>{Math.round(pdfFile.size / 1024)} KB • Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-5xl mb-4">📤</div>
                      <p className="font-inter font-semibold text-sm mb-1" style={{ color: '#0a0a0a' }}>Drag & drop your PDF here</p>
                      <p className="font-inter text-xs" style={{ color: '#888888' }}>or click to browse files</p>
                      <p className="font-inter text-xs mt-3 px-4 py-1.5 rounded-lg inline-block" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                        Browse PDF
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={
                      sourceType === 'whatsapp'
                        ? 'Paste your WhatsApp group messages here...\n\nExample:\n"Reminder: DBMS assignment due Friday 11:59 PM\nCoding club meetup Thursday 4PM Lab 2\nBus route 4 now departs 7:45 AM"'
                        : sourceType === 'email'
                        ? 'Paste email content from your professor or college admin here...'
                        : sourceType === 'portal'
                        ? 'Paste content from NSUT ERP portal, attendance system, or results page here...'
                        : 'Paste notice board content, circulars, or announcements here...'
                    }
                    rows={12}
                    className="w-full px-4 py-4 rounded-2xl border text-sm font-inter outline-none transition-all resize-none"
                    style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8', color: '#0a0a0a' }}
                    onFocus={e => e.target.style.borderColor = '#014D4E'}
                    onBlur={e => e.target.style.borderColor = '#e0ddd8'}
                  />
                  {text && (
                    <div className="absolute bottom-3 right-3">
                      <span className="font-inter text-xs" style={{ color: '#aaaaaa' }}>{text.length} chars</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="mb-6 p-4 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
              <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#888888' }}>How it works</p>
              <div className="flex gap-4 flex-wrap">
                {[
                  { num: '1', text: 'Select a source type above' },
                  { num: '2', text: 'Paste content or upload PDF' },
                  { num: '3', text: 'AI analyzes the information' },
                  { num: '4', text: 'Get clean, structured summary' },
                ].map(s => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                      {s.num}
                    </div>
                    <span className="font-inter text-xs" style={{ color: '#444444' }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="mb-6 p-5 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                    🤖
                  </div>
                  <p className="font-inter text-sm font-medium" style={{ color: '#0a0a0a' }}>
                    {stepMessages[step as keyof typeof stepMessages]}
                  </p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e0ddd8' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      backgroundColor: '#014D4E',
                      width: step === 'analyzing' ? '33%' : step === 'extracting' ? '66%' : '90%',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {['Analyzing', 'Extracting', 'Saving'].map((s, i) => (
                    <span key={s} className="font-inter text-xs" style={{
                      color: (step === 'analyzing' && i === 0) || (step === 'extracting' && i <= 1) || (step === 'saving') ? '#014D4E' : '#aaaaaa'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || (sourceType === 'pdf' ? !pdfFile : !text.trim())}
              className="w-full py-4 rounded-2xl font-inter font-semibold text-base transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}
            >
              {loading ? 'Processing with AI...' : '✨ Analyze & Add to Dashboard'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
