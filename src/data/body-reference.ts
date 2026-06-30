export interface BodyReference {
  height: number
  armSpan: number
  waistHeight: number
  bust: number
  neckCircumference: number
  shoulderWidth: number
  underBustOptions: number[]
  waistOptions: number[]
  hipOptions: number[]
}

export const BODY_REFERENCE_A: BodyReference[] = [
  {
    height: 1500, armSpan: 1500, waistHeight: 920, bust: 760,
    neckCircumference: 318, shoulderWidth: 380,
    underBustOptions: [620, 640, 660],
    waistOptions: [580, 600, 620],
    hipOptions: [810, 828, 846],
  },
  {
    height: 1550, armSpan: 1550, waistHeight: 950, bust: 800,
    neckCircumference: 326, shoulderWidth: 390,
    underBustOptions: [660, 680, 700],
    waistOptions: [620, 640, 660],
    hipOptions: [846, 864, 882],
  },
  {
    height: 1600, armSpan: 1600, waistHeight: 980, bust: 840,
    neckCircumference: 334, shoulderWidth: 400,
    underBustOptions: [700, 720, 740],
    waistOptions: [660, 680, 700],
    hipOptions: [882, 900, 918],
  },
  {
    height: 1650, armSpan: 1650, waistHeight: 1010, bust: 880,
    neckCircumference: 342, shoulderWidth: 410,
    underBustOptions: [740, 760, 780],
    waistOptions: [700, 720, 740],
    hipOptions: [918, 936, 954],
  },
  {
    height: 1700, armSpan: 1700, waistHeight: 1040, bust: 920,
    neckCircumference: 350, shoulderWidth: 420,
    underBustOptions: [780, 800, 820],
    waistOptions: [740, 760, 780],
    hipOptions: [954, 972, 990],
  },
  {
    height: 1750, armSpan: 1750, waistHeight: 1070, bust: 960,
    neckCircumference: 358, shoulderWidth: 430,
    underBustOptions: [820, 840, 860],
    waistOptions: [780, 800, 820],
    hipOptions: [990, 1008, 1026],
  },
  {
    height: 1800, armSpan: 1800, waistHeight: 1100, bust: 1000,
    neckCircumference: 366, shoulderWidth: 440,
    underBustOptions: [860, 880, 900],
    waistOptions: [820, 840, 860],
    hipOptions: [1026, 1044, 1062],
  },
  {
    height: 1850, armSpan: 1850, waistHeight: 1130, bust: 1040,
    neckCircumference: 374, shoulderWidth: 450,
    underBustOptions: [900, 920, 940],
    waistOptions: [860, 880, 900],
    hipOptions: [1062, 1080, 1098],
  },
]

export function getClosestBodyRef(height: number): BodyReference {
  return BODY_REFERENCE_A.reduce((prev, curr) =>
    Math.abs(curr.height - height) < Math.abs(prev.height - height) ? curr : prev
  )
}
