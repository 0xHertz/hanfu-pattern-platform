/**
 * Professional Hanfu Pattern SVG Generator — 交领上襦 (直袖)
 *
 * Verified against "现代汉服裁剪参照图集" Chapter 3, page 74 size table.
 * Key design: cross-collar, STRAIGHT sleeves, no hem flare, no side slits.
 */
import { calculateJiaolingShangRu, JIAOLING_SHANGRU_SIZES } from '@/data/garments/jiaoling-shang-ru'

type Pt = [number, number]

interface Piece {
  name: string
  outline: Pt[]
  seamOutline: Pt[]
  interior: Pt[]
  dims: { from: Pt; to: Pt; label: string }[]
  width: number
  height: number
  grainline: Pt
}

const SEAM = 10
const GAP = 60
const MARGIN = 40

function fmt(label: string, v: number): string { return `${label}${Math.round(v)}` }

function seamExpand(pts: Pt[], offset: number): Pt[] {
  return pts.map((_, i) => {
    const prev = pts[(i-1+pts.length)%pts.length]
    const curr = pts[i]
    const next = pts[(i+1)%pts.length]
    const n1 = norm(prev, curr); const n2 = norm(curr, next)
    const nx = n1[0]+n2[0]; const ny = n1[1]+n2[1]
    const nl = Math.sqrt(nx*nx+ny*ny)||1
    return [curr[0]+(nx/nl)*offset, curr[1]+(ny/nl)*offset] as Pt
  })
}

function norm(a: Pt, b: Pt): [number,number] {
  const dx=b[0]-a[0], dy=b[1]-a[1]
  const l=Math.sqrt(dx*dx+dy*dy)||1
  return [-dy/l, dx/l]
}

function spath(pts: Pt[], sw: number, dash?: string, close = true): string {
  if (pts.length<2) return ''
  const d = pts.map((p,i) => `${i?'L':'M'}${p[0]},${p[1]}`).join(' ')
  return `<path d="${d}${close?' Z':''}" fill="none" stroke="#222" stroke-width="${sw}" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`
}

