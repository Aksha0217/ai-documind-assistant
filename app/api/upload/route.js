import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file) return new Response(JSON.stringify({ message: 'No file provided' }), { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

    const filename = file.name || `upload-${Date.now()}`
    const filePath = path.join(uploadsDir, filename)
    await fs.promises.writeFile(filePath, buffer)

    return new Response(JSON.stringify({ message: `Saved ${filename}` }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Upload error', error: String(err) }), { status: 500 })
  }
}
