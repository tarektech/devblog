import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/supabase-dashboard-queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: post, error } = await createPost(body);

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
