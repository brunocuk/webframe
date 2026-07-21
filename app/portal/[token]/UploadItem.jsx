'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  requestUpload,
  confirmUpload,
  removeUpload,
  saveNote,
  setSkipped,
} from './actions'
import { MAX_UPLOAD_MB } from '@/lib/contentItems'

// PUT via XHR instead of fetch so we can report upload progress.
const putWithProgress = (url, file, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error('Upload failed — please try again.'))
    xhr.onerror = () => reject(new Error('Upload failed — please try again.'))
    xhr.send(file)
  })

export default function UploadItem({ token, item, guide, thumbs }) {
  const inputRef = useRef(null)
  const dragDepth = useRef(0)
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [removing, setRemoving] = useState(null)
  const [progress, setProgress] = useState(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [error, setError] = useState(null)

  const files = Array.isArray(item.files) ? item.files : []
  const note = typeof item.note === 'string' ? item.note.trim() : ''
  const skipped = Boolean(item.optional && item.skipped)
  const done = files.length > 0 || Boolean(note) || skipped
  const imageFiles = files.filter((file) => thumbs?.[file.path])
  const otherFiles = files.filter((file) => !thumbs?.[file.path])

  const handleFiles = async (fileList) => {
    const selected = Array.from(fileList)
    const tooBig = selected.find((file) => file.size > MAX_UPLOAD_MB * 1024 * 1024)
    if (tooBig) {
      setError(
        `“${tooBig.name}” is over ${MAX_UPLOAD_MB} MB — for video or other big files, paste a WeTransfer or Drive link in a note instead.`
      )
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setBusy(true)
    setError(null)
    try {
      for (let i = 0; i < selected.length; i++) {
        const file = selected[i]
        setProgress({ index: i + 1, total: selected.length, name: file.name, pct: 0 })
        const ticket = await requestUpload(token, item.id, file.name, file.size)
        if (ticket.error) throw new Error(ticket.error)
        await putWithProgress(ticket.url, file, (pct) =>
          setProgress({ index: i + 1, total: selected.length, name: file.name, pct })
        )
        const confirmed = await confirmUpload(token, item.id, {
          path: ticket.path,
          name: file.name,
          size: file.size,
        })
        if (confirmed.error) throw new Error(confirmed.error)
      }
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = async (file) => {
    setRemoving(file.path)
    setError(null)
    try {
      const result = await removeUpload(token, item.id, file.path)
      if (result.error) throw new Error(result.error)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setRemoving(null)
    }
  }

  const handleSaveNote = async () => {
    setSavingNote(true)
    setError(null)
    try {
      const result = await saveNote(token, item.id, noteDraft)
      if (result.error) throw new Error(result.error)
      setNoteOpen(false)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingNote(false)
    }
  }

  const handleSkip = async (value) => {
    setSkipping(true)
    setError(null)
    try {
      const result = await setSkipped(token, item.id, value)
      if (result.error) throw new Error(result.error)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSkipping(false)
    }
  }

  // Drag events fire on every child element too, so track enter/leave depth
  // to avoid the highlight flickering while moving across the card.
  const onDragEnter = (e) => {
    e.preventDefault()
    dragDepth.current += 1
    setDragging(true)
  }
  const onDragOver = (e) => e.preventDefault()
  const onDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }
  const onDrop = (e) => {
    e.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (!busy && e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`bg-white rounded-2xl border p-6 transition-colors flex flex-col ${
        dragging
          ? 'border-primary border-dashed bg-purple-50/50'
          : done
            ? 'border-green-200'
            : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900">{item.label}</h3>
        {files.length > 0 ? (
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-semibold text-green-700">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {files.length} file{files.length === 1 ? '' : 's'}
            {note ? ' + note' : ''}
          </span>
        ) : note ? (
          <span className="flex-shrink-0 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-semibold text-green-700">
            note ✓
          </span>
        ) : skipped ? (
          <span className="flex-shrink-0 px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-gray-500">
            skipped ✓
          </span>
        ) : (
          <span className="flex-shrink-0 px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-gray-500">
            waiting
          </span>
        )}
      </div>

      {guide && !done && (
        <>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">{guide.hint}</p>
          <ul className="mb-4 space-y-1.5">
            {guide.tips.map((tip) => (
              <li key={tip} className="flex gap-1.5 text-xs text-gray-500 leading-relaxed">
                <span className="text-primary flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </>
      )}

      {imageFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {imageFiles.map((file) => (
            <div
              key={file.path}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URLs, next/image can't cache these */}
              <img
                src={thumbs[file.path]}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(file)}
                disabled={busy || removing !== null}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] leading-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50"
                aria-label={`Remove ${file.name}`}
              >
                {removing === file.path ? '…' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {otherFiles.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {otherFiles.map((file, i) => (
            <li
              key={file.path || i}
              className="flex items-center justify-between gap-2 text-xs text-gray-500"
            >
              <span className="truncate">📎 {file.name}</span>
              <button
                onClick={() => handleRemove(file)}
                disabled={busy || removing !== null}
                className="flex-shrink-0 font-semibold text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                aria-label={`Remove ${file.name}`}
              >
                {removing === file.path ? 'Removing…' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {noteOpen ? (
        <div className="mb-3">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={5}
            autoFocus
            placeholder={
              item.optional
                ? 'Links to sites you like, price lists, opening hours — anything useful.'
                : 'Type or paste it here — rough notes and bullet points are fine.'
            }
            className="w-full text-sm text-gray-900 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
          />
          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={handleSaveNote}
              disabled={savingNote}
              className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {savingNote ? 'Saving…' : 'Save note'}
            </button>
            <button
              onClick={() => setNoteOpen(false)}
              disabled={savingNote}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : note ? (
        <div className="mb-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-4">
              {note}
            </p>
            <button
              onClick={() => {
                setNoteDraft(note)
                setNoteOpen(true)
              }}
              className="flex-shrink-0 text-[11px] font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      ) : null}

      {busy && progress && (
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500 mb-1">
            <span className="truncate">{progress.name}</span>
            <span className="flex-shrink-0">
              {progress.total > 1 ? `${progress.index}/${progress.total} · ` : ''}
              {progress.pct}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto">
        {skipped ? (
          <p className="text-xs text-gray-500 text-center py-2">
            Marked as nothing to send.{' '}
            <button
              onClick={() => handleSkip(false)}
              disabled={skipping}
              className="font-semibold text-primary hover:text-primary-dark disabled:opacity-50 transition-colors"
            >
              Undo
            </button>
          </p>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
            />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className={`w-full py-2.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
                done
                  ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {busy
                ? 'Uploading…'
                : dragging
                  ? 'Drop files here'
                  : done
                    ? 'Add more files'
                    : 'Upload files'}
            </button>
            <div className="flex items-center justify-center gap-3 mt-2 text-[11px]">
              <span className="text-gray-400">…or drag &amp; drop</span>
              {!noteOpen && !note && (
                <button
                  onClick={() => {
                    setNoteDraft('')
                    setNoteOpen(true)
                  }}
                  className="font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  ✎ write it as a note
                </button>
              )}
              {item.optional && !done && (
                <button
                  onClick={() => handleSkip(true)}
                  disabled={skipping}
                  className="font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
                >
                  {skipping ? 'Skipping…' : 'skip — nothing extra'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
