'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestUpload, confirmUpload } from './actions'

export default function UploadItem({ token, item }) {
  const inputRef = useRef(null)
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const files = Array.isArray(item.files) ? item.files : []
  const done = files.length > 0

  const handleFiles = async (fileList) => {
    setBusy(true)
    setError(null)
    try {
      for (const file of Array.from(fileList)) {
        const ticket = await requestUpload(token, item.id, file.name)
        if (ticket.error) throw new Error(ticket.error)
        const put = await fetch(ticket.url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        })
        if (!put.ok) throw new Error('Upload failed — please try again.')
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
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl border p-6 transition-colors ${
        done ? 'border-green-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900">{item.label}</h3>
        {done ? (
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-semibold text-green-700">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {files.length} file{files.length === 1 ? '' : 's'}
          </span>
        ) : (
          <span className="flex-shrink-0 px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-gray-500">
            waiting
          </span>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mb-4 space-y-1">
          {files.map((file, i) => (
            <li key={i} className="text-xs text-gray-500 truncate">
              📎 {file.name}
            </li>
          ))}
        </ul>
      )}

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
        {busy ? 'Uploading…' : done ? 'Add more files' : 'Upload files'}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
