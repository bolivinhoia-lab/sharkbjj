import QRCode from 'qrcode'

export interface QRData {
  type: 'bjj_attendance'
  student_id: string
  academy_id: string
  expires: string
  hash: string
  timestamp?: number
}

export async function generateStudentQR(studentId: string, academyId: string): Promise<string> {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  const timestamp = Date.now()
  
  const qrData: QRData = {
    type: 'bjj_attendance',
    student_id: studentId,
    academy_id: academyId,
    expires,
    timestamp,
    hash: await generateSecurityHash(studentId, academyId, timestamp)
  }

  return await QRCode.toDataURL(JSON.stringify(qrData), {
    width: 256,
    margin: 2,
    color: {
      dark: '#1e293b',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  })
}

export async function generateSecurityHash(
  studentId: string, 
  academyId: string, 
  timestamp: number
): Promise<string> {
  const data = `${studentId}-${academyId}-${timestamp}`
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function parseQRCode(qrData: string): QRData | null {
  try {
    const parsed = JSON.parse(qrData) as QRData
    
    if (
      !parsed ||
      parsed.type !== 'bjj_attendance' ||
      !parsed.student_id ||
      !parsed.academy_id ||
      !parsed.expires ||
      !parsed.hash
    ) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function isQRCodeValid(qrData: QRData): boolean {
  // Check expiration
  if (new Date(qrData.expires) < new Date()) {
    return false
  }

  // Additional validation could be added here
  return true
}

export async function verifyQRCodeHash(qrData: QRData): Promise<boolean> {
  if (!qrData.timestamp) {
    return false
  }
  
  const expectedHash = await generateSecurityHash(
    qrData.student_id, 
    qrData.academy_id, 
    qrData.timestamp
  )
  
  return expectedHash === qrData.hash
}

// Generate a unique student number
export function generateStudentNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `SBJ${timestamp.slice(-6)}${random.toUpperCase()}`
}

// Generate QR code string (for storage in database)
export function generateQRString(studentId: string, academyId: string): string {
  return `${studentId}-${academyId}-${Date.now()}`
}

// Belt progression utilities
export function getBeltColor(belt: string): string {
  const colors = {
    white: '#ffffff',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    brown: '#a16207',
    black: '#1f2937'
  }
  return colors[belt as keyof typeof colors] || colors.white
}

export function getBeltRequirements(belt: string) {
  const requirements = {
    white: { minClasses: 80, minDays: 180, minTechniques: 15 },
    blue: { minClasses: 150, minDays: 540, minTechniques: 30 },
    purple: { minClasses: 200, minDays: 900, minTechniques: 50 },
    brown: { minClasses: 300, minDays: 1080, minTechniques: 75 },
    black: { minClasses: 500, minDays: 1800, minTechniques: 100 }
  }
  return requirements[belt as keyof typeof requirements] || requirements.white
}

export function calculateBeltProgress(student: any) {
  const requirements = getBeltRequirements(student.belt_level)
  const daysSincePromotion = Math.floor(
    (new Date().getTime() - new Date(student.promotion_date).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  const progress = {
    classes: Math.min(student.total_classes / requirements.minClasses, 1),
    time: Math.min(daysSincePromotion / requirements.minDays, 1),
    techniques: Math.min(student.total_techniques_learned / requirements.minTechniques, 1)
  }
  
  const totalProgress = (progress.classes + progress.time + progress.techniques) / 3
  return {
    ...progress,
    overall: Math.min(totalProgress, 1)
  }
}

// XP and level calculations
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
  return (currentLevel) ** 2 * 100
}

export function getXPProgress(currentXP: number, currentLevel: number): number {
  const currentLevelXP = (currentLevel - 1) ** 2 * 100
  const nextLevelXP = getXPForNextLevel(currentLevel)
  const progressXP = currentXP - currentLevelXP
  const requiredXP = nextLevelXP - currentLevelXP
  return progressXP / requiredXP
}