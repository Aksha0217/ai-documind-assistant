"use client"
import { useState } from "react"

export default function UploadPage() {
  const [message, setMessage] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    setMessage("Uploading...")
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      setMessage(data?.message || 'Upload complete')
    } catch (err) {
      setMessage('Upload failed')
    }
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <h1>Upload a file</h1>
      <form onSubmit={handleSubmit}>
        <input name="file" type="file" required />
        <div style={{ marginTop: 12 }}>
          <button type="submit">Upload</button>
        </div>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  )
}
