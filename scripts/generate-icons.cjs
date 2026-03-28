// @ts-check
// Generates placeholder PNG icons and a favicon.ico for the PWA.
// Brand color: #2563EB (R=37, G=99, B=235)
// Run once: node scripts/generate-icons.js

'use strict'

const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const R = 37, G = 99, B = 235  // #2563EB

// --- CRC-32 ---
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xFF]
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function createSolidPNG(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8   // bit depth
  ihdrData[9] = 2   // color type: RGB
  ihdrData[10] = 0  // compression method
  ihdrData[11] = 0  // filter method
  ihdrData[12] = 0  // interlace
  const ihdr = makeChunk('IHDR', ihdrData)

  // Raw image data: filter(0) + RGB pixels per row
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const base = y * (1 + width * 3)
    raw[base] = 0  // filter type: None
    for (let x = 0; x < width; x++) {
      const p = base + 1 + x * 3
      raw[p] = r; raw[p + 1] = g; raw[p + 2] = b
    }
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(raw))
  const iend = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdr, idat, iend])
}

// ICO containing a single 32x32 RGBA image (all-blue, full alpha)
function createFaviconICO(r, g, b) {
  const size = 32
  // ICONDIR
  const iconDir = Buffer.alloc(6)
  iconDir.writeUInt16LE(0, 0)   // reserved
  iconDir.writeUInt16LE(1, 2)   // type: ICO
  iconDir.writeUInt16LE(1, 4)   // count: 1 image

  // BMP header sizes
  const dibHeaderSize = 40
  const pixelDataSize = size * size * 4  // BGRA
  const xorMaskSize = pixelDataSize
  const andMaskSize = size * (Math.ceil(size / 32) * 4)  // 1-bit mask, row-padded to DWORD
  const bmpSize = dibHeaderSize + xorMaskSize + andMaskSize

  // ICONDIRENTRY
  const dirEntry = Buffer.alloc(16)
  dirEntry[0] = size  // width
  dirEntry[1] = size  // height
  dirEntry[2] = 0     // color count (0 = >256 colors)
  dirEntry[3] = 0     // reserved
  dirEntry.writeUInt16LE(1, 4)   // planes
  dirEntry.writeUInt16LE(32, 6)  // bit count
  dirEntry.writeUInt32LE(bmpSize, 8)  // size of image data
  dirEntry.writeUInt32LE(6 + 16, 12) // offset: after ICONDIR + ICONDIRENTRY

  // DIB header (BITMAPINFOHEADER)
  const dib = Buffer.alloc(dibHeaderSize)
  dib.writeUInt32LE(dibHeaderSize, 0)
  dib.writeInt32LE(size, 4)
  dib.writeInt32LE(size * 2, 8)  // height * 2 for ICO (XOR + AND masks)
  dib.writeUInt16LE(1, 12)       // planes
  dib.writeUInt16LE(32, 14)      // bit count
  dib.writeUInt32LE(0, 16)       // compression: none
  dib.writeUInt32LE(xorMaskSize + andMaskSize, 20)  // image size

  // XOR mask (BGRA pixels, bottom-up)
  const xorMask = Buffer.alloc(xorMaskSize)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      xorMask[i] = b    // B
      xorMask[i + 1] = g  // G
      xorMask[i + 2] = r  // R
      xorMask[i + 3] = 255 // A (fully opaque)
    }
  }

  // AND mask (all zeros = fully opaque)
  const andMask = Buffer.alloc(andMaskSize, 0)

  return Buffer.concat([iconDir, dirEntry, dib, xorMask, andMask])
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons')
fs.mkdirSync(iconsDir, { recursive: true })

const sizes = [
  { name: 'icon-192.png', width: 192, height: 192 },
  { name: 'icon-512.png', width: 512, height: 512 },
  { name: 'icon-180.png', width: 180, height: 180 },
  { name: 'icon-maskable-512.png', width: 512, height: 512 },
]

for (const { name, width, height } of sizes) {
  const buf = createSolidPNG(width, height, R, G, B)
  fs.writeFileSync(path.join(iconsDir, name), buf)
  console.log(`Created ${name} (${width}x${height})`)
}

const ico = createFaviconICO(R, G, B)
fs.writeFileSync(path.join(iconsDir, 'favicon.ico'), ico)
console.log('Created favicon.ico (32x32)')

console.log('Done. Replace these placeholder icons with real artwork before production.')
