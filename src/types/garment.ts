// 汉服款式类型定义

export type GarmentCategory = 'upper' | 'lower' | 'full_body'

export type Dynasty =
  | 'ming'
  | 'tang'
  | 'song'
  | 'han'
  | 'general'

export type SleeveType =
  | 'work'       // 劳作/中衣：至手腕
  | 'regular'    // 常服：至指尖
  | 'formal'     // 礼服：过指尖6寸~反屈回肘

export type FitType =
  | 'snug'       // 紧身 6-8cm
  | 'fitted'     // 合体 8-10cm
  | 'loose'      // 宽松 14cm+

export interface GarmentSize {
  label: string            // e.g. "155/80A"
  height: number           // mm
  bust: number             // mm (净胸围)
  waist: number            // mm (净腰围)
  hip: number              // mm (净臀围)
  bodyType: 'A' | 'B'     // 体型
}

export interface GarmentInfo {
  id: string
  name: string                     // 中文名称 e.g. "短袄"
  nameEn: string                   // English name e.g. "Short Ao"
  category: GarmentCategory
  dynasty: Dynasty
  chapter: number                  // 对应PDF章节
  description: string              // 简介
  illustrations: string[]          // 款式图示
  defaultMeasurements: string[]    // 需要的测量参数
  sizeTable: GarmentSize[]         // 尺码对照表
  sleeveType: SleeveType
  fitType: FitType
  tags: string[]                   // 标签 e.g. ['女装', '明制', '交领']
}

export interface PatternPiece {
  name: string                     // 部位名称 e.g. "左前片", "右袖"
  description: string
  seamAllowance: number            // 缝份 (mm)
  hemAllowance: number            // 收口 (mm)
}

export interface PatternData {
  garmentId: string
  measurements: Record<string, number>
  pieces: PatternPiece[]
  svgString: string                // FreeSewing生成的SVG
  generatedAt: string              // ISO timestamp
}
