import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, formData } = body;

    if (!formId || !formData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: formId and formData' },
        { status: 400 }
      );
    }

    // Submit lead using the server-side function
    const result = await submitLead({ formId, formData });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in lead submission API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
