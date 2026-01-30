import { NextRequest, NextResponse } from 'next/server'

// Using local mock data system for full functionality
export async function POST(req: NextRequest) {
  try {
    const { qrData, instructorId } = await req.json()
    
    if (!qrData || !instructorId) {
      return NextResponse.json({ 
        error: 'QR data and instructor ID são obrigatórios' 
      }, { status: 400 })
    }

    // Import mock API dinamically (client-side module)
    const mockModule = await import('@/app/mock-data');
    const result = mockModule.mockAPI.scanQRCode(qrData, instructorId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        student: result.student,
        message: result.message,
        xp_gained: 50
      })
    } else {
      return NextResponse.json({ 
        success: false,
        message: result.message 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('QR scan error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
