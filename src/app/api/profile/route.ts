import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentUserProfile,
  updateUserProfile,
} from '@/lib/supabase-dashboard-queries';

export async function GET() {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }   
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: profile, error } = await updateUserProfile(body);

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
