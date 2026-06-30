/**
 * Maps garment IDs to their PDF page numbers in 
 * 现代汉服裁剪参照图集.pdf
 * 
 * Each garment's pattern pages are arranged as:
 *   - Size table (if separate)
 *   - For each size: views page (外观图/透视图/展开图)
 *   - For each size: dimensions page (详细尺寸图)
 * 
 * PDF page numbering starts from 1.
 */
export interface PatternPageInfo {
  garmentId: string
  chapter: number
  /** Pages to extract from the PDF */
  pages: PatternPageEntry[]
}

export interface PatternPageEntry {
  /** PDF page number (1-based) */
  pdfPage: number
  /** Display label for this page */
  label: string
  /** Short filename slug */
  slug: string
}

/**
 * Pattern page catalog: maps garment IDs → PDF page numbers.
 * 
 * The PDF 现代汉服裁剪参照图集.pdf has 388 pages with the following layout:
 * - Front matter + sewing basics: PDF pages 1-11
 * - Chapter 1 (中衣与裤子): PDF pages 11-32
 * - Chapter 2 (袄裙): PDF pages 33-72
 * - Chapter 3 (襦裙): PDF pages 73-120
 * - Chapter 4 (褙子): PDF pages 121-161
 * - Chapter 5 (女式盘领): PDF pages 162-191
 * - Chapter 6 (曲裾): PDF pages 192-214
 * - Chapter 7 (半臂): PDF pages 215-248
 * - Chapter 8 (裋褐): PDF pages 249-260
 * - Chapter 9 (直裰直身道袍): PDF pages 261-306
 * - Chapter 10 (盘领袍襕衫): PDF pages 307-346
 * - Chapter 11 (深衣): PDF pages 347-365
 * - Chapter 12 (曳撒): PDF pages 366-388
 * 
 * Each garment has alternating views/dimensions pages per size.
 */
