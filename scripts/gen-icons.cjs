// Generates pwa-192.png and pwa-512.png as valid PNGs (purple bg, white $ symbol)
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

function crc32(buf) {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    table[i] = c
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(typeAndData))
  return Buffer.concat([lenBuf, typeAndData, crcBuf])
}

function generatePNG(size) {
  // Purple gradient-like: primary #6366f1 center, darker edges
  const cx = size / 2, cy = size / 2, r = size * 0.42

  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter: None
    for (let x = 0; x < size; x++) {
      const i = y * (size * 4 + 1) + 1 + x * 4
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      const inCircle = dist <= r
      const cornerRadius = size * 0.22
      const inRoundedRect =
        x >= cornerRadius && x <= size - cornerRadius &&
        y >= cornerRadius && y <= size - cornerRadius
      const inCornerTL = Math.sqrt((x - cornerRadius) ** 2 + (y - cornerRadius) ** 2) <= cornerRadius
      const inCornerTR = Math.sqrt((x - (size - cornerRadius)) ** 2 + (y - cornerRadius) ** 2) <= cornerRadius
      const inCornerBL = Math.sqrt((x - cornerRadius) ** 2 + (y - (size - cornerRadius)) ** 2) <= cornerRadius
      const inCornerBR = Math.sqrt((x - (size - cornerRadius)) ** 2 + (y - (size - cornerRadius)) ** 2) <= cornerRadius

      const inBg = inRoundedRect || inCornerTL || inCornerTR || inCornerBL || inCornerBR

      if (inBg) {
        // Purple background
        raw[i] = 99; raw[i+1] = 102; raw[i+2] = 241; raw[i+3] = 255
      } else {
        // Transparent
        raw[i] = 0; raw[i+1] = 0; raw[i+2] = 0; raw[i+3] = 0
      }

      // Draw a simple "G" (gastos) white symbol in the center
      const nx = (x - cx) / (size * 0.28)
      const ny = (y - cy) / (size * 0.28)
      // Vertical bar of $ sign
      if (inBg && Math.abs(nx) < 0.12 && Math.abs(ny) < 0.75) {
        raw[i] = 255; raw[i+1] = 255; raw[i+2] = 255; raw[i+3] = 255
      }
      // Top arc of $
      if (inBg && ny > -0.75 && ny < -0.1) {
        const arcR = Math.sqrt(nx ** 2 + (ny + 0.28) ** 2)
        if (arcR > 0.36 && arcR < 0.58 && nx >= 0) {
          raw[i] = 255; raw[i+1] = 255; raw[i+2] = 255; raw[i+3] = 255
        }
      }
      // Bottom arc of $
      if (inBg && ny > 0.1 && ny < 0.75) {
        const arcR = Math.sqrt(nx ** 2 + (ny - 0.28) ** 2)
        if (arcR > 0.36 && arcR < 0.58 && nx <= 0) {
          raw[i] = 255; raw[i+1] = 255; raw[i+2] = 255; raw[i+3] = 255
        }
      }
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  const compressed = zlib.deflateSync(raw)
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))])
}

const publicDir = path.join(__dirname, '..', 'public')
fs.writeFileSync(path.join(publicDir, 'pwa-192.png'), generatePNG(192))
fs.writeFileSync(path.join(publicDir, 'pwa-512.png'), generatePNG(512))
console.log('Icons generated: pwa-192.png, pwa-512.png')