function anno(x1:number,y1:number,x2:number,y2:number,label:string,off=14):string {
  if (x1===x2&&y1===y2) return ''
  const mx=(x1+x2)/2, my=(y1+y2)/2
  const dx=x2-x1, dy=y2-y1
  const len=Math.sqrt(dx*dx+dy*dy)||1
  const ox=mx-dy/len*off, oy=my+dx/len*off
  const tick=3
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C00" stroke-width="0.3"/>
<line x1="${x1}" y1="${y1-tick}" x2="${x1}" y2="${y1+tick}" stroke="#C00" stroke-width="0.3"/>
<line x1="${x2}" y1="${y2-tick}" x2="${x2}" y2="${y2+tick}" stroke="#C00" stroke-width="0.3"/>
<text x="${ox}" y="${oy}" text-anchor="middle" font-size="8" fill="#C00" dominant-baseline="middle">${label}</text>`
}

function buildPieces(measurements: Record<string,number>, ease:number): Piece[] {
  const h = measurements.height ?? 1700
  const b = measurements.bust ?? 920
  const dims = calculateJiaolingShangRu(h, b, ease)

  const gBust = dims.garmentBust
  const bw = gBust / 4           // body half-width (quarter bust)
  const gLen = dims.garmentLength // garment length
  const shW = (measurements.shoulderWidth ?? 400) / 2
  const armSpan = measurements.armSpan ?? h
  const sLen = (armSpan - shW*2) / 2 // sleeve length from shoulder tip
  const cuffW = dims.cuffWidth   // cuff width (from size table)
  const collarW = dims.collarWidth // neck opening width
  const collarEdge = dims.collarEdgeWidth // collar band width
  const neckCirc = measurements.neckCircumference ?? (h * 0.21)
  const collarLen = neckCirc * 0.5 + 30 // half neck + overlap

  // Front piece (前片) — cross-collar diagonal, straight sides
  const front: Piece = {
    name: '前片 (前身頃)',
    outline: [
      [0, 0],                                // neckCenter CF
      [shW, 25],                             // shoulderTip
      [bw, 40],                              // armpit
      [bw, gLen],                            // hemSide (straight, no flare)
      [0, gLen],                             // hemCenter CF
      [collarW, gLen * 0.22],                // cross-collar endpoint
    ],
    interior: [[0,0],[0,gLen]],
    seamOutline: [],
    dims: [
      { from:[0,0], to:[0,gLen], label:fmt('衣长',gLen) },
      { from:[-5,gLen], to:[bw+5,gLen], label:fmt('下摆半',Math.round(bw)) },
      { from:[0,0], to:[shW,25], label:fmt('肩',Math.round(shW)) },
      { from:[bw,40], to:[bw,gLen], label:fmt('侧缝',gLen-40) },
    ],
    width: bw, height: gLen,
    grainline: [12, gLen*0.3],
  }
  front.seamOutline = seamExpand(front.outline, SEAM)

  // Back piece (后片) — simple, straight sides
  const back: Piece = {
    name: '后片 (後身頃)',
    outline: [
      [0, 0],                                // cbNeck
      [shW, 18],                             // shoulderTip (slightly higher back)
      [bw, 32],                              // armpit
      [bw, gLen],                            // hemSide
      [0, gLen],                             // hemCB
    ],
    interior: [[0,0],[0,gLen]],
    seamOutline: [],
    dims: [
      { from:[0,0], to:[0,gLen], label:fmt('衣长',gLen) },
      { from:[0,0], to:[shW,18], label:fmt('肩',Math.round(shW)) },
    ],
    width: bw, height: gLen,
    grainline: [12, gLen*0.3],
  }
  back.seamOutline = seamExpand(back.outline, SEAM)

  // Sleeve (直袖) — straight, slight taper
  const sleeve: Piece = {
    name: '袖 (直袖)',
    outline: [
      [0, 0],                                // cap top
      [sLen, -cuffW/2],                      // wrist top
      [sLen, cuffW/2],                       // wrist bottom
      [0, bw * 0.8],                         // cap bottom (armhole depth)
    ],
    interior: [[sLen,-cuffW/2],[sLen,cuffW/2]],
    seamOutline: [],
    dims: [
      { from:[0,0], to:[sLen,-cuffW/2], label:fmt('袖长',Math.round(sLen)) },
      { from:[sLen,-cuffW/2], to:[sLen,cuffW/2], label:fmt('袖口',Math.round(cuffW)) },
      { from:[0,0], to:[0,bw*0.8], label:fmt('袖山',Math.round(bw*0.8)) },
    ],
    width: sLen, height: bw*0.8 + cuffW/2,
    grainline: [sLen*0.4, 0],
  }
  sleeve.seamOutline = seamExpand(sleeve.outline, SEAM)

  // Collar band (领)
  const collar: Piece = {
    name: '领 (衿)',
    outline: [
      [0, -collarEdge],
      [0, 0],
      [collarLen, 0],
      [collarLen, -collarEdge],
    ],
    interior: [],
    seamOutline: [],
    dims: [
      { from:[-5,-collarEdge], to:[collarLen+5,-collarEdge], label:fmt('领长',Math.round(collarLen)) },
      { from:[-5,-collarEdge], to:[-5,0], label:fmt('领宽',collarEdge) },
    ],
    width: collarLen, height: collarEdge,
    grainline: [collarLen*0.5, -collarEdge/2],
  }
  collar.seamOutline = seamExpand(collar.outline, SEAM)

  return [front, back, sleeve, collar]
}

export function generateSvg(
  _garmentId: string, measurements: Record<string,number>, options?: Record<string,number>
): string {
  const ease = options?.ease ?? 100
  const pieces = buildPieces(measurements, ease)

  let cx = MARGIN, maxH = 600, totalW = 0
  const rows: {piece: Piece; x: number; y: number}[] = []

  // Layout: front + back on top row, sleeve + collar below
  for (const p of [pieces[0], pieces[1]]) {
    rows.push({ piece: p, x: cx, y: MARGIN })
    cx += p.width + GAP
    maxH = Math.max(maxH, MARGIN + p.height)
  }
  totalW = cx
  cx = MARGIN
  const row2Y = maxH + 40
  for (const p of [pieces[2], pieces[3]]) {
    rows.push({ piece: p, x: cx, y: row2Y })
    cx += p.width + GAP
  }
  totalW = Math.max(totalW, cx)
  const totalH = row2Y + Math.max(pieces[2].height, pieces[3].height) + MARGIN

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" style="background:#fff;font-family:sans-serif;">`
  svg += `<defs><marker id="a" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0,0 5,2 0,4" fill="#C00"/></marker></defs>`

  for (const {piece, x, y} of rows) {
    svg += `<g transform="translate(${x},${y})">`

    svg += `<rect x="${-SEAM*2}" y="${-SEAM*2}" width="${piece.width+SEAM*4}" height="${piece.height+SEAM*4}" fill="#FFFAF5" rx="2"/>`

    if (piece.seamOutline.length) svg += spath(piece.seamOutline, 0.35)
    svg += spath(piece.outline, 0.6)

    if (piece.interior.length) svg += spath(piece.interior, 0.2, '4,3')

    const [gx, gy] = piece.grainline
    svg += `<line x1="${gx-18}" y1="${gy}" x2="${gx+30}" y2="${gy}" stroke="#666" stroke-width="0.3" marker-end="url(#a)"/>`

    for (const a of piece.dims) {
      svg += anno(a.from[0], a.from[1], a.to[0], a.to[1], a.label, 12)
    }

    svg += `<text x="${piece.width/2}" y="${piece.height/2}" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">${piece.name}</text>`
    svg += `</g>`
  }

  svg += `<text x="${MARGIN}" y="${totalH-12}" font-size="9" fill="#999">汉服纸样平台 — 交领上襦 (直袖) | 单位: mm | 缝份: ${SEAM}mm | 放量: ${ease}mm</text>`
  svg += `</svg>`
  return svg
}

export function renderPattern(
  garmentId: string, measurements: Record<string,number>, options?: Record<string,number>
) {
  const svg = generateSvg(garmentId, measurements, options)
  return { svg, width: 2000, height: 1200, partCount: 4 }
}