export const PATTERN_PAGES: Record<string, PatternPageInfo> = {
  // ====== Chapter 1: 中衣和裤子 ======
  zhongyi: {
    garmentId: 'zhongyi',
    chapter: 1,
    pages: [
      { pdfPage: 12, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 13, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 14, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 15, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 16, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 17, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 18, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 19, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 20, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 21, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 22, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 23, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },
  kuzi: {
    garmentId: 'kuzi',
    chapter: 1,
    pages: [
      { pdfPage: 24, label: '155/68A 外观图', slug: '155-68a-views' },
      { pdfPage: 25, label: '155/68A 详细尺寸图', slug: '155-68a-dimensions' },
      { pdfPage: 26, label: '160/72A 外观图', slug: '160-72a-views' },
      { pdfPage: 27, label: '160/72A 详细尺寸图', slug: '160-72a-dimensions' },
      { pdfPage: 28, label: '165/76A 外观图', slug: '165-76a-views' },
      { pdfPage: 29, label: '165/76A 详细尺寸图', slug: '165-76a-dimensions' },
      { pdfPage: 30, label: '170/80A 外观图', slug: '170-80a-views' },
      { pdfPage: 31, label: '170/80A 详细尺寸图', slug: '170-80a-dimensions' },
      { pdfPage: 32, label: '175/84A 外观图', slug: '175-84a-views' },
    ],
  },

  // ====== Chapter 2: 袄裙 ======
  'duan-ao': {
    garmentId: 'duan-ao',
    chapter: 2,
    pages: [
      { pdfPage: 34, label: '尺码表', slug: 'size-table' },
      { pdfPage: 35, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 36, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 37, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 38, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 39, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 40, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 41, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 42, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },
  'da-ao': {
    garmentId: 'da-ao',
    chapter: 2,
    pages: [
      { pdfPage: 44, label: '尺码表', slug: 'size-table' },
      { pdfPage: 45, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 46, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 47, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 48, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 49, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 50, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 51, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 52, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },
  'mamian-qun': {
    garmentId: 'mamian-qun',
    chapter: 2,
    pages: [
      { pdfPage: 54, label: '尺码表', slug: 'size-table' },
      { pdfPage: 55, label: '155/68A 外观图', slug: '155-68a-views' },
      { pdfPage: 56, label: '155/68A 详细尺寸图', slug: '155-68a-dimensions' },
      { pdfPage: 57, label: '160/72A 外观图', slug: '160-72a-views' },
      { pdfPage: 58, label: '160/72A 详细尺寸图', slug: '160-72a-dimensions' },
      { pdfPage: 59, label: '165/76A 外观图', slug: '165-76a-views' },
      { pdfPage: 60, label: '165/76A 详细尺寸图', slug: '165-76a-dimensions' },
      { pdfPage: 61, label: '170/80A 外观图', slug: '170-80a-views' },
      { pdfPage: 62, label: '170/80A 详细尺寸图', slug: '170-80a-dimensions' },
    ],
  },

  // ====== Chapter 3: 襦裙 ======
  'jiaoling-shang-ru': {
    garmentId: 'jiaoling-shang-ru',
    chapter: 3,
    pages: [
      { pdfPage: 74, label: '尺码表', slug: 'size-table' },
      { pdfPage: 75, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 76, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 77, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 78, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
    ],
  },
  'duijin-shang-ru': {
    garmentId: 'duijin-shang-ru',
    chapter: 3,
    pages: [
      { pdfPage: 84, label: '尺码表', slug: 'size-table' },
      { pdfPage: 85, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 86, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 87, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 88, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 89, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 90, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
    ],
  },
  'zhe-qun': {
    garmentId: 'zhe-qun',
    chapter: 3,
    pages: [
      { pdfPage: 94, label: '155/68A 外观图 A型', slug: '155-68a-a-views' },
      { pdfPage: 95, label: '155/68A 详细尺寸图 A型', slug: '155-68a-a-dimensions' },
      { pdfPage: 96, label: '160/72A 外观图 A型', slug: '160-72a-a-views' },
      { pdfPage: 97, label: '160/72A 详细尺寸图 A型', slug: '160-72a-a-dimensions' },
      { pdfPage: 98, label: '165/76A 外观图 B型', slug: '165-76a-b-views' },
      { pdfPage: 99, label: '165/76A 详细尺寸图 B型', slug: '165-76a-b-dimensions' },
      { pdfPage: 100, label: '170/80A 外观图 B型', slug: '170-80a-b-views' },
      { pdfPage: 101, label: '170/80A 详细尺寸图 B型', slug: '170-80a-b-dimensions' },
      { pdfPage: 102, label: '165/72A 外观图 B型', slug: '165-72a-b-views' },
      { pdfPage: 103, label: '165/72A 详细尺寸图 B型', slug: '165-72a-b-dimensions' },
      { pdfPage: 104, label: '165/72A 外观图 B型 续', slug: '165-72a-b2-views' },
    ],
  },
  'qixiong-ruqun': {
    garmentId: 'qixiong-ruqun',
    chapter: 3,
    pages: [
      { pdfPage: 106, label: '尺码表', slug: 'size-table' },
      { pdfPage: 107, label: '齐胸上襦 155/80A 外观图', slug: 'shangru-155-80a-views' },
      { pdfPage: 108, label: '齐胸上襦 155/80A 详细尺寸图', slug: 'shangru-155-80a-dimensions' },
      { pdfPage: 109, label: '齐胸上襦 160/84A 外观图', slug: 'shangru-160-84a-views' },
      { pdfPage: 110, label: '齐胸上襦 160/84A 详细尺寸图', slug: 'shangru-160-84a-dimensions' },
      { pdfPage: 111, label: '齐胸上襦 165/88A 外观图', slug: 'shangru-165-88a-views' },
      { pdfPage: 112, label: '齐胸上襦 165/88A 详细尺寸图', slug: 'shangru-165-88a-dimensions' },
      { pdfPage: 113, label: '齐胸上襦 170/92A 外观图', slug: 'shangru-170-92a-views' },
      { pdfPage: 114, label: '齐胸上襦 170/92A 详细尺寸图', slug: 'shangru-170-92a-dimensions' },
      { pdfPage: 115, label: '齐胸裙 155/68A 外观图', slug: 'qun-155-68a-views' },
      { pdfPage: 116, label: '齐胸裙 155/68A 详细尺寸图', slug: 'qun-155-68a-dimensions' },
      { pdfPage: 117, label: '齐胸裙 160/72A 外观图', slug: 'qun-160-72a-views' },
      { pdfPage: 118, label: '齐胸裙 160/72A 详细尺寸图', slug: 'qun-160-72a-dimensions' },
      { pdfPage: 119, label: '齐胸裙 165/76A 外观图', slug: 'qun-165-76a-views' },
      { pdfPage: 120, label: '齐胸裙 165/76A 详细尺寸图', slug: 'qun-165-76a-dimensions' },
    ],
  },

  // ====== Chapter 4: 褙子 ======
  'xieduijin-beizi': {
    garmentId: 'xieduijin-beizi',
    chapter: 4,
    pages: [
      { pdfPage: 123, label: '尺码表', slug: 'size-table' },
      { pdfPage: 124, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 125, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 126, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 127, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 128, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 129, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 130, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 131, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },
  'zhiduijin-beizi': {
    garmentId: 'zhiduijin-beizi',
    chapter: 4,
    pages: [
      { pdfPage: 144, label: '尺码表', slug: 'size-table' },
      { pdfPage: 145, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 146, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 147, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 148, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 149, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 150, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 151, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 152, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },

  // ====== Chapter 5: 女式盘领 ======
  'panling-da-ao': {
    garmentId: 'panling-da-ao',
    chapter: 5,
    pages: [
      { pdfPage: 164, label: '尺码表', slug: 'size-table' },
      { pdfPage: 165, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 166, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 167, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 168, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 169, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 170, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 171, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 172, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },
  'panling-duan-ao': {
    garmentId: 'panling-duan-ao',
    chapter: 5,
    pages: [
      { pdfPage: 184, label: '尺码表', slug: 'size-table' },
      { pdfPage: 185, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 186, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 187, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 188, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 189, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 190, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
    ],
  },

  // ====== Chapter 6: 曲裾 ======
  quju: {
    garmentId: 'quju',
    chapter: 6,
    pages: [
      { pdfPage: 194, label: '尺码表', slug: 'size-table' },
      { pdfPage: 195, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 196, label: '155/80A 详细尺寸图 1', slug: '155-80a-dimensions-1' },
      { pdfPage: 197, label: '155/80A 详细尺寸图 2', slug: '155-80a-dimensions-2' },
      { pdfPage: 198, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 199, label: '160/84A 详细尺寸图 1', slug: '160-84a-dimensions-1' },
      { pdfPage: 200, label: '160/84A 详细尺寸图 2', slug: '160-84a-dimensions-2' },
      { pdfPage: 201, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 202, label: '165/88A 详细尺寸图 1', slug: '165-88a-dimensions-1' },
      { pdfPage: 203, label: '165/88A 详细尺寸图 2', slug: '165-88a-dimensions-2' },
    ],
  },

  // ====== Chapter 7: 半臂 ======
  'jiaoling-banbi': {
    garmentId: 'jiaoling-banbi',
    chapter: 7,
    pages: [
      { pdfPage: 217, label: '尺码表', slug: 'size-table' },
      { pdfPage: 218, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 219, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 220, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 221, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 222, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 223, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 224, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 225, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },
  'zhiduijin-banbi': {
    garmentId: 'zhiduijin-banbi',
    chapter: 7,
    pages: [
      { pdfPage: 231, label: '尺码表', slug: 'size-table' },
      { pdfPage: 232, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 233, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 234, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 235, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 236, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 237, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
    ],
  },
  'xieduijin-banbi': {
    garmentId: 'xieduijin-banbi',
    chapter: 7,
    pages: [
      { pdfPage: 241, label: '尺码表', slug: 'size-table' },
      { pdfPage: 242, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 243, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 244, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 245, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 246, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 247, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
    ],
  },

  // ====== Chapter 8: 裋褐 ======
  shuhe: {
    garmentId: 'shuhe',
    chapter: 8,
    pages: [
      { pdfPage: 251, label: '尺码表', slug: 'size-table' },
      { pdfPage: 252, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 253, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 254, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 255, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 256, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 257, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 258, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 259, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },

  // ====== Chapter 9: 直裰直身道袍 ======
  'zhiduo-zhishen': {
    garmentId: 'zhiduo-zhishen',
    chapter: 9,
    pages: [
      { pdfPage: 263, label: '尺码表', slug: 'size-table' },
      { pdfPage: 264, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 265, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 266, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 267, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 268, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 269, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 270, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 271, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },
  daopao: {
    garmentId: 'daopao',
    chapter: 9,
    pages: [
      { pdfPage: 288, label: '尺码表', slug: 'size-table' },
      { pdfPage: 289, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 290, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 291, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 292, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 293, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 294, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 295, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 296, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },

  // ====== Chapter 10: 盘领袍襕衫 ======
  'panling-pao': {
    garmentId: 'panling-pao',
    chapter: 10,
    pages: [
      { pdfPage: 309, label: '尺码表', slug: 'size-table' },
      { pdfPage: 310, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 311, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 312, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 313, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 314, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 315, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 316, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 317, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },
  lanshan: {
    garmentId: 'lanshan',
    chapter: 10,
    pages: [
      { pdfPage: 329, label: '尺码表', slug: 'size-table' },
      { pdfPage: 330, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 331, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 332, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 333, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 334, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 335, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 336, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 337, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },

  // ====== Chapter 11: 深衣 ======
  shenyi: {
    garmentId: 'shenyi',
    chapter: 11,
    pages: [
      { pdfPage: 349, label: '尺码表', slug: 'size-table' },
      { pdfPage: 350, label: '155/80A 外观图', slug: '155-80a-views' },
      { pdfPage: 351, label: '155/80A 详细尺寸图', slug: '155-80a-dimensions' },
      { pdfPage: 352, label: '160/84A 外观图', slug: '160-84a-views' },
      { pdfPage: 353, label: '160/84A 详细尺寸图', slug: '160-84a-dimensions' },
      { pdfPage: 354, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 355, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 356, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 357, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
    ],
  },

  // ====== Chapter 12: 曳撒 ======
  yesa: {
    garmentId: 'yesa',
    chapter: 12,
    pages: [
      { pdfPage: 368, label: '尺码表', slug: 'size-table' },
      { pdfPage: 369, label: '165/88A 外观图', slug: '165-88a-views' },
      { pdfPage: 370, label: '165/88A 详细尺寸图', slug: '165-88a-dimensions' },
      { pdfPage: 371, label: '170/92A 外观图', slug: '170-92a-views' },
      { pdfPage: 372, label: '170/92A 详细尺寸图', slug: '170-92a-dimensions' },
      { pdfPage: 373, label: '175/96A 外观图', slug: '175-96a-views' },
      { pdfPage: 374, label: '175/96A 详细尺寸图', slug: '175-96a-dimensions' },
      { pdfPage: 375, label: '180/100A 外观图', slug: '180-100a-views' },
      { pdfPage: 376, label: '180/100A 详细尺寸图', slug: '180-100a-dimensions' },
    ],
  },
}

/** Get the pattern page info for a given garment ID */
export function getPatternPages(garmentId: string): PatternPageInfo | undefined {
  return PATTERN_PAGES[garmentId]
}

/** Build the base path for a garment's pattern images */
export function getPatternImageBasePath(garmentId: string): string {
  return `/images/patterns/${garmentId}`
}

/** Build the full image URL for a pattern page entry */
export function getPatternImageUrl(garmentId: string, entry: PatternPageEntry): string {
  return `${getPatternImageBasePath(garmentId)}/${entry.slug}.png`
}
