// 人体测量参数类型定义

export interface MeasurementDefinition {
  id: string                       // e.g. "height"
  name: string                     // 中文名 e.g. "身高"
  nameEn: string                   // English
  unit: 'mm'
  description: string              // 测量方法描述
  guideImage?: string              // 量体引导图 URL
  min: number                      // 最小值 (mm)
  max: number                      // 最大值 (mm)
  step: number                     // 步进值
  required: boolean
  category: MeasurementCategory    // 分类
}

export type MeasurementCategory =
  | 'body'         // 身体基础数据
  | 'torso'        // 躯干
  | 'arm'          // 手臂
  | 'leg'          // 腿部
  | 'preference'   // 个人偏好

// 预设测量参数集
export const MEASUREMENT_DEFINITIONS: MeasurementDefinition[] = [
  {
    id: 'height',
    name: '身高',
    nameEn: 'Height',
    unit: 'mm',
    description: '从头顶顶点垂直量至足跟，身体站直，赤脚测量',
    min: 1400,
    max: 2000,
    step: 5,
    required: true,
    category: 'body',
  },
  {
    id: 'bust',
    name: '净胸围',
    nameEn: 'Bust (net)',
    unit: 'mm',
    description: '从腋下通过胸部最丰满处水平环绕一周，正常呼吸状态',
    min: 700,
    max: 1200,
    step: 5,
    required: true,
    category: 'torso',
  },
  {
    id: 'waist',
    name: '净腰围',
    nameEn: 'Waist (net)',
    unit: 'mm',
    description: '绕腰部最细处水平测量一周，正常呼吸，不收紧腹部',
    min: 550,
    max: 1100,
    step: 5,
    required: true,
    category: 'torso',
  },
  {
    id: 'hip',
    name: '净臀围',
    nameEn: 'Hip (net)',
    unit: 'mm',
    description: '绕臀部最高点水平测量一周，双脚并拢站立',
    min: 750,
    max: 1300,
    step: 5,
    required: true,
    category: 'torso',
  },
  {
    id: 'shoulderWidth',
    name: '总肩宽',
    nameEn: 'Shoulder Width',
    unit: 'mm',
    description: '从左肩端点经后颈点量至右肩端点',
    min: 320,
    max: 500,
    step: 5,
    required: true,
    category: 'torso',
  },
  {
    id: 'neckCircumference',
    name: '颈围',
    nameEn: 'Neck Circumference',
    unit: 'mm',
    description: '绕颈根部（喉结下方）水平测量一周',
    min: 280,
    max: 420,
    step: 5,
    required: false,
    category: 'torso',
  },
  {
    id: 'armSpan',
    name: '通臂长',
    nameEn: 'Arm Span',
    unit: 'mm',
    description: '双臂自然张开，两中指尖之间的距离，约等于身高',
    min: 1300,
    max: 2100,
    step: 5,
    required: false,
    category: 'arm',
  },
  {
    id: 'armLength',
    name: '臂长',
    nameEn: 'Arm Length',
    unit: 'mm',
    description: '从肩端点沿手臂外侧量至手腕',
    min: 450,
    max: 700,
    step: 5,
    required: false,
    category: 'arm',
  },
  {
    id: 'garmentLength',
    name: '衣长',
    nameEn: 'Garment Length',
    unit: 'mm',
    description: '从后颈点用尺子垂直量至期望的衣长位置',
    min: 400,
    max: 1500,
    step: 10,
    required: false,
    category: 'preference',
  },
  {
    id: 'skirtLength',
    name: '裙长',
    nameEn: 'Skirt Length',
    unit: 'mm',
    description: '从髋骨上方约6cm处量至离地面约3cm处',
    min: 500,
    max: 1200,
    step: 10,
    required: false,
    category: 'preference',
  },
]

export interface UserMeasurements {
  userId?: string
  name?: string                    // 测量方案名称
  values: Record<string, number>   // e.g. { height: 1700, bust: 920, ... }
  bodyType: 'A' | 'B'
  createdAt?: string
  updatedAt?: string
}
